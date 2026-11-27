require 'rails_helper'

RSpec.describe "Household owners", type: :request do
  let(:owner) { create(:user) }
  let(:household) { create(:household, owner: owner) }
  let!(:member) { create(:user, household: household, households: [ household ]) }

  before { owner.update!(household: household, households: [ household ]) }

  def gql(query, as:)
    post "/graphql", params: { query: query }, headers: { "Authorization" => "Bearer #{AuthToken.encode(as)}" }, as: :json
    response.parsed_body
  end

  it "exposes the owner and whether the viewer is it" do
    query = "{ households { owner { email } isOwner } }"

    expect(gql(query, as: owner).dig("data", "households", 0)).to eq({ "owner" => { "email" => owner.email }, "isOwner" => true })
    expect(gql(query, as: member).dig("data", "households", 0, "isOwner")).to be(false)
  end

  describe "removeUserFromHousehold" do
    def remove(user, as:)
      gql("mutation { removeUserFromHousehold(id: \"#{household.id}\", userId: \"#{user.id}\") }", as: as)
    end

    it "lets the owner remove a member, clearing their current household" do
      expect(remove(member, as: owner).dig("data", "removeUserFromHousehold")).to be(true)
      expect(household.reload.users).to eq([ owner ])
      expect(member.reload.household).to be_nil
    end

    it "refuses members who aren't the owner" do
      expect(remove(owner, as: member).dig("errors", 0, "message")).to eq("Only the household's owner can remove members")
      expect(household.reload.users).to include(owner)
    end

    it "won't remove the owner" do
      expect(remove(owner, as: owner).dig("errors", 0, "message")).to eq("The owner can't be removed")
    end
  end
end
