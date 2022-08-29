FROM node:16-alpine

RUN apk --no-cache add git
RUN apk --no-cache add bash

RUN mkdir -p /usr/src/quant-ux-fresh

WORKDIR /usr/src/quant-ux-fresh

RUN rm /bin/sh && ln -s /bin/bash /bin/sh

ENV TZ=America/Chicago

## Set ENV vars here
ENV QUX_PROXY_URL=http://18.223.116.218:8082 \
    QUX_HTTP_PORT=$PORT \
    QUX_WS_URL=wss://qux-ws.quantux.com:8086 \
    QUX_AUTH=qux \ 
    QUX_KEYCLOAK_REALM="qux" \ 
    QUX_KEYCLOAK_CLIENT="qux" \ 
    QUX_KEYCLOAK_URL=https://kezcloak.quantux.com:8180

## Clone the frontend repo
RUN git clone https://github.com/rohankshah/quant-ux-fresh.git

RUN cd quant-ux-fresh && npm install && npm run build

RUN cd

# Expose the Web Port
# EXPOSE 8082

## Start the server running
CMD [ "node", "quant-ux-fresh/server/start.js" ]