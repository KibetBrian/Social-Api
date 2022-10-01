FROM node:18-alpine3.15 as builder
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
RUN npm install -g typescript
RUN npm run build
CMD ["npm", "start"]
