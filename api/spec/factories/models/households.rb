FactoryBot.define do
  factory :household do
    name { Faker::Name.name }
    owner { association :user }
  end
end
