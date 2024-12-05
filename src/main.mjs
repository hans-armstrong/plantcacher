import { user, plants, plantList } from "./state.mjs";


document.addEventListener("DOMContentLoaded", async () => {
    console.log(plants)
    console.log("plantList", plantList)
    const gallery = document.getElementById("plantsDOM");
    const plantsToShow = (plants && plants.length > 0) ? plants.slice(0, 20) : [];

    plantsToShow.forEach(plant => {
        console.log("plant", plant)
        const plantDiv = document.createElement("div");
        plantDiv.classList.add("plant");

        const plantName = document.createElement("h3");
        plantName.textContent = plant.common_name;
        plantDiv.appendChild(plantName);

        const plantImage = document.createElement("img");
        plantImage.src = plant.image_url;
        plantDiv.appendChild(plantImage);

        const moreInfoButton = document.createElement("button");
        moreInfoButton.textContent = "More Information";
        moreInfoButton.onclick = () => {
            window.location.href = `plantdetails.html?plantId=${plant.plant_id}`;
        };
        plantDiv.appendChild(moreInfoButton);

        gallery.appendChild(plantDiv);
    });

    // Add pagination logic here if needed
});


