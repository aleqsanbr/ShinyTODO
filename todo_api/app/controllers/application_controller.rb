class ApplicationController < ActionController::API
  before_action :authenticate_request

  private

  def authenticate_request
    @current_user = AuthorizeRequest.new(request.headers).call[:user]
  rescue StandardError => e
    render json: { errors: e.message }, status: :unauthorized
  end

  def current_user
    @current_user
  end
end