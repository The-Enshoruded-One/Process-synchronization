let readers = 3;
let writers = 2;
let sharedData = 0;
let readerWriterIntervalIds = []; // To track intervals for cleanup
let currentReaders = 0; // Active readers count
let writerActive = false; // Flag to track if a writer is active

// Function to start the simulation for Reader-Writer problem
function startReaderWriter() {
    const area = document.getElementById("visualization-area");
    area.innerHTML = "<h2>Reader-Writer Simulation</h2>";  // Clear previous content

    // Create shared data display
    const sharedDataDiv = document.createElement("div");
    sharedDataDiv.id = "shared-data";
    sharedDataDiv.textContent = `Shared Data: ${sharedData}`;
    sharedDataDiv.className = "shared-data";
    area.appendChild(sharedDataDiv);

    // Create reader and writer containers
    const readersDiv = document.createElement("div");
    readersDiv.id = "readers";
    readersDiv.className = "readers-writers";
    area.appendChild(readersDiv);

    const writersDiv = document.createElement("div");
    writersDiv.id = "writers";
    writersDiv.className = "readers-writers";
    area.appendChild(writersDiv);

    // Start readers
    for (let i = 0; i < readers; i++) {
        const readerInterval = setInterval(() => {
            if (!writerActive) {
                currentReaders++;
                updateReaderWriterUI("Reader", i + 1, "reading");
                console.log(`Reader ${i + 1} is reading data: ${sharedData}`);
                setTimeout(() => {
                    currentReaders--;
                    updateReaderWriterUI("Reader", i + 1, "idle");
                }, 500); // Reading for 500ms
            } else {
                console.log(`Reader ${i + 1} is waiting (writer active)`);
            }
        }, 1000 + i * 200); // Staggered start for better visualization
        readerWriterIntervalIds.push(readerInterval);
    }

    // Start writers
    for (let i = 0; i < writers; i++) {
        const writerInterval = setInterval(() => {
            if (currentReaders === 0 && !writerActive) {
                writerActive = true;
                updateReaderWriterUI("Writer", i + 1, "writing");
                console.log(`Writer ${i + 1} is writing data: ${sharedData + 1}`);
                sharedData++;
                updateSharedData(sharedData);

                setTimeout(() => {
                    writerActive = false;
                    updateReaderWriterUI("Writer", i + 1, "idle");
                }, 1000); // Writing for 1 second
            } else {
                console.log(`Writer ${i + 1} is waiting (readers active or another writer writing)`);
            }
        }, 3000 + i * 500); // Staggered start for better visualization
        readerWriterIntervalIds.push(writerInterval);
    }
}

// Update reader or writer state in the UI
function updateReaderWriterUI(type, id, state) {
    const container = document.getElementById(type === "Reader" ? "readers" : "writers");
    let element = document.getElementById(`${type}-${id}`);

    if (!element) {
        // Create a new element if it doesn't exist
        element = document.createElement("div");
        element.id = `${type}-${id}`;
        element.className = "process";
        container.appendChild(element);
    }

    element.textContent = `${type} ${id} is ${state}`;
    element.style.backgroundColor = state === "reading" || state === "writing" ? "green" : "gray";
}

// Update shared data in the UI
function updateSharedData(data) {
    const sharedDataDiv = document.getElementById("shared-data");
    sharedDataDiv.textContent = `Shared Data: ${data}`;
}

// Reset Reader-Writer simulation
function resetReaderWriter() {
    // Clear all intervals
    readerWriterIntervalIds.forEach(clearInterval);
    readerWriterIntervalIds = [];
    writerActive = false;
    currentReaders = 0;
    sharedData = 0;

    // Clear the visualization area
    const area = document.getElementById("visualization-area");
    area.innerHTML = "<h2>Reader-Writer Simulation</h2>";

    // Clear process UI elements
    const readersDiv = document.getElementById("readers");
    const writersDiv = document.getElementById("writers");
    readersDiv.innerHTML = "";
    writersDiv.innerHTML = "";

    console.log("Reset Reader-Writer simulation.");
}
