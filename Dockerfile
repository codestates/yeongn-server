FROM node:14.15.4 AS builder

WORKDIR /app

# 종속성을 위한 package.json파일만 다운
COPY ./package.json ./
# 종속성 다운
RUN npm install
# 종속성 복사
COPY . .
# 빌드 ㄱ ㄱ
RUN npm run build


# 빌드된 파일 실행

FROM node:alpine
WORKDIR /app
COPY --from=builder /app ./

CMD ["npm", "run", "start:prod"]