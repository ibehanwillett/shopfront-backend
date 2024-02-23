import request from 'supertest';
import { expect } from 'chai';
import app from './../app.js'; 

describe('POST /payment/process-payment', function() {
  it('should require paymentMethodId and amount', function(done) {
    request(app)
      .post('/payment/process-payment')
      .send({})
      .end((err, res) => {
        expect(res.statusCode).to.equal(400);
        expect(res.body).to.deep.equal({ success: false, message: "Missing required parameters." });
        done();
      });
  });

  it('should process payment successfully', function(done) {
    const paymentMethodId = 'pm_example';
    const amount = 1000; 

    request(app)
      .post('/payment/process-payment')
      .send({ paymentMethodId, amount })
      .end((err, res) => {
        expect(res.statusCode).to.equal(200);
        expect(res.body.success).to.equal(true);
        done();
      });
  });
});
