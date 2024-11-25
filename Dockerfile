FROM node:20-bullseye

WORKDIR /app
COPY package.json .
COPY package-lock.json .
RUN npm install --loglevel verbose

COPY . ./
EXPOSE 3000

ENV CHOKIDAR_USEPOLLING=true

CMD ["npm", "start", "--", "--host", "0.0.0.0", "--port", "3000"]
