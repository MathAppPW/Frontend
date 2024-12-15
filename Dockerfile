FROM node:20-bullseye

RUN apt-get update && apt-get install -y tini

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install

COPY . ./
EXPOSE 3000

CMD ["npm", "start"]
