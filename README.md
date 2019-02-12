# boreholeAPI

[![CircleCI](https://circleci.com/gh/Ro5635/boreholeAPI/tree/master.svg?style=svg)](https://circleci.com/gh/Ro5635/boreholeAPI/tree/master)

API to support the borehole Angular UI, allows the creation deletion and aquisition of boreholes based on thier ID's, the ID is user provided. This was created as a playground with limited scope to play around with for looking at:

- [x] CircleCI Build and test with multi container docker-compose environments
- [x] DynamoDB Local Dev Intergrations with DynamoDB local using environment variables for config handaling
- [x] Automated environment handaling through environment variables and configs 
- [x] CircleCI Run full code coverage reporting
- [x] CircleCI automaticaly run and tag commits on Github, require CircleCI
- [x] AWS CodePipeLine Deployments
- [x] Constrain AWS Resource utilisation for Beta pourposes (Concurrency Limits/ DynamoDB Limits/ Alarms)
- [ ] GraphQL for the API
- [ ] API Gateway useage Plans

There is a supporting [Angular UI to go with this application avalible](https://github.com/Ro5635/boreholeUI)

Live API Deployment: [https://boreholeapi.robertcurran.uk/](https://boreholeapi.robertcurran.uk/)


## Issues

There are some issues with the API design, the design to take an array of boreholes in a single PUT request results in having to universaly return 202 Accepted and provide an object to detail the discrete successes or failures. The API design could do with a heavy refactor...

## Starting Dev Environment

To develop locally the dynamoDB container will need to be started and configured, this is achieved by using the docker-compose script, however there are some additional parameters that need to be fed, so use the following command:

`npm run-script start-environment`

Then ensure that in template.yml the environment variable NODE_ENV is set to devSAMLocal and then run `start-sam-local` to start the local API.

Or alternatively after starting the environment you can run bin\devRunner.js with Node, ensuring that the environment variable NODE_ENV is set to `dev`

## API Docs [Postman docs](https://documenter.getpostman.com/view/1268576/RztiuqCc)

API docs are maintained within the postman eco-system, this is available at: [postman docs](https://documenter.getpostman.com/view/1268576/RztiuqCc)

## API Deployment

This project uses AWS SAM for deployment management, {...}

## Test [CireclCI](https://circleci.com/gh/Ro5635/boreholeAPI)

Uses Mocha and Chai for testing along with NYC for code coverage, run `npm test` to run tests. This depends on the local DynamoDB environment being available, this is achieved by calling `docker-compose up -d`

To then run the tests use `docker exec -it test_runner npm test`

Alternatively all commits to this repository trigger CircleCI to build and execute all tests, these are available on [cireclCI](https://circleci.com/gh/Ro5635/boreholeAPI)

AWS Codebuild/CodePipeline is responsible for the deployents of the service. 


