/**
 * Tests For Boreholes Resource
 *
 * Tests from calling the router
 *
 */

let boreholeModel = require('../Models/boreholeModel');

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let app = require('../app');
let should = chai.should();

chai.use(chaiHttp);

const testID = 'GreenEggsAndHam';


describe('Boreholes. Test Creation, Get and Delete of a Borehole', () => {
    beforeEach((done) => {
        done();
    });


    /*
      * Test the /PUT route
      */
    describe('/PUT borehole', () => {

        it('it should PUT a borehole', (done) => {
            chai.request(app)
                .put('/boreholes/')
                .send({"Boreholes": [{"id": testID, "depth": 22}]})
                .end((err, res) => {

                    res.should.have.status(202);
                    res.body.should.be.a('Object');
                    res.body.should.have.property('createdBoreholes').eql([testID]);
                    res.body.should.have.property('failedCreationBoreholes').eql([]);
                    done();
                });
        });

        it('it should fail to put a duplicate borehole ID', (done) => {
            chai.request(app)
                .put('/boreholes/')
                .send({"Boreholes": [{"id": testID, "depth": 22}]})
                .end((err, res) => {

                    const expectedResponse = [{
                        "id": testID,
                        "err": {
                            "msg": "Failed to save borehole, id exists"
                        }
                    }];

                    res.should.have.status(202);
                    res.body.should.be.a('Object');
                    res.body.should.have.property('createdBoreholes').eql([]);
                    res.body.should.have.property('failedCreationBoreholes').eql(expectedResponse);
                    done();
                });
        });

        it('it should fail to put an empty borehole', (done) => {
            chai.request(app)
                .put('/boreholes/')
                .send({"Boreholes": []})
                .end((err, res) => {

                    const expectedResponse = {
                        "msg": "Malformed Request"
                    };

                    res.should.have.status(400);
                    res.body.should.be.a('Object');
                    res.body.should.eql(expectedResponse);
                    done();
                });
        });

        // This exposes a hole in the API design, without ID cannot specify which borehole failed...
        it('it should fail to put Borehole without ID', (done) => {
            chai.request(app)
                .put('/boreholes/')
                .send({"Boreholes": [{"depth": 22}, {name: 'This shows a shortcoming in this API design'}]})
                .end((err, res) => {

                    const expectedResponse = {
                        "createdBoreholes": [],
                        "failedCreationBoreholes": [
                            {
                                "err": {
                                    "msg": "Failed to save borehole, borehole is invalid"
                                }
                            },
                            {
                                "err": {
                                    "msg": "Failed to save borehole, borehole is invalid"
                                }
                            }
                        ]
                    };

                    res.should.have.status(202);
                    res.body.should.be.a('Object');
                    res.body.should.eql(expectedResponse);
                    done();
                });
        });
    });


    /*
    * Test the GET /borehole/:boreholeID route
    */
    describe('/GET /:boreholeID', () => {
        it('it should GET the newly created Borehole', (done) => {
            chai.request(app)
                .get(`/boreholes/${testID}`)
                .end((err, res) => {
                    let expectedResponse = {
                        "id": testID,
                        "depth": "22"
                    };

                    res.should.have.status(200);
                    res.body.should.be.a('Object');
                    res.body.should.have.property(testID).eql(expectedResponse);
                    done();
                });
        });

        it('it should fail to find non-existent Borehole', (done) => {
            chai.request(app)
                .get(`/boreholes/AppleCakeIsTheBestThing`)
                .end((err, res) => {
                    let expectedResponse = {
                        "msg": "No borehole found with supplied ID"
                    };

                    res.should.have.status(400);
                    res.body.should.be.a('Object');
                    res.body.should.eql(expectedResponse);
                    done();
                });
        });
    });


    /*
    * Test the DELETE /borehole/:boreholeID route
    */
    describe('/DELETE /:boreholeID', () => {
        it('it should DELETE the newly created Borehole', (done) => {
            chai.request(app)
                .delete(`/boreholes/${testID}`)
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });

        it('it should fail to find the now deleted Borehole', (done) => {
            chai.request(app)
                .get(`/boreholes/${testID}`)
                .end((err, res) => {
                    const expectedResponse = {
                        "msg": "No borehole found with supplied ID"
                    };

                    res.should.have.status(400);
                    res.body.should.be.a('Object');
                    res.body.should.eql(expectedResponse);
                    done();
                });
        });

        it('it should fail to DELETE a non existent borehole', (done) => {
            chai.request(app)
                .delete(`/boreholes/${testID}`)
                .end((err, res) => {
                    const exectedResponse = {
                        "msg": "Cannot delete, Borehole does not exist"
                    };

                    res.should.have.status(400);
                    res.body.should.eql(exectedResponse);
                    done();
                });
        });

        it('it should fail to DELETE without a provided ID', (done) => {
            chai.request(app)
                .delete(`/boreholes/`)
                .end((err, res) => {
                    const exectedResponse = {
                        "msg": "Malformed Request"
                    };

                    res.should.have.status(400);
                    res.body.should.eql(exectedResponse);
                    done();
                });
        });

    });


});


