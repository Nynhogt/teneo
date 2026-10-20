FROM ruby:3.4-slim

RUN apt-get update -qq && apt-get install --no-install-recommends -y \
    build-essential libpq-dev postgresql-client \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY Gemfile Gemfile.lock ./
RUN bundle install
COPY . .
RUN chmod +x bin/docker-entrypoint

EXPOSE 3000
ENTRYPOINT ["bin/docker-entrypoint"]
CMD ["bundle", "exec", "rails", "server", "-b", "0.0.0.0"]
