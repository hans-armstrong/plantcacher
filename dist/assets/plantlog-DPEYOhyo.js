import{i as m,g as u}from"./state-BIFfatHf.js";document.addEventListener("DOMContentLoaded",async()=>{let l=document.getElementById("plantLogDivDOM"),{user:d,plantLog:r}=await m();await(async()=>{console.log(r),r.forEach(e=>{const i=document.createElement("div");i.setAttribute("data-plant-id",e.plant_id),i.classList="flex relative my-6 mx-4 mb-8",i.innerHTML=`
        <h3 class="absolute -left-4 -top-4 p-2 px-4 bg-sky-950 text-white text-lg rounded-lg">${e.common_name}</h3>
        <figure><img src=${e.thumbnail_image_url} class="max-w-60">
        <figcaption class="absolute bottom-0 p-2 bg-blue-950/75 italic ">${e.scientific_name}</figcaption></figure>
        <div>    
        <h4>Log Date:${e.log_date}</h4>
            <input type="textarea" class="hidden">
            <h4>Notes</h4>
            <p>${e.notes}</p>
            <div id="images-${e.plant_id}" class="more-images-div"></div>
        </div>
        <div>
        <div>
        <button id="user-log-images-button-${e.log_id}" class="btn btn-primary">Logged Images</button>
        <div id="user-log-images-${e.log_id}"></div> 
        </div>
        <form id="form-${e.log_id}">
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
    `,l.appendChild(i),document.getElementById(`user-log-images-button-${e.log_id}`).addEventListener("click",()=>p(e.log_id))});async function p(e){let i=document.getElementById(`user-log-images-${e}`);try{const a=await fetch(`https://plant-web-service.onrender.com/api/user_images?log_id=${e}`,{method:"GET",headers:{"Content-Type":"application/json"}}).then(t=>{if(!t.ok)throw new Error("Network response was not ok");return t.json()}).then(t=>(console.log("Plant images:",t),t)).then(t=>{t&&t.forEach(n=>{const o=document.createElement("div");o.innerHTML=`
                                    <img src="${n.image_url}" alt="${n.type}">
                                    <p>Type: ${n.type}</p>
                                `,i.appendChild(o)})})}catch(a){console.error("There was a problem with the fetch operation:",a)}}r.forEach(e=>{document.getElementById(`form-${e.log_id}`).addEventListener("submit",async a=>{a.preventDefault();const n=a.target.querySelector("input[type=file]").files[0],o=new FormData;o.append("image_id",u()),o.append("user_id",d.user_id),o.append("log_id",e.log_id),o.append("uploaded_at",new Date().toISOString()),o.append("type",a.target.querySelector('select[name="image_type"]').value),o.append("image_url",n);try{const s=await fetch("https://plant-web-service.onrender.com/api/user_images",{method:"POST",body:o});if(!s.ok)throw new Error("Upload failed");const c=await s.json();console.log(c)}catch(s){console.error("Error uploading:",s)}})}),r.forEach(e=>{let i=document.getElementById(`images-${e.plant_id}`);i.addEventListener("click",async()=>{try{const a=await fetch(`https://plant-web-service.onrender.com/api/plant_images?plant_id=${e.plant_id}`,{method:"GET",headers:{"Content-Type":"application/json"}}).then(t=>{if(!t.ok)throw new Error("Network response was not ok");return t.json()}).then(t=>(console.log("Plant images:",t),t)).then(t=>{t&&t.forEach(n=>{const o=document.createElement("div");o.innerHTML=`
                            <img src="${n.image_url}" alt="${n.type}">
                            <p>Type: ${n.type}</p>
                            <p>Copyright: ${n.copyright}</p>
                            `,i.appendChild(o)})})}catch(a){console.error("There was a problem with the fetch operation:",a)}})})})()});
