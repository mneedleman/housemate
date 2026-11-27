module Types
  class HouseholdType < BaseObject
    field :id, ID, null: false
    field :name, String, null: false
    field :users, [ Types::UserType ]
    field :owner, Types::UserType
    field :is_owner, Boolean, null: false, description: "Whether the current user owns this household"

    def is_owner
      object.owned_by?(current_user)
    end
  end
end
