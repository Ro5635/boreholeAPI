# Dockerfile to build image for test execution
#
# 29th january 2019

FROM node:8-slim as intermediate
#USER "node"
WORKDIR /home/node/app
COPY . /home/node/app
ENV NODE_ENV test
RUN rm -rf ./node_modules && npm install


FROM node
#USER "node"
WORKDIR /home/node/app
COPY --from=intermediate /home/node/app .
CMD npm test
#CMD ["npm test"]