let buffer = []; 
let bufferSize = 5; // Default size of the buffer 
let producerInterval, consumerInterval;
let updateDelay = 300; // Delay in ms for each buffer update

// Start Producer-Consumer Simulation
function startProducerConsumer() {
    const area = document.getElementById("visualization-area");
    area.innerHTML = "<h2>Producer-Consumer Simulation</h2>";
    
    // Create the buffer display
    const bufferDiv = document.createElement("div");
    bufferDiv.id = "buffer-display";
    bufferDiv.style.display = "flex";
    bufferDiv.style.gap = "10px";
    bufferDiv.style.margin = "20px 0";
    area.appendChild(bufferDiv);
    
    // Log area
    const logDiv = document.createElement("div");
    logDiv.id = "log-display";
    logDiv.style.marginTop = "20px";
    area.appendChild(logDiv);
    
    updateBufferDisplay();
    updateLogDisplay("Simulation started...");
    
    // Start producer process
    producerInterval = setInterval(() => {
        if (buffer.length < bufferSize) {
            // Delay producer actions
            setTimeout(() => {
                buffer.push("item");
                updateLogDisplay("Producer: Added an item to buffer.");
                updateBufferDisplay();
            }, updateDelay);
        } else {
            // Delay full buffer message
            setTimeout(() => {
                updateLogDisplay("Producer: Buffer is FULL. Waiting...");
            }, updateDelay);
        }
    }, 2000);
    
    // Start consumer process
    consumerInterval = setInterval(() => {
        if (buffer.length > 0) {
            // Delay consumer actions
            setTimeout(() => {
                buffer.shift();
                updateLogDisplay("Consumer: Removed an item from buffer.");
                updateBufferDisplay();
            }, updateDelay);
        } else {
            // Delay empty buffer message
            setTimeout(() => {
                updateLogDisplay("Consumer: Buffer is EMPTY. Waiting...");
            }, updateDelay);
        }
    }, 4000);
}

// Update Buffer Display with Delay
function updateBufferDisplay() {
    const bufferDiv = document.getElementById("buffer-display");
    bufferDiv.innerHTML = ""; // Clear the display
    
    // Loop through buffer and update each slot with a delay
    for (let i = 0; i < bufferSize; i++) {
        const slot = document.createElement("div");
        slot.style.width = "50px";
        slot.style.height = "50px";
        slot.style.border = "1px solid #333";
        slot.style.display = "flex";
        slot.style.alignItems = "center";
        slot.style.justifyContent = "center";
        slot.style.backgroundColor = buffer[i] ? "green" : "lightgray";
        slot.textContent = buffer[i] ? "Item" : "";
        bufferDiv.appendChild(slot);
    }
}

// Update Log Display with Delay
function updateLogDisplay(message) {
    const logDiv = document.getElementById("log-display");
    const logMessage = document.createElement("div");
    logMessage.textContent = `${new Date().toLocaleTimeString()}: ${message}`;
    logDiv.appendChild(logMessage);
    logDiv.scrollTop = logDiv.scrollHeight; // Auto-scroll to latest log
}

// Reset Producer-Consumer Simulation
function resetProducerConsumer() {
    clearInterval(producerInterval);
    clearInterval(consumerInterval);
    buffer = [];
    const area = document.getElementById("visualization-area");
    area.innerHTML = "<h2>Producer-Consumer Simulation</h2>";
    updateBufferDisplay();
    console.log("Reset Producer-Consumer simulation.");
}
