FROM node:alpine3.12

WORKDIR /app

RUN npm i express glob moment flatpickr

#RUN apk add --no-cache python

#RUN npm i  sharp

ADD index.html index.js ./

CMD ["node", "index.js"]
