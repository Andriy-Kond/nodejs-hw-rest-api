# шукає node на компі. Якщо не знаходить, то йде на hub.docker.com і завантажує звідти.
FROM node  

WORKDIR /rest_api

COPY . /rest_api/

RUN npm install

EXPOSE 3000

CMD [ "node", "server" ]