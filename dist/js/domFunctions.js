export const setPlaceholderText = () => {
  const input = document.getElementById("searchBar__text");
  window.innerWidth < 400
    ? (input.placeholder = "City, State, Country")
    : (input.placeholder = "City, State, Country or Zip Code");
};

export const addSpinner = (element) => {
  animateButton(element);
  setTimeout(animateButton, 1000, element);
};

const animateButton = (element) => {
  element.classList.toggle("none");
  element.nextElementSibling.classList.toggle("block");
  element.nextElementSibling.classList.toggle("none");
};

export const displayError = (headerMsg, srMsg) => {
  updateWeatherLocationHeader(headerMsg);
  updateScreenReaderConfirmation(srMsg);
};

export const displayApiError = (statusCode) => {
  console.log("API Error status code: ", statusCode);
  const properMsg = toProperCase(statusCode.message);
  console.log("Proper Message: ", properMsg);
  updateWeatherLocationHeader(properMsg);
  updateScreenReaderConfirmation(`${properMsg}. Please try again.`);
};

const toProperCase = (text) => {
  const words = text.split(" ");
  const properWords = words.map((word) => {
    return word.charAt(0).toUpperCase() + word.slice(1);
  });
  return properWords.join(" ");
};

const updateWeatherLocationHeader = (message) => {
  const h2 = document.getElementById("currentForecast__location");
  if (message.indexOf("Lat:") !== -1 && message.indexOf("Long:") !== -1) {
    const msgArray = message.split(" ");
    const mapArray = msgArray.map((msg) => {
      return msg.replace(":", ": ");
    });
    const lat =
      mapArray[0].indexOf("-") === -1
        ? mapArray[0].slice(0, 10)
        : mapArray[0].slice(0, 11);
    const long =
      mapArray[1].indexOf("-") === -1
        ? mapArray[1].slice(0, 11)
        : mapArray[1].slice(0, 12);
    h2.textContent = `${lat} • ${long}`;
  } else {
    h2.textContent = message;
  }
};

export const updateScreenReaderConfirmation = (message) => {
  const p = document.getElementById("confirmation");
  p.textContent = message;
};

export const updateDisplay = (weatherJson, locationObj) => {
  fadeDisplay();
  clearDisplay();
  const weatherClass = getWeatherClass(weatherJson.current.weather[0].icon);
  setBGIMage(weatherClass);
  const screenReaderWeather = buildScreenReaderWeather(
    weatherJson,
    locationObj
  );
  updateScreenReaderConfirmation(screenReaderWeather);
  updateWeatherLocationHeader(locationObj.getName());
  // current conditions
  const ccArray = createCurrentConditionsDivs(
    weatherJson,
    locationObj.getUnit()
  );
  displayCurrentConditions(ccArray);
  // six day forecast
  setFocusOnSearch();
  fadeDisplay(); // calling twice for toggle
};

const fadeDisplay = () => {
  const cc = document.getElementById("currentForecast");
  cc.classList.toggle("zero-vis");
  cc.classList.toggle("fade-in");
  const sixDay = document.getElementById("dailyForecast");
  sixDay.classList.toggle("zero-vis");
  sixDay.classList.toggle("fade-in");
};

const clearDisplay = () => {
  const currentConditions = document.getElementById(
    "currentForecast__conditions"
  );
  deleteContents(currentConditions);
  const sixDaysForecast = document.getElementById("dailyForecast__contents");
  deleteContents(sixDaysForecast);
};

const deleteContents = (parentElement) => {
  console.log("Parent Element: ", parentElement);
  let child = parentElement.lastElementChild;
  console.log("Child element: ", child);
  while (child) {
    parentElement.removeChild(child);
    child = parentElement.lastElementChild;
  }
};

const getWeatherClass = (icon) => {
  const firstTwoChars = icon.slice(0, 2);
  const lastChar = icon.slice(2);
  const weatherLookup = {
    "09": "snow",
    10: "rain",
    11: "rain",
    13: "snow",
    50: "fog",
  };
  let weatherClass;
  if (weatherLookup[firstTwoChars]) {
    weatherClass = weatherLookup[firstTwoChars];
  } else if (lastChar === "d") {
    weatherClass = "clouds";
  } else {
    weatherClass = "night";
  }
  return weatherClass;
};

