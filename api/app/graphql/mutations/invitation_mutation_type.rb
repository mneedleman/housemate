module Mutations
  module InvitationMutationType
    extend ActiveSupport::Concern

    included do
      field :invite_to_household, Types::InvitationType, null: true,
        description: "Email an invitation to join a household. Owner only. Re-inviting an email replaces its old link." do
        argument :household_id, GraphQL::Types::ID, required: true
        argument :email, String, required: true
      end

      field :cancel_invitation, GraphQL::Types::Boolean, null: true, description: "Owner only; the link stops working." do
        argument :id, GraphQL::Types::ID, required: true
      end

      field :accept_invitation, Types::HouseholdType, null: true,
        description: "Join the invitation's household as the logged-in user (whose email must match)." do
        argument :token, String, required: true
      end
    end

    def invite_to_household(household_id:, email:)
      return unless current_user

      household = owned_household!(household_id, "Only the household's owner can invite people")
      email = email.strip.downcase
      raise GraphQL::ExecutionError, "#{email} is already in #{household.name}" if household.users.exists?(email: email)

      InviteThrottle.check!(current_user)
      invitation = Invitation.transaction do
        # Re-inviting acts as "resend": the previous link stops working
        household.invitations.open.where(email: email).find_each(&:cancel!)
        household.invitations.create!(email: email, inviter: current_user)
      end
      InvitationMailer.with(invitation: invitation, token: invitation.token).invite.deliver_later
      invitation
    end

    def cancel_invitation(id:)
      return unless current_user

      invitation = Invitation.joins(:household).merge(current_user.households).find(id)
      owned_household!(invitation.household_id, "Only the household's owner can cancel invitations")
      raise GraphQL::ExecutionError, "This invitation has already been #{invitation.status}" unless invitation.pending?

      invitation.cancel!
      true
    end

    def accept_invitation(token:)
      return unless current_user

      invitation = Invitation.find_by_token(token) or raise GraphQL::ExecutionError, "This invitation link isn't valid"
      invitation.accept!(current_user)
      invitation.household
    rescue Invitation::NotAcceptable => e
      raise GraphQL::ExecutionError, e.message
    end

    private

    def owned_household!(id, message)
      household = current_user.households.find(id)
      raise GraphQL::ExecutionError, message unless household.owned_by?(current_user)

      household
    end
  end
end
