module Types
  # What the holder of an invitation link can see, before signing up or logging in
  class PublicInvitationType < BaseObject
    field :email, String, null: false
    field :status, String, null: false, description: "pending, accepted, canceled or expired"
    field :household_name, String, null: false
    field :inviter_name, String, null: false
    field :account_exists, Boolean, null: false,
      description: "Whether the invited email already has an account (log in to accept) or not (sign up)"

    def household_name = object.household.name
    def inviter_name = object.inviter.name.presence || object.inviter.email
    def account_exists = User.exists?(email: object.email)
  end
end
