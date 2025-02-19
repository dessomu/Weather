import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [weather, setWeather] = useState();
  const [forecast, setForecast] = useState([]);
  let date = new Date();

  const [time, setTime] = useState(date);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  //in case data not fetched yet and the weather is undefined
  const realTimeWeather = {
    temp: weather?.current?.temp_c || "Loading..",
    humidity: weather?.current?.humidity || "Loading..",
    preipitation: weather?.current?.precip_mm || "Loading..",
    wind: weather?.current?.wind_kph || "Loading..",
    windDir: weather?.current?.wind_dir || "Loading..",
    visibility: weather?.current?.vis_km || "Loading..",
    realFeel: weather?.current?.feelslike_c || "Loading..",
  };

  let currentHour = date.getHours();

  let hourlyForecast = [];
  if (forecast && forecast.length > 0) {
    hourlyForecast = forecast.slice(currentHour, currentHour + 5);
  }

  console.log(weather);

  async function fetchWeather() {
    try {
      const response = await fetch(
        "https://api.weatherapi.com/v1/current.json?key=9e8d41abeb974084b5250832251802&q=Kolkata"
      );
      const data = await response.json();
      if (data) {
        setWeather(data);
      } else {
        setWeather(null);
      }
    } catch (error) {
      console.log("Error", error);
    }
  }

  async function fetchForecast() {
    try {
      const response = await fetch(
        "https://api.weatherapi.com/v1/forecast.json?key=9e8d41abeb974084b5250832251802&q=Kolkata&days=3&aqi=yes&alerts=yes"
      );
      const data = await response.json();
      if (data) {
        setForecast(data.forecast.forecastday[0].hour);
      } else {
        setForecast(null);
      }
    } catch (error) {
      console.log("Error", error);
    }
  }
  useEffect(() => {
    fetchWeather();
    fetchForecast();
  }, []);

  return (
    <>
      <div className="main">
        <div className="container">
          <div className="primary">
            <div className="location-date">
              <div className="place">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/927/927667.png"
                  alt="location-icon"
                  className="location-icon"
                />
                Kolkata
              </div>
              <div className="date">{date.toDateString()}</div>
            </div>
            <div className="temp">
              <div className="temperature">{realTimeWeather.temp}°</div>
              <div className="additional-info">
                <span>💧{realTimeWeather.humidity} %</span>
                <span>
                  {"\uD83C\uDF27"} {realTimeWeather.preipitation} mm
                </span>
              </div>
            </div>
            <ol className="hourly-forecast">
              {hourlyForecast.map((item, index) => (
                <li key={index}>
                  <strong style={{ fontSize: "20px" }}>
                    {item.time.substr(11, 5)}
                  </strong>
                  <br />
                  <span>{item.temp_c} °C</span>
                  <span>💧 {item.humidity}%</span>
                  <span>
                    {"\uD83C\uDF27"} {item.precip_mm} mm
                  </span>
                </li>
              ))}
            </ol>
          </div>
          <div className="secondary">
            <div className="time">
              <h3>
                {time.toLocaleTimeString().substring(0, 5)}
                <span> </span>
                {currentHour >= 12 ? "PM" : "AM"}
              </h3>
            </div>
            <div className="details">
              <p>Humidity : {realTimeWeather.humidity}%</p>
              <p>Feels Like : {realTimeWeather.realFeel}%</p>
              <p>Wind Speed : {realTimeWeather.wind} KM/H</p>
              <p>Wind Direction : {realTimeWeather.windDir}</p>
              <p>Visibility : {realTimeWeather.visibility} KM</p>
              <p>Precip : {realTimeWeather.preipitation} mm</p>
            </div>
            <div className="instruction">
              <h3>Symbols</h3>
              <br />
              <span>Humidity : 💧</span>
              <span>Precipitaion : {"\uD83C\uDF27"} </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
