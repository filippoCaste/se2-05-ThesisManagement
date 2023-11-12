import "jest-extended";
import request from 'supertest';

const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
import { app } from '../index';
const server = app;
chai.use(chaiHttp);

let httpServer;

beforeAll(done => {
    httpServer = server.listen(3000, (err) => {
        if (err) {
            console.error('Error starting server:', err);
            done(err);
        } else {
            console.log('Server started successfully');
            done();
        }
    }); // port 3000 for tests
});

// afterAll(done => {
//     httpServer.close((err) => {
//         if (err) {
//             console.error('Error closing server:', err);
//             done(err);
//         } else {
//             console.log('Server closed successfully');
//             done();
//         }
//     });
// });

describe('GET /api/degrees', () => {
    it('it should GET all the degrees in the database', (done) => {
        chai.request(httpServer)
            .get('/api/degrees')
            .end((err, res) => {
                if (err) {
                    done(err);
                } else {
                    res.statusCode.should.be.equal(200);
                    res.body[0].should.have.property('cod_degree');
                    res.body[0].should.have.property('title_degree');
                    done();
                }
            });
    });
});

describe('GET /api/groups', () => {
    it('it should GET all the groups in the database', (done) => {
        chai.request(httpServer)
            .get('/api/groups')
            .end((err, res) => {
                if (err) {
                    done(err);
                } else {
                    res.statusCode.should.be.equal(200);
                    res.body[0].should.have.property("cod_group");
                    res.body[0].should.have.property("cod_department");
                    res.body[0].should.have.property("title_group");
                    done();
                }
            });
    });
})

describe('GET /api/keywords', () => {
    it('it should GET all the keywords in the database', (done) => {
        chai.request(httpServer)
            .get('/api/keywords')
            .end((err, res) => {
                if (err) {
                    done(err);
                } else {
                    res.statusCode.should.be.equal(200);
                    res.body[0].should.have.property("id");
                    res.body[0].should.have.property("name");
                    done();
                }
            });
    })
})

describe('POST /api/proposals', () => {
    it('it should post a new proposal in the database', (done) => {
        chai.request(httpServer)
            .post('/api/proposals')
            .send({
                "title": "DevOps proposal",
                "type": "Innovation that inspires",
                "description": "This is a DevOps proposal.",
                "level": 4,
                "expiration_date": "2023-12-22",
                "notes": "No additional notes",
                "required_knowledge": "Student must know the principle of software development.",
                "cod_degree": ["2"],
                "cod_group": "1",
                "supervisors_obj": {
                    "supervisor_id": 10000,
                    "co_supervisors": [
                        10001,
                        10002
                    ]
                },
                "keywords": [
                    "Javascript"
                ]
            })
            .end((err, res) => {
                if (err) {
                    done(err);
                } else {
                    res.statusCode.should.be.equal(200);
                    done();
                }
            });
    })

    it('it should fail to post a proposal on the database for missing fields', (done) => {
        chai.request(httpServer)
            .post('/api/proposals')
            .send({
                "title": "DevOps proposal",
                "type": "Innovation that inspires",
                "level": 4,
                "expiration_date": "2023-12-22",
                "notes": "No additional notes",
                "required_knowledge": "Student must know the principle of software development.",
                "cod_degree": ["2"],
                "cod_group": "1",
                "supervisors_obj": {
                    "supervisor_id": 10000,
                    "co_supervisors": [
                        10001,
                        10002
                    ]
                },
                "keywords": [
                    "Javascript"
                ]
            })
            .end((err, res) => {
                if (err) {
                    done(err);
                } else {
                    res.statusCode.should.be.equal(400);
                    res.body.error.should.be.equal("Missing fields")
                    done();
                }
            });
    })

    it('it should fail to post a proposal on the database for uncorrect fields', (done) => {
        chai.request(httpServer)
            .post('/api/proposals')
            .send({
                "title": "DevOps proposal",
                "type": "Innovation that inspires",
                "description": "This is a DevOps proposal.",
                "level": "this is not a number",
                "expiration_date": "2023-12-22",
                "notes": "No additional notes",
                "required_knowledge": "Student must know the principle of software development.",
                "cod_degree": ["2"],
                "cod_group": "1",
                "supervisors_obj": {
                    "supervisor_id": 10000,
                    "co_supervisors": [
                        10001,
                        10002
                    ]
                },
                "keywords": [
                    "Javascript"
                ]
})
            .end((err, res) => {
                if (err) {
                    done(err);
                } else {
                    res.statusCode.should.be.equal(400);
                    res.body.error.should.be.equal("Uncorrect fields")
                    done();
                }
            });
    })

    it('it should fail to post a proposal on the database for uncorrect fields', (done) => {
        chai.request(httpServer)
            .post('/api/proposals')
            .send({
                "title": "DevOps proposal",
                "type": "Innovation that inspires",
                "description": "This is a DevOps proposal.",
                "level": 2,
                "expiration_date": "2023-12-22",
                "notes": "No additional notes",
                "required_knowledge": "Student must know the principle of software development.",
                "cod_degree": ["2"],
                "cod_group": "1aaaaaaaaaa",
                "supervisors_obj": {
                    "supervisor_id": 10000,
                    "co_supervisors": [
                        10001,
                        10002
                    ]
                },
                "keywords": [
                    "Javascript"
                ]
            })
            .end((err, res) => {
                if (err) {
                    done(err);
                } else {
                    res.statusCode.should.be.equal(400);
                    res.body.error.should.be.equal("Uncorrect fields")
                    done();
                }
            });
    })

    it('it should fail to post a proposal on the database for uncorrect fields', (done) => {
        chai.request(httpServer)
            .post('/api/proposals')
            .send({
                "title": "DevOps proposal",
                "type": "Innovation that inspires",
                "description": "This is a DevOps proposal.",
                "level": 2,
                "expiration_date": "2023-12-22",
                "notes": "No additional notes",
                "required_knowledge": "Student must know the principle of software development.",
                "cod_degree": ["2", "aaa"],
                "cod_group": "1",
                "supervisors_obj": {
                    "supervisor_id": 10000,
                    "co_supervisors": [
                        10001,
                        10002
                    ]
                },
                "keywords": [
                    "Javascript"
                ]
            })
            .end((err, res) => {
                if (err) {
                    done(err);
                } else {
                    res.statusCode.should.be.equal(400);
                    res.body.error.should.be.equal("Uncorrect fields")
                    done();
                }
            });
    })


})

