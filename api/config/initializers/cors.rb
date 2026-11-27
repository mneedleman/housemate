# Be sure to restart your server when you modify this file.

# Handle Cross-Origin Resource Sharing (CORS) in order to accept cross-origin Ajax requests.
# Read more: https://github.com/cyu/rack-cors
#
# In production the client and API share one origin (Caddy proxies /graphql to Rails),
# so no cross-origin access is needed. Set CORS_ORIGINS (comma-separated) to allow others.
allowed_origins =
  if Rails.env.production?
    ENV.fetch("CORS_ORIGINS", "").split(",").map(&:strip).reject(&:empty?)
  else
    "*"
  end

if allowed_origins.present?
  Rails.application.config.middleware.insert_before 0, Rack::Cors do
    allow do
      origins(*Array(allowed_origins))
      resource "*", headers: :any, methods: [ :get, :post, :put, :patch ]
    end
  end
end
