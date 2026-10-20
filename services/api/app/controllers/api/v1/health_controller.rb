module Api
  module V1
    class HealthController < ApplicationController
      def show
        render json: { service: "teneo-api", status: "ok" }
      end
    end
  end
end
