module Queries
  module InvitationQueryType
    extend ActiveSupport::Concern

    included do
      field :invitation, Types::PublicInvitationType, null: true,
        description: "Look up an invitation by the token from its email link. No login needed." do
        argument :token, String, required: true
      end
    end

    def invitation(token:)
      Invitation.find_by_token(token)
    end
  end
end
