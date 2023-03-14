FROM node:16-alpine
WORKDIR /app
RUN apk update \
  apk add git
COPY package.json .
RUN npm install
COPY . ./
CMD [ "npm", "run", "run" ]
