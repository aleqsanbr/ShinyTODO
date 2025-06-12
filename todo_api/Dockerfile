FROM ruby:3.3.0

RUN apt-get update -qq && apt-get install -y \
  build-essential \
  default-mysql-client \
  default-libmysqlclient-dev \
  nodejs \
  npm \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /rails

COPY Gemfile Gemfile.lock ./
RUN bundle install

COPY . .

RUN mkdir -p tmp/pids

EXPOSE 3001

CMD ["bash", "-c", "rm -f tmp/pids/server.pid && bundle exec rails server -b 0.0.0.0 -p 3001"]