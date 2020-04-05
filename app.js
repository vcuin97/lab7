const express = require("express");
const app = express();

app.set("view engine","ejs");

app.use(express.static("public")); //specify folder for images,css,js

//allows us to generate a request and get content of a webpage url
const request = require('request');

//routes
//specify method first get or post
//default route and input parameters is request and response
// use await for before function that returns code
//use async in front of functinon declaration
//yo

app.listen(process.env.PORT,process.env.IP,function(){
    console.log("Running Express Server...");
});

app.get("/", async function(req,res){
  
    let orientation = req.query.orientation;
    
    let keywords = ["car", "dog", "cat", "python"];
    
    let keyword = keywords[Math.floor(Math.random()*keywords.length)];
     
    let parsedData = await getImages(keyword,"vertical"); //the JSON Object returned
    
    parsedData.hits = shuffle(parsedData.hits);
    
    res.render("index",{"image":parsedData});

});

app.get("/results", async function(req,res){
    
    let keyword = req.query.keyword; //this must match the name in our results form
    
    let orientation = req.query.orientation;
    
    //let randomIndex = Math.floor(Math.random() * parsedData.hits.length);
    
    let parsedData = await getImages(keyword,orientation); //the JSON Object returned
    
    parsedData.hits = shuffle(parsedData.hits);
    
    //parsedData.hits.webformatURL = parsedData.hits.webformatURL[Math.floor(Math.random()*parsedData.hits.webformatURLlength)];
    
    res.render("results",{"images":parsedData});
    
});


//returns all data from Pixabay API as JSON Object
function getImages(keyword,orientation){
    
    return new Promise(function(resolve,reject){
        
        request('https://pixabay.com/api/?key=15801884-152b8422d5187a01582c5eb42&q='+keyword+'&orientation='+orientation, 
        function (error, response,body){
    
            //body is a string not an object so we need to parse it
            //check if error is not false and that the status code is 200 (ok)
            if(!error && response.statusCode==200){
        
                let parsedData = JSON.parse(body);
                //now that it's a json object inside parsedData we can access hits and largeImageURL
        
                resolve(parsedData); //returns parsedData and assigns it to variable declared in our route
        
                //let randomIndex = Math.floor(Math.random() * parsedData.hits.length);
        
                //res.send(`<img src='${parsedData.hits[randomIndex].largeImageURL}'>`);
                //res.render("index"); //displays index but not image so pass by parameter
                //res.render("index",{"image":parsedData.hits[randomIndex].largeImageURL});
                //index is the index.ejs page, image is the name of the variable we are passing to index.ejs
                //this is separated by : and we put the data we want to send right next to the variable image
                //so parsedData is being put into the variable "image" and then being sent to index.ejs
            } else{
                reject(error); //rejects the promise
                console.log(response.statusCode);
                console.log(error);
        
            }
  
    
        });
        
        
    });


}

function shuffle(sourceArray) {
    for (var i = 0; i < sourceArray.length - 1; i++) {
        var j = i + Math.floor(Math.random() * (sourceArray.length - i));

        var temp = sourceArray[j];
        sourceArray[j] = sourceArray[i];
        sourceArray[i] = temp;
    }
    return sourceArray;
}