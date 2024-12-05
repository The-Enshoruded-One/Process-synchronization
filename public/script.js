let isRunning = false;
let currentProblem = "ProducerConsumer"; // Default problem
let readerWriterIntervalIds = []; // To track Reader-Writer intervals

// DOM Elements
const startButton = document.getElementById("start-btn");
const resetButton = document.getElementById("reset-btn");
const endButton = document.getElementById("end-btn");
const problemSelector = document.getElementById("problem");

// Handle problem selection
problemSelector.addEventListener("change", () => {
    resetSimulation();
    currentProblem = problemSelector.value;
    toggleEndButton(); // Show/Hide the End button based on the problem
});

// Handle Start button click
startButton.addEventListener("click", () => {
    if (!isRunning) {
        isRunning = true;
        startSimulation(currentProblem);
    }
});

// Handle Reset button click
resetButton.addEventListener("click", () => {
    resetSimulation();
});

// Handle End button click (specific to Reader-Writer)
endButton.addEventListener("click", () => {
    if (currentProblem === "ReaderWriter") {
        stopReaderWriterProcesses();
    }
});

// Toggle End button visibility based on the current problem
function toggleEndButton() {
    if (currentProblem === "ReaderWriter") {
        endButton.style.display = "inline-block";
    } else {
        endButton.style.display = "none";
    }
}

// Start Simulation based on selected problem
function startSimulation(problem) {
    if (problem === "ProducerConsumer") {
        startProducerConsumer();
    } else if (problem === "ReaderWriter") {
        startReaderWriter();
    } else if (problem === "DiningPhilosophers") {
        startDiningPhilosophers();
    }
}

// Reset Simulation
function resetSimulation() {
    isRunning = false;
    document.getElementById("visualization-area").innerHTML = ""; // Clear the area
    if (currentProblem === "ReaderWriter") {
        stopReaderWriterProcesses(); // Stop Reader-Writer processes if running
    } else if (currentProblem === "DiningPhilosophers") {
        resetDiningPhilosophers(); // Reset Dining Philosophers if running
    }
    console.log("Simulation Reset.");
}

// Stop all Reader-Writer processes
function stopReaderWriterProcesses() {
    readerWriterIntervalIds.forEach((id) => clearInterval(id));
    readerWriterIntervalIds = [];
    console.log("Stopped all Reader-Writer processes.");
}

// Add the other simulations such as startProducerConsumer, startDiningPhilosophers etc.

function startProducerConsumer() {
    // Producer-Consumer logic here
    console.log("Started Producer-Consumer simulation");
}

function startDiningPhilosophers() {
    // Dining Philosophers logic here
    console.log("Started Dining Philosophers simulation");
}

// Example of a reset function for Dining Philosophers
function resetDiningPhilosophers() {
    console.log("Dining Philosophers simulation reset.");
}
