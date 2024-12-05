import{i as c}from"./state-B7VqXr0d.js";document.addEventListener("DOMContentLoaded",async()=>{let o=document.getElementById("plantListDivDOM"),{user:p,plantList:n}=await c();console.log(n),n.forEach(e=>{const i=document.createElement("div");i.innerHTML=`
            <p>${e.common_name}</p>
            <button id="fetch-images-${e.plant_id}">Fetch Images</button>
            <div id="images-${e.plant_id}"></div>
        `,o.appendChild(i),document.getElementById(`fetch-images-${e.plant_id}`).addEventListener("click",async()=>{const s=await(await fetch(`https://plant-web-service.onrender.com/api/plant_images?plant_id=${e.plant_id}`)).json(),a=document.getElementById(`images-${e.plant_id}`);a.innerHTML="",s.forEach(t=>{const d=document.createElement("div");d.innerHTML=`
                    <img src="${t.image_url}" alt="${t.type}">
                    <p>Type: ${t.type}</p>
                    <p>Copyright: ${t.copyright}</p>
                `,a.appendChild(d)})})})});
