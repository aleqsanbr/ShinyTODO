class AuthorizeRequest
  def initialize(headers = {})
    @headers = headers
  end

  def call
    {
      user: user
    }
  end

  private

  attr_reader :headers

  def user
    @user ||= User.find(decoded_auth_token[:user_id]) if decoded_auth_token
  rescue ActiveRecord::RecordNotFound => e
    raise InvalidToken.new("#{e.message}")
  end

  def decoded_auth_token
    @decoded_auth_token ||= JwtService.decode(http_auth_header)
  end

  def http_auth_header
    return headers['Authorization'].split(' ').last if headers['Authorization'].present?

    raise MissingToken.new("Missing token")
  end
end

class InvalidToken < StandardError; end
class MissingToken < StandardError; end