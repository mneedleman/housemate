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
  validates :name, presence: true
  has_many :timeline_items, dependent: :destroy
end
