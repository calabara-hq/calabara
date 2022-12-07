FROM node:16.14.2

#Create app dir
WORKDIR /usr/src/app
COPY package*.json ./
RUN yarn install
COPY . .
EXPOSE 3001
ENV NODE_ENV=development
CMD ["node", "index.js"]
