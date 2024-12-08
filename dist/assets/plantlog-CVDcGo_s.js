import{i as p}from"./state-CcQ5ey2X.js";document.addEventListener("DOMContentLoaded",async()=>{let d=document.getElementById("plantLogDivDOM"),{user:c,plantLog:a}=await p();await(async()=>{console.log(a),a.forEach(t=>{const n=document.createElement("div");n.setAttribute("data-plant-id",t.plant_id),n.innerHTML=`
            <p>${t.common_name}</p>
            <div id="images-${t.plant_id}"><img src=${t.thumbnail_image_url}></div>
        `,d.appendChild(n)}),a.forEach(t=>{let n=document.getElementById(`images-${t.plant_id}`);n.addEventListener("click",async()=>{try{const o=await fetch(`https://plant-web-service.onrender.com/api/plant_images?plant_id=${t.plant_id}`,{method:"GET",headers:{"Content-Type":"application/json"}}).then(e=>{if(!e.ok)throw new Error("Network response was not ok");return e.json()}).then(e=>(console.log("Plant images:",e),e)).then(e=>{e&&e.forEach(i=>{const r=document.createElement("div");r.innerHTML=`
                            <img src="${i.image_url}" alt="${i.type}">
                            <p>Type: ${i.type}</p>
                            <p>Copyright: ${i.copyright}</p>
                            `,n.appendChild(r)})})}catch(o){console.error("There was a problem with the fetch operation:",o)}})})})()});
