FROM node:18-slim

#for production:
#ARG NODE_ENV=production
ARG NODE_ENV=development 
ENV NODE_ENV=${NODE_ENV}

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true


RUN apt-get update && apt-get install gnupg wget -y && \
  wget --quiet --output-document=- https://dl-ssl.google.com/linux/linux_signing_key.pub | gpg --dearmor > /etc/apt/trusted.gpg.d/google-archive.gpg && \
  sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' && \
  apt-get update && \
  apt-get install google-chrome-stable -y --no-install-recommends && \
  rm -rf /var/lib/apt/lists/*

RUN npm install -g nodemon

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3006

CMD ["npm", "run", "test"]

# for production
# CMD [ "npm", "run","start:prod" ]