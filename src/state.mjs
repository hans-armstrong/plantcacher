import { generateRandomId } from "./utils/functions.mjs";

export let user = '';
export let plants = [];
export let plantList = [];
export let plantLog = [];

async function checkUserInLocalStorage() {
  user = JSON.parse(localStorage.getItem('user'));
  let userIP = await getUserIpAddress();
  // console.log(`?ip=${userIP}`);
  if (user === null || user === undefined || user === '') {
    try {
      const response = await readUser(`ip=${userIP}`);
      if (response) {
        user = response;
        localStorage.setItem("user", JSON.stringify(user));
        console.log(JSON.parse(localStorage.getItem('user')), "user from database");
      } else {
        let userObject = {
          user_id: generateRandomId(),
          ip: userIP,
          first_name: "",
          last_name: "",
          points: "0",
        };
        localStorage.setItem("user", JSON.stringify(userObject));
        await sendUserToApi(userObject);
        user = userObject;
      }
    } catch (error) {
      console.error("There was a problem with the user fetch operation:", error);
    }
  }
  return user;
}

async function getUserIpAddress() {
  try {
    const response = await fetch("https://api.ipify.org?format=json");
    const data = await response.json();
    return data.ip;
  } catch (error) {
    console.error("There was a problem with the fetch operation:", error);
  }
}

async function sendUserToApi(user) {
  try {
    const response = await fetch("https://plant-web-service.onrender.com/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(user),
    });
    console.log(response, 'user post response')
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    console.log("User sent to API:", data);
  } catch (error) {
    console.error("There was a problem with the fetch operation:", error);
  }
}

async function readUser(param) {
  try {
    const response = await fetch(`https://plant-web-service.onrender.com/api/user?${param}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      }
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("There was a problem with the fetch operation:", error);
  }
}

async function readPlants() {
  return fetch("https://plant-web-service.onrender.com/api/plants")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .catch((error) => {
      console.error("There was a problem with the fetch operation:", error);
    });
}

async function readPlantList() {
  try {
    const response = await fetch(`https://plant-web-service.onrender.com/api/plant_list?user_id=${user.user_id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      }
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("There was a problem with the fetch operation:", error);
  }
}

async function readPlantLog() {
  try {
    const response = await fetch(`https://plant-web-service.onrender.com/api/plant_log?user_id=${user.user_id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      }
    });
    console.log(response)
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    console.log("User log fetched:", data);
    return data;
  } catch (error) {
    console.error("There was a problem with the fetch operation:", error);
  }
}

let pointsDOM = document.getElementById('pointsDOM');

export default async function initialize() {
  // user = await checkUserInLocalStorage();
  user =  {
    user_id: generateRandomId(),
    ip: await getUserIpAddress(),
    first_name: "",
    last_name: "",
    points: "0",
  }
  if (user) {
    user = await userPOST(user)
    pointsDOM.innerText = user.points;
  }
  let plantsUnfiltered = await readPlants();
  plantList = await readPlantList();
  plantLog = await readPlantLog();
  if (!Array.isArray(plantList)) {
    plantList = [];
  }
  const plantListIds = plantList.map(listedPlant => listedPlant.plant_id);
  plants = plantsUnfiltered.filter(plant => 
    !plantListIds.includes(plant.plant_id)
  );
  return { user, plants, plantList, plantLog, pointsDOM };
}

initialize().then(({ user, plants, plantList, plantLog, pointsDOM }) => {
  // Further actions after initialization if needed
});

export let userPOST = async (user) => {
  try {
      // First try-catch for GET request
      try {
          const getResponse = await fetch(`https://plant-web-service.onrender.com/api/user?ip=${user.ip}`, {
              method: "GET",
              headers: {
                  "Content-Type": "application/json",
              }
          });
          
          if (!getResponse.ok) {
              throw new Error("GET request failed");
          }
          
          const getData = await getResponse.json();
          localStorage.setItem('user', getData[0])
          return getData[0];
          
      } catch (getError) {
          console.error("GET request failed:", getError);
          
          // Second try-catch for POST request (only if GET fails)
          try {
              const postResponse = await fetch("https://plant-web-service.onrender.com/api/users", {
                  method: "POST",
                  headers: {
                      "Content-Type": "application/json",
                      "Accept": "application/json"
                  },
                  body: JSON.stringify(user),
              });
              
              if (!postResponse.ok) {
                  throw new Error("POST request failed");
              }
              
              const postData = await postResponse.json();
              console.log("User sent to API:", postData);
              return postData;
              
          } catch (postError) {
              console.error("POST request failed:", postError);
              throw postError; // Re-throw to be caught by outer catch
          }
      }
  } catch (error) {
      console.error("Operation failed:", error);
      throw error; // Re-throw if needed by calling code
  }
};