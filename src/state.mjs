import { generateRandomId } from './utils/functions.mjs';



let user = {}


function checkUserInLocalStorage() {
  const user = localStorage.getItem('user');
  if (!user) {
    getUserIpAddress();
  } else {
    console.log('User found in localStorage:', JSON.parse(user));
  }
}

async function getUserIpAddress() {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    user = {
      first_name: "John",
      last_name: "Doe",
      ip: data.ip,
      points: '0',
      user_id: generateRandomId()
    };
    localStorage.setItem('user', JSON.stringify(user));
    console.log('User saved to localStorage:', user);
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
  }
}

checkUserInLocalStorage();

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
  
  
  // Call the function to display the first plant's common name
readTodoList();