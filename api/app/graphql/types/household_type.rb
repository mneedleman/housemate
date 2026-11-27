module Types
  class HouseholdType < BaseObject
    field :id, ID, null: false
    field :name, String, null: false
    field :users, [ Types::UserType ]
    field :owner, Types::UserType
    field :is_owner, Boolean, null: false, description: "Whether the current user owns this household"

    field :pending_invitations, [ Types::InvitationType ], description: "Owner only; null for other members"

    def is_owner
      object.owned_by?(current_user)
    end

    def pending_invitations
      return unless object.owned_by?(current_user)

      object.invitations.pending.includes(:inviter).order(:created_at)
    end
  end
end
