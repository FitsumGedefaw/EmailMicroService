let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../index');
require("dotenv").config();

//assertion style
chai.should();
chai.use(chaiHttp);

const { initializeApp } = require("@firebase/app");
const { getAuth } = require("@firebase/auth");
const { signInWithEmailAndPassword } = require("@firebase/auth");

// Your web app's Firebase configuration
const firebaseConfig = {

};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

let api_end_point = "/gebeya/api/email/sendEmail";
describe('POST /gebeya/api/email/sendEmail', () => {

    // invalid values, you can change but make sure they are invalid
    let invalid_values = {
        from: {
            email: "sender@gmail.com",
            name: "Sender Name"
        },
        templateId: "d-b0102c9e5d3f463abf3f122029",
        fbToken: "eyJhbGciOiJSUzI1NiIsImtpZCI6IjUyZiJKpZGVudGl0aWVzv-4xEOgBBF7-077rzIEKJ-xnAqC4-HHHoQ",
        SENDGRID_API_KEY: "SG.tzb3qPP4ReKw",
        attachments: [
            {
                templateName: "ABCD",
                fileName: "attachemet-1"
            }
        ]
    };

    // to get valid fbtoken, put the correct user info registered on firebase for Authentication
    let user_info = {
        email: "user@gmail.com",
        password: "123..."
    }

    let data;
    let authHeader;
    let validFbToken;
    let validSGapiKey = process.env.SENDGRID_API_KEY;

    // grab valid firebase token
    before(async () => {
        await signInWithEmailAndPassword(auth, user_info.email, user_info.password)
            .then((userCredencials) => {
                validFbToken = userCredencials.user.accessToken;//grab valid token 
            })
            .catch((error) => {
                console.log(error.message);
            });
    });

    beforeEach((done) => {
        data = {
            personalizations: {
                person: {
                    firstName: "Fitsum",
                    lastName: "Gedefaw"
                },
                requestDetail: {
                    requestedTitle: "API Developer & Tester",
                    requestedExperienceLevel: "13-years",
                    requestNumber: "839-10-08-2022"
                }
            },
            from: {
                email: "dawit1111111@gmail.com",
                name: "FItsum Gedefaw"
            },
            to: [
                {
                    email: "sossina01@gmail.com",
                    name: "Sissay Damtew"
                }
            ],
            templateId: "d-b0102c9e5d3f463abf36dd73cff12029"
        };
        authHeader = { authorization: `Bearer ${validFbToken}` };
        process.env.SENDGRID_API_KEY = validSGapiKey;
        done();
    });


    it('Test-1: It should not send: firebase id-token is not provided', (done) => {

        chai.request(server)
            .post(api_end_point)
            .send(data)
            .end((err, res) => {
                res.should.have.status(401);
                res.text.should.be.a('string');
                done();
            });
    });

    it('Test-2: It should not send: firebase id-token is expired or invalid', (done) => {

        authHeader = { authorization: `Bearer ${invalid_values.fbToken} ` }; //invalid firebase token 
        chai.request(server)
            .post(api_end_point)
            .set(authHeader)
            .send(data)
            .end((err, res) => {
                res.should.have.status(401);
                res.text.should.be.a('string');
                done();
            });
    });

    it('Test-3: It should not send: invalid sendgrid api-key', (done) => {

        process.env.SENDGRID_API_KEY = invalid_values.SENDGRID_API_KEY; // invalid  SENDGRID_API_KEY api-key
        chai.request(server)
            .post(api_end_point)
            .set(authHeader)
            .send(data)
            .end((err, res) => {
                res.should.have.status(401);
                res.text.should.be.a('string');
                done();
            });
    });

    it('Test-4: It should not send: sender email address is invalid', (done) => {

        data.from = invalid_values.from;// invalid sender address
        chai.request(server)
            .post(api_end_point)
            .set(authHeader)
            .send(data)
            .end((err, res) => {
                res.should.have.status(403);
                res.text.should.be.a('string');
                done();
            });
    });

    it('Test-5: It should not send: email template-id is wrong', (done) => {

        data.templateId = invalid_values.templateId;  //invalid template-id
        chai.request(server)
            .post(api_end_point)
            .set(authHeader)
            .send(data)
            .end((err, res) => {
                res.should.have.status(400);
                res.text.should.be.a('string');
                done();
            });
    });

    it('Test-6: It should not send: wrong pdf-template name', (done) => {

        data.attachments = invalid_values.attachments;// wrong template name
        chai.request(server)
            .post(api_end_point)
            .set(authHeader)
            .send(data)
            .end((err, res) => {
                res.should.have.status(400);
                res.text.should.be.a('string');
                done();
            });
    });

    it('Test-7: It should send: "attachments", "cc", and "bcc" fields are not included', (done) => {

        chai.request(server)
            .post(api_end_point)
            .set(authHeader)
            .send(data)
            .end((err, res) => {
                res.should.have.status(202);
                res.text.should.be.a('string');
                done();
            });
    });

    it('Test-8: It should send: "attachments", "cc", and "bcc" fields are included', (done) => {
        data.cc = [
            {
                name: "Dawit Andargachew",
                email: "dawit.andargachew@aau.edu.et"
            }
        ];
        data.bcc = [
            {
                name: "Dawit Andargachew",
                email: "hereisdawit@gmail.com"
            }
        ];
        data.attachments = [
            {
                templateName: "gebeya_template",
                fileName: "attachment1"
            }
        ];
        chai.request(server)
            .post(api_end_point)
            .set(authHeader)
            .send(data)
            .end((err, res) => {
                res.should.have.status(202);
                res.text.should.be.a('string');
                done();
            });

    });

    it('Test-9: It should send:  "attachments" field has more than one pdf-templates', (done) => {
        data.attachments = [
            {
                templateName: "gebeya_template",
                fileName: "attachment1"
            },
            {
                templateName: "requestCancelled",
                fileName: "attachment2"
            },
            {
                templateName: "welcome",
                fileName: "attachment3"
            }
        ];
        chai.request(server)
            .post(api_end_point)
            .set(authHeader)
            .send(data)
            .end((err, res) => {
                res.should.have.status(202);
                res.text.should.be.a('string');
                done();
            });

    });

});

