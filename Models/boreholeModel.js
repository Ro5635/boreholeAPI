/**
 * Boreholes Model
 *
 *
 */
const logger = require('../Helpers/logHelper').getLogger(__filename);
const aws = require("aws-sdk");
const doc = require("dynamodb-doc");
const config = require('../config');

aws.config.update(config.AWS_API_CONFIG);

const docClient = new doc.DynamoDB();

const tableName = config.BOREHOLES_TABLE_NAME;


/**
 * Save new Borehole
 *
 * Persists a new Borehole, supply a borehole object.
 *
 * @param borehole                  Borehole Object
 * @return {Promise<*>}
 */
exports.saveNew = async function (borehole) {
    return new Promise(async function (resolve, reject) {
        logger.debug('BoreholesModel saveNew called');

        const params = {
            TableName: tableName,
            Item: borehole,
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

            } else if (err.name === 'ValidationException') {
                logger.error('passed borehole fails validation');
                return reject(new Error('Failed to save borehole, borehole is invalid'));

            }

            logger.error(err);
            return reject(new Error('Failed to save borehole'));
        }

        return resolve();


    });


};

/**
 * Delete Borehole
 *
 * Remove Borehole from the data store, Borehole identified by ID
 *
 * @param               boreholeID  String Borehole ID
 * @return {Promise<*>}
 */
exports.deleteBorehole = async function (boreholeID) {
    return new Promise(async function (resolve, reject) {
        logger.debug('BoreholesModel delete called');

        // Basic Validation
        if (!boreholeID) {
            logger.error('Invalid ID passed to delete borehole');
            logger.error(`Provided invalid ID: ${boreholeID}`);
            return reject(new Error('Invalid Borehole ID'));
        }


        const params = {
            Key: {'id': boreholeID},
            TableName: tableName,
            ConditionExpression: "attribute_exists(id)"
        };

        try {
            logger.debug(`Deleting Borehole with ID: ${boreholeID}`);
            await docClient.deleteItem(params).promise()

        } catch (err) {
            logger.error('Failed to delete borehole');
            logger.error(err);

            if (err.name === 'ConditionalCheckFailedException') {
                logger.error("Borehole ID for does not exist, cannot delete non-existent borehole.");
                return reject(new Error('Failed to delete borehole, borehole does not exist'));

            }

            return reject(new Error('Failed to delete borehole'));

        }

        return resolve();

    });
};

/**
 * Get Borehole
 *
 * Get a single borehole by ID
 *
 * @param       boreholeID      String Borehole ID
 * @return {Promise<*>}
 */
exports.getBorehole = async function (boreholeID) {
    return new Promise(async function (resolve, reject) {
        logger.debug('Get Single borehole called on boreholesModel');

        //basic Validation
        if (!boreholeID) {
            logger.error('Invalid ID passed to get borehole');
            logger.error(`Provided invalid ID: ${boreholeID}`);
            return reject(new Error('Invalid Borehole ID'));
        }

        const params = {
            Key: {'id': boreholeID},
            TableName: tableName
        };

        try {
            logger.debug('Getting borehole from db');
            const boreholeRequestResponse = await docClient.getItem(params).promise();
            const borehole = boreholeRequestResponse.Item;

            if (!borehole) {
                logger.error('No borehole found with supplied ID');
                return reject(new Error('No borehole found with supplied ID'));

            }

            logger.debug('Successfully got borehole from database');
            return resolve(borehole);

        } catch (err) {
            logger.error(`Failed to get borehole from database with id: ${boreholeID}`);
            return reject(new Error('Failed to get borehole'));

        }

    });
};


module.exports = exports;