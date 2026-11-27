# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.1].define(version: 2026_11_27_200914) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_catalog.plpgsql"

  create_table "households", force: :cascade do |t|
    t.string "name", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "owner_id"
    t.index ["owner_id"], name: "index_households_on_owner_id"
  end

  create_table "households_users", id: false, force: :cascade do |t|
    t.bigint "household_id"
    t.bigint "user_id"
    t.index ["household_id"], name: "index_households_users_on_household_id"
    t.index ["user_id"], name: "index_households_users_on_user_id"
  end

  create_table "leftovers", force: :cascade do |t|
    t.string "name"
    t.bigint "user_id", null: false
    t.bigint "household_id", null: false
    t.string "allergens"
    t.datetime "use_by"
    t.datetime "trash_by"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["household_id"], name: "index_leftovers_on_household_id"
    t.index ["user_id"], name: "index_leftovers_on_user_id"
  end

  create_table "timeline_item_instances", force: :cascade do |t|
    t.bigint "timeline_item_id", null: false
    t.datetime "completed_at"
    t.datetime "scheduled_for"
    t.datetime "skipped_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["timeline_item_id"], name: "index_timeline_item_instances_on_timeline_item_id"
  end

  create_table "timeline_items", force: :cascade do |t|
    t.string "title", null: false
    t.text "body"
    t.integer "frequency_value"
    t.datetime "last_completed_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "user_id", null: false
    t.bigint "household_id", null: false
    t.integer "frequency_unit", default: 0
    t.index ["household_id"], name: "index_timeline_items_on_household_id"
    t.index ["user_id"], name: "index_timeline_items_on_user_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "password_digest", null: false
    t.string "name"
    t.string "email", null: false
    t.json "tokens"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "household_id"
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["household_id"], name: "index_users_on_household_id"
  end

  add_foreign_key "households", "users", column: "owner_id"
  add_foreign_key "leftovers", "households"
  add_foreign_key "leftovers", "users"
  add_foreign_key "timeline_item_instances", "timeline_items"
  add_foreign_key "timeline_items", "households"
  add_foreign_key "timeline_items", "users"
  add_foreign_key "users", "households"
end
