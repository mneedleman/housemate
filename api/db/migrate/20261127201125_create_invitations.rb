class CreateInvitations < ActiveRecord::Migration[8.1]
  def change
    create_table :invitations do |t|
      t.references :household, null: false, foreign_key: true
      t.references :inviter, null: false, foreign_key: { to_table: :users }
      t.string :email, null: false
      # SHA-256 of the token in the emailed link; the token itself is never stored
      t.string :token_digest, null: false, index: { unique: true }
      t.datetime :expires_at, null: false
      t.datetime :accepted_at
      t.references :accepted_by, foreign_key: { to_table: :users }
      t.datetime :canceled_at
      t.timestamps
    end

    # At most one open invitation per email per household
    add_index :invitations, [ :household_id, :email ], unique: true,
      where: "accepted_at IS NULL AND canceled_at IS NULL", name: "index_invitations_open_per_household_email"
  end
end
