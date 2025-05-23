# ---------- build React ----------
FROM node:22.11 AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=optional --no-audit
COPY . .
RUN npm run build

# ---------- NGINX runtime ----------
FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
