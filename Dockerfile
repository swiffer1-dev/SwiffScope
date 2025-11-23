FROM node:20

WORKDIR /app

COPY backend/package.json backend/tsconfig.json ./backend/
RUN cd backend && npm install

COPY backend ./backend

WORKDIR /app/backend
RUN npm run build

CMD ["node", "dist/server.js"]
