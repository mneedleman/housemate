module Mutations
  module HouseholdMutationType
    extend ActiveSupport::Concern

    included do
      field :edit_household, Types::HouseholdType do
        argument :name, String, required: true
      end

      field :set_household, Types::HouseholdType do
        argument :id, GraphQL::Types::ID, required: true
      end

      field :create_household, Types::HouseholdType do
        argument :name, String, required: true
        argument :make_current, GraphQL::Types::Boolean, required: false, default_value: false,
          description: "Also switch the current user to the new household"
      end

      field :delete_household, GraphQL::Types::Boolean do
        argument :id, GraphQL::Types::ID, required: true
      end


      field :remove_user_from_household, GraphQL::Types::Boolean do
        argument :id, GraphQL::Types::ID, required: true
        argument :user_id, GraphQL::Types::ID, required: true
      end
    end

    def edit_household(name:)
      return unless current_user
      return unless (household = current_user.household)

      household.update(name: name)
    end

    def set_household(id:)
      return unless current_user
      return unless (household = current_user.households.find(id))

      current_user.update(household: household)

      household
    end

    def create_household(name:, make_current:)
      return unless current_user

      Household.transaction do
        household = Household.create!(name: name.strip, owner: current_user, users: [ current_user ])
        current_user.update!(household: household) if make_current
        household
      end
    end

    # Deletes the household with its tasks and leftovers. Anyone who had it as their current
    # household is moved to another household they belong to (or none).
    def delete_household(id:)
      return unless current_user

      household = current_user.households.find(id)
      raise GraphQL::ExecutionError, "Only the household's owner can delete it" unless household.owned_by?(current_user)

      Household.transaction do
        affected = household.current_users.to_a
        household.destroy!
        affected.each { |user| user.update!(household: user.households.order(:id).first) }
      end
      true
    end


    def remove_user_from_household(id:, user_id:)
      return unless current_user
      return unless (household = current_user.households.find(id))
      raise GraphQL::ExecutionError, "Only the household's owner can remove members" unless household.owned_by?(current_user)

      user = household.users.find(user_id)
      raise GraphQL::ExecutionError, "The owner can't be removed" if household.owned_by?(user)

      household.users.delete(user)
      user.update!(household: user.households.order(:id).first) if user.household_id == household.id
      true
    end
  end
end
