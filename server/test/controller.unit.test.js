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

