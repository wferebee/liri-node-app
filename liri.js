require("dotenv").config();         // all of the requires

var colors = require('colors');  /*  I also decided to add some colors to my app to spice it up -completely unneccesary, and took about an exrta 30 minutes.
I was disaapointed that the preview URLs for the sportify calls would error out after like three calls saying it didnt know what "blue was.
It would pull about three results and just quit so i decided to just leave it alone*/

var request = require("request");
var fs = require("fs");
var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);

//----------------------------------------------------------------


var choice = process.argv[2];  // setting up user inputs, of course go with 2, and 3 
var inputParameter = process.argv[3]; // almost named this choice but made more sense sense it is literally  a parameter in my function just below

//----------------------------------------------------------------


UserInputs(choice, inputParameter); // had to search this, but this made the most sense for this kind of app
                                    
function UserInputs (choice, inputParameter){ // Im sure there is probs an easier way to do this lol, but this wasnt too bad.
    switch (choice) {
    case 'concert-this':
        showConcertInfo(inputParameter);
        break;
    case 'spotify-this-song':
        showSongInfo(inputParameter);
        break;
    case 'movie-this':
        showMovieInfo(inputParameter);
        break;
    case 'do-what-it-says':
        showInfo();
        break;
    default: 
        console.log("Please Try Again: \nconcert-this 'user input' \nspotify-this-song 'user input' \nmovie-this 'user input' \ndo-what-it-says".red)
    }
}

//----------------------------------------------------------------


function showConcertInfo(inputParameter){
    var queryUrl = "https://rest.bandsintown.com/artists/" + inputParameter + "/events?app_id=codingbootcamp";
    request(queryUrl, function(error, response, body) {
    
    if (!error && response.statusCode === 200) {  // If ther is no error then run code
        var concerts = JSON.parse(body);  // parses the JSON string
        for (var i = 0; i < concerts.length; i++) {  
            console.log("**********EVENT INFO*********".red);  //output to the console
            console.log(i);
            console.log("Name of the Venue: ".green + concerts[i].venue.name.yellow);
            console.log("Venue Location: ".green +  concerts[i].venue.city.yellow);
            console.log("Date of the Event: ".green +  concerts[i].datetime.yellow);
            console.log("*****************************");
            
            //----------------------------------------------------------------

            fs.appendFileSync("log.txt", "**********EVENT INFO*********\n"); //output to the log.txt file
            fs.appendFileSync("log.txt", i+"\n");
            fs.appendFileSync("log.txt", "Name of the Venue: " + concerts[i].venue.name+"\n");
            fs.appendFileSync("log.txt", "Venue Location: " +  concerts[i].venue.city+"\n");
            fs.appendFileSync("log.txt", "Date of the Event: " +  concerts[i].datetime+"\n");
            fs.appendFileSync("log.txt", "************"+"\n");
        }
    } else{
      console.log('Error');
    }
});}

//----------------------------------------------------------------


function showSongInfo(inputParameter) {
    if (inputParameter === undefined) {
        inputParameter = "The Sign";  // if no user input, The sign is searched for
    }
    spotify.search(
        {
            type: "track",
            query: inputParameter
        },
        function (err, data) {
            if (err) {
                console.log("Error: " + err);
                return;
            }
            var songs = data.tracks.items;

            for (var i = 0; i < songs.length; i++) {
                console.log("**********SONG INFO*********".red);               
                console.log(i);               
                console.log("Song name: ".green + songs[i].name.blue);               
                console.log("Preview song: ".green + songs[i].preview_url);                
                console.log("Album: ".green + songs[i].album.name.blue);               
                console.log("Artist(s): ".green + songs[i].artists[0].name.blue);               
                console.log("************");  
                
                //----------------------------------------------------------------

                fs.appendFileSync("log.txt", "**********SONG INFO*********\n");
                fs.appendFileSync("log.txt", i +"\n");
                fs.appendFileSync("log.txt", "song name: " + songs[i].name +"\n");
                fs.appendFileSync("log.txt", "preview song: " + songs[i].preview_url +"\n");
                fs.appendFileSync("log.txt", "album: " + songs[i].album.name + "\n");
                fs.appendFileSync("log.txt", "artist(s): " + songs[i].artists[0].name + "\n");
                fs.appendFileSync("log.txt", "************\n");
             }
        }
    );
};