const setBGIMage = (weatherClass) => {
  document.documentElement.classList.add(weatherClass);
  document.documentElement.classList.forEach((img) => {
    if (img !== weatherClass) document.documentElement.classList.remove(img);
  });
};

const buildScreenReaderWeather = (weatherJson, locationObj) => {
  const location = locationObj.getName();
  const unit = locationObj.getUnit();
  const tempUnit = unit === "imperial" ? "Fahrenheit" : "Celsius";
  return `${weatherJson.current.weather[0].description} and ${Math.round(
    Number(weatherJson.current.temp)
  )}°${tempUnit} in ${location}`;
};

const setFocusOnSearch = () => {
  document.getElementById("searchBar__text").focus();
};

const createCurrentConditionsDivs = (weatherObj, unit) => {
  const tempUnit = unit === "imperial" ? "F" : "C";
  const windUnit = unit === "imperial" ? "mph" : "m/s";
  const currentWeather = weatherObj.current.weather[0];
  const weatherTemp = weatherObj.daily[0].temp;
  const icon = createMainImgDiv(
    currentWeather.icon,
    currentWeather.description
  );
  const temp = createElem(
    "div",
    "temp",
    `${Math.round(Number(weatherObj.current.temp))}°`
  );
  const properDesc = toProperCase(currentWeather.description);
  const desc = createElem("div", "desc", properDesc);
  const feels = createElem(
    "div",
    "feels",
    `Feels Like ${Math.round(Number(weatherObj.current.feels_like))}°`
  );
  const maxTemp = createElem(
    "div",
    "maxtemp",
    `High ${Math.round(Number(weatherTemp.max))}° ${tempUnit}`
  );
  const minTemp = createElem(
    "div",
    "mintemp",
    `Low ${Math.round(Number(weatherTemp.min))}° ${tempUnit}`
  );
  const humidity = createElem(
    "div",
    "humidity",
    `Humidity ${weatherObj.current.humidity}%`
  );
  const wind = createElem(
    "div",
    "wind",
    `Wind ${Math.round(Number(weatherObj.current.wind_speed))} ${windUnit}`
  );
  return [icon, temp, desc, feels, maxTemp, minTemp, humidity, wind];
};

const createMainImgDiv = (icon, altText) => {
  const iconDiv = createElem("div", "icon");
  iconDiv.id = "icon";
  const faIcon = translateIconToFontAwesome(icon);
  faIcon.ariaHidden = true;
  faIcon.title = altText;
  iconDiv.appendChild(faIcon);
  return iconDiv;
};

const createElem = (elemType, divClassName, divText, unit) => {
  const div = document.createElement(elemType);
  div.className = divClassName;
  if (divText) {
    div.textContent = divText;
  }
  if (divClassName === "temp") {
    const unitDiv = document.createElement("div");
    unitDiv.classList.add("unit");
    unitDiv.textContent = unit;
    div.appendChild(unitDiv);
  }
  return div;
};

const translateIconToFontAwesome = (icon) => {
  const i = document.createElement("i");
  const firstTwoChars = icon.slice(0, 2);
  const lastChar = icon.slice(2);
  switch (firstTwoChars) {
    case "01":
      if (lastChar === "d") {
        i.classList.add("far", "fa-sun");
      } else {
        i.classList.add("far", "fa-moon");
      }
      break;
    case "02":
      if (lastChar === "d") {
        i.classList.add("fas", "fa-cloud-sun");
      } else {
        i.classList.add("fas", "fa-cloud-moon");
      }
      break;
    case "03":
      i.classList.add("fas", "fa-cloud");
      break;
    case "04":
      i.classList.add("fas", "fa-cloud-meatball");
      break;
    case "09":
      i.classList.add("fas", "fa-cloud-rain");
      break;
    case "10":
      if (lastChar === "d") {
        i.classList.add("fas", "fa-cloud-sun-rain");
      } else {
        i.classList.add("fas", "fa-cloud-moon-rain");
      }
      break;
    case "11":
      i.classList.add("fas", "fa-poo-storm");
      break;
    case "13":
      i.classList.add("far", "fa-snowflake");
      break;
    case "50":
      i.classList.add("fas", "fa-smog");
      break;
    default:
      i.classList.add("far", "fa-circle-question");
  }
  return i;
};

const displayCurrentConditions = (currentConditionsArray) => {
  const ccContainer = document.getElementById("currentForecast__conditions");
  currentConditionsArray.forEach((cc) => {
    ccContainer.appendChild(cc);
  });
};
