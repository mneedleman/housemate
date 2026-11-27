# Limits failed logins and signups per client IP to slow down password guessing and mass signups.
# Successful logins don't count, so a household sharing one IP doesn't lock itself out.
# Counts live in Rails.cache (in-memory in production; fine for a single server).
module AuthThrottle
  LIMIT = 10
  PERIOD = 15.minutes

  class Exceeded < GraphQL::ExecutionError
    def initialize
      super("Too many attempts. Try again in a few minutes.")
    end
  end

  def self.check!(ip)
    raise Exceeded if Rails.cache.read(key(ip)).to_i >= LIMIT
  end

  def self.record!(ip)
    Rails.cache.increment(key(ip), 1, expires_in: PERIOD)
  end

  def self.key(ip)
    "auth-attempts:#{ip}"
  end
end
