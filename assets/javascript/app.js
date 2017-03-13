// Initialize Firebase
var config = {
    apiKey: "AIzaSyCEIoMxxvBncLKQwM7M16V23_z9I-dVB_M",
    authDomain: "train-scheduler-101fb.firebaseapp.com",
    databaseURL: "https://train-scheduler-101fb.firebaseio.com",
    storageBucket: "train-scheduler-101fb.appspot.com",
    messagingSenderId: "994668127097"
};
firebase.initializeApp(config);


// Create a variable to reference the database.
var database = firebase.database();

// Initial Values
var interval = "";
var currentTime = "";
var name = "";
var destination = "";
var firstArrival = "";
var frequency = "";
var minAway = "";
var arrivalTime = "";
var count = "";
var rows = [""];

// Capture Button Click
$("#submit-btn").on("click", function(event) {
    event.preventDefault();

    // Grabbed values from text boxes
    name = $("#name-input").val().trim();
    destination = $("#destination-input").val().trim();
    firstArrival = $("#firstArrival-input").val().trim();
    frequency = $("#frequency-input").val().trim();
    // clear values from text boxes
    $("#name-input").val("");
    $("#destination-input").val("");
    $("#firstArrival-input").val("");
    $("#frequency-input").val("");

    // Code for handling the push
    database.ref().push({
        name: name,
        destination: destination,
        firstArrival: firstArrival,
        frequency: frequency,


    });
    updateHTML();
});

$(document).on("click", ".delete", deleteTrain);

function deleteTrain() {
    var deleteKey = $(this).attr("id");
    console.log($(this).attr("id"));
    database.ref().child(deleteKey).remove();

    updateHTML();

}

database.ref().once("value", function(snapshot) {
    clock();
    updateHTML();
    // // Handle the errors
}, function(errorObject) {
    console.log("Errors handled: " + errorObject.code);
});


function setHTML() {
    time();
    $(".jumbotron h1").html(currentTime);

    var row = $("<tr>").attr("data-key", key);
    row.append($("<td>" + name + "</td>"))
        .append($("<td>" + destination + "</td>"))
        .append($("<td>" + frequency + "</td>"))
        .append($("<td>" + arrivalTime + "</td>"))
        .append($("<td>" + minAway + "</td>"))
        .append($('<button type="button" class="btn btn-warning btn-xs delete" id="' + key + '">Delete</button>'));

    rows.push(row);
}

function updateHTML() {
    $("tbody").empty();
    database.ref().once("value", function(snapshot) {
            snapshot.forEach(function(childSnapshot) {
                var childKey = childSnapshot.key;
                var childData = childSnapshot.val();
                name = (childData.name);
                destination = (childData.destination);
                firstArrival = (childData.firstArrival);
                frequency = (childData.frequency);
                key = (childKey);
                // Console.loging the last user's data
                console.log(childData);
                // Change the HTML to reflect
                setHTML();

            });
            $("tbody").append(rows);
            rows = [""];
        },
        // Handle the errors
        function(errorObject) {
            console.log("Errors handled: " + errorObject.code);
        });
}


function time() {
    // Current Time
    currentTime = moment().format("hh:mm");
    console.log("CURRENT TIME:  " + currentTime);
    // First Time (pushed back 1 year to make sure it comes before current time)
    var firstArrivalConverted = moment(firstArrival, "hh:mm").subtract(1, "years");
    // Difference between the times
    var diffTime = moment().diff(moment(firstArrivalConverted, "hh:mm"), "minutes");
    // Time apart (remainder)
    var tRemainder = diffTime % frequency;
    // Minute Until Train
    minAway = frequency - tRemainder;
    console.log("MINUTES TILL TRAIN: " + minAway);
    // Next Train
    arrivalTime = moment().add(minAway, "minutes").format("hh:mm");
    console.log("ARRIVAL TIME: " + arrivalTime);
}

function clock() {
    interval = setInterval(function() {
        updateHTML();
    }, 60000);
}
