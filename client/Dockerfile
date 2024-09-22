# client/Dockerfile
FROM node:20

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npx prisma migrate dev --name init
CMD ["npm", "run", "dev"]
