module Types
  # An invitation as its household's owner sees it
  class InvitationType < BaseObject
    field :id, ID, null: false
    field :email, String, null: false
    field :status, String, null: false, description: "pending, accepted, canceled or expired"
    field :created_at, GraphQL::Types::ISO8601DateTime, null: false
    field :expires_at, GraphQL::Types::ISO8601DateTime, null: false
    field :inviter, Types::UserType, null: false
  end
end
