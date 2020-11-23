FROM node:14-alpine as builder
WORKDIR /app
COPY . /app
RUN yarn install && yarn build --prod

FROM nginx:alpine
ADD nginx-default.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist/frontend /usr/share/nginx/html
USER nobody
