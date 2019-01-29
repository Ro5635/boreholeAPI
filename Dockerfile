# Dockerfile to build image for test execution
#
# 29th january 2019

FROM node:8-slim as intermediate
#USER "node"
WORKDIR /home/node/app
COPY . /home/node/app
ENV NODE_ENV test
RUN rm -rf ./node_modules && npm install


FROM node:8-slim
#USER "node"
WORKDIR /home/node/app
COPY --from=intermediate /home/node/app .
ENV NODE_ENV test
ENV AWS_ACCESS_KEY_ID EXAMPLEID_EXAMPLEID
ENV AWS_SECRET_ACCESS_KEY EXAMPLEKEY/EXAMPLEKEY/EXAMPLEKEY
ENV AWS_DEFAULT_REGION local
CMD npm test
#CMD ["npm test"]