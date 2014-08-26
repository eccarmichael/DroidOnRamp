DroidOnRamp
===========

##Assignment 1
* Run `npm install` on the master branch
* start the server by running `node server.js`
* Create a mocha test in your own repository
* The URL you are testing will be http://localhost:3000/
* Verify with should that you get a list of locations & print the number of locations
  * Use the should library to validate data: https://github.com/visionmedia/should.js/ 
* Print a list of location names along with the title of each of it's corresponding delecacies to the console as such:
  * location {
    name:
    delicacies: [
      food1, 
      food2, 
      food3
    ]
  }

##Assignment 2
* Pick a user name (can be your own name) and get the bookmarks for your user
* Test that the number of booksmarks is accurate (0)
* Add a bookmark for your user & validate the response
* Get the bookmarks for your user & validate the response (correct number, correct values).
 * Don't test data that doesn't make sense to be tested
* Add another bookmark and fetch all bookarks and validate as you did previously
* Delete a bookmark & verify the bookmark has been removed

##References
* The API looks as such:
```
app.get("/")
app.get("/bookmarks/:user")
app.delete("/bookmark/:bookmark_id")
app.put("/bookmark/:user/:itemid")
```
* The bookmark object on the server looks as such:
```
 bookmark = {[
             user: Elise
             bookmarks: [
                 {
                     bookmark_id = 1, (bookmark id)
                     item_id: 2,
                 },
                 {
                     bookmark_idid = 2,
                     item_id: 3
                 }
             ]
             ]}
```
