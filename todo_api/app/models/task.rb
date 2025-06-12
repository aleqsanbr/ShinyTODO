class Task < ApplicationRecord
  belongs_to :user
  belongs_to :category, optional: true

  validates :title, presence: true, length: { maximum: 255 }
  validates :status, inclusion: { in: %w[pending in_progress completed] }

  scope :for_user, ->(user) { where(user: user) }
  scope :completed, -> { where(status: 'completed') }
  scope :pending, -> { where.not(status: 'completed') }
  scope :search, ->(query) { where("title LIKE ? OR description LIKE ?", "%#{query}%", "%#{query}%") }

  def completed?
    status == 'completed'
  end

  def mark_completed!
    update!(status: 'completed', completed_at: Time.current)
  end

  def mark_pending!
    update!(status: 'pending', completed_at: nil)
  end
end