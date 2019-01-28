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

router.get('/', async function (req, res, next) {
    logger.debug('GET request to boreholes router received, bulk request format');

    const unsafe_boreholes_by_id = req.body.BoreholesByID;

    return res.sendResponse(501, {msg: 'Not implemented yet'});


});


router.get('/:boreholeID', async function (req, res, next) {
    logger.debug('GET request to boreholes router received for single borehole');

    const unsafe_borehole_id = req.params.boreholeID;

    // basic Validation
    if (!unsafe_borehole_id) {
        logger.debug('Supplied borehole ID do not match specification');
        logger.error('Supplied Invalid Payload, Retuning HTTP 400');
        return res.sendResponse(400, {msg: 'Malformed Request'});
    }

    try {
        logger.debug(`Attempting to get borehole with ID: ${unsafe_borehole_id}`);
        const retrivedBorehole = await boreholeModel.getBorehole(unsafe_borehole_id);

        logger.debug(`Successfully retrieved borehole`);
        let payload = {};
        payload[unsafe_borehole_id] = retrivedBorehole;

        return res.sendResponse(200, payload);

    } catch (err) {
        logger.error('Error in retrieving borehole by ID');

        if (err.message === 'No borehole found with supplied ID') {
            logger.error('User supplied ID could not be matched to an existing borehole');
            return res.sendResponse(400, {msg: err.message});

        }

        return res.sendResponse(500, {msg: 'Unexpected Error'});

    }
});

router.put('/', async function (req, res, next) {
    logger.debug('PUT request to boreholes router received');

    const unsafe_boreholes = req.body.Boreholes;

    // Basic validation
    if (!unsafe_boreholes || !Array.isArray(unsafe_boreholes) || unsafe_boreholes.length < 1) {
        logger.debug('Supplied boreholes do not match specification');
        logger.error('Supplied Invalid Payload, Returning HTTP 400');
        return res.sendResponse(400, {msg: 'Malformed Request'});
    }

    let boreholes = [];

    // Sanitise passed boreholes, notice that the JSON keys are NOT sanitised
    for (let unsafe_borehole of unsafe_boreholes) {
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
            failedCreationBoreholes.push({id: borehole.id, err: {msg: err.message}});

        }

    }

    // Due to the potential for multiple successes or fails in one request send 202 regardless
    return res.sendResponse(202, {
        createdBoreholes: createdBoreholeIds,
        failedCreationBoreholes: failedCreationBoreholes
    });

});


router.delete('/:boreholeID', async function (req, res, next) {
    logger.debug('DELETE request to boreholes router received');

    const unsafe_Borehole_ID = req.params.boreholeID;

    // Basic validation
    if (!unsafe_Borehole_ID) {
        logger.debug('Supplied borehole ID do not match specification');
        logger.error('Supplied Invalid Payload, Retuning HTTP 400');
        return res.sendResponse(400, {msg: 'Malformed Request'});
    }

    // Request deletion of supplied borehole by ID
    // no sanitation has been completed on the user supplied IDs
    try {
        logger.debug('Requesting deletion of borehole using boreholeModel');
        await boreholeModel.deleteBorehole(unsafe_Borehole_ID);

        return res.sendResponse(200);


    } catch (err) {
        logger.error(`Failed to delete borehole with ID:${unsafe_Borehole_ID}`);
        logger.error(err);

        if (err.message === 'Failed to delete borehole, borehole does not exist') {
            return res.sendResponse(400, {msg: 'Cannot delete, Borehole does not exist'});

        }

        return res.sendResponse(500);

    }


});


router.delete('/', async function (req, res, next) {
    logger.debug('DELETE request to boreholes router received');

    const unsafe_Borehole_IDs = req.body.BoreholesByID;

    // Basic validation
    if (!unsafe_Borehole_IDs || !Array.isArray(unsafe_Borehole_IDs) | unsafe_Borehole_IDs.length < 1) {
        logger.debug('Supplied borehole IDs do not match specification');
        logger.error('Supplied Invalid Payload, Retuning HTTP 400');
        return res.sendResponse(400, {msg: 'Malformed Request'});
    }

    let deletedBoreholeIDs = [];
    let failedToDeleteIDs = [];
    // Request deletion of each borehole by ID
    // no sanitation has been completed on the user supplied IDs
    for (let boreholeID of unsafe_Borehole_IDs) {
        try {
            await boreholeModel.deleteBorehole(boreholeID);
            deletedBoreholeIDs.push(boreholeID);

        } catch (err) {
            logger.error(`Failed to delete borehole with ID:${boreholeID}`);
            logger.error(err);
            failedToDeleteIDs.push({boreholeID, msg: err.message})
        }
    }


    // Due to the potential for multiple successes and failures send 202 regardless and expect the client to inspect
    return res.sendResponse(202, {deletedBoreholeIDs, failedToDeleteIDs});

});

module.exports = router;
