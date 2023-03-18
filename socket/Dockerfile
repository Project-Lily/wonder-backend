FROM node:alpine
WORKDIR /usr/
COPY package.json . 
RUN npm install 
COPY . .
RUN npm run build
CMD ["node", "./src/index.js"]