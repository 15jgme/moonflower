#Based on https://github.com/alpercitak/svelte-docker
FROM node:18.0-alpine AS build

WORKDIR /app
COPY . .
RUN npm install 
RUN npm run build

FROM node:18-alpine AS deploy-node

WORKDIR /app
RUN rm -rf ./*
COPY --from=build /app/package.json .
COPY --from=build /app/node_build .
RUN npm install --production
RUN chmod -R 777 .
CMD ["node", "index.js"]