//Tab ko fetch karenge

const userTab = document.querySelector("[data-yourCity]");
const searchTab = document.querySelector("[data-Search]");
const userContainer = document.querySelector(".conatiner");
const grantAccess = document.querySelector(".grant-loaction-container");
const searchForm = document.querySelector("[data-SearchForm]");
const loadingScreen = document.querySelector(".loadingContainer");
const userInfo = document.querySelector(".user-info-container");

// Variables Needed

let currentTab = userTab;
const API_KEY = "b3a11790c786eebf5be32e8f65739dcc";
currentTab.classList.add("current-tab");
getfromSessionStorage();

function switchTab(clickedTab) {
  //Switch tab Color
  if (clickedTab != currentTab) {
    currentTab.classList.remove("current-tab");
    currentTab = clickedTab;
    currentTab.classList.add("current-tab");

    //move the tab to search weather tab
    if (!searchForm.classList.contains("active")) {
      userInfo.classList.remove("active");
      grantAccess.classList.remove("active");
      searchForm.classList.add("active");
    }
    //now tab is in searchWeather,now switch to my city Tab
    else {
      searchForm.classList.remove("active");
      userInfo.classList.remove("active");
      //show your city weather coordinates
      getfromSessionStorage();
    }
  }
}
userTab.addEventListener("click", () => {
  //pass clicked tab as input parameter
  switchTab(userTab);
});
searchTab.addEventListener("click", () => {
  //pass clicked tab as input parameter
  switchTab(searchTab);
});
//check coordinates store hai ki ni session storage me
function getfromSessionStorage() {
  const localCoordinates = sessionStorage.getItem("user-coordinates");
  if (!localCoordinates) {
    //if local coordinates are note available
    grantAccess.classList.add("active");
  } else {
    const coordinates = JSON.parse(localCoordinates); //json string to json object
    fetchUserweatherInfo(coordinates);
  }
}
async function fetchUserweatherInfo(coordinates) {
  const { lat, lon } = coordinates;
  //make grant access container invisble
  grantAccess.classList.remove("active");
  //make loader visible
  loadingScreen.classList.add("active");

  //API call
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    );
    const data = await response.json();

    //remove load screen
    loadingScreen.classList.remove("active");
    userInfo.classList.add("active");

    renderWeatherInfo(data);
  } catch (err) {
    loadingScreen.classList.remove("active");
    userInfo.innerText="Not Found";
  }
}
//coordinates leke weather screen me show karega
function renderWeatherInfo(weatherInfo) {
  //firstly we have to fetch the elements

  const cityName = document.querySelector("[data-cityName]");
  const countryIcon = document.querySelector("[data-countryIcon]");
  const desc = document.querySelector("[data-weatherDesc]");
  const weatherIcon = document.querySelector("[data-weatherIcon]");
  const temp = document.querySelector("[data-weatherTemp]");
  const windspeed = document.querySelector("[data-windspeed]");
  const humidity = document.querySelector("[data-humidity]");
  const cloud = document.querySelector("[data-cloud]");

  // console.log(weatherInfo);

  //fetch values from waetherInfo
  cityName.innerText = weatherInfo?.name;
  countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
  desc.innerText = weatherInfo?.weather?.[0]?.description;
  weatherIcon.src = `https://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
  // temp.innerText = `${weatherInfo?.main?.temp} °C`;
  temp.innerText = `${weatherInfo?.main?.temp} °C`;
  windspeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
  humidity.innerText = `${weatherInfo?.main?.humidity}%`;
  cloud.innerText = `${weatherInfo?.clouds?.all}%`;
}
//in grantAccess Apply eventListener
function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    userInfo.innerText="Not Found";
  }
}
function showPosition(position) {
  const userCoordinates = {
    lat: position.coords.latitude,
    lon: position.coords.longitude,
  };

  sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
  fetchUserweatherInfo(userCoordinates);
}
const grantAccessButton = document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener("click", getLocation);

const searchInput = document.querySelector("[data-SearchInput]");

searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  let cityName = searchInput.value;

  if (cityName === "") return;
  else fetchSearchWeatherInfo(cityName);
});
async function fetchSearchWeatherInfo(city) {
  loadingScreen.classList.add("active");
  userInfo.classList.remove("active");
  grantAccess.classList.remove("active");

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
    );
    const data = await response.json();
    loadingScreen.classList.remove("active");
    userInfo.classList.add("active");
    renderWeatherInfo(data);
  } catch (err) {}
}
