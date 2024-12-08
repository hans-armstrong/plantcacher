import initialize from "./state.mjs";
import './style.css'

document.addEventListener("DOMContentLoaded", async () => {
    let { user, plants, plantList } = await initialize();
    console.log(user, 'user');
    // console.log("plantList", plantList);

    const gallery = document.getElementById("plantsDOM");
    const itemsPerPage = 20;
    let currentPage = 1;

    const nodePool = Array.from({ length: 20 }, (_, i) => {
        const div = document.createElement('div');
        div.className = 'list-item card card-compact bg-base-100 w-96 shadow-xl';

        const figure = document.createElement('figure');
        const img = document.createElement('img');
        img.className = 'list-img';
        img.loading = 'lazy';

        figure.appendChild(img)

        const divBody = document.createElement('div');
        divBody.className = 'card-body';

        const h2 = document.createElement('h2');
        h2.className = 'card-title';

        const divCardActions = document.createElement('div');
        divCardActions.className = 'card-actions justify-end';

        const button = document.createElement('button');
        button.className = 'btn btn-primary';
        button.textContent = 'Details';

        const addButton = document.createElement('button');
        addButton.textContent = "+";
        addButton.className = 'btn btn-primary add-button';

        const logButton = document.createElement('button')
        logButton.textContent = "Found plant"
        logButton.className = 'btn btn-primary log-button'


        divCardActions.appendChild(button);
        divCardActions.appendChild(addButton);
        divCardActions.appendChild(logButton)
        divBody.appendChild(h2);
        divBody.appendChild(divCardActions);
        div.appendChild(figure);
        div.appendChild(divBody);

        gallery.appendChild(div);
        return div;
    });


    const renderPage = (page) => {
        // const cachedPage = localStorage.getItem(`plantsPage_${page}`);
        // if (cachedPage) {
        //     gallery.innerHTML = cachedPage;
        //     return;
        // }

        const start = (page - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        const plantsToShow = plants.slice(start, end);
        let firstPlant = plantsToShow[0]
        // console.log(firstPlant)


        for (let i = 0; i < nodePool.length; i++) {
            const div = nodePool[i];
            if (i < plantsToShow.length) {
                const item = plantsToShow[i];
                div.querySelector('.card-title').textContent = item.common_name;
                div.querySelector('img').src = item.thumbnail_image_url;
                div.querySelector('button').onclick = () => {
                    console.log("Navigating to plant details page");
                    window.location.href = `plantdetails.html?plantId=${item.plant_id}`;
                };
                div.querySelector('.add-button').onclick = async () => {
                        // console.log(JSON.stringify(plant.plant_id), user.user_id)
                        try {
                            const response = await fetch("https://plant-web-service.onrender.com/api/plant_list", {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                    "Accept": "application/json"
        
                                },
                                body: JSON.stringify({ plant_id: item.plant_id, user_id: user.user_id })
                            });
                            if (!response.ok) {
                                throw new Error("Network response was not ok");
                            }
                            // alert("Plant added successfully!");
                        } catch (error) {
                            console.error("There was a problem with the fetch operation:", error);
                        }
                    };
                div.querySelector('.log-button').onclick = async () => {
                    try {
                        console.log('logged plant')
                    } catch (error) {
                        console.error('problem logging plant')
                    }
                }
            } else {
                div.style.display = 'none'; // Hide the node if it's not in the visible range
            }
        }


        // plantsToShow.forEach(plant => {
        //     // console.log("plant", plant);
        //     const plantDiv = document.createElement("div");
        //     plantDiv.classList.add("plant");

        //     const plantName = document.createElement("h3");
        //     plantName.textContent = plant.common_name;
        //     plantDiv.appendChild(plantName);

        //     const plantImage = document.createElement("img");
        //     plantImage.src = plant.thumbnail_image_url;
        //     plantImage.classList = "max-w-64"
        //     if (plant.plant_id === firstPlant.plant_id) {
        //         plantImage.classList = "max-w-[100%]"
        //     }
        //     plantDiv.appendChild(plantImage);

        //     const moreInfoButton = document.createElement("button");
        //     moreInfoButton.textContent = "Details";
        //     moreInfoButton.addEventListener('click', () => {
        //         console.log('clicked')
        //     })
        //     // moreInfoButton.onclick = () => {
        //     //     console.log("Navigating to plant details page");
        //     //     window.location.href = `plantdetails.html?plantId=${plant.plant_id}`;
        //     // };
        //     plantDiv.appendChild(moreInfoButton);

        //     const addButton = document.createElement("button");
        //     addButton.textContent = "+";
        //     addButton.onclick = async () => {
        //         console.log(JSON.stringify(plant.plant_id), user.user_id)
        //         try {
        //             const response = await fetch("https://plant-web-service.onrender.com/api/plant_list", {
        //                 method: "POST",
        //                 headers: {
        //                     "Content-Type": "application/json",
        //                     "Accept": "application/json"

        //                 },
        //                 body: JSON.stringify({ plant_id: plant.plant_id, user_id: user.user_id })
        //             });
        //             if (!response.ok) {
        //                 throw new Error("Network response was not ok");
        //             }
        //             // alert("Plant added successfully!");
        //         } catch (error) {
        //             console.error("There was a problem with the fetch operation:", error);
        //         }
        //     };
        //     plantDiv.appendChild(addButton);
        //     gallery.appendChild(plantDiv);
        // });

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

