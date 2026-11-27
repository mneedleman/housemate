# An emailed invitation to join a household. The link carries a random token; only its
# SHA-256 digest is stored, so database access alone can't produce a working link.
class Invitation < ApplicationRecord
  EXPIRES_IN = 7.days

  class NotAcceptable < StandardError; end

  belongs_to :household
  belongs_to :inviter, class_name: "User"
  belongs_to :accepted_by, class_name: "User", optional: true

  normalizes :email, with: ->(email) { email.strip.downcase }
  validates :email, presence: true, format: { with: URI::MailTo::EMAIL_REGEXP }

  # Open = not accepted or canceled (may still be expired)
  scope :open, -> { where(accepted_at: nil, canceled_at: nil) }
  scope :pending, -> { open.where("expires_at > ?", Time.current) }

  # The plain token, only available on the instance that created it (for the email)
  attr_reader :token

  before_validation :generate_token, on: :create

  def self.digest(token)
    OpenSSL::Digest::SHA256.hexdigest(token.to_s)
  end

  def self.find_by_token(token)
    return if token.blank?

    find_by(token_digest: digest(token))
  end

  def status
    if accepted_at then "accepted"
    elsif canceled_at then "canceled"
    elsif expires_at <= Time.current then "expired"
    else "pending"
    end
  end

  def pending?
    status == "pending"
  end

  # Raises NotAcceptable with a user-facing message unless `user` may accept this invitation.
  def ensure_acceptable_by!(email)
    case status
    when "accepted" then raise NotAcceptable, "This invitation has already been used"
    when "canceled" then raise NotAcceptable, "This invitation was canceled"
    when "expired" then raise NotAcceptable, "This invitation has expired. Ask for a new one."
    end
    return if email.to_s.strip.downcase == self.email

    raise NotAcceptable, "This invitation was sent to #{self.email}. Use that email address to accept it."
  end

  # Adds the user to the household, makes it their current household, and closes the invitation.
  def accept!(user)
    ensure_acceptable_by!(user.email)

    transaction do
      household.users << user unless household.users.exists?(user.id)
      user.update!(household: household)
      update!(accepted_at: Time.current, accepted_by: user)
    end
  end

  def cancel!
    update!(canceled_at: Time.current)
  end

  private

  def generate_token
    @token = SecureRandom.urlsafe_base64(32)
    self.token_digest = self.class.digest(@token)
    self.expires_at ||= EXPIRES_IN.from_now
  end
end
