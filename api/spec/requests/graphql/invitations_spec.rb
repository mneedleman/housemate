require 'rails_helper'

RSpec.describe "Household invitations", type: :request do
  include ActiveJob::TestHelper

  let(:owner) { create(:user, name: "Olive Owner") }
  let(:household) { create(:household, name: "Beach House", owner: owner) }
  let!(:member) { create(:user, household: household, households: [ household ]) }

  before { owner.update!(household: household, households: [ household ]) }
  after { ActionMailer::Base.deliveries.clear }

  def gql(query, variables = {}, as: nil)
    headers = as ? { "Authorization" => "Bearer #{AuthToken.encode(as)}" } : {}
    post "/graphql", params: { query: query, variables: variables }, headers: headers, as: :json
    response.parsed_body
  end

  def invite(email, as: owner)
    perform_enqueued_jobs do
      gql("mutation($h: ID!, $e: String!) { inviteToHousehold(householdId: $h, email: $e) { id email status } }",
        { h: household.id, e: email }, as: as)
    end
  end

  # The emailed link is the only place the plain token exists
  def token_from_last_email
    ActionMailer::Base.deliveries.last.text_part.body.to_s[%r{/invite/(\S+)}, 1]
  end

  def signup(email, token)
    gql("mutation($e: String!, $t: String) { signup(email: $e, password: \"long-enough-password\", name: \"New\", invitationToken: $t) }",
      { e: email, t: token })
  end

  def lookup(token)
    gql("query($t: String!) { invitation(token: $t) { email status householdName inviterName accountExists } }", { t: token })
      .dig("data", "invitation")
  end

  describe "inviting" do
    it "emails a link to the invited address" do
      body = invite("  New.Person@Example.com ")

      expect(body.dig("data", "inviteToHousehold")).to include("email" => "new.person@example.com", "status" => "pending")
      mail = ActionMailer::Base.deliveries.last
      expect(mail.to).to eq([ "new.person@example.com" ])
      expect(mail.subject).to eq("Olive Owner invited you to Beach House on Housemate")
      expect(mail.html_part.body.to_s).to include("http://localhost:8080/invite/#{token_from_last_email}")
    end

    it "stores only a digest of the token" do
      invite("new@example.com")
      token = token_from_last_email

      expect(Invitation.last.token_digest).to eq(Invitation.digest(token))
      expect(Invitation.last.attributes.values).not_to include(token)
    end

    it "is owner only" do
      body = invite("new@example.com", as: member)

      expect(body.dig("errors", 0, "message")).to eq("Only the household's owner can invite people")
      expect(ActionMailer::Base.deliveries).to be_empty
    end

    it "refuses people who are already members" do
      expect(invite(member.email).dig("errors", 0, "message")).to eq("#{member.email} is already in Beach House")
    end

    it "replaces the previous link when re-inviting the same email" do
      invite("new@example.com")
      old_token = token_from_last_email
      invite("new@example.com")

      expect(lookup(old_token)["status"]).to eq("canceled")
      expect(lookup(token_from_last_email)["status"]).to eq("pending")
      expect(household.invitations.open.count).to eq(1)
    end

    context "with a real cache" do
      around do |example|
        original = Rails.cache
        Rails.cache = ActiveSupport::Cache::MemoryStore.new
        example.run
      ensure
        Rails.cache = original
      end

      it "limits how many invitations a user can send per day" do
        InviteThrottle::LIMIT.times { |i| invite("person#{i}@example.com") }

        expect(invite("one-more@example.com").dig("errors", 0, "message")).to match(/a lot of invitations today/)
      end
    end
  end

  describe "pending invitations" do
    it "shows the owner pending invitations only" do
      invite("pending@example.com")
      invite("canceled@example.com")
      Invitation.find_by(email: "canceled@example.com").cancel!
      Invitation.create!(household: household, inviter: owner, email: "expired@example.com", expires_at: 1.minute.ago)

      list = gql("{ households { pendingInvitations { email status inviter { name } } } }", as: owner)
        .dig("data", "households", 0, "pendingInvitations")
      expect(list).to eq([ { "email" => "pending@example.com", "status" => "pending", "inviter" => { "name" => "Olive Owner" } } ])
    end

    it "hides them from other members" do
      invite("pending@example.com")

      expect(gql("{ households { pendingInvitations { email } } }", as: member).dig("data", "households", 0, "pendingInvitations")).to be_nil
    end
  end

  describe "canceling" do
    def cancel(id, as:)
      gql("mutation($id: ID!) { cancelInvitation(id: $id) }", { id: id }, as: as)
    end

    it "lets the owner cancel, after which the link no longer works" do
      invite("new@example.com")
      token = token_from_last_email

      expect(cancel(Invitation.last.id, as: owner).dig("data", "cancelInvitation")).to be(true)
      expect(lookup(token)["status"]).to eq("canceled")
      expect(signup("new@example.com", token).dig("errors", 0, "message")).to eq("This invitation was canceled")
      expect(User.where(email: "new@example.com")).to be_empty
    end

    it "is owner only" do
      invite("new@example.com")

      expect(cancel(Invitation.last.id, as: member).dig("errors", 0, "message")).to eq("Only the household's owner can cancel invitations")
      expect(Invitation.last.status).to eq("pending")
    end

    it "can't cancel an accepted invitation" do
      invite("new@example.com")
      signup("new@example.com", token_from_last_email)

      expect(cancel(Invitation.last.id, as: owner).dig("errors", 0, "message")).to eq("This invitation has already been accepted")
    end
  end

  describe "looking up a link" do
    it "works without logging in and says whether to sign up or log in" do
      invite("new@example.com")

      expect(lookup(token_from_last_email)).to eq(
        "email" => "new@example.com", "status" => "pending", "householdName" => "Beach House",
        "inviterName" => "Olive Owner", "accountExists" => false
      )
    end

    it "returns nothing for an unknown token" do
      expect(lookup("not-a-real-token")).to be_nil
    end
  end

  describe "signing up from a link" do
    it "creates the account in the household, as its current household" do
      invite("new@example.com")
      body = signup("New@Example.com", token_from_last_email)

      user = User.find_by(email: "new@example.com")
      expect(body.dig("data", "signup", "token")).to be_present
      expect(user.households).to eq([ household ])
      expect(user.household).to eq(household)
      expect(Invitation.last).to have_attributes(status: "accepted", accepted_by: user)
    end

    it "requires the invited email address" do
      invite("new@example.com")
      body = signup("someone-else@example.com", token_from_last_email)

      expect(body.dig("errors", 0, "message")).to eq("This invitation was sent to new@example.com. Use that email address to accept it.")
      expect(User.where(email: "someone-else@example.com")).to be_empty
    end

    it "refuses expired invitations" do
      invite("new@example.com")
      token = token_from_last_email
      Invitation.last.update!(expires_at: 1.minute.ago)

      expect(signup("new@example.com", token).dig("errors", 0, "message")).to match(/expired/)
    end

    it "only works once" do
      invite("new@example.com")
      token = token_from_last_email
      signup("new@example.com", token)

      expect(signup("new@example.com", token).dig("errors", 0, "message")).to eq("This invitation has already been used")
    end
  end

  describe "accepting as an existing user" do
    let!(:existing) { create(:user, email: "existing@example.com") }

    def accept(token, as:)
      gql("mutation($t: String!) { acceptInvitation(token: $t) { name } }", { t: token }, as: as)
    end

    it "tells the link page to log in instead of signing up" do
      invite("existing@example.com")

      expect(lookup(token_from_last_email)["accountExists"]).to be(true)
    end

    it "joins the household once logged in with the invited email" do
      invite("existing@example.com")

      expect(accept(token_from_last_email, as: existing).dig("data", "acceptInvitation", "name")).to eq("Beach House")
      expect(existing.reload.household).to eq(household)
    end

    it "refuses a different logged-in user" do
      invite("existing@example.com")
      body = accept(token_from_last_email, as: member)

      expect(body.dig("errors", 0, "message")).to match(/sent to existing@example.com/)
    end
  end

  it "no longer lets members add users directly" do
    body = gql("mutation { addUserToHousehold(id: \"#{household.id}\", userId: \"1\") }", as: owner)

    expect(body.dig("errors", 0, "message")).to match(/doesn't exist on type 'Mutation'/)
  end
end
