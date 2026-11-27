require 'rails_helper'

RSpec.describe "GraphQL deleteHousehold", type: :request do
  let(:owner_user) { create(:user) }
  let(:doomed) { create(:household, name: "Doomed", owner: owner_user) }
  let(:other) { create(:household, name: "Other") }
  let!(:user) { owner_user.tap { |u| u.update!(household: doomed, households: [ doomed, other ]) } }
  let!(:housemate) { create(:user, household: doomed, households: [ doomed ]) }
  let!(:item) { create(:timeline_item, user: user, household: doomed) }
  let!(:instance) { TimelineItemInstance.create!(timeline_item: item) }
  let!(:leftover) { Leftover.create!(name: "Soup", trash_by: 3.days.from_now, user: user, household: doomed) }

  def delete_household(id, as: user)
    post "/graphql",
      params: { query: "mutation($id: ID!) { deleteHousehold(id: $id) }", variables: { id: id } },
      headers: { "Authorization" => "Bearer #{AuthToken.encode(as)}" },
      as: :json
    response.parsed_body
  end

  it "deletes the household with its tasks, task history and leftovers" do
    body = delete_household(doomed.id)

    expect(body).to eq({ "data" => { "deleteHousehold" => true } })
    expect(Household.exists?(doomed.id)).to be(false)
    expect(TimelineItem.exists?(item.id)).to be(false)
    expect(TimelineItemInstance.exists?(instance.id)).to be(false)
    expect(Leftover.exists?(leftover.id)).to be(false)
  end

  it "keeps the members' accounts and their other households" do
    delete_household(doomed.id)

    expect(user.reload.households).to eq([ other ])
    expect(User.exists?(housemate.id)).to be(true)
    expect(Household.exists?(other.id)).to be(true)
  end

  it "moves members whose current household it was to another of theirs, or to none" do
    delete_household(doomed.id)

    expect(user.reload.household).to eq(other)
    expect(housemate.reload.household).to be_nil
  end

  it "refuses a member who isn't the owner" do
    body = delete_household(doomed.id, as: housemate)

    expect(body.dig("errors", 0, "message")).to eq("Only the household's owner can delete it")
    expect(Household.exists?(doomed.id)).to be(true)
  end

  it "refuses a household the user isn't in" do
    stranger = create(:household)

    expect(delete_household(stranger.id).dig("errors", 0, "message")).to eq("Not found")
    expect(Household.exists?(stranger.id)).to be(true)
  end
end
