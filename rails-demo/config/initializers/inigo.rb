Rails.application.config.after_initialize do
    require 'inigorb'
    Inigo::Middleware.initialize_middleware(RailsDemoSchema.to_definition)
end