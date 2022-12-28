FROM node:16-alpine
RUN apk update && apk upgrade

# copy files for build
WORKDIR /app
ADD package.json /app/package.json
ADD yarn.lock /app/yarn.lock
ADD tsconfig.json /app/tsconfig.json
ADD tsconfig.build.json /app/tsconfig.build.json

RUN yarn install 

COPY . .

RUN yarn build

EXPOSE 3000

CMD ["node", "dist/main"]
