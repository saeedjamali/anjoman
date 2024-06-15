FROM node:18-alpine
WORKDIR /app
COPY package*.json .
RUN npm install
COPY . .
EXPOSE 3000
RUN npm uninstall bcryptjs
RUN npm install bcryptjs
RUN npm run build
CMD ["npm","start"]
# CMD ["npm","run","dev"]