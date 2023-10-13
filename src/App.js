import "./App.css";
import axios from "axios";
import React, { useState, useEffect } from "react";
import Cities from "./cities";
function App() {
  const [latitude, setLatitude] = useState();
  const [longitude, setLongitude] = useState();
  const [weatherResp, setWeatherResp] = useState(null);
  const getWeather = () => {
    axios
      .get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&exclude={part}&appid=2ba9f1f49a271c293cd86bb50526c90d`
      )
      .then((response) => {
        setWeatherResp(response.data);
      })
      .catch((error) => {
        console.error("Error fetching weather data", error);
      });
  };

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(function (position) {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
      });
    }
  }, []);

  useEffect(() => {
    if (latitude && longitude) {
      getWeather();
    }
  }, [latitude, longitude]);
  const getCurrentTime = () => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${formattedHours}:${formattedMinutes} ${ampm}`;
  };

  const [currentTime, setCurrentTime] = useState(getCurrentTime());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(getCurrentTime());
    }, 1000);

    return () => clearInterval(interval);
  }, []);
  const isDay = currentTime >= 6 && currentTime < 18;
  const KelvinToDeg = () => {
    const kelvin = weatherResp.main.temp;
    const celsius = (kelvin - 273.15).toFixed(1);
    return celsius;
  };
  return (
    <div className="App main">
      {/* local country / city time, weather in degrees, exchange rate compared to usd/eur */}
      {weatherResp && (
        <div>
          <div className="location-sec">
            <h2>{weatherResp.name}</h2>
            <h2>{currentTime}</h2>
          </div>
          <div className="temp-sect">
            <div className="flex">
              <h1>{KelvinToDeg()}°</h1>
              <img
                src={` https://openweathermap.org/img/wn/${weatherResp.weather[0].icon}@2x.png`}
                alt="ico"
              />
            </div>
            <h2 className="sub-title">{weatherResp.weather[0].description}</h2>
          </div>
        </div>
      )}
      <Cities day={isDay} />
    </div>
  );
}

export default App;
