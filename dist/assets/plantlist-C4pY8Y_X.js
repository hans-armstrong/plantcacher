import{i as d}from"./state-DdzIWKEB.js";document.addEventListener("DOMContentLoaded",async()=>{let r=document.getElementById("plantListDivDOM"),{user:p,plantList:i}=await d();console.log(i),i.forEach(t=>{const n=document.createElement("div");n.setAttribute("data-plant-id",t.plant_id),n.innerHTML=`
            <p>${t.common_name}</p>
            <button id="fetch-images-${t.plant_id}">Fetch Images</button>
            <div id="images-${t.plant_id}"></div>
        `,r.appendChild(n)}),i.forEach(t=>{let n=document.getElementById(`fetch-images-${t.plant_id}`),o=document.getElementById(`images-${t.plant_id}`);n.onclick=async()=>{try{const e=await fetch(`https://plant-web-service.onrender.com/api/plant_images?plant_id=${t.plant_id}`,{method:"GET",headers:{"Content-Type":"application/json"}});if(!e.ok)throw new Error("Network response was not ok");return e.json()}catch(e){console.error("There was a problem with the fetch operation:",e)}},o.innerHTML="",plantImages.forEach(e=>{const a=document.createElement("div");a.innerHTML=`
                <img src="${e.image_url}" alt="${e.type}">
                <p>Type: ${e.type}</p>
                <p>Copyright: ${e.copyright}</p>
            `,o.appendChild(a)})})});
