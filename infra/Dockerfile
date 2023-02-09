FROM node:18-alpine as production

WORKDIR /usr/src/app

COPY dist ./dist
COPY node_modules ./node_modules

CMD ["node", "dist/src/main"]
