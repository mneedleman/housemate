require 'rails_helper'

RSpec.describe "GraphQL timelineItems", type: :request do
  let(:household) { create(:household) }
  let(:user) { create(:user, household: household) }
  let!(:item) { create(:timeline_item, user: user, household: household) }
  let(:token) { JWT.encode({ user: user.id }, 'foo') }

  def run_query(fields)
    post "/graphql",
      params: { query: "{ timelineItems { id #{fields} } }" },
      headers: { "Authorization" => "Bearer #{token}" },
      as: :json
    response.parsed_body
  end

  it "resolves dueAt for every field the schema declares" do
    body = run_query("dueAt")

    debugger
    expect(body["errors"]).to be_nil
    expect(body.dig("data", "timelineItems", 0)).to have_key("dueAt")
  end

  it "returns null dueAt for an item that has never been completed" do
    body = run_query("dueAt")

    expect(body.dig("data", "timelineItems", 0, "dueAt")).to be_nil
  end

  context "when the item has been completed and has a frequency" do
    let!(:item) do
      create(:timeline_item, user: user, household: household,
        last_completed_at: Time.utc(2026, 1, 10), frequency_value: 2, frequency_unit: :weeks)
    end

    it "is due one interval after the last completion" do
      body = run_query("dueAt")

      expect(Time.iso8601(body.dig("data", "timelineItems", 0, "dueAt"))).to eq(Time.utc(2026, 1, 24))
    end
  end

  it "no longer exposes color" do
    body = run_query("color")

    expect(body["errors"].first["message"]).to include("Field 'color' doesn't exist")
  end
end
