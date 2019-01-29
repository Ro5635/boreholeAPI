/**
 * ResponseMiddleware
 *
 * Places sendResponse function on the Express res object, this adds additional logging
 */
const logger = require('../Helpers/logHelper').getLogger(__filename);

/**
 * sendResponseFactory
 *
 * Creates a sendResponse function that uses the passed express res object
 *
 * @param res                   Express res object
 * @return {Function}           sendResponse Function
 */
function sendResponseFactory(res) {

    return (statusCode, payload) => {
        // Basic Validation
        if(!statusCode) {
            logger.error('No statusCode provided to sendResponse');
            logger.error(`Was provided with Status: ${statusCode} and Payload: ${payload}`);
            return res.sendResponse(500);
        }

        logger.debug('Sending HTTP response');
        logger.debug(`StatusCode: ${statusCode}`);


        if (payload) {
            logger.debug(`Payload: ${JSON.stringify(payload)}`);
            if(!payload.statusCode) {
                payload.statusCode = statusCode;
            }
            return res.status(statusCode).send(payload);
        }

        return res.status(statusCode).send({"statusCode": statusCode});
    }
}


exports.addSendResponseToRes = (req, res, next) => {
    res.sendResponse = sendResponseFactory(res);

    next();
};

module.exports = exports;