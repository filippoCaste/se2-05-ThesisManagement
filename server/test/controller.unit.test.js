import "jest-extended";
import request from 'supertest';
import { getApplicationsByProposalId } from "../src/services/application.services";
import { getApplicationsProposalId } from "../src/controllers/application.controller";

const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
import { app } from '../index';
const server = app;
chai.use(chaiHttp);

jest.mock('../src/services/application.services');

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

describe('GET /api/teachers/:id', () => {
    it('it should GET the teacher in the database with the specified id', (done) => {
        chai.request(httpServer)
            .get('/api/teachers/10000')
            .end((err, res) => {
                if (err) {
                    done(err);
                } else {
                    res.statusCode.should.be.equal(200);
                    res.body.should.have.property("id");
                    res.body.should.have.property("name");
                    res.body.should.have.property("surname");
                    res.body.should.have.property("email");
                    res.body.should.have.property("cod_group");
                    res.body.should.have.property("group_name");
                    res.body.should.have.property("cod_department");

                    done();
                }
            });
    })

    it('it should FAIL for uncorrect id', (done) => {
        chai.request(httpServer)
            .get('/api/teachers/1')
            .end((err, res) => {
                if (err) {
                    done(err);
                } else {
                    res.statusCode.should.be.equal(404);
                    res.body.error.should.be.equal("User not found")
                    done();
                }
            });
    })

    it('it should FAIL for uncorrect parameter', (done) => {
        chai.request(httpServer)
            .get('/api/teachers/myself')
            .end((err, res) => {
                if (err) {
                    done(err);
                } else {
                    res.statusCode.should.be.equal(400);
                    res.body.error.should.be.equal("Uncorrect id")
                    done();
                }
            });
    })


})

describe('GET /api/students/:id', () => {
    it('it should GET the student in the database with the specified id', (done) => {
        chai.request(httpServer)
            .get('/api/students/400000')
            .end((err, res) => {
                if (err) {
                    done(err);
                } else {
                    res.statusCode.should.be.equal(200);
                    res.body.should.have.property("id");
                    res.body.should.have.property("name");
                    res.body.should.have.property("surname");
                    res.body.should.have.property("email");
                    res.body.should.have.property("gender");
                    res.body.should.have.property("nationality");
                    res.body.should.have.property("cod_degree");
                    res.body.should.have.property("enrollment_year");

                    done();
                }
            });
    })

    it('it should FAIL for uncorrect id', (done) => {
        chai.request(httpServer)
            .get('/api/students/1')
            .end((err, res) => {
                if (err) {
                    done(err);
                } else {
                    res.statusCode.should.be.equal(404);
                    res.body.error.should.be.equal("User not found")
                    done();
                }
            });
    })

    it('it should FAIL for uncorrect parameter', (done) => {
        chai.request(httpServer)
            .get('/api/students/myself')
            .end((err, res) => {
                if (err) {
                    done(err);
                } else {
                    res.statusCode.should.be.equal(400);
                    res.body.error.should.be.equal("Uncorrect id")
                    done();
                }
            });
    })

})

describe('getApplicationsProposalId', () => {
    const mockRequest = {
        params: {
            id: 1
        }
    };
    const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
    }

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('should return 200 and an empty array if the proposal exists but there aren\'t any applications for it', async () => {
        const mockApplicationdData = [];

        const req = mockRequest(1);
        const res = mockResponse();
        await getApplicationsProposalId(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockApplicationdData);
    });

    test('should return 200 and an array with the applications if the proposal exists and there are applications for it', async () => {
        const mockApplicationdData = [
            {
                student_id: 400000,
                submission_date: "2021-05-12",
                student_name: "Mario",
                student_surname: "Rossi",
                student_email: "s400000@studenti.polito.it",
                student_nationality: "Italian",
                student_enrollment_year: 2018,
                student_title_degree: "Bachelor's degree in Computer Engineering"
            },
            {
                student_id: 400001,
                submission_date: "2021-05-12",
                student_name: "Luca",
                student_surname: "Verdi",
                student_email: "s40001@studenti.polito.it",
                student_nationality: "Italian",
                student_enrollment_year: 2018,
                student_title_degree: "Bachelor's degree in Computer Engineering"
            }
        ];

        const req = mockRequest(1);
        const res = mockResponse();
        await getApplicationsProposalId(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockApplicationdData);
    });

    /*test('should return 404 if the proposal does not exist', async () => {
        const req = mockRequest(2);
        const res = mockResponse();
        await getApplicationsProposalId(req, res);
        expect(res.status).toHaveBeenCalledWith(404);
    });*/

    test('should return 500 if error', async () => {
        const req = mockRequest("a");
        const res = mockResponse();
        await getApplicationsProposalId(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
    });

});
