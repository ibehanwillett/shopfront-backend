import request from 'supertest';
import { expect } from 'chai';
import app from '../app.js';
import { generateAccessToken } from '../controllers/auth.js'; 

// Generate a valid JWT token for authentication in the tests.
const validToken = generateAccessToken({ email: 'nicole@nightmare.com' }); 

describe('POST /payment/process-payment', function() {
  
  // Test case to ensure that the route requires both paymentMethodId and amount parameters.
  it('should require paymentMethodId and amount', function(done) {
    // Simulate a POST request to the payment processing route without sending paymentMethodId and amount.
    // Authorization header is set with the Bearer token for authentication.
    request(app)
      .post('/payment/process-payment')
      .set('Authorization', `Bearer ${validToken}`)
      .send({})
      .end((err, res) => {
        // Assert that the response status code is 400 indicating a Bad Request.
        // Assert that the response body contains a specific error message about missing parameters.
        expect(res.statusCode).to.equal(400);
        expect(res.body).to.deep.equal({ message: "Missing required payment parameters." });
        done(); // Indicates the end of the test case.
      });
  });

  // Test case to verify successful payment processing.
  it('should process payment successfully', function(done) {
    // Define valid paymentMethodId and amount values for the test.
    const paymentMethodId = 'pm_card_visa';
    const amount = 1000; // Represents $10.00 in a currency's smallest unit (e.g., cents for USD)

    // Simulate a POST request with the required payment parameters.
    request(app)
      .post('/payment/process-payment')
      .set('Authorization', `Bearer ${validToken}`) 
      .send({ paymentMethodId, amount })
      .end((err, res) => {
        // Assert that the response status code is 200 indicating success.
        // Assert that the response body indicates a successful payment.
        expect(res.statusCode).to.equal(200);
        expect(res.body.success).to.equal(true);
        done();
      });
  });

  // Test case to ensure that the route rejects payments with a zero amount.
  it('should reject payment with zero amount', function(done) {
    // Define a paymentMethodId and set the amount to 0 to simulate an invalid payment attempt.
    const paymentMethodId = 'pm_card_visa';
    const amount = 0; 

    // Simulate the POST request with the invalid amount.
    request(app)
      .post('/payment/process-payment')
      .set('Authorization', `Bearer ${validToken}`)
      .send({ paymentMethodId, amount })
      .end((err, res) => {
        // Assert that the response status code is 400 indicating a Bad Request.
        // Assert that the response body contains a specific error message about the invalid amount.
        expect(res.statusCode).to.equal(400); 
        expect(res.body).to.deep.equal({ message: "Invalid amount." }); 
        done();
      });
  });

  // Test case to check rejection of payments with a negative amount.
  it('should reject payment with negative amount', function(done) {
    // Define a payment attempt with a negative amount to simulate an invalid payment.
    const paymentMethodId = 'pm_card_visa';
    const amount = -100; // Represents an invalid negative amount.

    // Simulate the POST request with the invalid negative amount.
    request(app)
      .post('/payment/process-payment')
      .set('Authorization', `Bearer ${validToken}`)
      .send({ paymentMethodId, amount })
      .end((err, res) => {
        // Assert the same expectations as the zero amount test case.
        expect(res.statusCode).to.equal(400);
        expect(res.body).to.deep.equal({ message: "Invalid amount." }); 
        done();
      });
  });

});
