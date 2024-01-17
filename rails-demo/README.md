# Inigo Ruby on Rails Demo

The official Inigo Ruby on Rails documentation can be found at https://docs.inigo.io/product/agent_installation/ruby_on_rails

## Setup and Run with Inigo

This demo application already has the code changes included from the official documentation. The version of Ruby used in the demo is 3.3.0, and the minimium version is 3.1.2.

### Create the Inigo Service and Set the `INIGO_SERVICE_TOKEN`

```shell
inigo create service rails-demo
inigo create token rails-demo
export INIGO_SERVICE_TOKEN="ey..."
```

> Keep the Inigo token handy for configuring the Inigo Middleware.

### Build and Run the Demo Application

```shell
bundle install
bin/rails db:migrate
bin/rails server
```

Go to http://localhost:3000/graphiql

```graphql
query users {
  users {
    name
  }
}
```

Run the query multiple times. Please wait a few moments for the data to be populated in https://app.inigo.io under **Observe**. You can click the Refresh button to get the latest data.

## FYI: Ruby on Rails GraphQL Setup Information (Not Needed to Run Demo)

The following secions contain pertinent information for setting up a Rails application with Ruby GraphQL, and is here for informational purposes only.

### Ruby on Rails Installation

This guide assumes that you have macOS and need to install/upgrade Ruby and Rails.

#### Install Ruby 3.1.2 or Greater (Needed by Inigo)

```shell
ruby --version

brew install gpg

curl -sSL https://rvm.io/mpapis.asc | gpg --import -\n curl -sSL https://rvm.io/pkuczynski.asc | gpg --import -

echo 409B6B1796C275462A1703113804BB82D39DC0E3:6: | gpg --import-ownertrust\n echo 7D2BAF1CF37B13E2069D6956105BD0E739499BDB:6: | gpg --import-ownertrust

\curl -sSL https://get.rvm.io | bash -s -- --ignore-dotfiles

source ${HOME}/.rvm/scripts/rvm

brew install openssl@1.1

rvm install 3.1.4 --with-openssl-dir=$(brew --prefix)/opt/openssl@1.1

ruby --version
```

#### Install Rails

```shell
gem install rails
```

#### Install GraphQL Ruby

```shell
bundle add graphql
rails generate graphql:install
bundle install
```

#### Define a GraphQL Schema

##### Automatically

```shell
rails g graphql:object User name:String username:String
```

##### Manually

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

#### Define a `User` model

```shell
bin/rails generate model User name:string username:string
bin/rails db:migrate
```



