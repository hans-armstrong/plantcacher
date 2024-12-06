import initialize from "./state.mjs";
import './style.css'

document.addEventListener("DOMContentLoaded", async () => {
    let { user, plants, plantList } = await initialize();
    console.log(user, 'user');
    // console.log("plantList", plantList);

    const gallery = document.getElementById("plantsDOM");
    const itemsPerPage = 20;
    let currentPage = 1;

    const renderPage = (page) => {
        // const cachedPage = localStorage.getItem(`plantsPage_${page}`);
        // if (cachedPage) {
        //     gallery.innerHTML = cachedPage;
        //     return;
        // }

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
            moreInfoButton.textContent = "More Indsformation";
            moreInfoButton.addEventListener('click', () => {
                console.log('clicked')
            })
            // moreInfoButton.onclick = () => {
            //     console.log("Navigating to plant details page");
            //     window.location.href = `plantdetails.html?plantId=${plant.plant_id}`;
            // };
            plantDiv.appendChild(moreInfoButton);

            const addButton = document.createElement("button");
            addButton.textContent = "+";
            addButton.onclick = async () => {
                console.log(JSON.stringify(plant.plant_id), user.user_id)
                try {
                    const response = await fetch("https://plant-web-service.onrender.com/api/plant_list", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "Accept": "application/json"

                        },
                        body: JSON.stringify({ plant_id: plant.plant_id, user_id: user.user_id })
                    });
                    if (!response.ok) {
                        throw new Error("Network response was not ok");
                    }
                    // alert("Plant added successfully!");
                } catch (error) {
                    console.error("There was a problem with the fetch operation:", error);
                }
            };
            plantDiv.appendChild(addButton);
            gallery.appendChild(plantDiv);
        });

        localStorage.setItem(`plantsPage_${page}`, gallery.innerHTML);
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

    
    // moreInfoButton.onclick = () => {
    //     console.log("Navigating to plant details page");
    //     window.location.href = `plantdetails.html?plantId=${plant.plant_id}`;
    // };

    // if(addButton) {            
    //     addButton.onclick = async () => {
    //     console.log("Adding plant to user's list");
    //     try {
    //         const response = await fetch("https://plant-web-service.onrender.com/api/plant_list", {
    //             method: "POST",
    //             headers: {
    //                 "Content-Type": "application/json"
    //             },
    //             body: JSON.stringify({ plant_id: plant.plant_id, user_id: user.user_id })
    //         });
    //         if (!response.ok) {
    //             throw new Error("Network response was not ok");
    //         }
    //         // alert("Plant added successfully!");
    //     } catch (error) {
    //         console.error("There was a problem with the fetch operation:", error);
    //     }
    // };

    renderPage(currentPage);
    createPaginationButtons();
});

