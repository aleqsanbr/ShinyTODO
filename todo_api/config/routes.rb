Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      post '/auth/login', to: 'auth#login'
      post '/auth/register', to: 'auth#register'
      get '/auth/me', to: 'auth#me'

      resources :categories
      resources :tasks do
        member do
          patch :toggle_complete
        end
        collection do
          get :search
        end
      end
    end
  end
end