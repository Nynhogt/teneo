ActiveRecord::Schema[8.1].define(version: 2026_10_18_000000) do
  create_table "organizations", force: :cascade do |table|
    table.string "name", null: false
    table.string "slug", null: false
    table.datetime "created_at", null: false
    table.datetime "updated_at", null: false
    table.index ["slug"], name: "index_organizations_on_slug", unique: true
  end
end
