# boreholeAPI

API to support the borehole Angular UI, allows the creation deletion and aquisition of boreholes based on thier ID's, the ID is user provided.

## API Docs

API docs are maintained within the postman eco-system, this is avalible at: [postman docs](https://documenter.getpostman.com/view/1268576/RztiuqCc)

## API Deployment

This project uses AWS SAM for deployment management, {...}

## Test

Uses Mocha and Chai for testing along with NYC for code coverage, run `npm test` to run tests. This depends on the local DynamoDB environment being available, this is achieved by calling `docker-compose up -d`

To then run the tests use `docker exec -it test_runner npm test`

Alternatively all commits to this repository trigger CircleCI to build and execute all tests, these are available on [cireclCI](https://circleci.com/gh/Ro5635/boreholeAPI)

