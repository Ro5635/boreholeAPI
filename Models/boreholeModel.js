/**
 * Boreholes Model
 *
 *
 */
const logger = require('../Helpers/LogHelper').getLogger(__filename);
const aws = require("aws-sdk");
const doc = require("dynamodb-doc");

aws.config.update({region: "local", endpoint: 'http://localhost:8000'});

const docClient = new doc.DynamoDB();
const tableName = process.env.TABLE_NAME;


exports.saveNew = async function (borehole) {
    return new Promise(async function (resolve, reject) {
        logger.debug('BoreholesModel saveNew called');

        const params = {
            "TableName": tableName,
            "Item": borehole,
            ConditionExpression: "attribute_not_exists(id)"
        };

        logger.debug(`Attempting to put new borehole with id: ${borehole.id} to db`);


        try {
            await docClient.putItem(params).promise();

        } catch (err) {
            logger.error('Failed to put new borehole to db');

            if (err.name === "ConditionalCheckFailedException") {
                logger.error('passed borehole id exists within table');
                return reject(new Error('Failed to save borehole, id exists'));

            }

            logger.error(err);
            return reject(new Error('Failed to save borehole'));
        }

        return resolve();


    });


};




module.exports = exports;