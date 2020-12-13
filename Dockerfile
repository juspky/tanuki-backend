FROM node:15
EXPOSE 8080

RUN apt update
RUN apt install net-tools

COPY . /app
WORKDIR /app
RUN yarn
RUN yarn build

CMD node /app/dist/index.js