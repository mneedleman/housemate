# == Schema Information
#
# Table name: timeline_item_instances
#
#  id               :bigint           not null, primary key
#  completed_at     :datetime
#  scheduled_for    :datetime
#  skipped_at       :datetime
#  created_at       :datetime         not null
#  updated_at       :datetime         not null
#  timeline_item_id :bigint           not null
#
# Indexes
#
#  index_timeline_item_instances_on_timeline_item_id  (timeline_item_id)
#
# Foreign Keys
#
#  fk_rails_...  (timeline_item_id => timeline_items.id)
#
require 'rails_helper'

RSpec.describe TimelineItemInstance, type: :model do
  pending "add some examples to (or delete) #{__FILE__}"
end
