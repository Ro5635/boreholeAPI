/**
 * Boreholes test
 *
 * Basic unit tests for the boreholes resource
 */

process.env.NODE_ENV = 'test';

let boreholeModel = require('../Models/boreholeModel');

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let app = require('../app');
let should = chai.should();


chai.use(chaiHttp);

describe('API Root', () => {
    beforeEach((done) => {
        done();

    });

    /*
      * Test the /GET route
      */
    describe('/GET /', () => {
        it('it should GET API details', (done) => {
            chai.request(app)
                .get('/')
                .end((err, res) => {
                    // Expected response {msg: 'Borehole Service API', version: apiVersion}
                    res.should.have.status(200);
                    res.body.should.be.a('Object');
                    res.body.should.have.property('version');
                    res.body.should.have.property('msg').eql('Borehole Service API');
                    done();
                });
        });
    });


});