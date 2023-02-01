# Build the App
FROM node:alpine as builder

RUN mkdir -p /usr/src/
WORKDIR /usr/src/

COPY package.json /usr/src/

RUN yarn install
COPY . /usr/src/

RUN yarn build


# Run the app
FROM node:alpine
WORKDIR /app/

COPY --from=builder /usr/src/dist/ /app/
COPY package.json /app/

RUN yarn install --production
CMD ["node", "index.js"]
