import React, { useState, useEffect } from 'react';
import axios from "axios";
import Icon from "react-icons-kit";
import { search } from "react-icons-kit/feather/search";
import { arrowUp } from "react-icons-kit/feather/arrowUp";
import { arrowDown } from "react-icons-kit/feather/arrowDown";
import { droplet } from "react-icons-kit/feather/droplet";
import { wind } from "react-icons-kit/feather/wind";
import { activity } from "react-icons-kit/feather/activity";
import { SphereSpinner } from "react-spinners-kit";

// Directly include hostName and appId
const hostName = "https://api.openweathermap.org";
const appId = "f49653e026f6bd0c4262ce24fd7466ae";

// Define interfaces for the weather and forecast data
type WeatherData = {
  name: string;
  weather: { description: string; icon: string }[];
  main: { temp: number; feels_like: number; temp_max: number; temp_min: number; humidity: number; pressure: number };
  wind: { speed: number };
  coord: { lat: number; lon: number };
}
interface Forecast {
  dt_txt: string;
  weather: { icon: string; description: string }[];
  main: { temp_max: number; temp_min: number };
}

function App() {
  // Local state
  const [city, setCity] = useState<string>("chennai");
  const [unit, setUnit] = useState<string>("metric"); // metric = C and imperial = F
  const [loadings, setLoadings] = useState<boolean>(true);
  const [citySearchData, setCitySearchData] = useState<WeatherData | { error: string } | null>(null);
  const [forecastData, setForecastData] = useState<{ list: Forecast[] } | null>(null);
  const [forecastError, setForecastError] = useState<string | null>(null);

  // Fetch city weather data
  const fetchCityData = async () => {
    try {
      const response = await axios.get(
        `${hostName}/data/2.5/weather?q=${city}&units=${unit}&APPID=${appId}`
      );
      setCitySearchData(response.data);
      return response.data.coord;
    } catch (error: any) {
      setCitySearchData({ error: error.response.data.message });
      return null;
    }
  };

  // Fetch 5-day forecast data
  const fetchForecastData = async (coords: { lat: number; lon: number }) => {
    if (!coords) return;
    try {
      const response = await axios.get(
        `${hostName}/data/2.5/forecast?lat=${coords.lat}&lon=${coords.lon}&units=${unit}&APPID=${appId}`
      );
      setForecastData(response.data);
      setForecastError(null);
    } catch (error: any) {
      setForecastError(error.response.data.message);
    }
  };

  // Fetch data based on city and unit
  const fetchData = async () => {
    setLoadings(true);
    const coords = await fetchCityData();
    if (coords) {
      fetchForecastData(coords);
    }
    setLoadings(false);
  };

  // Initial fetch on load and when unit changes
  useEffect(() => {
    fetchData();
  }, [unit]);

  // Handle unit toggle
  const toggleUnit = () => {
    setUnit(unit === "metric" ? "imperial" : "metric");
  };

  // Handle city search
  const handleCitySearch = (e: React.FormEvent) => {
    e.preventDefault();
    setLoadings(true);
    fetchData();
  };

  // Filter forecast data based on the time of the first object
  const filterForecastByFirstObjTime = (forecastData: any[]) => {
    if (!forecastData || forecastData.length === 0) return [];
    const firstObjTime = forecastData[0]?.dt_txt?.split(" ")[1];
    if (!firstObjTime) return [];
    return forecastData.filter((data) => data.dt_txt?.endsWith(firstObjTime));
  };

  // Filter data for the next 4 hours
  const hourlyForecast = forecastData?.list?.slice(0, 4);
  const filteredForecast = filterForecastByFirstObjTime(forecastData?.list || []);

  return (
    <div className="background">
      <div className="box">
        {/* City search form */}
        <form autoComplete="off" onSubmit={handleCitySearch}>
          <label>
            <Icon icon={search} size={20} />
          </label>
          <input
            type="text"
            className="city-input"
            placeholder="Enter City"
            required
            value={city}
            onChange={(e) => setCity(e.target.value)}
            readOnly={loadings}
          />
          <button type="submit">GO</button>
        </form>

        {/* Current weather details box */}
        <div className="current-weather-details-box">
          <div className="details-box-header">
            <h4>Current Weather</h4>
            <div className="switch" onClick={toggleUnit}>
              <div
                className={`switch-toggle ${unit === "metric" ? "c" : "f"}`}
              ></div>
              <span className="c">C</span>
              <span className="f">F</span>
            </div>
          </div>

          {loadings ? (
            <div className="loader">
              <SphereSpinner loading={loadings} color="#2fa5ed" size={20} />
            </div>
          ) : (
            <>
              {citySearchData && 'error' in citySearchData ? (
                <div className="error-msg">{citySearchData.error}</div>
              ) : (
                <>
                  {forecastError ? (
                    <div className="error-msg">{forecastError}</div>
                  ) : (
                    <>
                      {citySearchData && 'name' in citySearchData && (
                        <div className="weather-details-container">
                          <div className="details">
                            <h4 className="city-name">{citySearchData.name}</h4>
                            <div className="icon-and-temp">
                              <img
                                src={`https://openweathermap.org/img/wn/${citySearchData.weather[0].icon}@2x.png`}
                                alt="icon"
                              />
                              <h1>{citySearchData.main.temp}°</h1>
                            </div>
                            <h4 className="description">
                              {citySearchData.weather[0].description}
                            </h4>
                          </div>

                          <div className="metrices">
                            <h4>
                              Feels like {citySearchData.main.feels_like}°
                            </h4>
                            <div className="key-value-box">
                              <div className="key">
                                <Icon icon={arrowUp} size={20} className="icon" />
                                <span className="value">
                                  {citySearchData.main.temp_max}°
                                </span>
                              </div>
                              <div className="key">
                                <Icon icon={arrowDown} size={20} className="icon" />
                                <span className="value">
                                  {citySearchData.main.temp_min}°
                                </span>
                              </div>
                            </div>
                            <div className="key-value-box">
                              <div className="key">
                                <Icon icon={droplet} size={20} className="icon" />
                                <span>Humidity</span>
                              </div>
                              <div className="value">
                                <span>{citySearchData.main.humidity}%</span>
                              </div>
                            </div>
                            <div className="key-value-box">
                              <div className="key">
                                <Icon icon={wind} size={20} className="icon" />
                                <span>Wind</span>
                              </div>
                              <div className="value">
                                <span>{citySearchData.wind.speed}kph</span>
                              </div>
                            </div>
                            <div className="key-value-box">
                              <div className="key">
                                <Icon icon={activity} size={20} className="icon" />
                                <span>Pressure</span>
                              </div>
                              <div className="value">
                                <span>{citySearchData.main.pressure} hPa</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                      {/* Hourly forecast data */}
                      <h4 className="hourly-forecast-heading">Hourly Forecast (Next 4 Hours)</h4>
                      {hourlyForecast && hourlyForecast.length > 0 ? (
                        <div className="hourly-forecast-container">
                          {hourlyForecast.map((data, index) => {
                            const hour = new Date(data.dt_txt).getHours();
                            return (
                              <div className="hourly-forecast-box" key={index}>
                                <h5>{hour}:00</h5>
                                <img
                                  src={`https://openweathermap.org/img/wn/${data.weather[0].icon}.png`}
                                  alt="icon"
                                />
                                <h5>{data.weather[0].description}</h5>
                                <h5 className="min-max-temp">
                                  {data.main.temp_max}° / {data.main.temp_min}°
                                </h5>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div>No Hourly Forecast Data Available</div>
                      )}
                      {/* Extended forecast data */}
                      <h4 className="extended-forecast-heading">Extended Forecast</h4>
                      {filteredForecast.length > 0 ? (
                        <div className="extended-forecasts-container">
                          {filteredForecast.map((data, index) => {
                            const date = new Date(data.dt_txt);
                            const day = date.toLocaleDateString("en-US", {
                              weekday: "short",
                            });
                            return (
                              <div className="forecast-box" key={index}>
                                <h5>{day}</h5>
                                <img
                                  src={`https://openweathermap.org/img/wn/${data.weather[0].icon}.png`}
                                  alt="icon"
                                />
                                <h5>{data.weather[0].description}</h5>
                                <h5 className="min-max-temp">
                                  {data.main.temp_max}° / {data.main.temp_min}°
                                </h5>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div>No Extended Forecast Data Available</div>
                      )}
                    </>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}export default App;
