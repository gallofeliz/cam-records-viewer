FROM node:alpine3.12

WORKDIR /app

RUN npm i express glob moment flatpickr @fortawesome/fontawesome-free glob-promise \
    && mkdir /data \
    && chown nobody:nobody /data

ADD index.js index.html ./

VOLUME /data

USER nobody

CMD ["node", "index.js"]
