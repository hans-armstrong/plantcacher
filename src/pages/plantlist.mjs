import initialize from "../state.mjs";

document.addEventListener("DOMContentLoaded", async () => {
    let plantListDivDOM = document.getElementById('plantListDivDOM');
    let { user, plantList } = await initialize();

    console.log(plantList);
    plantList.forEach(plant => {
        const plantDiv = document.createElement('div');
        plantDiv.setAttribute('data-plant-id', plant.plant_id)
        plantDiv.innerHTML = `
            <p>${plant.common_name}</p>
            <div id="images-${plant.plant_id}"><img src=${plant.thumbnail_image_url}></div>
        `;

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
})
