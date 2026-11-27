# == Schema Information
#
# Table name: households
#
#  id         :bigint           not null, primary key
#  name       :string           not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
class Household < ApplicationRecord
  has_and_belongs_to_many :users
  # Optional only for households that predate owners and had no members to inherit it
  belongs_to :owner, class_name: "User", optional: true
  validates :name, presence: true
  validates :owner, presence: true, on: :create
  has_many :timeline_items, dependent: :destroy
  has_many :leftovers, dependent: :destroy
  # Members who have this as their current household; cleared before it's deleted
  has_many :current_users, class_name: "User", foreign_key: :household_id,
    inverse_of: :household, dependent: :nullify

  def owned_by?(user)
    user.present? && owner_id == user.id
  end
end
