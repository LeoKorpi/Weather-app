export const setLocationObject = (locationObject, coordsObj) => {
  const { lat, long, name, unit } = coordsObj;
  locationObject.setLat(lat);
  locationObject.setLong(long);
  locationObject.setName(name);
  if (unit) {
    locationObject.setUnit(unit);
  }
};

export const getHomeLocation = () => {
  return localStorage.getItem("defaultWeatherLocation");
};

export const getWeatherFromCoords = async (locationObj) => {
  //   const lat = locationObj.getLat();
  //   const long = locationObj.getLong();
  //   const units = locationObj.getUnit();
  //   const url = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${long}&exclude=minutely,hourly,alerts&units=${units}&appid=${WEATHER_API_KEY}`;
  //   try {
  //     const weatherStream = await fetch(url);
  //     const weatherJson = await weatherStream.json();
  //     return weatherJson;
  //   } catch (err) {
  //     console.error(err);
  //   }

  const urlDataObj = {
    lat: locationObj.getLat(),
    long: locationObj.getLong(),
    units: locationObj.getUnit(),
  };
  try {
    const weatherStream = await fetch("./.netlify/functions/get_weather", {
      method: "POST",
      body: JSON.stringify(urlDataObj),
    });
    const weatherJson = await weatherStream.json();
    return weatherJson;
  } catch (err) {
    console.error(err);
  }
};

export const getCoordsFromApi = async (entryText, units) => {
  //   const regex = /^\d+$/g;
  //   const flag = regex.test(entryText) ? "zip" : "q";
  //   const url = `https://api.openweathermap.org/data/2.5/weather?${flag}=${entryText}&APPID=${WEATHER_API_KEY}&units=${units}`;
  //   const encodedUrl = encodeURI(url);
  //   try {
  //     const dataStream = await fetch(encodedUrl);
  //     const jsonData = await dataStream.json();
  //     return jsonData;
  //   } catch (err) {
  //     console.log(err.stack);
  //   }

  const urlDataObj = {
    text: entryText,
    units: units,
  };
  try {
    const dataStream = await fetch("./.netlify/functions/get_coords", {
      method: "POST",
      body: JSON.stringify(urlDataObj),
    });
    const jsonData = await dataStream.json();
    return jsonData;
  } catch (err) {
    console.error(err);
  }
};

export const cleanText = (text) => {
  const regex = / {2,}/g;
  const entryText = text.replaceAll(regex, " ").trim();
  return entryText;
};
