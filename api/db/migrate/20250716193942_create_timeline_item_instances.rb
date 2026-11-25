class CreateTimelineItemInstances < ActiveRecord::Migration[7.1]
  def change
    create_table :timeline_item_instances do |t|
      t.references :timeline_item, null: false, foreign_key: true
      t.datetime :completed_at, null: true
      t.datetime :scheduled_for, null: true
      t.datetime :skipped_at, null: true

      t.timestamps
    end
  end
end
