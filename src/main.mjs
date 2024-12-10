import initialize from "./state.mjs";
import { generateRandomId } from "./utils/functions.mjs";
import './style.css'

document.addEventListener("DOMContentLoaded", async () => {
    let { user, plants, plantList } = await initialize();
    console.log(user, 'user');



    //SEARCH SECTION 

    // Trefle.io jwt token for the user
    const fetchJWTUserToken = async (user) => {
        try {
            // Add await here - fetch returns a Promise
            const response = await fetch(`https://plant-web-service.onrender.com/api/auth?ip=${user.ip}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            });
    
            // Check response status before parsing JSON
            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.status}`);
            }
    
            // Parse JSON after checking response
            const data = await response.json();
            return data.token;
    
        } catch (error) {
            console.error("There was a problem with the token get:", error);
            return null; // or handle error appropriately
        }
    }


    let userToken = await fetchJWTUserToken(user)
    // console.log(userToken)
//{
//     "token": "eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjo3MTM2LCJvcmlnaW4iOiJodHRwczovL2hhbm5haC1hLmdpdGh1Yi5pby9wbGFudGNhY2hlci8iLCJpcCI6IjM4Ljc4LjIwMC4xMDgiLCJleHBpcmUiOiIyMDI0LTEyLTExIDIwOjM0OjUwICswMDAwIiwiZXhwIjoxNzMzOTQ5MjkwfQ.0mQ4hsRADg5ZpqUqZd380ZIAFWCOhqkvcc1NRB5h4p8",
//     "expiration": "12-11-2024 20:34"
// }


    const searchResultsDiv = document.querySelector('#searchResults')
    const searchInput = document.querySelector('#searchInputDOM')
    const searchButton = document.querySelector('#searchButton')

    const sanitizeInput = (input) => {
        if (!input) return '';
    
        return input
            .trim() 
            .toLowerCase() 
            .replace(/[^\w\s-]/g, '') 
            .replace(/\s+/g, ' ') 
            .substring(0, 100);
    };    

    searchButton.onclick = async () => {
        let query = sanitizeInput(searchInput.value) 
        try {
            const response = await fetch(`https://trefle.io/api/v1/plants/search?token=${userToken}&q=${query}`, {
                mode: 'no-cors' // Add this line
            });


            //Getting 500 server error, may need proxy server to send from github pages
            // const response = await fetch(`https://trefle.io/api/v1/plants/search?token=${userToken}&q=${query}`, {
            //     mode: 'no-cors' // Add this line
            // });

            let data = await response.json()
            console.log(data)

        } catch (error) {
            console.error("There was a problem with the fetch operation:", error);
        }

    }









    // MAIN PLANTS SECTION




    // console.log("plantList", plantList);
    // const formDiv = document.getElementById("formDiv");
    const gallery = document.getElementById("plantsDOM");
    const modalDiv = document.getElementById("modalDiv");

    const toggleModalVisibility = () => {
        modalDiv.classList.toggle('hidden');
        modalDiv.innerHTML = ''
    };

    modalDiv.addEventListener('click', toggleModalVisibility);

    const itemsPerPage = 1;
    let currentPage = 1;

    const nodePool = Array.from({ length: 1 }, (_, i) => {
        const div = document.createElement('div');
        div.classList = 'plant-parent-div carousel-item relative flex w-full'; // Add flex-shrink-0 to prevent shrinking

        const figure = document.createElement('figure');
        figure.classList = 'plant-figure h-auto flex-none';
        const img = document.createElement('img');
        img.classList = 'plant-img w-full'; // Add object-cover to maintain aspect ratio
        img.loading = 'lazy';

        const divBody = document.createElement('div');
        divBody.classList = 'plant-content flex flex-col';

        const h2 = document.createElement('h2');
        h2.classList = 'plant-title';

        const scientificSpan = document.createElement('span')
        scientificSpan.classList ='scientificSpan'

        const plantDetails = document.createElement('div')
        plantDetails.classList = 'plantDetails'
        
        const usaImage = document.createElement('img')
        usaImage.src = 'images/usa.svg'

        plantDetails.appendChild(usaImage)

        const pointDiv = document.createElement('div')
        const pointsH3 = document.createElement('h3')
        pointDiv.classList = 'pointsDiv flex items-center bg-teal-700/75 text-center text-black'
        pointsH3.setAttribute('id', 'pointsH3')

        const plusImages = document.createElement('div')
        plusImages.classList = 'absolute top-0 p-4 '
        plusImages.innerHTML = `<i class="text-2xl fa-solid fa-up-right-and-down-left-from-center" style="color: #63E6BE;"></i>`
        plusImages.setAttribute('id', 'plusImages')

        const divCardActions = document.createElement('div');
        divCardActions.classList = 'plant-buttons mt-auto w-full';

        // const button = document.createElement('button');
        // button.classList = 'btn detail-button';
        // button.textContent = 'Details';

        const addButton = document.createElement('button');
        addButton.innerHTML = "List &#127793;";
        addButton.classList = 'btn add-button';

        // const logButton = document.createElement('button')
        // logButton.textContent = "Found"
        // logButton.className = 'btn btn-primary log-button'

        figure.appendChild(img)
        // divCardActions.appendChild(button);
        divCardActions.appendChild(addButton);
        // divCardActions.appendChild(logButton)
        divBody.appendChild(h2);
        divBody.appendChild(scientificSpan)
        divBody.appendChild(plantDetails)
        pointDiv.appendChild(pointsH3)
        divBody.appendChild(divCardActions);
        div.appendChild(pointDiv)
        div.appendChild(plusImages)
        div.appendChild(figure);
        div.appendChild(divBody);

        gallery.appendChild(div);
        return div;

        /* <div class="plant-parent-div carousel-item relative">
                <div class="flex items-center p-2 bg-teal-700/75 rounded-lg text-center text-black">
                <h3 id="pointsH3">2</h3>
                </div>
                <div id="plusImages"><i class="fa-solid fa-up-right-and-down-left-from-center" style="color: #63E6BE;" aria-hidden="true"></i>
                </div>
                <figure class="plant-figure max-w-[200px] h-auto flex-none">
                <img class="plant-img w-full max-w-[50%]" loading="lazy" src="https://bs.plantnet.org/image/o/668938d1562f40ea502e8cbe47fb03c5f234ba58"></figure>
                <div class="plant-content">
                    <h2 class="plant-title">Fineleaf hymenopappus</h2>
                    <div class="plant-buttons">
                        <button class="btn btn-primary detail-button">Details</button>
                        <button class="btn btn-primary add-button">+ List</button>
                    </div>
                </div>
            </div>
        */
    });

    const fetchAndDisplayPlantDetails = async (item, plantDetailsDiv) => {
        
        // const usaImage = document.createElement('img')
        // usaImage.src = 'images/usa.svg'

        // plantDetailsDiv.appendChild(usaImage)

        const continentalUnitedStates = [
            "Alabama", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", 
            "Delaware", "Florida", "Georgia", "Idaho", "Illinois", "Indiana", "Iowa", 
            "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", 
            "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", 
            "Nevada", "New Hampshire", "New Jersey", "New Mexico", "New York", 
            "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", 
            "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", 
            "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", 
            "West Virginia", "Wisconsin", "Wyoming"
        ];
        try {
            const response = await fetch(`https://plant-web-service.onrender.com/api/plant_locales?plant_id=${item.plant_id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            });
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            const data = await response.json();
            console.log(data, 'plantdetails');
            const nativePlaces = data[0].native.split(',').map(place => place.trim());
            continentalUnitedStates.forEach(state => {
                if (nativePlaces.includes(state)) {
                    const stateImage = document.createElement('img');
                    stateImage.src = `images/${state}.svg`;
                    stateImage.alt = state;
                    plantDetailsDiv.appendChild(stateImage);
                }
            });
        } catch (error) {
            console.error("There was a problem with the fetch operation:", error);
        }
    };

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
                div.querySelector('#pointsH3').textContent = item.points
                div.querySelector('.plant-title').textContent = item.common_name;
                div.querySelector('.scientificSpan').textContent = item.scientific_name
                div.querySelector('img').src = item.thumbnail_image_url;
                div.querySelector('#plusImages').onclick = async () => {
                    try {
                        const response = await fetch(`https://plant-web-service.onrender.com/api/plant_images?plant_id=${item.plant_id}`, {
                            method: "GET",
                            headers: {
                                "Content-Type": "application/json"
                            }
                        })
                            .then(response => {
                                if (!response.ok) {
                                    throw new Error("Network response was not ok");
                                }
                                return response.json();
                            })
                            .then(plantImages => {
                                console.log('Plant images:', plantImages);
                                return plantImages;
                            })
                            .then(plantImages => {
                                if (plantImages) {
                                    plantImages.forEach(image => {
                                        const imageDiv = document.createElement('div');
                                        imageDiv.setAttribute('class', 'modal-image-div')
                                        imageDiv.innerHTML = `
                                    <figure class="modal-image-figure">
                                        <img src="${image.image_url}" alt="${image.type}">
                                        <figcaption class="modal-image-figcaption">
                                        <p>Type: ${image.type}</p>
                                        <p>Copyright: ${image.copyright}</p>
                                        </figcaption>
                                    </figure>
                                    `;
                                        modalDiv.appendChild(imageDiv);
                                    });
                                }
                            })
                        modalDiv.classList = "absolute block m-4 p-6 z-[1000] flex flex-col items-center w-full"; // Ensure modalDiv has a high z-index
                        // toggleModalVisibility();
                    } catch (error) {
                        console.error("There was a problem with the fetch operation:", error);
                    };

                }
                const plantDetailsDiv = div.querySelector('.plantDetails');
                fetchAndDisplayPlantDetails(item, plantDetailsDiv);
                div.querySelector('.add-button').onclick = async () => {
                    console.log(JSON.stringify(item.plant_id), user.user_id)
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
                // div.querySelector('.log-button').onclick = async () => {
                //     // Open modal with form
                //     let div = document.createElement('div');
                //     div.classList = 'modal-div';


                //     let xButton = document.createElement('button')
                //     xButton.textContent = 'x'
                //     xButton.classList = 'btn btn-primary add-button'
                //     xButton.onclick = async () => {
                //         div.remove()
                //     }

                //     div.appendChild(xButton)

                //     let formElement = document.createElement('form');
                //     formElement.innerHTML = `
                // <label for="logDate">Log Date:</label>
                // <input type="date" id="logDate" name="logDate" required>
                // <label for="notes">Notes:</label>
                // <textarea id="notes" name="notes" rows="4" cols="50" required></textarea>
                // <button type="submit">Submit</button>`;

                //     formElement.onsubmit = async (event) => {
                //         event.preventDefault();
                //         const logDate = document.getElementById('logDate').value;
                //         const notes = document.getElementById('notes').value;
                //         const bodyJSON = JSON.stringify({ plant_id: item.plant_id, log_id: generateRandomId(), user_id: user.user_id, log_date: logDate, notes: notes })
                //         console.log(bodyJSON)
                //         try {
                //             const response = await fetch("https://plant-web-service.onrender.com/api/plant_log", {
                //                 method: "POST",
                //                 headers: {
                //                     "Content-Type": "application/json",
                //                     "Accept": "application/json"
                //                 },
                //                 body: bodyJSON
                //             });
                //             console.log(response)
                //             if (!response.ok) {
                //                 throw new Error("Network response was not ok");
                //             }
                //             div.remove()
                //         } catch (error) {
                //             console.error("There was a problem with the fetch operation:", error);
                //         }
                //     };
                //     div.appendChild(formElement)
                //     formDiv.appendChild(div)
                // }
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

        const prevButton = document.createElement("button");
        prevButton.textContent = "Previous page";
        prevButton.classList = 'join-item btn btn-outline';
        prevButton.onclick = () => {
            if (currentPage > 1) {
                currentPage--;
                renderPage(currentPage);
            }
            let resetMapDiv = document.querySelector('.plantDetails')
            resetMapDiv.innerHTML = ''
            const usaImage = document.createElement('img')
            usaImage.src = 'images/usa.svg'

            resetMapDiv.appendChild(usaImage)
        };
        pagination.appendChild(prevButton);

        const nextButton = document.createElement("button");
        nextButton.textContent = "Next";
        nextButton.classList = 'join-item btn btn-outline';
        nextButton.onclick = () => {
            if (currentPage < totalPages) {
                currentPage++;
                renderPage(currentPage);
            }
            let resetMapDiv = document.querySelector('.plantDetails')
            resetMapDiv.innerHTML = ''
            const usaImage = document.createElement('img')
            usaImage.src = 'images/usa.svg'

            resetMapDiv.appendChild(usaImage)
        };
        pagination.appendChild(nextButton);
    };

    renderPage(currentPage);
    createPaginationButtons();
});

