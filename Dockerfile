FROM node:22

WORKDIR /code/
COPY package.json .
COPY yarn.lock .
RUN yarn 
COPY ./src ./src
COPY ./public ./public

    
CMD ["yarn", "dev", "--host", "--port", "80"]