//----------------------------------------------------------------


function showMovieInfo(inputParameter){
    if (inputParameter === undefined) {
        inputParameter = "Mr. Nobody"
        console.log("-----------------------");       
        console.log("If you haven't watched 'Mr. Nobody,' then you should: http://www.imdb.com/title/tt0485947/".red);       
        console.log("It's on Netflix!".red);
        
        //----------------------------------------------------------------

        fs.appendFileSync("log.txt", "-----------------------\n");
        fs.appendFileSync("log.txt", "If you haven't watched 'Mr. Nobody,' then you should: http://www.imdb.com/title/tt0485947/" +"\n");
        fs.appendFileSync("log.txt", "It's on Netflix!\n");
    }
    var queryUrl = "http://www.omdbapi.com/?t=" + inputParameter + "&y=&plot=short&apikey=trilogy";
    request(queryUrl, function(error, response, body) {
    // If the request is successful
    if (!error && response.statusCode === 200) {
        var movies = JSON.parse(body);
        console.log("**********MOVIE INFO*********".red);        
        console.log("Title: ".green + movies.Title.yellow);      
        console.log("Release Year: ".green + movies.Year.yellow);      
        console.log("IMDB Rating: ".green + movies.imdbRating.yellow);       
        console.log("Rotten Tomatoes Rating: ".green + getRottenTomatoesRatingValue(movies).yellow);      
        console.log("Country of Production: ".green + movies.Country.yellow);       
        console.log("Language: ".green + movies.Language.yellow);       
        console.log("Plot: ".green + movies.Plot.yellow);       
        console.log("Actors: ".green + movies.Actors.yellow);        
        console.log("************");  
        
        //----------------------------------------------------------------

        fs.appendFileSync("log.txt", "**********MOVIE INFO*********\n");
        fs.appendFileSync("log.txt", "Title: " + movies.Title + "\n");
        fs.appendFileSync("log.txt", "Release Year: " + movies.Year + "\n");
        fs.appendFileSync("log.txt", "IMDB Rating: " + movies.imdbRating + "\n");
        fs.appendFileSync("log.txt", "Rotten Tomatoes Rating: " + getRottenTomatoesRatingValue(movies) + "\n");
        fs.appendFileSync("log.txt", "Country of Production: " + movies.Country + "\n");
        fs.appendFileSync("log.txt", "Language: " + movies.Language + "\n");
        fs.appendFileSync("log.txt", "Plot: " + movies.Plot + "\n");
        fs.appendFileSync("log.txt", "Actors: " + movies.Actors + "\n");
        fs.appendFileSync("log.txt", "************\n");
    } else{
      console.log('Error occurred.');
    }
});}

//----------------------------------------------------------------


function getRottenTomatoesRatingObject (data) {  // this is had to look up, i was very confused because i thought i had gotten it to work 
    return data.Ratings.find(function (item) {  // but apparently i was wrong, so i looked it up and this is how its done apparently???
       return item.Source === "Rotten Tomatoes"; // Not that i dont understand it now, i just couldnt figure it out on my own
    });
  };
  
  function getRottenTomatoesRatingValue (data) {
    return getRottenTomatoesRatingObject(data).Value;
  };

//----------------------------------------------------------------


function showInfo(){   // this is the do what it says function
	fs.readFile('random.txt', 'utf8', function(err, data){
		if (err){ 
			return console.log(err);
		}
        var dataArr = data.split(',');
        UserInputs(dataArr[0], dataArr[1]);
	});
};


