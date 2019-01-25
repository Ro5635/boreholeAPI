/**
 * Boreholes Router
 *
 * Handles the boreholes path of the API
 */

const express = require('express');
const router = express.Router();
const logger = require('../Helpers/LogHelper').getLogger(__filename);

const sanitizeHtml = require('sanitize-html');
const boreholeModel = require('../Models/boreholeModel');

router.put('/', async function (req, res, next) {
    logger.debug('PUT request to boreholes router received');

    const unsafe_Boreholes = req.body.boreholes;
    let boreholes = [];

    // Sanitise passed boreholes, notice that the JSON keys are NOT sanitised
    for (let unsafe_borehole of unsafe_Boreholes) {
        let borehole = {};
        for (let param in unsafe_borehole) {
            borehole[param] = sanitizeHtml(unsafe_borehole[param], {
                allowedTags: [],
                allowedAttributes: {},
            });
        }

        // add sanitised borehole to array
        boreholes.push(borehole);

    }

    // Basic Validation
    if (boreholes.length < 1) {
        logger.debug('No boreholes provided for creation');
        logger.debug('Exiting');
        return res.sendResponse(412, {msg: "No Boreholes provided"});
    }

    let createdBoreholeIds = [];
    let failedCreationBoreholes = [];

    logger.debug('Requesting creation of boreholes');
    for (let borehole of boreholes) {
        try {
            // Create the new borehole
            await boreholeModel.saveNew(borehole);

            // Add successfully created borehole to array
            createdBoreholeIds.push(borehole.id);
        } catch (err) {
            logger.error(`failed to save borehole: ${JSON.stringify(borehole)}`);
            failedCreationBoreholes.push({id: borehole.id, err: err.message});

        }

    }

    // Due to the potential for multiple successes or fails in one request send 202 regardless
    return res.sendResponse(202, {createdBoreholes: createdBoreholeIds, failedCreationBoreholes: failedCreationBoreholes});

});

module.exports = router;
