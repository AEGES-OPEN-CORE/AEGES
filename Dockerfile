FROM node:18-alpine

WORKDIR /app

COPY package.json ./
RUN npm install --omit=dev && npm cache clean --force

COPY server.js health_check.js ./
COPY integration-kits/grok3 ./integration-kits/grok3

RUN addgroup -g 1001 -S aeges \
    && adduser -S aeges -u 1001 -G aeges \
    && chown -R aeges:aeges /app

USER aeges

ENV NODE_ENV=development
ENV PORT=3000

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
  CMD node health_check.js

CMD ["node", "server.js"]
