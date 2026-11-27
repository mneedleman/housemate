require 'rails_helper'

RSpec.describe "GraphQL auth hardening", type: :request do
  let(:password) { "correct-horse-battery" }
  let!(:user) { create(:user, email: "person@example.com", password: password) }

  def gql(query, variables = {}, headers: {}, ip: "203.0.113.7")
    post "/graphql", params: { query: query, variables: variables }, headers: headers.merge("REMOTE_ADDR" => ip), as: :json
    response.parsed_body
  end

  def login(email, pass, ip: "203.0.113.7")
    gql("mutation($e: String!, $p: String!) { login(email: $e, password: $p) }", { e: email, p: pass }, ip: ip)
  end

  def signup(email, pass)
    gql("mutation($e: String!, $p: String!) { signup(email: $e, password: $p, name: \"N\") }", { e: email, p: pass })
  end

  describe "login" do
    it "gives the same answer for an unknown email and a wrong password" do
      unknown = login("nobody@example.com", password)
      wrong = login("person@example.com", "wrong-password")

      expect(unknown).to eq(wrong)
      expect(unknown.dig("data", "login")).to be_nil
      expect(unknown["errors"]).to be_nil
    end

    it "ignores email case and surrounding spaces" do
      expect(login("  Person@Example.COM ", password).dig("data", "login", "token")).to be_present
    end

    context "with a real cache" do
      around do |example|
        original = Rails.cache
        Rails.cache = ActiveSupport::Cache::MemoryStore.new
        example.run
      ensure
        Rails.cache = original
      end

      it "doesn't count successful logins" do
        (AuthThrottle::LIMIT + 2).times do
          expect(login("person@example.com", password).dig("data", "login", "token")).to be_present
        end
      end

      it "blocks an IP after too many failed attempts, without affecting other IPs" do
        AuthThrottle::LIMIT.times { login("person@example.com", "wrong-password") }

        blocked = login("person@example.com", password)
        expect(blocked.dig("errors", 0, "message")).to match(/Too many attempts/)
        expect(login("person@example.com", password, ip: "198.51.100.9").dig("data", "login", "token")).to be_present
      end
    end
  end

  describe "signup" do
    it "rejects passwords shorter than 8 characters with a readable error" do
      body = signup("new@example.com", "short")

      expect(body.dig("errors", 0, "message")).to match(/Password is too short/)
      expect(User.where(email: "new@example.com")).to be_empty
    end

    it "rejects an email that differs only by case" do
      body = signup("PERSON@example.com", "long-enough-password")

      expect(body.dig("errors", 0, "message")).to match(/Email has already been taken/)
    end
  end

  describe "tokens" do
    let(:household) { create(:household) }
    let(:member) { create(:user, household: household) }

    def current_email(token)
      gql("{ currentUser { email } }", headers: { "Authorization" => "Bearer #{token}" }).dig("data", "currentUser", "email")
    end

    it "accepts a fresh token" do
      expect(current_email(AuthToken.encode(member))).to eq(member.email)
    end

    it "rejects an expired token" do
      expect(current_email(AuthToken.encode(member, expires_at: 1.minute.ago))).to be_nil
    end

    it "rejects a validly signed token with no expiry" do
      no_exp = JWT.encode({ user: member.id }, AuthToken.secret, "HS256")

      expect(current_email(no_exp)).to be_nil
    end
  end

  it "returns a GraphQL error, not a 500, for another user's item" do
    other = create(:user)
    item = create(:timeline_item, user: other, household: create(:household))
    token = AuthToken.encode(user)

    body = gql("{ timelineItem(id: \"#{item.id}\") { id } }", headers: { "Authorization" => "Bearer #{token}" })

    expect(response).to have_http_status(:ok)
    expect(body.dig("errors", 0, "message")).to eq("Not found")
  end
end
