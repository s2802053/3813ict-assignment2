const assert = require('assert');
const http = require('http');
const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
chai.use(chaiHttp);

// start the server when the test is run
const app = require(__dirname + '/../server');

describe('Server test', function(){
    describe('/api/auth/login', () => {
        it('it should return a successful response', (done) => {
            chai.request(app)
                .post('/api/auth/login')
                .send({username: 'super', password: '12345'})
                .end((err, res) => {
                    res.should.have.status(200);
                    console.log(res.body);
                    res.body.should.have.property('success');
                    assert.equal(res.body.success, true);
                    done();
                });
        });
        it('it should return the correct user', (done) => {
            chai.request(app)
                .post('/api/auth/login')
                .send({username: 'super', password: '12345'})
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('success');
                    assert.equal(res.body.success, true);
                    assert.equal(res.body.data.username, 'super');
                    done();
                });
        });
    });
});