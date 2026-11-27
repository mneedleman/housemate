# == Schema Information
#
# Table name: timeline_items
#
#  id                :bigint           not null, primary key
#  body              :text
#  frequency_unit    :integer          default("days")
#  frequency_value   :integer
#  last_completed_at :datetime
#  title             :string           not null
#  created_at        :datetime         not null
#  updated_at        :datetime         not null
#  household_id      :bigint           not null
#  user_id           :bigint           not null
#
# Indexes
#
#  index_timeline_items_on_household_id  (household_id)
#  index_timeline_items_on_user_id       (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (household_id => households.id)
#  fk_rails_...  (user_id => users.id)
#
class TimelineItem < ApplicationRecord
  belongs_to :household
  belongs_to :user

  has_many :timeline_item_instances, dependent: :destroy

  enum :frequency_unit, [
    :days,
    :weeks,
    :months
  ]

  def frequency_unit_formatted
    return "" if frequency_value.blank?
    return frequency_unit.singularize if frequency_value < 2

    frequency_unit
  end

  def frequency
    "#{frequency_value} #{frequency_unit_formatted}"
  end

  # Next due date: one frequency interval after the last completion.
  # Nil until the item has been completed and has a frequency set.
  def due_at
    return if last_completed_at.blank? || frequency_value.blank? || frequency_unit.blank?

    last_completed_at + frequency_value.public_send(frequency_unit)
  end
end
