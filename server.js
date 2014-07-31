var fs = require("fs");
var host = "127.0.0.1";
var port = 80;
var express = require("express");
var thedata = require("./basicList.json");  // Initial data

var app = express();

var lastBookMarkId = 0;

// Bookmark json looks like
// bookmark = {[
//             user: Elise
//             bookmarks: [
//                 {
//                     id = 1, (bookmark id)
//                     location_id: 2,
//                 },
//                 {
//                     id = 2,
//                     location_id: 3
//                 }
//             ]
//             ]}

app.get("/", function(request, response){ //root dir
    // Don't return bookmarks.  Just stored in the big array because lazy
    response.status(200).end({locations: thedata.locations});
});

app.get("/bookmarks/:user", function(request, response) {
    console.log("Getting bookmarks for user: " + request.params.user);
    var bookmarksForUser = GetBookmarksForUser(request.params.user);
    response.status(200).send(bookmarksForUser);
})

app.delete("/bookmark/:id", function(request, response) {
    // TODO: This is dumb, but I'm lazy...
    var indexToDelete;
    var user = GetUserWhoOwnsBookmark(request.params.id);

    if(!user) {
        console.log("Bookmark not found - not deleted");
        response.status(200).send({ response: "OK", message: "Not Found" });
        return;
    }

    var bookmarksForUser = GetBookmarksForUser(user);

    for(var i = 0; i < bookmarksForUser.bookmarks.length; i++) {
        var mark = bookmarksForUser.bookmarks[i];
        if(!mark)
            break;
        if(mark.id == request.params.id) {
            indexToDelete = i;
        }
    }

    bookmarksForUser = bookmarksForUser.bookmarks.splice(indexToDelete, 1)
    console.log("Bookmark deleted for user " + user);
    response.status(201).send({ response: "OK", message: "Deleted" });
})

// Body is the location object
app.put("/bookmark/:user/:locationid", function(request, response) {
    var bookmarksForUser = GetBookmarksForUser(request.params.user);

    // Does this bookmark exist already?  If so, return the id of the existing bookmark
    var id = GetExistingBookmark(bookmarksForUser.bookmarks, request.params.locationid);
    if(id) {
        console.log("Duplicate bookmark of bookmark id: " + id)
        response.status(200).send({ response: "OK", message: "Duplicate Bookmark", id: id });
        return;
    }

    bookmarksForUser.bookmarks.push(
        {
            id: ++lastBookMarkId,
            location_id: request.params.locationid
        });

    console.log("New bookmark added for " + request.params.user + " at location: " + request.params.locationid);
    response.status(200).send({ response: "OK", message: "Bookmark Added", id: lastBookMarkId });
})

function GetUserWhoOwnsBookmark(bookmarkId) {
    for(var i = 0; i < thedata.bookmarks.length; i++) {
        var usermarks = thedata.bookmarks[i];
        if(usermarks.bookmarks.length == 0) {
            continue;
        }

        for(var k = 0; k < usermarks.bookmarks.length; k++) {
            var mark = usermarks.bookmarks[k];
            console.log(JSON.stringify(mark, null, 4));

            if(!mark) {
                continue;
            }

            if(mark.id == bookmarkId) {
                return usermarks.user;
            }
        }
    }
}

function GetBookmarksForUser(userName) {
    if(thedata.bookmarks.length > 0)
    {
         for(var i = 0; i < thedata.bookmarks.length; i++) {
            var userBookmarks = thedata.bookmarks[i];
            JSON.stringify(userBookmarks, null, 4)
            if(!userBookmarks.user || !userName)
                continue;

            if(userBookmarks.user.toLowerCase() == userName.toLowerCase()) {
                return userBookmarks;
            }
        }
    }

    // Init this user's bookmarks
    thedata.bookmarks.push( {
        user: userName,
        bookmarks: [{}]
    });

    return thedata.bookmarks[thedata.bookmarks.length-1];
}

function GetExistingBookmark(marks, locationid) {
    for(var i = 0; i < marks.length; i++) {
        mark = marks[i];
        if(mark.location_id == locationid) {
            return mark.id;
        }
    }
    return null;
}

app.listen(port, host);
