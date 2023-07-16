import chai from 'chai';
import chaiHttp from 'chai-http';
import chaiDom from 'chai-dom';
import jsdom from 'jsdom';
import dotenv from "dotenv";

chai.use(chaiHttp);
chai.use(chaiDom);

const should = chai.should();
const expect = chai.expect;

process.env.NODE_ENV = "testing"
dotenv.config({path: `.env-testing`});

// load app after env
const app = (await import('../app.js')).app;

describe('GET /', () => {
    it('should return index page', async () => {
        const response = await chai.request(app).get('/');
        response.should.have.status(200);

        const dom = new jsdom.JSDOM(response.text);
        expect(dom.window.document.body.innerHTML).contain("Create new todo")
    });
});

describe('Filter already finished', () => {
    it('should not contain finished entries', async () => {
        const response = await chai.request(app).post('/filter');
        response.should.have.status(200);

        const dom = new jsdom.JSDOM(response.text);
        expect(dom.window.document.body.innerHTML).to.not.contain("Finished")
    });
});

describe('note Not found', () => {
    it('should return 404', async () => {
        const response = await chai.request(app).get('/edit/abcdef');
        response.should.have.status(404);
    });
});

describe('Importance higher than 5', () => {
    it('should not allow importance higher 5', function(done) {
        chai
            .request(app)
            .post('/edit')
            .set('content-type', 'application/x-www-form-urlencoded')
            .send({
                title: "Test",
                importance: "6",
                due_date: "2024-03-03",
                description: "adasdsad",
                create_button: "Test"
            })
            .end(function(error, response, body) {
                if (error) {
                    done(error);
                } else {
                    response.should.have.status(403);
                    done();
                }
            });
    });
});
