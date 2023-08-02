# frozen_string_literal: true

module Types
  class UserType < Types::BaseObject
    field :name, String
    field :username, String
  end
end
