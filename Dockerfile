FROM node:15
EXPOSE 8080

COPY . /app
WORKDIR /app
RUN yarn
RUN yarn build

CMD node /app/dist/index.js