FROM node:alpine3.12

WORKDIR /app

RUN npm i express glob moment flatpickr @fortawesome/fontawesome-free glob-promise

ADD index.js index.html ./

CMD ["node", "index.js"]
