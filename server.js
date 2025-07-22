// Import the required modules //
const express = require("express");
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

// Create an instance of an Express application //
const app = express();

// Define the port the server will listen on //
const port = process.env.PORT || 3002;

// Middleware to parse incoming JSON requests //
app.use(express.json());

// Define the path to the JSON file //
const dataFilePath = path.join(__dirname, "data.json");

// Function to read data from the JSON file //
const readData = () => {
  // Create an if statement to confirm the file exists //
  if (!fs.existsSync(dataFilePath)) {
    return [];
  }
  // Assign a variable to read the data within the file //
  const data = fs.readFileSync(dataFilePath);
  // Convert the data into usable javascript //
  return JSON.parse(data);
};

// Function to write data to the JSON file
const writeData = (data) => {
// Create an action to write the data as a string //
  fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
};

// Serve static files from the 'public' directory //
app.use(express.static(path.join(__dirname, "public")));

// Handle a GET request at the root route //
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.htm"));
});

// Handle a GET request to identify/read data in the file //
app.get("/data", (req, res) => {
  // Assign variable to reading data action //
  const data = readData();
  res.json(data);
});

// Handle a POST request to save new data with a unique ID
app.post("/data", (req, res) => {
  // Assign a variable to creating new data with an id //
  const newData = { id: uuidv4(), ...req.body };
  // Assign a variable to reading data action //
  const currentData = readData();
  // Create an action of adding the new data to the file //
  currentData.push(newData);
  writeData(currentData);
  // Create a response to confirm the process was successful //
  res.json({ message: "Data saved successfully", data: newData });
});

// Handle GET request to retrieve data by ID //
app.get("/data/:id", (req, res) => {
  // Identify/read the data //
  const data = readData();
  // Assign a variable to locate specific data by id //
  const item = data.find((item) => item.id === req.params.id);
  // Create an if statement to catch an error if the data does not exist //
  if (!item) {
    return res.status(404).json({ message: "Data not found" });
  }
  // If data exists, return it in json format //
  res.json(item);
});

// Handle a PUT request to update data by ID //
app.put("/data/:id", (req, res) => {
  // Identify specific data by id //
  const data = readData();
  const index = data.findIndex((item) => item.id === req.params.id);
  // Create an if statement to catch an error if the data does not exist //
  if (index === -1) {
  return res.status (404).json({ message: "Data not found" });
  }
  // Create a variable for the specific data identified //
  data[index] = {...data[index], ...req.body };
  // Overwrite data with new input // 
  writeData (data);
  // Create a response to confirm the process was successful //
  res. json({ message: "Data updated successfully", data: data[index] });
});

// Handle DELETE request to delete data by ID //
app.delete("/data/:id", (req, res) => {
// Identify specific data by id //
const data = readData();
const item = data.findIndex((item) => item.id === req.params.id);
// Create an if statement to catch an error if the data does not exist //
if (!item === -1) {
return res.status(404).json({ message: "Data not found" });
}
// Assign a variable to the data the user wants to delete //
const index = data.indexOf(item);
// Delete the data //
data.splice(index, 1); 
writeData (data);
// Create a response to confirm the process was successful // 
res.json(({ message: "Item deleted successfully", data: item }));
});

// Handle a POST request at the /echo route //
app.post("/echo", (req, res) => {
  // Respond with the same data that was received in the request body //
  res.json({ received: req.body });
});

// Wildcard route to handle undefined routes //
app.all("*", (req, res) => {
  res.status(404).send("Route not found");
});

// Start the server and listen on the specified port //
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

