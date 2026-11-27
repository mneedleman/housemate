require 'rails_helper'

RSpec.describe "GraphQL timelineItems household filter", type: :request do
  let(:home) { create(:household, name: "Home") }
  let(:cabin) { create(:household, name: "Cabin") }
  let(:strangers) { create(:household, name: "Strangers") }
  let(:user) { create(:user, household: home, households: [ home, cabin ]) }

  let!(:home_item) { create(:timeline_item, title: "Bins", user: user, household: home) }
  let!(:cabin_item) { create(:timeline_item, title: "Gutters", user: user, household: cabin) }
  let!(:stranger_item) { create(:timeline_item, title: "Secret", user: create(:user), household: strangers) }

  def titles(household_ids = :omit)
    variables = household_ids == :omit ? {} : { householdIds: household_ids }
    post "/graphql",
      params: {
        query: "query($householdIds: [ID!]) { timelineItems(householdIds: $householdIds) { title household { name } } }",
        variables: variables
      },
      headers: { "Authorization" => "Bearer #{AuthToken.encode(user)}" },
      as: :json
    response.parsed_body.dig("data", "timelineItems").map { |i| [ i["title"], i.dig("household", "name") ] }
  end

  it "defaults to the current household" do
    expect(titles).to eq([ [ "Bins", "Home" ] ])
  end

  it "returns one other household the user belongs to" do
    expect(titles([ cabin.id ])).to eq([ [ "Gutters", "Cabin" ] ])
  end

  it "returns several households at once" do
    expect(titles([ home.id, cabin.id ])).to contain_exactly([ "Bins", "Home" ], [ "Gutters", "Cabin" ])
  end

  it "ignores households the user isn't in" do
    expect(titles([ strangers.id ])).to eq([])
    expect(titles([ home.id, strangers.id ])).to eq([ [ "Bins", "Home" ] ])
  end

  it "returns nothing for an empty list" do
    expect(titles([])).to eq([])
  end
end
