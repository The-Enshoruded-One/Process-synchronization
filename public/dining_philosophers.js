let philosophers = 5;
let states = new Array(philosophers).fill("thinking"); // Thinking or Eating state
let philosopherIntervals = []; // To track intervals for cleanup
let forks = new Array(philosophers).fill(true); // True indicates the fork is available
let mutex = new Array(philosophers).fill(true); // Mutex array to ensure no deadlock

// Mutex for accessing forks (only one philosopher can use a fork at a time)
function pickUpFork(philosopherIndex) {
    let leftFork = philosopherIndex;
    let rightFork = (philosopherIndex + 1) % philosophers;

    // Ensure both forks are available and mutex is unlocked
    if (forks[leftFork] && forks[rightFork] && mutex[leftFork] && mutex[rightFork]) {
        forks[leftFork] = false; // Pick up left fork
        forks[rightFork] = false; // Pick up right fork
        mutex[leftFork] = false;  // Lock the left fork
        mutex[rightFork] = false; // Lock the right fork
        console.log(`Philosopher ${philosopherIndex + 1} picked up forks.`);
        return true;
    }
    return false; // Can't pick up both forks, philosopher has to wait
}

function putDownFork(philosopherIndex) {
    let leftFork = philosopherIndex;
    let rightFork = (philosopherIndex + 1) % philosophers;

    forks[leftFork] = true; // Put down left fork
    forks[rightFork] = true; // Put down right fork
    mutex[leftFork] = true;  // Unlock the left fork
    mutex[rightFork] = true; // Unlock the right fork
    console.log(`Philosopher ${philosopherIndex + 1} put down forks.`);
}

function startDiningPhilosophers() {
    const area = document.getElementById("visualization-area");
    area.innerHTML = "<h2>Dining Philosophers Simulation</h2>";

    // Create philosopher elements
    const table = document.createElement("div");
    table.className = "philosopher-table";
    area.appendChild(table);

    for (let i = 0; i < philosophers; i++) {
        const philosopherDiv = document.createElement("div");
        philosopherDiv.id = `philosopher-${i}`;
        philosopherDiv.className = "philosopher";
        philosopherDiv.textContent = `Philosopher ${i + 1}`;
        philosopherDiv.style.backgroundColor = "blue"; // Default: thinking
        table.appendChild(philosopherDiv);
    }

    // Start simulation
    for (let i = 0; i < philosophers; i++) {
        const interval = setInterval(() => {
            // Philosopher randomly changes state
            if (states[i] === "thinking") {
                // Try to pick up forks, otherwise continue thinking
                if (pickUpFork(i)) {
                    states[i] = "eating";
                    updateUI(i, states[i]);
                    console.log(`Philosopher ${i + 1} is eating.`);
                    setTimeout(() => {
                        putDownFork(i); // Philosopher finishes eating and puts down forks
                        states[i] = "thinking";
                        updateUI(i, states[i]);
                        console.log(`Philosopher ${i + 1} is thinking.`);
                    }, 2000); // Eating for 2 seconds
                } else {
                    console.log(`Philosopher ${i + 1} is waiting for forks.`);
                }
            }
        }, 1000); // Check every second

        philosopherIntervals.push(interval);
    }
}

function updateUI(index, state) {
    const philosopherDiv = document.getElementById(`philosopher-${index}`);
    philosopherDiv.style.backgroundColor = state === "eating" ? "green" : "blue";
    philosopherDiv.textContent = `Philosopher ${index + 1} is ${state}`;
}

function resetDiningPhilosophers() {
    // Clear intervals
    philosopherIntervals.forEach(clearInterval);
    philosopherIntervals = [];

    // Reset states and forks
    states = new Array(philosophers).fill("thinking");
    forks = new Array(philosophers).fill(true); // All forks are available
    mutex = new Array(philosophers).fill(true); // Reset mutex

    // Reset UI
    const area = document.getElementById("visualization-area");
    area.innerHTML = "<h2>Dining Philosophers Simulation</h2>";
    console.log("Reset Dining Philosophers simulation.");
}
