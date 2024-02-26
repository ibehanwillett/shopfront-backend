import request from 'supertest';
import { expect } from 'chai';
import app from './../app.js';
import { generateAccessToken } from './../auth.js'; 

const username = 'shopfront-valentinas';
const validToken = generateAccessToken({ username }); 

describe('POST /payment/process-payment', function() {
  it('should require paymentMethodId and amount', function(done) {
    request(app)
      .post('/payment/process-payment')
      .set('Authorization', `Bearer ${validToken}`)
      .send({})
      .end((err, res) => {
        expect(res.statusCode).to.equal(400);
        expect(res.body).to.deep.equal({ message: "Missing required payment parameters." });
        done();
      });
  });

  it('should process payment successfully', function(done) {
    const paymentMethodId = 'pm_card_visa';
    const amount = 1000; 

    request(app)
      .post('/payment/process-payment')
      .set('Authorization', `Bearer ${validToken}`) 
      .send({ paymentMethodId, amount })
      .end((err, res) => {
        expect(res.statusCode).to.equal(200);
        expect(res.body.success).to.equal(true);
        done();
      });
  });

  it('should reject payment with zero amount', function(done) {
    const paymentMethodId = 'pm_card_visa';
    const amount = 0; 
    
    request(app)
      .post('/payment/process-payment')
      .set('Authorization', `Bearer ${validToken}`)
      .send({ paymentMethodId, amount })
      .end((err, res) => {
        expect(res.statusCode).to.equal(400); 
        expect(res.body).to.deep.equal({ message: "Invalid amount." }); 
        done();
      });
  });

  it('should reject payment with negative amount', function(done) {
    const paymentMethodId = 'pm_card_visa';
    const amount = -100;
    
    request(app)
      .post('/payment/process-payment')
      .set('Authorization', `Bearer ${validToken}`)
      .send({ paymentMethodId, amount })
      .end((err, res) => {
        expect(res.statusCode).to.equal(400);
        expect(res.body).to.deep.equal({ message: "Invalid amount." }); 
        done();
      });
  });

});
