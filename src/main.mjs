import initialize from "./state.mjs";

document.addEventListener("DOMContentLoaded", async () => {
    let { user, plants, plantList } = await initialize();
    // console.log(plants);
    // console.log("plantList", plantList);

    const gallery = document.getElementById("plantsDOM");
    const itemsPerPage = 20;
    let currentPage = 1;

    const renderPage = (page) => {
        gallery.innerHTML = ""; 
        const start = (page - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        const plantsToShow = plants.slice(start, end);
        let firstPlant = plantsToShow[0]
        console.log(firstPlant)

        plantsToShow.forEach(plant => {
            // console.log("plant", plant);
            const plantDiv = document.createElement("div");
            plantDiv.classList.add("plant");

            const plantName = document.createElement("h3");
            plantName.textContent = plant.common_name;
            plantDiv.appendChild(plantName);

            const plantImage = document.createElement("img");
            plantImage.src = plant.thumbnail_image_url;
            plantImage.classList = "max-w-64"
            if (plant.plant_id === firstPlant.plant_id) {
                plantImage.classList = "max-w-[100%]"
            }
            plantDiv.appendChild(plantImage);

            const moreInfoButton = document.createElement("button");
            moreInfoButton.textContent = "More Information";
            moreInfoButton.onclick = () => {
                window.location.href = `plantdetails.html?plantId=${plant.plant_id}`;
            };
            plantDiv.appendChild(moreInfoButton);

            gallery.appendChild(plantDiv);
        });
    };

    const createPaginationButtons = () => {
        const pagination = document.getElementById("pagination");
        pagination.innerHTML = ""; // Clear existing buttons

        const totalPages = Math.ceil(plants.length / itemsPerPage);

        for (let i = 1; i <= totalPages; i++) {
            const button = document.createElement("button");
            button.textContent = i;
            button.onclick = () => {
                currentPage = i;
                renderPage(currentPage);
            };
            pagination.appendChild(button);
        }
    };

    renderPage(currentPage);
    createPaginationButtons();
});

