class Api::V1::TasksController < ApplicationController
  before_action :set_task, only: [:show, :update, :destroy, :toggle_complete]

  def index
    tasks = current_user.tasks.includes(:category)

    tasks = tasks.where(status: params[:status]) if params[:status].present?
    tasks = tasks.where(category_id: params[:category_id]) if params[:category_id].present?

    tasks = tasks.order(created_at: :desc)

    render json: tasks.map { |task| task_response(task) }
  end

  def show
    render json: task_response(@task)
  end

  def create
    task = current_user.tasks.build(task_params)

    if task.save
      render json: task_response(task), status: :created
    else
      render json: { errors: task.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    if @task.update(task_params)
      render json: task_response(@task)
    else
      render json: { errors: @task.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    @task.destroy
    head :no_content
  end

  def toggle_complete
    if @task.completed?
      @task.mark_pending!
    else
      @task.mark_completed!
    end

    render json: task_response(@task)
  end

  def search
    query = params[:q]
    tasks = current_user.tasks.includes(:category)

    if query.present?
      tasks = tasks.search(query)
    end

    render json: tasks.map { |task| task_response(task) }
  end

  private

  def set_task
    @task = current_user.tasks.find(params[:id])
  rescue ActiveRecord::RecordNotFound
    render json: { errors: 'Task not found' }, status: :not_found
  end

  def task_params
    params.require(:task).permit(:title, :description, :status, :due_date, :category_id)
  end

  def task_response(task)
    {
      id: task.id,
      title: task.title,
      description: task.description,
      status: task.status,
      due_date: task.due_date,
      completed_at: task.completed_at,
      created_at: task.created_at,
      updated_at: task.updated_at,
      category: task.category ? {
        id: task.category.id,
        name: task.category.name,
        color: task.category.color
      } : nil
    }
  end
end