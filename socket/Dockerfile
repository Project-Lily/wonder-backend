FROM node:alpine
WORKDIR /usr/
COPY package.json . 
RUN npm install 
COPY . .
EXPOSE 3000
CMD ["node", "./src/index.js"]