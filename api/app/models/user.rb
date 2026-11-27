require "bcrypt"
# == Schema Information
#
# Table name: users
#
#  id              :bigint           not null, primary key
#  email           :string           not null
#  name            :string
#  password_digest :string           not null
#  tokens          :json
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#  household_id    :bigint
#
# Indexes
#
#  index_users_on_email         (email) UNIQUE
#  index_users_on_household_id  (household_id)
#
# Foreign Keys
#
#  fk_rails_...  (household_id => households.id)
#
class User < ApplicationRecord
  # Default validations: password required on create, at most 72 bytes (bcrypt's limit)
  has_secure_password
  validates :password, length: { minimum: 8 }, allow_nil: true

  # Stored and looked up lowercased, so "Me@Example.com" and "me@example.com" are one account
  normalizes :email, with: ->(email) { email.strip.downcase }
  validates :email, presence: true, uniqueness: true, format: { with: URI::MailTo::EMAIL_REGEXP }

  has_and_belongs_to_many :households
  belongs_to :household, optional: true
  has_many :timeline_items
  has_many :leftovers

  alias current_household household
end
