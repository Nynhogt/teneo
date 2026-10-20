class CreateOrganizations < ActiveRecord::Migration[8.1]
  def change
    create_table :organizations do |table|
      table.string :name, null: false
      table.string :slug, null: false
      table.timestamps
    end

    add_index :organizations, :slug, unique: true
  end
end
