# Caps how many invitation emails one user can send per day, so the app can't be used
# to spam arbitrary addresses (which would also hurt the sending domain's reputation).
module InviteThrottle
  LIMIT = 20
  PERIOD = 1.day

  def self.check!(user)
    count = Rails.cache.increment("invites-sent:#{user.id}", 1, expires_in: PERIOD)
    raise GraphQL::ExecutionError, "You've sent a lot of invitations today. Try again tomorrow." if count.to_i > LIMIT
  end
end
