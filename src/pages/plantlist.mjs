import initialize from "../state.mjs";
import { generateRandomId } from "../utils/functions.mjs";

document.addEventListener("DOMContentLoaded", async () => {
    let { user, plantList, pointsDOM } = await initialize();
    
    const formDiv = document.getElementById("formDiv")
    let plantListDivDOM = document.getElementById('plantListDivDOM');

    console.log(plantList);
    plantList.forEach(plant => {
        console.log(plant)
        const plantDiv = document.createElement('div');
        plantDiv.setAttribute('data-plant-id', plant.plant_id)
        plantDiv.innerHTML = `
            <p>${plant.common_name}</p>
            <div id="images-${plant.plant_id}"><img src=${plant.thumbnail_image_url}></div>
        `;
        const logButton = document.createElement('button')
        logButton.textContent = "Found"
        logButton.className = 'btn btn-primary log-button'

        logButton.onclick = async () => {
            // Open modal with form
            let div = document.createElement('div');
            div.classList = 'modal-div';


            let xButton = document.createElement('button')
            xButton.textContent = 'x'
            xButton.classList = 'btn btn-primary add-button'
            xButton.onclick = async () => {
                div.remove()
            }

            div.appendChild(xButton)

            let formElement = document.createElement('form');
            formElement.innerHTML = `
            <label for="logDate">Log Date:</label>
            <input type="date" id="logDate" name="logDate" required>
            <label for="notes">Notes:</label>
            <textarea id="notes" name="notes" rows="4" cols="50" required></textarea>
            <button type="submit">Submit</button>`;

            formElement.onsubmit = async (event) => {
                event.preventDefault();
                const logDate = document.getElementById('logDate').value;
                const notes = document.getElementById('notes').value;
                const bodyJSON = JSON.stringify({ plant_id: plant.plant_id, log_id: generateRandomId(), user_id: user.user_id, log_date: logDate, notes: notes })
                console.log(bodyJSON)
                try {
                    const response = await fetch("https://plant-web-service.onrender.com/api/plant_log", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "Accept": "application/json"
                        },
                        body: bodyJSON
                    });
                    console.log(response)
                    if (!response.ok) {
                        throw new Error("Network response was not ok");
                    }
                    pointsDOM.innerText = Number(user.points) + Number(plant.points)
                    await updatePoints(user.user_id, user.first_name, user.last_name, user.ip, Number(user.points) + Number(plant.points));
                    div.remove()
                } catch (error) {
                    console.error("There was a problem with the fetch operation:", error);
                }
            };
            div.appendChild(formElement)
            formDiv.appendChild(div)
        }
        plantDiv.appendChild(logButton)
        plantListDivDOM.appendChild(plantDiv);

    });
    plantList.forEach(plant => {
        let imagesDiv = document.getElementById(`images-${plant.plant_id}`);
        let plantImages 
        imagesDiv.addEventListener('click', async () => {
            try {
                const response = await fetch(`https://plant-web-service.onrender.com/api/plant_images?plant_id=${plant.plant_id}`, {
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
                            imageDiv.innerHTML = `
                                <img src="${image.image_url}" alt="${image.type}">
                                <p>Type: ${image.type}</p>
                                <p>Copyright: ${image.copyright}</p>
                            `;
                            imagesDiv.appendChild(imageDiv);
                        });
                    }
                })
            } catch (error) {
                console.error("There was a problem with the fetch operation:", error);
            }
        })
    });

    const updatePoints = async (userid, firstname, lastname, ipAddress, points) => {
        localStorage.setItem('user', JSON.stringify({ user_id: userid, first_name: firstname, last_name: lastname, ip: ipAddress, points: points }))
        try {
            const response = await fetch("https://plant-web-service.onrender.com/api/users", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({ user_id: userid, first_name: firstname, last_name: lastname, ip: ipAddress, points: points })
            });
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
        } catch (error) {
            console.error("There was a problem with the fetch operation:", error);
        }
    };
})
