function showAnswer() {
    // Look for element labeled answer
    var answer = document.getElementById("answer");
    var showButton = document.getElementById("showButton")
    
    // If hidden, show it
    if (answer.style.visibility === "visible") {
        showButton.textContent = "Show Answer?";
        answer.style.visibility = "hidden";
    // If visible, hide it
    } else {
        showButton.textContent = "Hide Answer?";
        answer.style.visibility = "visible";
    }
}

function newQuestion() {
    // Fetch new question from flask
    fetch("/new-question")
    .then(response => response.json())
    .then(data => {
        // Update all accordingly
        document.getElementById("clue").textContent = data.clue;
        document.getElementById('answer').textContent = data.answer;
        document.getElementById("showButton").textContent = "Show Answer?"
        document.getElementById("answer").style.visibility = "hidden";
    });
}