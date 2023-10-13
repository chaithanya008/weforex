import React, { useState, useEffect } from "react";
import axios from "axios";
import { Modal } from "antd";

const Cities = () => {
  const cityList = [
    "Delhi",
    "Beijing",
    "Tokyo",
    "Washington",
    "Berlin",
    "Brasília",
    "London",
    "Toronto",
  ];
  const [weatherResp, setWeatherResp] = useState([]);
  const [currencyResp, setCurrencyResp] = useState([]);
  const [currentData, setCurrent] = useState();
  const [openModal, setModal] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      const responses = [];

      for (const city of cityList) {
        try {
          const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=2ba9f1f49a271c293cd86bb50526c90d`;
          const response = await axios.get(apiUrl);
          const data = response.data;
          data.main.temp = (data.main.temp - 273.15).toFixed(0);
          responses.push(data);
        } catch (error) {
          console.error("Error fetching weather data", error);
        }
      }

      setWeatherResp(responses);
    };

    fetchData();
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      const apiUrl = `https://api.currencyapi.com/v3/latest?apikey=cur_live_DCMWBXbyNqJlLFGrnajM91zp2fglMU8GA16aVzgu`;
      const response = await axios.get(apiUrl);
      // Create a new array to update the state
      const updatedCurrencyResp = [];
      for (const currencyCode in response.data.data) {
        const currencyInfo = response.data.data[currencyCode];

        if (currencyInfo.code === "GBP")
          updatedCurrencyResp.push({
            val: `£ ${currencyInfo.value.toFixed(1)}`,
            country: "GB",
          });
        else if (currencyInfo.code === "INR")
          updatedCurrencyResp.push({
            val: `₹ ${currencyInfo.value.toFixed(1)}`,
            country: "IN",
          });
        else if (currencyInfo.code === "CNY")
          updatedCurrencyResp.push({
            val: `¥ ${currencyInfo.value.toFixed(1)}`,
            country: "CN",
          });
        else if (currencyInfo.code === "JPY")
          updatedCurrencyResp.push({
            val: `¥ ${currencyInfo.value.toFixed(1)}`,
            country: "JP",
          });
        else if (currencyInfo.code === "USD")
          updatedCurrencyResp.push({
            val: `US ${currencyInfo.value.toFixed(1)}`,
            country: "US",
          });
        else if (currencyInfo.code === "EUR")
          updatedCurrencyResp.push({
            val: `€ ${currencyInfo.value.toFixed(1)}`,
            country: "DE",
          });
        else if (currencyInfo.code === "BRL")
          updatedCurrencyResp.push({
            val: `R$ ${currencyInfo.value.toFixed(1)}`,
            country: "BR",
          });
        else if (currencyInfo.code === "CAD")
          updatedCurrencyResp.push({
            val: `CAD ${currencyInfo.value.toFixed(1)}`,
            country: "CA",
          });
      }
      setCurrencyResp(updatedCurrencyResp);
    };

    fetchData();
  }, []);

  return (
    <div>
      {/* Render the weather data here */}
      {
        <div className="card-area ">
          {weatherResp &&
            weatherResp.map((data, index) => (
              <div
                key={index}
                className="card"
                onClick={() => {
                  setCurrent(data);
                  setModal(true);
                }}
              >
                <div className="justify-between flex">
                  <h2>{data.name + ", " + data.sys.country}</h2>

                  <img
                    src={` https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`}
                    alt="ico"
                  />
                  <h2 className="temp-card">{data.main.temp}°</h2>
                </div>
              </div>
            ))}
          <Modal
            open={openModal}
            onCancel={() => {
              setModal(false);
            }}
            width={450}
          >
            {currentData && (
              <div>
                <div className="flex justify-between">
                  <h2 className="sub-title">
                    {currentData.name + ", " + currentData.sys.country}
                  </h2>
                  <img
                    src={` https://openweathermap.org/img/wn/${currentData.weather[0].icon}@2x.png`}
                    alt="ico"
                  />
                </div>
                <div className="justify-between flex">
                  <h2 className="temp-sm">{currentData.main.temp}°</h2>

                  <div>
                    <h4>Details</h4>
                    <h4>
                      Feels Like:
                      {(currentData.main.feels_like - 273.15).toFixed(0)}°
                    </h4>
                    <h4>
                      Wind: {(currentData.wind.speed * 1.60934).toFixed(1)}kph
                    </h4>
                    <h4>Humidity: {currentData.main.humidity}%</h4>
                  </div>
                </div>
                <div className="currency">
                  <h2>Forex</h2>
                  <h2 className="main-txt">
                    1 USD =
                    {" " +
                      currencyResp.find(
                        (item) => item.country === currentData.sys.country
                      )?.val}
                  </h2>
                </div>
              </div>
            )}
          </Modal>
        </div>
      }
    </div>
  );
};

export default Cities;
