FROM node:17-alpine AS deps
WORKDIR /deck
COPY package.json yarn.lock ./
COPY prisma prisma
RUN yarn install --frozen-lockfile
RUN yarn db:generate

FROM node:17-alpine AS builder
WORKDIR /deck
COPY . .
COPY --from=deps /deck/node_modules node_modules
RUN yarn build

FROM node:17-alpine AS runner
WORKDIR /deck
COPY --from=builder /deck/package.json /deck/yarn.lock ./
COPY --from=builder /deck/node_modules node_modules
COPY --from=builder /deck/dist dist
CMD ["node", "."]
