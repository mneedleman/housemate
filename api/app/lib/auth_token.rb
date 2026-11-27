# Signs and verifies the bearer tokens handed out on login/signup.
# The key is secret_key_base (SECRET_KEY_BASE env var in production).
module AuthToken
  ALGORITHM = "HS256"

  def self.encode(user)
    JWT.encode({ user: user.id }, secret, ALGORITHM)
  end

  # Returns the user id, or nil if the token is missing, tampered with, or malformed.
  def self.decode(token)
    payload, = JWT.decode(token, secret, true, algorithm: ALGORITHM)
    payload["user"]
  rescue JWT::DecodeError
    nil
  end

  def self.secret
    Rails.application.secret_key_base
  end
end
