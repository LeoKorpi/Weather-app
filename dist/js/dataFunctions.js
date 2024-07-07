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
