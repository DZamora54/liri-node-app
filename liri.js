// Take in the command line argument
var inputString = process.argv;

// Parses the command line argument to capture the "user command" (my-tweets, spotify-this-song, movie-this, do-what-it-says)
var userCommand = inputString[2];

// initializes variable song name
var songName = "";

// Include the npm packages twitter, node-spotify-api and request
var Twitter = require("twitter");
var Spotify = require("node-spotify-api");
var request = require("request");

// Grabs the keys module
var keys = require("./keys.js");

var fs = require("fs");

// Gets all twitter keys 
var twitKeys = keys.twitterKeys;
var spotKeys = keys.spotifyKeys;

// Adds twitter and spotify keys as credentials to access twitter and spotify api endpoints
var T = new Twitter(twitKeys);
var spotify = new Spotify(spotKeys);

// Parameters to be passed for twitter search
var params = {
  screen_name: "DZamoraFSD",
  count: 20
};


// If else statement to check user command and call the appropriate function for that command
if (userCommand === "my-tweets") {
  myTweets();	
} 

else if (userCommand === "spotify-this-song") {
  spotifyThisSong();
} 

else if (userCommand === "movie-this") {
  movieThis();
}

else if (userCommand === "do-what-it-says") {
  doWhatItSays();
}  

else {
    console.log("Please enter valid command.");
}

// Function that grabs 20 most recent tweets and prints the time created and text
function myTweets() {
  T.get("statuses/user_timeline", params, function(err, data, responses) {
    if (!err) {
      for ( i = 0; i < 20; i++) {
        console.log("Created at: " + data[i].created_at + "\n" + "Text: " + data[i].text + "\n");
      };    
    } else {
  	  console.log(err);
    }
  });
};

// For the song name this function prints Artist(s), The song's name, a preview link of the song from spotify, the album that the song is from. Defaults to "The Sign" when the user does not type the name of a song.
function spotifyThisSong() {
  if (inputString.length < 4) {
    songName = "The Sign";
  }
  else {
    for (var i = 3; i < inputString.length; i++) {
  	  if (i > 3 && i < inputString.length) {
  	    songName = songName + " " + inputString[i];
  	  }
  	  else {
  	    songName += inputString[i];
  	  }
    };
  };

  spotify.search({type: "track", query: '\"' + songName + '\"'}, function(err, data) {
    if (err) {
  	  return console.log("Error occurred: " + err);
  	}
    console.log("Artist(s): " + data.tracks.items[0].artists[0].name);
    console.log("Song's name: " + data.tracks.items[0].name);
    console.log("Preview link: " + data.tracks.items[0].preview_url);
    console.log("Album: " + data.tracks.items[0].album.name);
  });
};  

// For the movie name this function prints title of the movie, the year the movie came out, imdb rating rating of the movie, rotten tomatoes rating of the movie, country where the movie was produced, language of the movie, plot of the movie and actors in the movie. Includes default message if the user does not enter a movie title.
function movieThis() {
  var movieName = "";

  if (inputString.length < 4) {
    movieName = "Mr. Nobody";
    console.log("If you haven't watched Mr. Nobody, then you should: http://www.imdb.com/title/tt0485947/");
    console.log("It's on Netflix!");
  }
  else {
    for (var i = 3; i < inputString.length; i++) {
  	  if (i > 3 && i < inputString.length) {
  	    movieName = movieName + " " + inputString[i];
  	  }
  	  else {
  	    movieName += inputString[i];
  	  }

  	  var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=40e9cece";

  	  console.log(movieName);
  
      request(queryUrl, function(error, response, body) {
        if (!error && response.statusCode === 200) {
          console.log("Movie title: "+ JSON.parse(body).Title);
          console.log("Release year: "+ JSON.parse(body).Year);
          console.log("IMDB rating: "+ JSON.parse(body).Ratings[0].Value);
          console.log("Rotten Tomatoes rating: "+ JSON.parse(body).Ratings[1].Value);
          console.log("Country: "+ JSON.parse(body).Country);
          console.log("Language: "+ JSON.parse(body).Language);
          console.log("Plot: "+ JSON.parse(body).Plot);
          console.log("Actors: "+ JSON.parse(body).Actors);
        };      
      })
    };
  };
  
};  

//  Reads file random.txt and uses the text to run a command
function doWhatItSays () {
  console.log("dowhatitsays");
  fs.readFile("random.txt", "utf8", function(err, data) {
  	if (err) {
  	  return console.log(err);
  	}

  	var randomString = data;
    
    var commandArray = randomString.split(",");

  	if (commandArray[0] === "my-tweets") {
      myTweets();	
    } else if (commandArray[0] === "spotify-this-song") {
      songName = commandArray[1];
      console.log(songName);
      spotifyThisSong();
    } else if (commandArray[0] === "movie-this") {
      movieThis();
    } else if (commandArray[0] === "do-what-it-says") {
      doWhatItSays();
    } else {
      console.log("Please enter valid command.");
    }
  })
}