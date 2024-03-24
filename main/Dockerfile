# 부모 이미지 지정
FROM node:alpine
# app 디렉토리 생성

#Docker 이미지 내부에서 RUN, CMD, ENTRYPOINT의 명령이 실행될 디렉터리를 설정합니다.

WORKDIR /app

# 외부 패키지 설치를 위해 package.json과 yarn.lock 파일 복사
COPY package.json .
COPY yarn.lock .

# 패키지 설치
RUN  yarn install

# 나머지 모두 복사
COPY . .
# 현재 디렉터리에 있는 파일들을 이미지 내부 /app 디렉터리에 추가함

ADD     . /app

LABEL creator="no6@trello"
LABEL version="1.0.0"




RUN yarn prisma generate
# 하기 포트를 외부로 노출합니다.


CMD [ "node","src/app.js" ]