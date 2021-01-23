var express = require("express");
var bodyParser = require("body-parser");
var mongodb = require("mongodb");
var ObjectID = mongodb.ObjectID;

const multer = require('multer');
const path = require('path');


var GOALS = "Goals"
var VISION="Vision"
var HABITS="Habits"
var POINTS="Points"
var STEPS="GoalSteps"
var HISTORY="History"
var NOTES="Notes"
var app = express();

//Used to by pass Chrome
const cors = require("cors");



app.use(bodyParser.json());

//Image file folders
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

//adding stoage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads');
    },
    filename: (req, file, cb) => {
        console.log(file);
        cb(null, "vision.png");
    }
});



// Create a database variable outside of the database connection callback to reuse the connection pool in your app.
var db;

// Connect to the database before starting the application server.
mongodb.MongoClient.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/Test", function (err, client) {
  if (err) {
    console.log(err);
    process.exit(1);
  }

  // Save database object from the callback for reuse.
  db = client.db();
  console.log("Database connection ready");

  // Initialize the app.
  var server = app.listen(process.env.PORT || 8888, function () {
    var port = server.address().port;
    console.log("App now running on port", port);
    console.log(server.address());	  
  });


  //used to bypass
  app.use(cors());







//GOALS********************************************************************************

// GET GOALS
app.get("/api/goals", function(req, res) {
  db.collection(GOALS).find({},{"_id":false}).toArray(function(err, docs) {
    if (err) {
      handleError(res, err.message, "Failed to get goals.");
    } else {
      res.status(200).json(docs);
    }
  });
});

//POST GOALS API
app.post("/api/goals/update", function(req, res) {
  var data = req.body;
  console.log(data);	
  var myquery = { _id: new ObjectID(data.id)}
  var newvalues = { $set: {  
                             goalType:data.goalType,
                             title:data.title,
                             time:data.time,
                             description:data.description,
                             measureable:data.measureable,
                             curNum:data.curNum,
                             endNum:data.endNum,
                             tags:data.tags,
                             dueDate:data.dueDate,
                             diffculty:data.diffculty                          
                           } };
  

db.collection(GOALS).updateOne(myquery, newvalues, function(err, res) {
    if (err) throw err;
    console.log("Goal document updated");
  });
});


//Update Goal
app.post("/api/goals", function(req, res) {
  var jsonData = req.body;

    db.collection(GOALS).insertOne(jsonData, function(err, doc) {
      if (err) {
        handleError(res, err.message, "Failed to create new goal.");
      } else {
        res.status(201).json("Goal Record Inserted "+ doc.ops[0]);
      }
    });

 });
//****************************NOTES************************************************************

//POST API NOTES
app.post("/api/goals/notes", function(req, res) {
  var jsonData = req.body;

    db.collection(NOTES).insertOne(jsonData, function(err, doc) {
      if (err) {
        handleError(res, err.message, "Failed to create new notes.");
      } else {
        res.status(201).json("Note Record Inserted "+ doc.ops[0]);
      }
    });

 });

//GET GOAL NOTE
app.get("/api/goals/notes", function(req, res) {
  db.collection(NOTES).find({},{"_id":false}).toArray(function(err, docs) {
    if (err) {
      handleError(res, err.message, "Failed to get notes.");
    } else {
      res.status(200).json(docs);
    }
  });
});





//***********************STEPS*********************************************************8

//POST STEPS API
app.post("/api/goals/steps", function(req, res) {
  var jsonData = req.body;

    db.collection(STEPS).insertOne(jsonData, function(err, doc) {
      if (err) {
        handleError(res, err.message, "Failed to create new steps.");
      } else {
        res.status(201).json("Step Record Inserted "+ doc.ops[0]);
      }
    });

 });

//STEPS API
app.get("/api/goals/steps", function(req, res) {
  db.collection(STEPS).find({},{"_id":false}).toArray(function(err, docs) {
    if (err) {
      handleError(res, err.message, "Failed to get steps.");
    } else {
      res.status(200).json(docs);
    }
  });
});


//STEPS UPDATE
app.post("/api/goals/steps/update", function(req, res) {
  var data = req.body;
  console.log(data);
  var myquery = {_id:new ObjectID(data.id)}
  var newvalues = { $set: {
                             check:data.check,
                           } };

 db.collection(STEPS).updateOne(myquery, newvalues, function(err, res) {
    if (err) throw err;
    console.log("step updated");
  });
});



