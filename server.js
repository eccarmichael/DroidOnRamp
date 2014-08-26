var fs = require("fs");
var host = "127.0.0.1";
var port = process.env.PORT || 3000;
var express = require("express");
var thedata = require("./basicList.json");  // Initial data

var app = express();

var lastBookMarkId = 0;

// Bookmark json looks like
// bookmark = {[
//             user: Elise
//             bookmarks: [
//                 {
//                     bookmark_id = 1, (bookmark id)
//                     item_id: 2,
//                 },
//                 {
//                     bookmark_idid = 2,
//                     item_id: 3
//                 }
//             ]
//             ]}

app.get("/", function(request, response){ //root dir
    // Don't return bookmarks.  Just stored in the big array because lazy
    response.status(200).send({locations: thedata.locations});
});

app.get("/bookmarks/:user", function(request, response) {
    console.log("Getting bookmarks for user: " + request.params.user);
    var bookmarksForUser = GetBookmarksForUser(request.params.user);
    response.status(200).send(bookmarksForUser);
})

app.delete("/bookmark/:bookmark_id", function(request, response) {
    // TODO: This is dumb, but I'm lazy...
    var indexToDelete;
    var user = GetUserWhoOwnsBookmark(request.params.bookmark_id);

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
        if(mark.bookmark_id == request.params.bookmark_id) {
            console.log("Bookmark id to be delete:::: " + mark.bookmark_id);
            console.log("Index that is deleted: " + i);
            indexToDelete = i;
        }
    }

    bookmarksForUser = bookmarksForUser.bookmarks.splice(indexToDelete, 1)
    console.log("Bookmark deleted for user " + user);
    response.status(204).send();
})

app.put("/bookmark/:user/:itemid", function(request, response) {
    var bookmarksForUser = GetBookmarksForUser(request.params.user);

    // Does this bookmark exist already?  If so, return the id of the existing bookmark
    var bookmark_id = GetExistingBookmark(bookmarksForUser.bookmarks, request.params.itemid);
    if(bookmark_id) {
        console.log("Duplicate bookmark of bookmark id: " + bookmark_id)
        response.status(200).send({ response: "OK", message: "Duplicate Bookmark", bookmark_id: bookmark_id });
        return;
    }

    bookmarksForUser.bookmarks.push(
        {
            bookmark_id: ++lastBookMarkId,
            item_id: parseInt(request.params.itemid)
        });

    console.log("New bookmark added for " + request.params.user + " for item: " + request.params.itemid);
    response.status(200).send({ response: "OK", message: "Bookmark Added", bookmark_id: lastBookMarkId });
})

function GetUserWhoOwnsBookmark(bookmark_id) {
    for(var i = 0; i < thedata.bookmarks.length; i++) {
        var usermarks = thedata.bookmarks[i];
        if(usermarks.bookmarks.length == 0) {
            continue;
        }
        for(var k = 0; k < usermarks.bookmarks.length; k++) {
            var mark = usermarks.bookmarks[k];
            console.log(JSON.stringify(mark, null, 4));

            if(!mark) 
                continue;

            if(mark.bookmark_id == bookmark_id) {
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
        bookmarks: []
    });

    return thedata.bookmarks[thedata.bookmarks.length-1];
}

function GetExistingBookmark(marks, itemid) {
    for(var i = 0; i < marks.length; i++) {
        mark = marks[i];
        if(mark.item_id == itemid) {
            return mark.bookmark_id;
        }
    }
    return null;
}

app.listen(port, host);
