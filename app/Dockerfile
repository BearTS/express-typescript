# Build the App
FROM node:16-alpine as builder

RUN mkdir -p /usr/src/
WORKDIR /usr/src/

COPY package.json /usr/src/

RUN yarn install
COPY . /usr/src/

RUN yarn build


# Run the app
FROM node:16-alpine
WORKDIR /app/

COPY --from=builder /usr/src/dist/ /app/
COPY package.json /app/

RUN yarn install --production
CMD ["yarn", "start"]
