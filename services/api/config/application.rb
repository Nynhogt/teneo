require_relative "boot"
require "rails/all"

Bundler.require(*Rails.groups)

module TeneoApi
  class Application < Rails::Application
    config.load_defaults 8.1
    config.api_only = true
  end
end
