
const userTab=document.querySelector("[data-userWeather]");
const searchTab=document.querySelector("[data-searchWeather]");
const userContainer=document.getElementsByClassName("weather-container");
const grantAccessContainer=document.querySelector(".grant-location");
const searchForm=document.querySelector(".form-container");
const loadingScreen=document.querySelector(".loading-container");
const userInfoContainer=document.querySelector(".user-info-container");
let img=document.querySelector(".image");
let hello=document.querySelector(".hello");
 
let currentTab=userTab;
let API_key="fb54f95bf2a3631396fe07ecce8e4b37";
getLocation();

function switchTab(clickedTab){
if(clickedTab!=currentTab){
    currentTab.classList.remove("current-tab");
    currentTab=clickedTab;
    currentTab.classList.add("current-tab");

    if(!searchForm.classList.contains("active")){
       
        searchForm.classList.add("active");
        grantAccessContainer.classList.remove("active");
        userInfoContainer.classList.remove("active"); 
    }
    else{
        searchForm.classList.remove("active");
       userInfoContainer.classList.remove("active");
       hello.classList.remove("active");
       getfromSessionStorage();
    }
}
}

userTab.addEventListener('click',function(){
    //pass user tab as the clicked parmeter
    switchTab(userTab);
})

searchTab.addEventListener('click',function(){
    //passed search tab as the clicked parameter
    switchTab(searchTab);
})

//this will be having the coordinates already
function getfromSessionStorage(){
    const localCoordinates=sessionStorage.getItem("coordinates");
    if(!localCoordinates){
        grantAccessContainer.classList.add("active");
    }
    else{
        const coordinates=JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }
}
 async function fetchUserWeatherInfo(coordinates){
    const{lat,lon}=coordinates;
    //remove the grant access container to show your weather
    grantAccessContainer.classList.remove("active");
    loadingScreen.classList.remove("active");

    //API CALL
    try {
        const result=await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_key}`);
        const data=await result.json();
       
        userInfoContainer.classList.add("active");
   
        renderWeather(data);
    } catch (error) {
        loadingScreen.classList.remove("active");
        let err=document.createElement('h1');
        err.innerText="ERRRO 404";
        document.body.appendChild(err);

        
    }
}
function renderWeather(weatherInfo){
    if( typeof weatherInfo !=='undefined'){
        const cityName=document.querySelector("[data-cityName]");
    const countryIcon=document.querySelector("[data-countryIcon]");
    const desc=document.querySelector(".data-weatherDesc");
    const weatherIcon=document.querySelector(".data-weatherIcon");
const temp=document.querySelector(".data-temp");
const windSpeed=document.querySelector(".data-windspeed");
const humidity=document.querySelector(".data-humidity");
const cloud=document.querySelector(".data-cloudiness");

cityName.innerText=weatherInfo?.name;
if(cityName.innerText!=="undefined"){
    cityName.innerText=weatherInfo?.name;
}
else{
    userInfoContainer.classList.remove("active");
    displayErrorMessage();
}
countryIcon.src= `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
desc.innerText=weatherInfo?.weather?.[0]?.description;
weatherIcon.src=`http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
temp.innerText=`${weatherInfo?.main?.temp}°F`;
windSpeed.innerText=weatherInfo?.wind?.speed;
humidity.innerText=weatherInfo?.main?.humidity;
cloud.innerText=weatherInfo?.clouds?.all;
    }
   
    
}

function getLocation(){

    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
        
            alert("There is some error in fetching your current Location");
        
    }

}
function showPosition(position){
const coordinates={
    lat:position.coords.latitude,
    lon:position.coords.longitude
}
sessionStorage.setItem("coordinates",JSON.stringify(coordinates));
fetchUserWeatherInfo(coordinates);
}

const grantAccessLocation=document.querySelector("[data-grantAccess]");
grantAccessContainer.addEventListener('click',getLocation);

const searchInput=document.querySelector("[data-search]");

    searchForm.addEventListener("submit", function (e) {
        e.preventDefault();
    
        let cityName = searchInput.value.trim();
    
        if (cityName === "") {
            return;
        }
        else{
            fetchSearchWeatherInfo(cityName)
        }
       
     
        
      
     
       });
    

async function fetchSearchWeatherInfo(city){
   
loadingScreen.classList.add("active");
grantAccessContainer.classList.remove("active");
userInfoContainer.classList.remove("active");
hello.classList.remove("active");

try {
    const response=await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_key}`);
    const data= await response.json();
  
    loadingScreen.classList.remove("active");
    userInfoContainer.classList.add("active");
    renderWeather(data);
    
} 
catch (error) {
    
   
}
}
document.addEventListener("mousemove",function(dets){
img.style.left=`${dets.x}px`;
img.style.top=`${dets.y}px`
})
function displayErrorMessage(){
    hello.classList.add("active");
}