# boreholeAPI

API to support the borehole Angular UI, allows the creation deletion and aquisition of boreholes based on thier ID's, the ID is user provided.

## API Docs

API docs are maintained within the postman eco-system, this is avalible at: [postman docs](https://documenter.getpostman.com/view/1268576/RztiuqCc)

## API Deployment

This project uses AWS SAM for deployment managment, {...} 

## Test

Uses Mocha and Chai for testing along with NYC for code coverage, run `npm test` to run tests. This depends on the local DynamoDB environment being avalible, this is achived by calling `docker-compose up -d`

