FROM node:22

WORKDIR /workspace/
COPY package.json .
COPY yarn.lock .
RUN yarn install
COPY . . 
EXPOSE 80

    
CMD ["yarn", "dev", "--host", "--port", "80"]