//***********************VISION*******************************************

//GET VISION 
app.get("/api/vision", function(req, res) {
  db.collection(VISION).find({},{"_id":false}).toArray(function(err, docs) {
    if (err) {
      handleError(res, err.message, "Failed to get vision.");
    } else {
      res.status(200).json(docs);
    }
  });
});

//POST VISION
app.post("/api/vision", function(req, res) {
  var jsonData = req.body;

    db.collection(VISION).insertOne(jsonData, function(err, doc) {
      if (err) {
        handleError(res, err.message, "Failed to create new vision.");
      } else {
        res.status(201).json("Record Inserted "+ doc.ops[0]);
      }
    });

 });

//***************************************************************************

//GET HABITS
app.get("/api/habits", function(req, res) {
  db.collection(HABITS).find({},{"_id":false}).toArray(function(err, docs) {
    if (err) {
      handleError(res, err.message, "Failed to get habits.");
    } else {
      res.status(200).json(docs);
    }
  });
});

//POST HABITS
app.post("/api/habits", function(req, res) {
  var jsonData = req.body;

    db.collection(HABITS).insertOne(jsonData, function(err, doc) {
      if (err) {
        handleError(res, err.message, "Failed to create new habit.");
      } else {
        res.status(201).json("Habit Record Inserted "+ doc.ops[0]);
      }
    });

 });


//DELETE HABITS
app.post("/api/habits/delete", function(req, res) {
    var json = req.body;
    var myquery = { _id: new ObjectID(json.id)  }


   db.collection(HABITS).deleteOne(myquery,function(err, doc) {
      if (err) throw err;
	 console.log("Record Deleted");   
	    
    });

 });


//POINT ADDED TO HABIT
app.post("/api/habits/addPoint", function(req, res) {
  var json = req.body
  console.log(json.habitPoint);	
  var myquery = { _id: new ObjectID(json.objectId)  }
  var newvalues = { $set: {habitPoints:json.habitPoints } };
  db.collection(HABITS).updateOne(myquery, newvalues, function(err, res) {
    if (err) throw err;
    console.log("Habit document updated");
  });
});


//****************************Points********************************************************8

//POINT ADDED
app.post("/api/points", function(req, res) {
  var json = req.body;
  console.log(json);	
  var myquery = { _id: new ObjectID(json.objectId)  }
  var newvalues = { $set: {points:json.points } };
  db.collection(POINTS).updateOne(myquery, newvalues, function(err, res) {
    if (err) throw err;
    console.log("point added");
  });
});

//ADD 5 POINTS FOR TASK COMPLETION
app.post("/api/points/5", function(req, res) {
  var json = req.body;
  console.log(json);
  var myquery = { _id: new ObjectID(json.objectId)  }
  var newvalues = { $inc: {points:json.points } };
  db.collection(POINTS).updateOne(myquery, newvalues, function(err, res) {
    if (err) throw err;
    console.log("point added");
  });
});

//GET POINTS
app.get("/api/points", function(req, res) {
  db.collection(POINTS).find({},{"_id":false}).toArray(function(err, docs) {
    if (err) {
      handleError(res, err.message, "Failed to get contacts.");
    } else {
      res.status(200).json(docs);
    }
  });
});

//*************************Upload Vision Board******************************

//Used to store uploaded files
const upload = multer({ storage: storage });

app.post('/api/upload', upload.single('file'), (req, res, next) => {
    try {
        return res.status(201).json({
            message: 'File uploded successfully'
        });
    } catch (error) {
        console.error(error);
    }
});


//***********************HISTORY**********************************************

//POST HISTORY
app.post("/api/history", function(req, res) {
  var jsonData = req.body;

    db.collection(HISTORY).insertOne(jsonData, function(err, doc) {
      if (err) {
        handleError(res, err.message, "Failed to create new history.");
      } else {
        res.status(201).json("History Record Inserted "+ doc.ops[0]);
      }
    });

 });

//GET HISTORY
app.get("/api/history", function(req, res) {
  db.collection(HISTORY).find({},{"_id":false}).toArray(function(err, docs) {
    if (err) {
      handleError(res, err.message, "Failed to get history.");
    } else {
      res.status(200).json(docs);
    }
  });
});







//*************************************************************************


});
