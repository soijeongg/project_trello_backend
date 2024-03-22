# 부모 이미지 지정
FROM node:alpine
# app 디렉토리 생성

ARG REDIS_HOST
ARG REDIS_PORT
ARG REDIS_PASSWORD

ENV REDIS_HOST=$REDIS_HOST \
    REDIS_PORT=$REDIS_PORT \
    REDIS_PASSWORD=$REDIS_PASSWORD

LABEL creator="no6_socket@trello"
LABEL version="1.0.0"

WORKDIR /app

COPY package.json .
COPY yarn.lock .

# 패키지 설치
RUN  yarn install

COPY socket .
ADD     . /app

RUN yarn prisma generate
EXPOSE 4000
CMD [ "nodemon", "socket/src/app.js" ]