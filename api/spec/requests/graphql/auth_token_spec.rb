require 'rails_helper'

RSpec.describe "GraphQL bearer token auth", type: :request do
  let(:household) { create(:household) }
  let(:user) { create(:user, household: household) }
  let!(:item) { create(:timeline_item, user: user, household: household) }

  def timeline_items(token)
    post "/graphql",
      params: { query: "{ timelineItems { id } }" },
      headers: { "Authorization" => "Bearer #{token}" },
      as: :json
    response.parsed_body.dig("data", "timelineItems")
  end

  it "accepts a token issued by the server" do
    expect(timeline_items(AuthToken.encode(user))).to be_present
  end

  it "rejects a token signed with a different key" do
    forged = JWT.encode({ user: user.id }, "attacker-key", "HS256")

    expect(timeline_items(forged)).to be_blank
  end

  it "rejects an unsigned token" do
    forged = JWT.encode({ user: user.id }, nil, "none")

    expect(timeline_items(forged)).to be_blank
  end
end
