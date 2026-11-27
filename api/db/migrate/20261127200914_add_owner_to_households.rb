class AddOwnerToHouseholds < ActiveRecord::Migration[8.1]
  def up
    add_reference :households, :owner, foreign_key: { to_table: :users }, null: true

    # Existing households: the earliest member (oldest account) becomes the owner.
    # households_users has no timestamps, so account age is the best signal available.
    execute <<~SQL
      UPDATE households
      SET owner_id = (
        SELECT MIN(households_users.user_id)
        FROM households_users
        WHERE households_users.household_id = households.id
      )
    SQL
  end

  def down
    remove_reference :households, :owner, foreign_key: { to_table: :users }
  end
end
