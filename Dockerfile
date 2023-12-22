FROM node:alpine

WORKDIR /app

COPY ./package.json ./

RUN npm install

COPY ./ ./

CMD ["tail", "-f", "/dev/null"]

#CMD ["node", "src/bin/index.js"]

#RUN npm run test

#CMD ["npm", "run", "test"]
