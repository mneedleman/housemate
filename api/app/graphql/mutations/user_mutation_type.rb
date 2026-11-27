module Mutations
  module UserMutationType
    extend ActiveSupport::Concern

    included do
      field :signup, GraphQL::Types::JSON, null: true do
        argument :email, String, required: true
        argument :password, String, required: true
        argument :name, String
        argument :invitation_token, String, required: false,
          description: "From an invitation link: joins that household. The email must match the invitation."
      end

      field :login, GraphQL::Types::JSON, null: true do
        argument :email, String, required: true
        argument :password, String, required: true
      end
    end

    def signup(email:, password:, name:, invitation_token: nil)
      AuthThrottle.check!(context[:ip])
      AuthThrottle.record!(context[:ip])

      if invitation_token
        invitation = Invitation.find_by_token(invitation_token) or raise GraphQL::ExecutionError, "This invitation link isn't valid"
        invitation.ensure_acceptable_by!(email)
      end

      user = User.transaction do
        User.create!(email:, password:, name:).tap { |created| invitation&.accept!(created) }
      end
      create_auth_token(user)
    rescue Invitation::NotAcceptable => e
      raise GraphQL::ExecutionError, e.message
    end

    # Unknown email and wrong password both return nil, and authenticate_by takes the same
    # time either way, so the response doesn't reveal which emails have accounts.
    def login(email:, password:)
      AuthThrottle.check!(context[:ip])
      unless (user = User.authenticate_by(email:, password:))
        AuthThrottle.record!(context[:ip])
        return
      end

      token = create_auth_token(user)
      return token unless user.household_id.blank?

      # No household selected yet: default to the first one they belong to
      if (household_id = user.households.pick(:id))
        user.update_column(:household_id, household_id)
      end

      token
    end

    # private
    def create_auth_token(user)
      { token: AuthToken.encode(user) }
    end
  end
end
