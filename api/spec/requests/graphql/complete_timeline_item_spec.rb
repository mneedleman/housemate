require 'rails_helper'

RSpec.describe "GraphQL completeTimelineItem", type: :request do
  let(:household) { create(:household) }
  let(:creator) { create(:user, household: household, households: [ household ]) }
  let(:housemate) { create(:user, household: household, households: [ household ]) }
  let(:outsider) { create(:user, households: [ create(:household) ]) }
  let!(:item) { create(:timeline_item, user: creator, household: household, last_completed_at: nil) }

  def complete(as:)
    post "/graphql",
      params: { query: "mutation($id: ID!) { completeTimelineItem(id: $id) { id lastCompletedAt } }", variables: { id: item.id } },
      headers: { "Authorization" => "Bearer #{AuthToken.encode(as)}" },
      as: :json
    response.parsed_body
  end

  it "lets the creator mark it done" do
    freeze_time do
      body = complete(as: creator)

      expect(body["errors"]).to be_nil
      expect(item.reload.last_completed_at).to eq(Time.current)
    end
  end

  it "lets another member of the household mark it done" do
    body = complete(as: housemate)

    expect(body["errors"]).to be_nil
    expect(item.reload.last_completed_at).to be_present
  end

  it "uses the server's clock" do
    travel_to Time.utc(2026, 3, 1, 12) do
      expect(complete(as: housemate).dig("data", "completeTimelineItem", "lastCompletedAt")).to eq("2026-03-01T12:00:00Z")
    end
  end

  it "refuses someone outside the household" do
    body = complete(as: outsider)

    expect(body.dig("errors", 0, "message")).to eq("Not found")
    expect(item.reload.last_completed_at).to be_nil
  end

  it "still only lets the creator edit it" do
    post "/graphql",
      params: { query: "mutation($id: ID!) { editTimelineItem(id: $id, title: \"Renamed\") { id } }", variables: { id: item.id } },
      headers: { "Authorization" => "Bearer #{AuthToken.encode(housemate)}" },
      as: :json

    expect(response.parsed_body.dig("errors", 0, "message")).to eq("Not found")
    expect(item.reload.title).not_to eq("Renamed")
  end
end
