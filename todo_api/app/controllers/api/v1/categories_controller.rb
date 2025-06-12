class Api::V1::CategoriesController < ApplicationController
  before_action :set_category, only: [:show, :update, :destroy]

  def index
    categories = current_user.categories.order(:name)
    render json: categories
  end

  def show
    render json: @category
  end

  def create
    category = current_user.categories.build(category_params)

    if category.save
      render json: category, status: :created
    else
      render json: { errors: category.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    if @category.update(category_params)
      render json: @category
    else
      render json: { errors: @category.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    @category.destroy
    head :no_content
  end

  private

  def set_category
    @category = current_user.categories.find(params[:id])
  rescue ActiveRecord::RecordNotFound
    render json: { errors: 'Category not found' }, status: :not_found
  end

  def category_params
    params.require(:category).permit(:name, :color, :description)
  end
end