// Initialize Firebase
var config = {
  apiKey: "AIzaSyCtUO2nxHwJxvG-BThYwMYUOdVttnU-_ys",
  authDomain: "train-schedule-homework-a28c1.firebaseapp.com",
  databaseURL: "https://train-schedule-homework-a28c1.firebaseio.com",
  projectId: "train-schedule-homework-a28c1",
  storageBucket: "train-schedule-homework-a28c1.appspot.com",
  messagingSenderId: "1082550532769"
};
firebase.initializeApp(config);
const database = firebase.database();

/** Updates Table in on the webpage to display database information 
 * @param {object} train - a single train object
 */
function displayData(train) {
  var startTime = moment(train.start, "HH:mm");
  startTime = startTime.subtract(1, "years");

  var frequency = parseInt(train.frequency);
  var diffTime = moment().diff(startTime, "minutes");
  // number of minutes in a year to correct for sub(1 year)
  diffTime = diffTime % 525600;
  // difference of current time from next train arriving based on frequency interval
  var minAway = diffTime % frequency;
  minAway = frequency - minAway;
  // add minutes away from next arrival interval to the current moment
  var nextArrival = moment().add(minAway, "minute");
  // format nextArrival time to desired time format
  nextArrival = nextArrival.format("hh:mm a");

  var tableRow = $("<tr>").append(
    $("<td>").text(train.name),
    $("<td>").text(train.destination),
    $("<td>").text(frequency),
    $("<td>").text(nextArrival),
    $("<td>").text(minAway)
  );
  $("#table-body").append(tableRow);
}

// When submit is clicked
$("#submit-btn").on("click", function() {
  console.log("submitted");
  // push form data to database
  var nameInput = $("#train-name-input");
  var destinationInput = $("#destination-input");
  var startInput = $("#start-input");
  var frequencyInput = $("#frequency-input");
  var red = "rgb(255, 0, 0, 0.5)"
  if (nameInput.val() == "") {
    nameInput.css("background-color", red);
  } else if (destinationInput.val() == "") {
    destinationInput.css("background-color", red);
  } else if (startInput.val() == "") {
    startInput.css("background-color", red);
  } else if (frequencyInput.val() == "") {
    frequencyInput.css("background-color", red);
  } else {
    database.ref("train").push({
      "name": nameInput.val(),
      "destination": destinationInput.val(),
      "start": startInput.val(),
      "frequency": frequencyInput.val(),
    }, function(error) {
      if (error)
        console.log("error saving data");
      else
        console.log("data added successfully");
    });
  }
});

// On child_added, update table with DB information
database.ref().on("child_added", function(childSnapshot) {
  console.log("child added");
  childSnapshot.forEach(function(trains) {
    displayData(trains.val());
  });
});