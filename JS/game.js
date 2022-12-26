/*****  Global Variables    *****/

var buttonColors = ["red", "green", "yellow", "blue"];      // Array that holds pre-selected colors
var gamePattern = [];                                       // Empty Array that will hold the random game sequence
var userPattern = [];                                       // Empty Array that will hold the user pattern response to validate against the game sequence
var started = false;                                        // Boolean value to start or stop the game
var level = 0;                                              // Integer variable to hold the current level

/*****  Listeners   *****/

/* Remove ALL hover effects from the colored buttons when hovering. This should be done
in the css for the separation of concerns. But I implemented this way to show wider 
knowledge of jquery and DOM manipulation and shorten overall code. */
$(".color-button").hover(function() {
    $(this).css("background-color", $(this).attr("id")).css("border", "10px solid black");
});

// On-Click listener for all the colored buttons on game board
$(".color-button").on("click", function() {
    let userClick = $(this).attr("id");
    userPattern.push(userClick);
    animatePress(userClick);
    playSound(userClick);
    checkAnswer(userPattern.length - 1);
});

// On-Click listener for the start button. Sets title text and starts sequence
$(".start-button").on("click", function() {
    if (!started) {
        $("#level-title").text("Level - " + level);
        nextSequence();
        started = true;
        $(".start-button").text("Start!");
    }
});

/*****  Functions   *****/

// Function to animate the click from the user based on the argument passed
function animatePress(currColor) {
    $("#" + currColor).addClass("pressed");                                             // Add a css class
    setTimeout(() => {                                                                  // setTimeout function @ 100ms to remove css class
        $("#" + currColor).removeClass("pressed");
    }, 100);
}

// Function to check the user response to the gamePattern Array
function checkAnswer(currentLevel) {
    if (gamePattern[currentLevel] === userPattern[currentLevel]) {                      // Check if most recent answer is correct
        if (userPattern.length === gamePattern.length) {                                // Check if the userPattern is equal to the gamePattern Array
            setTimeout(() => {                                                          // 1000ms timeout before starting next sequence
                nextSequence();
            }, 1000);
        }
    } else {                                                                            // If userPattern is not correct
        playSound("wrong");                                                             // Play wrong sound object
        $("#level-title").text("Game Over, Try Again!");                                // Display game over in level-title
        $(".start-button").text("Restart!");                                            // Change start-buttons text to restart
        $("body").addClass("game-over");                                                // Add a css class to the body of website
        setTimeout(() => {                                                              // Use a timeout for the basic animation of game over screen
            $("body").removeClass("game-over");                                         // Remove css class to complete animation
        }, 200);
        startOver();                                                                    // Call the startOver() function
    }
}

// Function to play the random sequence back to player using an interval object at 600ms.
function playSequence() {
    let seqIndex = 0;                                                                   // Intialize and Preserve index outside of interval function
    let seqInterval = setInterval(() => {                                               // Declare Interval and set helper function
        if (seqIndex >= gamePattern.length) {                                           // Make sure the sequence index isn't larger than the gamePattern
            clearInterval(seqInterval);                                                 // Clear and Stop interval if the index is larger than gamePattern
            seqIndex = 0;                                                               // Reset the index
        } else {
            playSound(gamePattern[seqIndex]);                                           // Play sound based on the index
            $("#" + gamePattern[seqIndex]).fadeIn(100).fadeOut(100).fadeIn(100);        // Basic flash animation as sequence plays
            seqIndex++;                                                                 // Increase index
        }        
    }, 600);    
}

// Helper function that creates a new Audio Object based on argument and then plays that sound
function playSound(name) {
    let buttonSound = new Audio("sounds/" + name + ".mp3");
    buttonSound.play();
}

// Function that generates, stores and displays the gamePattern sequence to the user
function nextSequence() {
    userPattern = [];                                                                   // Clear userPattern before each sequence
    level++;                                                                            // Increase level by 1
    $("#level-title").text("Level - " + level);
    /* Generate a random number, floor that number and then multiply it by 4 to return a
    number between 0 - 3. Finally input that number as the index for the buttonColors
    array, and add that random color to the end of the gamePattern Array. */
    gamePattern.push(buttonColors[Math.floor(Math.random() * 4)]);
    playSequence();                                                                     // Play the new Sequence back to the user
}

// Function to reset game and all progress
function startOver() {
    level = 0;                                                                          // Reset Level
    gamePattern= [];                                                                    // Clear gamePattern Array
    started = false;                                                                    // Return boolean to false
}