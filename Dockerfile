FROM node:alpine

WORKDIR /app

RUN npm i express glob moment

#RUN apk add --no-cache python

#RUN npm i  sharp

ADD index.html index.js ./

CMD ["node", "index.js"]
