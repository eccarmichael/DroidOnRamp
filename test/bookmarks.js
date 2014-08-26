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
                res.body.should.have.property('locations');
                res.body.locations[0].title.should.equal("Oaxaca, Mexico");
                //console.log(JSON.stringify(res.body.locations, null, 4));
                done();
            }
        });    
    });
})

describe('Bookmarks', function() {
    it('should let me save a bookmark to my name', function(done) {
       newRequest(url)
        .put("/bookmark/elise/1")
        .send()
        .expect(200)
        .end(function(err, res) {
            if(err) {
                console.log("Error putting bookmark data: " + err);
                done(err);
            }
            else {
                console.log("GOt response!");
                res.body.response.should.equal("OK");
                res.body.message.should.equal("Bookmark Added");
                var newBookmark = res.body.bookmark_id;

                // Make a get and make sure my new bookmark is there
                console.log("----New bookrmark id: " + newBookmark);

                done();
            }
        });  
    })

    it('should not let me save a duplicate bookmark to my name', function(done) {
        AddBookmark("elise", 2, function(err, serverResponse) {
            if(err) {
                done(err);
            }
            else {
                serverResponse.response.should.equal("OK");
                serverResponse.message.should.equal("Bookmark Added");

                AddBookmark("elise", 2, function(err, secondServerResponse) {
                    if(err) {
                        done(err);
                    }
                    else {
                        secondServerResponse.response.should.equal("OK");
                        secondServerResponse.message.should.equal("Duplicate Bookmark");
                        done();
                    }
                })
            }
        })
    })
});

function AddBookmark(name, itemid, done) {
    newRequest(url)
        .put("/bookmark/" + name + "/" + itemid)
        .send()
        .expect(200)
        .end(function(err, res) {
            if(err) {
                console.log("Error putting bookmark data: " + err);
                done(err);
            }
            else {
                done(null, res.body);
            }
        });
}