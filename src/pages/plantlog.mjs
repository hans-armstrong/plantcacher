import initialize from "../state.mjs";
import { generateRandomId } from "../utils/functions.mjs";

document.addEventListener("DOMContentLoaded", async () => {
    let plantLogDivDOM = document.getElementById('plantLogDivDOM');
    let { user, plantLog } = await initialize();
    // console.log(user)
    let loadDiv = async () => {
        console.log(plantLog);

        plantLog.forEach(log => {
            const plantDiv = document.createElement('div');
            plantDiv.setAttribute('data-plant-id', log.plant_id)
            plantDiv.classList = 'flex relative my-6 mx-4 mb-8'
            plantDiv.innerHTML = `
        <h3 class="absolute -left-4 -top-4 p-2 px-4 bg-sky-950 text-white text-lg rounded-lg">${log.common_name}</h3>
        <figure><img src=${log.thumbnail_image_url} class="max-w-60">
        <figcaption class="absolute bottom-0 p-2 bg-blue-950/75 italic ">${log.scientific_name}</figcaption></figure>
        <div>    
        <h4>Log Date:${log.log_date}</h4>
            <input type="textarea" class="hidden">
            <h4>Notes</h4>
            <p>${log.notes}</p>
            <div id="images-${log.plant_id}" class="more-images-div"></div>
        </div>
        <div>
        <div>
        <button id="user-log-images-button-${log.log_id}" class="btn btn-primary">Logged Images</button>
        <div id="user-log-images-${log.log_id}"></div> 
        </div>
        <form id="form-${log.log_id}">
    <input type="file"accept="image/*" class="file-input file-input-bordered w-full max-w-xs" />
    <select name="image_type" class="select select-bordered w-full max-w-xs">
    <option value="flower">Flower</option>
    <option value="leaf">Leaf</option>
    <option value="habit">Habit</option>
    <option value="fruit">Fruit</option>
    <option value="bark">Bark</option>
    <option value="other">Other</option>
    </select>
    <button type="submit" class="btn btn-primary mt-2">Upload Image</button>
    </form>
    `;
            plantLogDivDOM.appendChild(plantDiv);

            document.getElementById(`user-log-images-button-${log.log_id}`).addEventListener('click', () => getUserImages(log.log_id));
        });

        async function getUserImages(logId) {
            let imagesDiv = document.getElementById(`user-log-images-${logId}`);
            let plantImages;
            try {
                const response = await fetch(`https://plant-web-service.onrender.com/api/user_images?log_id=${logId}`, {
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
                                `;
                                imagesDiv.appendChild(imageDiv);
                            });
                        }
                    })
            } catch (error) {
                console.error("There was a problem with the fetch operation:", error);
            }
        }

        plantLog.forEach(log => {
            const form = document.getElementById(`form-${log.log_id}`);
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                const files = e.target.querySelector('input[type=file]').files;
                const file = files[0];
                const formData = new FormData();
                formData.append('image_id', generateRandomId());
                formData.append('user_id', user.user_id);
                // formData.append('plant_id', log.plant_id);
                formData.append('log_id', log.log_id);
                formData.append('uploaded_at', new Date().toISOString());
                formData.append('type', e.target.querySelector('select[name="image_type"]').value);
                formData.append('image_url', file);

                // const object = {}
                // formData.forEach((value, key) => {
                //     if (value instanceof File) {
                //         object[key] = {
                //             name: value.name,
                //             type: value.type,
                //             size: value.size
                //         };
                //     } else {
                //         object[key] = value;
                //     }
                // })
                // console.log(object)
                try {
                    const response = await fetch('https://plant-web-service.onrender.com/api/user_images', {
                        method: 'POST',
                        body: formData,
                    });

                    if (!response.ok) throw new Error('Upload failed');

                    const data = await response.json();
                    console.log(data);
                    // const imageContainer = document.getElementById(`user-log-images-${log.log_id}`);
                    // data.forEach(image => {
                    //     const img = document.createElement('img');
                    //     img.src = image.image_url;
                    //     img.classList.add('max-w-60', 'mt-2');
                    //     imageContainer.appendChild(img);
                    // });

                } catch (error) {
                    console.error('Error uploading:', error);
                }
            });
        });

        plantLog.forEach(plant => {
            let imagesDiv = document.getElementById(`images-${plant.plant_id}`);
            // let plantImages 
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
    };

    await loadDiv();
});
