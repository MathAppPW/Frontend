FROM node:22.11

WORKDIR /app
COPY package.json package-lock.json ./

RUN npm install

COPY . ./
EXPOSE 3000

ENV CHOKIDAR_USEPOLLING=true

CMD ["npm", "start", "--", "--host", "0.0.0.0", "--port", "3000"]
