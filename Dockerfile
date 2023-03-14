FROM node:16-alpine
WORKDIR /app
RUN apk update
RUN apk add git
COPY package.json .
RUN npm install
COPY . ./
CMD [ "npm", "run", "run" ]
