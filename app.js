const API_BASE = 'http://localhost:3000/api';

let allProperties = [];

async function fetchAllProperties(){

const loading = document.getElementById('loading');
const results = document.getElementById('results');

if(loading) loading.style.display='block';
if(results) results.innerHTML='';

try{

const res = await fetch(`${API_BASE}/propiedades`);
const data = await res.json();

let properties = Array.isArray(data) ? data : data.data || [];

if(properties.length === 0){
  properties = getMockProperties();
}

allProperties = properties;
renderProperties(properties);

}catch(e){

console.log("Error, usando mock");

const mock = getMockProperties();
allProperties = mock;

renderProperties(mock);

}

if(loading) loading.style.display='none';

}

function renderProperties(properties){

const results = document.getElementById('results');

results.innerHTML = `
<div class="property-grid">
${properties.map(p=>`

<div class="property-card">

<div class="property-image-wrap">
<img src="${p.imagen || 'https://picsum.photos/400/250'}" class="property-image">
<div class="remax-badge">RE/MAX</div>
</div>

<div class="property-body">
<div class="property-title">${p.titulo}</div>
<div class="property-address">📍 ${p.ubicacion}</div>
<div class="property-price">$${p.precio}</div>
</div>

</div>

`).join('')}
</div>
`;

}

function applyFilters(){

if(!allProperties.length) return;

let filtered = allProperties;

const location = document.getElementById("searchLocation").value.toLowerCase();
const price = document.getElementById("priceRange").value;
const category = document.getElementById("category").value;

if(location){
filtered = filtered.filter(p => p.ubicacion.toLowerCase().includes(location));
}

if(price){
filtered = filtered.filter(p=>{
if(price==="1") return p.precio<=1000000;
if(price==="2") return p.precio<=3000000;
if(price==="3") return p.precio>3000000;
});
}

if(category){
filtered = filtered.filter(p=>p.tipo===category);
}

renderProperties(filtered);

}

function getMockProperties(){
return[
{titulo:"Casa en Durango",ubicacion:"Durango",precio:2500000,tipo:"casa",imagen:"https://picsum.photos/400/250?1"},
{titulo:"Departamento CDMX",ubicacion:"CDMX",precio:1800000,tipo:"departamento",imagen:"https://picsum.photos/400/250?2"},
{titulo:"Terreno Monterrey",ubicacion:"Monterrey",precio:900000,tipo:"terreno",imagen:"https://picsum.photos/400/250?3"}
];
}

window.onload = fetchAllProperties;