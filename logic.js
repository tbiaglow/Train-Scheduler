// Initialize Firebase
var firebaseConfig = {
  apiKey: "AIzaSyBJ1llofwDgVsXSIwG5YUTqFbxqbj7tPBk",
  authDomain: "clickcounter2-2a1e7.firebaseapp.com",
  databaseURL: "https://clickcounter2-2a1e7.firebaseio.com",
  projectId: "clickcounter2-2a1e7",
  storageBucket: "clickcounter2-2a1e7.appspot.com",
  messagingSenderId: "194836924941",
  appId: "1:194836924941:web:f850ce3c659d67bd"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
  
  var database = firebase.database();
  
  // Button for adding trains
  $("#add-train-btn").on("click", function(event) {
    event.preventDefault();
  
    // Grabs user input
    var trainName = $("#train-name-input").val().trim();
    var trainDest = $("#destination-input").val().trim();
    var firstTime = moment($("#start-input").val().trim(), "HH:mm").format("X");
    var trainFreq = $("#rate-input").val().trim();
  
    // Creates local "temporary" object for holding train data
    var newTrain = {
      name: trainName,
      destination: trainDest,
      start: firstTime,
      rate: trainFreq
    };
  
    // Uploads train data to the database
    database.ref().push(newTrain);
  
    // Logs everything to console
    console.log(newTrain.name);
    console.log(newTrain.destination);
    console.log(newTrain.start);
    console.log(newTrain.rate);
  
    alert("Train successfully added");
  
    // Clears all of the text-boxes
    $("#train-name-input").val("");
    $("#destination-input").val("");
    $("#start-input").val("");
    $("#rate-input").val("");
  });
  
  // Create Firebase event for adding train to the database and a row in the html when a user adds an entry
  database.ref().on("child_added", function(childSnapshot) {
    console.log(childSnapshot.val());
  
    // Store everything into a variable.
    var trainName = childSnapshot.val().name;
    var trainDest = childSnapshot.val().destination;
    var firstTime = childSnapshot.val().start;
    var trainFreq = childSnapshot.val().rate;
  
    // Train Info
    console.log(trainName);
    console.log(trainDest);
    console.log(firstTime);
    console.log(trainFreq);

  
    // Calculate next arrival
    var today = new Date();
    todayHours = today.getHours();
    if (todayHours.length < 2) {
      todayHours = 0 + todayHours;
    }
    todayMinutes = today.getMinutes();
    if (todayMinutes.length < 2) {
      todayMinutes = 0 + todayMinutes;
    }

    todayHours = Number(todayHours);
    todayMinutes = Number(todayMinutes);
    totalTodayMinutes = todayHours * 60 + todayMinutes;

    startHours = Number(firstTime.charAt(0) + firstTime.charAt(1));
    startMinutes = Number(firstTime.charAt(3) + firstTime.charAt(4));
    totalStartMinutes = startHours * 60 + startMinutes;
    
    minutesAway = trainFreq - ((totalTodayMinutes - totalStartMinutes) % trainFreq);

    nextArrivalHours = Number(today.getHours());
    nextArrivalMinutes = Number(today.getMinutes()) + minutesAway;
    if (nextArrivalMinutes > 60) {
      nextArrivalMinutes -= 60;
      nextArrivalHours += 1;
    }
    nextArrival = nextArrivalHours.toString() + ":" + nextArrivalMinutes.toString();

    console.log(minutesAway)
    console.log(nextArrival)
    
    // Create the new row
    var newRow = $("<tr>").append(
      $("<td>").text(trainName),
      $("<td>").text(trainDest),
      $("<td>").text(trainFreq),
      $("<td>").text(nextArrival),
      $("<td>").text(minutesAway),
    );
  
    // Append the new row to the table
    $("#train-table > tbody").append(newRow);
  });
  

  