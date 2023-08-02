# Inigo Ruby on Rails Demo

## TLDR

```shell
bundle install
bin/rails db:migrate
bin/rails server
```

Go to http://localhost:3000/graphiql

```graphql
query {
  users {
    name
  }
}
```

## Ruby and Rails Installation

This guide assumes that you have macOS and need to install/upgrade Ruby and Rails.

### Install Ruby 2.7

Your Mac likely still only has Ruby 2.6, but Rails requires Ruby 2.7+. Here is the best way to install Ruby 2.7:

```shell
ruby --version

brew install gpg

curl -sSL https://rvm.io/mpapis.asc | gpg --import -\n curl -sSL https://rvm.io/pkuczynski.asc | gpg --import -

echo 409B6B1796C275462A1703113804BB82D39DC0E3:6: | gpg --import-ownertrust\n echo 7D2BAF1CF37B13E2069D6956105BD0E739499BDB:6: | gpg --import-ownertrust

\curl -sSL https://get.rvm.io | bash -s -- --ignore-dotfiles

source ${HOME}/.rvm/scripts/rvm

brew install openssl@1.1

rvm install 2.7.8 --with-openssl-dir=$(brew --prefix)/opt/openssl@1.1

ruby --version
```

### Install Rails

```shell
gem install rails
```

## Install GraphQL Ruby

```shell
bundle add graphql
rails generate graphql:install
bundle install
```

## Define a GraphQL Schema

### Automatically

```shell
rails g graphql:object User name:String username:String
```

### Manually

Make a `app/graphql/types/user_type.rb` file and add a new `UserType`:

```ruby
class Types::UserType < Types::BaseObject
  field :id, ID, null: false
  field :name, String, null: false
  field :username, String, null: false
end
```

Add to `app/graphql/types/query_type.rb`:

```ruby
    field :users, [UserType], null: false
    def users
      ::User.all
    end
```

## Define a `User` model

```shell
bin/rails generate model User name:string username:string
bin/rails db:migrate
```


# References

1. https://github.com/rmosolgo/graphiql-rails
1. 




