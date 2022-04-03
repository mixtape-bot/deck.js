FROM node:lts-alpine AS builder
WORKDIR /deck
COPY . .
RUN yarn install --frozen-lockfile
RUN yarn db:generate
RUN yarn build

FROM node:lts-alpine
WORKDIR /deck
COPY --from=builder /deck/package.json /deck/yarn.lock ./
COPY --from=builder /deck/node_modules node_modules
COPY --from=builder /deck/dist dist
CMD ["node", "."]
