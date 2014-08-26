var newRequest = require('supertest'); 
var should = require('should');
var url = "http://localhost:3000";

describe('Locations', function() {
    setTimeout(10000);

    it('should exist with locations and corresponding delicacies', function(done) {
        newRequest(url)
        .get("/")
        .send()
        .expect(200)
        .end(function(err, res) {
            if(err) {
                console.log("Error getting location data: " + err);
                done(err);
            }
            else {
                res.body.should.have.property('locations');
                done();
            }
    });    
    });

})
