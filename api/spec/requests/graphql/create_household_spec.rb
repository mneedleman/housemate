require 'rails_helper'

RSpec.describe "GraphQL createHousehold", type: :request do
  let(:existing) { create(:household) }
  let!(:user) { create(:user, household: existing, households: [ existing ]) }

  def create_household(variables, token: AuthToken.encode(user))
    post "/graphql",
      params: {
        query: "mutation($name: String!, $makeCurrent: Boolean) { createHousehold(name: $name, makeCurrent: $makeCurrent) { id name users { email } } }",
        variables: variables
      },
      headers: { "Authorization" => "Bearer #{token}" },
      as: :json
    response.parsed_body
  end

  it "creates the household with the user as its only member" do
    body = create_household({ name: "Beach House" })

    household = Household.find(body.dig("data", "createHousehold", "id"))
    expect(household.name).to eq("Beach House")
    expect(household.users).to eq([ user ])
    expect(household.owner).to eq(user)
    expect(body.dig("data", "createHousehold", "users")).to eq([ { "email" => user.email } ])
  end

  it "leaves the current household alone by default" do
    create_household({ name: "Beach House" })

    expect(user.reload.household).to eq(existing)
  end

  it "switches the user to it when makeCurrent is true" do
    body = create_household({ name: "Beach House", makeCurrent: true })

    expect(user.reload.household_id.to_s).to eq(body.dig("data", "createHousehold", "id"))
  end

  it "rejects a blank name without creating anything" do
    expect {
      body = create_household({ name: "   ", makeCurrent: true })
      expect(body.dig("errors", 0, "message")).to eq("Name can't be blank")
    }.not_to change(Household, :count)

    expect(user.reload.household).to eq(existing)
  end

  it "does nothing when signed out" do
    expect {
      body = create_household({ name: "Beach House" }, token: nil)
      expect(body.dig("data", "createHousehold")).to be_nil
    }.not_to change(Household, :count)
  end
end
