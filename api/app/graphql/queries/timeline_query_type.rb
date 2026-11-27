module Queries
  module TimelineQueryType
    extend ActiveSupport::Concern

    included do
      field :timeline_items, [ Types::TimelineItemType, null: false ], null: true do
        argument :household_ids, [ GraphQL::Types::ID ], required: false,
          description: "Households to include (only ones you belong to). Defaults to your current household."
      end

      field :timeline_item, Types::TimelineItemType, null: false do
        argument :id, GraphQL::Types::ID
      end
    end

    def timeline_items(household_ids: nil)
      return unless current_user

      # Scoped through current_user.households, so IDs of households you're not in are ignored
      households = household_ids.nil? ? current_user.household : current_user.households.where(id: household_ids)
      TimelineItem.where(household: households).includes(:household).order(:id)
    end

    def timeline_item(id:)
      return unless current_user

      current_user.timeline_items.find(id)
    end
  end
end
