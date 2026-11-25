require 'rails_helper'

RSpec.describe "GraphQL login", type: :request do
  let(:password) { "password123" }

  def login(email)
    post "/graphql",
      params: {
        query: "mutation($email: String!, $password: String!) { login(email: $email, password: $password) }",
        variables: { email: email, password: password }
      },
      as: :json
    response.parsed_body
  end

  context "when the user already has a current household" do
    let(:household) { create(:household) }
    let(:user) { create(:user, password: password, household: household, households: [household]) }

    it "returns a token" do
      body = login(user.email)

      expect(body.dig("data", "login", "token")).to be_present
    end
  end

  context "when the user belongs to a household but has none selected" do
    let(:household) { create(:household) }
    let(:user) { create(:user, password: password, household: nil, households: [household]) }

    it "returns a token" do
      body = login(user.email)

      expect(body["errors"]).to be_nil
      expect(body.dig("data", "login", "token")).to be_present
    end

    it "selects their first household" do
      login(user.email)

      expect(user.reload.household_id).to eq(household.id)
    end
  end
end
