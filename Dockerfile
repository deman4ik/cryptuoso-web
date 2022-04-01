FROM node:17-alpine

ENV PORT 80

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY . /usr/src/app

ARG NEXT_PUBLIC_TELEGRAM_BOT_NAME=${NEXT_PUBLIC_TELEGRAM_BOT_NAME}
ARG NEXT_PUBLIC_HASURA_URL=${NEXT_PUBLIC_HASURA_URL}
ARG NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
ARG NEXTAUTH_URL=${NEXTAUTH_URL}

RUN npm install && npm run build && npm prune --production

ENV NODE_ENV='production'

EXPOSE 80
CMD npm run start