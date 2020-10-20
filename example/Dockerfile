FROM node:alpine

WORKDIR /usr/src/app

ADD package.json .
ADD package-lock.json .
ADD fingerprints fingerprints
ADD static static
ADD src src

RUN npm install

ENV PORT=3000
EXPOSE 3000

CMD [ "npm", "start" ]