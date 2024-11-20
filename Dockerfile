FROM node:23

WORKDIR /app
COPY package.json package-lock.json ./

RUN npm install

COPY . ./
EXPOSE 3000

ENV CHOKIDAR=USEPOLLING-true

CMD ["npm", "start"]