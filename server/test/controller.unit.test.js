import "jest-extended";
import request from 'supertest';

const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
const server = require('../index');

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
                    done();
                }
            });
    });
})


