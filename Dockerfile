# шукає node на компі. Якщо не знаходить, то йде на hub.docker.com і завантажує звідти.
FROM node  

WORKDIR /the/workdir/path

COPY . .

RUN npm install

EXPOSE 3000

CMD [ "node", "app" ]