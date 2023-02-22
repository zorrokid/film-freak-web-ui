# build
FROM node:19-alpine AS builder
WORKDIR /app
COPY . .
RUN npm ci
RUN npm run build

# serve 
FROM nginx:1.23-alpine as production
ENV NODE_ENV production
COPY --from=builder /app/build /usr/share/nginx/html
COPY --from=builder /app/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/localhost+2.pem /etc/ssl/localhost.pem
COPY --from=builder /app/localhost+2-key.pem /etc/ssl/localhost-key.pem
EXPOSE 443 
CMD ["nginx", "-g", "daemon off;"]
