async function readTodoList() {
    return fetch('https://plant-web-service.onrender.com/api/plants')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log(data);
        return data;
      })
      .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
      });
  }
  
  async function displayFirstPlantCommonName() {
    let plantdata = await readTodoList();
  
    // Check if plantdata is an array and has at least one element
    if (Array.isArray(plantdata) && plantdata.length > 0) {
      let firstPlant = plantdata[0];
      let commonName = firstPlant.common_name;
  
      let title = document.createElement('span');
      title.innerHTML = commonName;
  
      let body = document.querySelector('body');
      body.appendChild(title);
    } else {
      console.error('No plant data available or plantdata is not an array');
    }
  }
  
  // Call the function to display the first plant's common name
  displayFirstPlantCommonName();