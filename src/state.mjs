import { generateRandomId } from "./utils/functions.mjs";

export let user = '';
export let plants = [];
export let plantList = [];

async function checkUserInLocalStorage() {
  user = JSON.parse(localStorage.getItem("user"));
  if (user === null || user === undefined || user === '') {
    let userObject = {
      user_id: generateRandomId(),
      ip: await getUserIpAddress(),
      first_name: "",
      last_name: "",
      points: "0",
    };
    localStorage.setItem("user", JSON.stringify(userObject));
    await sendUserToApi(userObject);
    return userObject;
  } else {
    user = await readUser()
    console.log(user, "final")
    return user;
  }
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
      },
      body: JSON.stringify(user),
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    console.log("User sent to API:", data);
  } catch (error) {
    console.error("There was a problem with the fetch operation:", error);
  }
}


async function readUser() {
  try {
    const response = await fetch(`https://plant-web-service.onrender.com/api/user?user_id=${user.user_id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      }
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    console.log("User data fetched:", data);
    return data
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
    console.log("User list fetched:", data);
    return data;
  } catch (error) {
    console.error("There was a problem with the fetch operation:", error);
  }
}

export default async function initialize() {
  user = await checkUserInLocalStorage();
  let plantsUnfiltered = await readPlants();
  plantList = await readPlantList();
  plants = plantsUnfiltered.filter(plant => 
    !plantList.some(listedPlant => listedPlant.plant_id === plant.plant_id)
  );
  console.log(user, plants, plantList)
  return { user, plants, plantList }
}

// document.addEventListener("DOMContentLoaded", async () => {
//   await initialize();
// });