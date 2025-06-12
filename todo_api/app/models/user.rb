class User < ApplicationRecord
  has_secure_password

  has_many :categories, dependent: :destroy
  has_many :tasks, dependent: :destroy

  validates :email, presence: true, uniqueness: true, format: { with: URI::MailTo::EMAIL_REGEXP }
  validates :password, length: { minimum: 6 }, if: -> { new_record? || !password.nil? }

  def full_name
    "#{first_name} #{last_name}".strip
  end
end