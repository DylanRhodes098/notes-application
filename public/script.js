document.addEventListener("DOMContentLoaded", () => {
  const dataList = document.getElementById("data-list");
  const dataForm = document.getElementById("data-form");
  const dataInput = document.getElementById("data-input");

  // Create a function to fetch data from the data.json file //
  const fetchData = async () => {
    // Initiate the request //
    try {
      // Triggers a get request to fetch data from data.json file //
      const response = await fetch("/data");
      // Converts data into usable javascript //
      const data = await response.json();

      // Clear the old list before loading the page (so that it doesn't repeat the list) //
      dataList.innerHTML = ""; 
      // Loops through each item, pasting each item in a list displayed as a string //
      data.forEach((item) => {
        const li = document.createElement("li")
        li.textContent = `${item.text}`;
        li.className = "item"
        dataList.appendChild(li);

        // Create an edit field for each note //
        const editField = document.createElement("input");
        editField.className = "input"
        dataList.appendChild(editField);

        // Create an edit button for each edit field //
        const editButton = document.createElement("button");
        editButton.textContent = "Edit";
        dataList.appendChild(editButton);

        // Create a click event for editing notes //
        editButton.addEventListener("click", async () => {
        // Create a variable for the edit field  //
        const editedData = { text: editField.value };

    // Initiate the request //
    try {
      // Triggers a http request to fetch the specific data from data.json file using id //
      const response = await fetch(`/data/${item.id}`, {
        // Asign the request as a put request //
        method: "PUT",
        // Format the data as json //
        headers: { 
          "Content-Type": "application/json" 
        },
        // Input the content to be sent to the data.json file //
        body: JSON.stringify(editedData),
      });

          // Create an if statment to confirm the request was successful //
            if (response.ok) {
          // Create commnands to... //
          // Clear the input field once a note has been added //
              dataInput.value = ""; 
          // Retrieve the new data in the data.json file //
              fetchData(); 
            }
          // Print an error if the request was unsuccessful //
          } catch (error) {
            console.error("Error");
          }
        });
     
        // Create a delete button for each edit field //
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        dataList.appendChild(deleteButton);

          // Create an event listener when the delete button is clicked //
        deleteButton.addEventListener("click", async () => {
          // Initiate the request //
          try {
          // Triggers a http request to fetch the specific data from data.json file using id //
            const response = await fetch(`/data/${item.id}`, {
          // assign the request as a delete request //
             method: "DELETE",
            });
          // Create an if statment to confirm the request was successful //
            if (response.ok) {
          // Create commnands to... //
          // Remove the text from the list //
              li.remove();
          // Remove the delete button from the list //
              deleteButton.remove()
          // Remove the edit button from the list //
              editButton.remove()
          // Remove the edit field from the list //
              editField.remove() 
            }
          // Print an error if the request was unsuccessful //
          } catch (error) {
            console.error("Error");
          }
            });
      });
    // Print an error if the request was unsuccessful //
    } catch (error) {
      console.error("Error");
    }
  };

  // Handle form submission to add new data //
  dataForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const newData = { text: dataInput.value };
    // Initiate the request //
    try {
      // Fetch a http request to the data.json file //
      const response = await fetch("/data", {
      // Define as a POST request //
        method: "POST",
      // Format the data as json //
        headers: { 
          "Content-Type": "application/json" 
        },
      // Input the content to be sent to the data.json file //
        body: JSON.stringify(newData),
      });
      // Create an if statment to confirm the request was successful //
      if (response.ok) {
      // Create commnands to... //
        // Clear the input field once a note has been added //
        dataInput.value = ""; 
        // Retrieve the new data in the data.json file //
        fetchData(); 
      }
    // Print an error if the request was unsuccessful //
    } catch (error) {
      console.error("Error adding data:", error);
    }
  });

  // Fetch data on page load
  fetchData();
});


