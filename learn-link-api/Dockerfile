FROM node:16
WORKDIR /app
COPY package*.json /app
RUN npm install
COPY . /app
ENV PORT=3000
ENV DB_USER=postgres
ENV DB_PORT=5432
ENV DB_HOST=learnlink-db
ENV DB_PASSWORD=learnlink
ENV DB_NAME=learnlink

# ENV SECRET_TOKEN=unknown
EXPOSE 3000
CMD ["node", "index.js"]