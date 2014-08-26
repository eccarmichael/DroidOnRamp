var newRequest = require('supertest'); 
var should = require('should');
var url = "http://localhost:3000";

describe('Locations', function() {
    this.timeout(15000);

    it('should let this test pass because it\'s not doing anything', function() {
        console.log("it passed!");
    //    throw "oops";
    })

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
    this.timeout(15000);

    it('should be removed/cleaned up prior to testing', function(done) {
        newRequest(url)
        .get("/bookmarks/elise")
        .send()
        .expect(200)
        .end(function(err, res) {
            if(err) {
                console.log("Error getting bookmark data: " + err);
                done(err);
            }
            else {
                var marks = res.body.bookmarks;
                if(marks.length > 0) {
                    for(var i = 0; i < marks.length; i++) {
                        var mark = marks[i];
                        DeleteBookmark(mark.bookmark_id, i, function(err, j) {
                            if(err) {
                                done("Unable to delete bookmark: " + err);
                            }
                            else {
                                if(j == marks.length - 1) {
                                    done();
                                }
                            }
                        });
                    }
                }
                else {
                    done();
                }
            }
        });  
    })

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
                console.log("Got response! : " + JSON.stringify(res.body));
                res.body.response.should.equal("OK");
                res.body.message.should.equal("Bookmark Added");
                var newBookmark = res.body.bookmark_id;

                // Make a get and make sure my new bookmark is there
                console.log("----New bookrmark id: " + newBookmark);

                done();
                // ValidateBookmarkExists("elise", 1, function(err) {
                //     if(err) {
                //         done(err);
                //     }
                //     else {
                //         done();
                //     }
                // })
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

function DeleteBookmark(itemid, i, done) {
    var delpath = "/bookmark/" + itemid;
    console.log("Deleting: " + delpath);
    newRequest(url)
        .delete(delpath)
        .send()
        //.expect(204)
        .end(function(err, res) {
            if(err) {
                console.log("ERROR");
                done("Error deleting bookmark " + itemid + ": " + err, i);
            }
            else {
                done(null, i);
            }
        });  
}

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