class InvitationMailer < ApplicationMailer
  # params: invitation:, token: (the plain token, which isn't stored on the record)
  def invite
    @invitation = params[:invitation]
    @inviter_name = @invitation.inviter.name.presence || @invitation.inviter.email
    @household_name = @invitation.household.name
    @url = "#{Rails.configuration.x.app_url}/invite/#{params[:token]}"

    mail(to: @invitation.email, subject: "#{@inviter_name} invited you to #{@household_name} on Housemate")
  end
end
