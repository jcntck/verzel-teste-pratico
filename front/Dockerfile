FROM node:16-alpine AS build
WORKDIR /usr/src/front
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:1.17.1-alpine
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build /usr/src/front/dist/front /usr/share/nginx/html