import { useState, useEffect } from "react";
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

function App() {
  // Local state
  const [city, setCity] = useState("chennai");
  const [unit, setUnit] = useState("metric"); // metric = C and imperial = F
  const [loadings, setLoadings] = useState(true);
  const [citySearchData, setCitySearchData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [forecastError, setForecastError] = useState(null);

  // Fetch city weather data
  const fetchCityData = async () => {
    try {
      const response = await axios.get(
        `${hostName}/data/2.5/weather?q=${city}&units=${unit}&APPID=${appId}`
      );
      setCitySearchData(response.data);
      return response.data.coord;
    } catch (error) {
      setCitySearchData({ error: error.response.data.message });
      return null;
    }
  };

  // Fetch 5-day forecast data
  const fetchForecastData = async (coords) => {
    if (!coords) return;
    try {
      const response = await axios.get(
        `${hostName}/data/2.5/forecast?lat=${coords.lat}&lon=${coords.lon}&units=${unit}&APPID=${appId}`
      );
      setForecastData(response.data);
      setForecastError(null);
    } catch (error) {
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
  const handleCitySearch = (e) => {
    e.preventDefault();
    setLoadings(true);
    fetchData();
  };

  // Filter forecast data based on the time of the first object
  const filterForecastByFirstObjTime = (forecastData) => {
    if (!forecastData) {
      return [];
    }

    const firstObjTime = forecastData[0].dt_txt.split(" ")[1];
    return forecastData.filter((data) => data.dt_txt.endsWith(firstObjTime));
  };

  // Filter data for the next 4 hours
  const hourlyForecast = forecastData?.list?.slice(0, 4);

  const filteredForecast = filterForecastByFirstObjTime(forecastData?.list);

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
              <SphereSpinner loadings={loadings} color="#2fa5ed" size={20} />
            </div>
          ) : (
            <>
              {citySearchData && citySearchData.error ? (
                <div className="error-msg">{citySearchData.error}</div>
              ) : (
                <>
                  {forecastError ? (
                    <div className="error-msg">{forecastError}</div>
                  ) : (
                    <>
                      {citySearchData && citySearchData.name && (
                        <div className="weather-details-container">
                          <div className="details">
                            <h4 className="city-name">{citySearchData.name}</h4>
                            <div className="icon-and-temp">
                              <img
                                src={`https://openweathermap.org/img/wn/${citySearchData.weather[0].icon}@2x.png`}
                                alt="icon"
                              />
                              <h1>{citySearchData.main.temp}&deg;</h1>
                            </div>
                            <h4 className="description">
                              {citySearchData.weather[0].description}
                            </h4>
                          </div>

                          <div className="metrices">
                            <h4>
                              Feels like {citySearchData.main.feels_like}&deg;
                            </h4>
                            <div className="key-value-box">
                              <div className="key">
                                <Icon icon={arrowUp} size={20} className="icon" />
                                <span className="value">
                                  {citySearchData.main.temp_max}&deg;
                                </span>
                              </div>
                              <div className="key">
                                <Icon icon={arrowDown} size={20} className="icon" />
                                <span className="value">
                                  {citySearchData.main.temp_min}&deg;
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
                                  {data.main.temp_max}&deg; / {data.main.temp_min}&deg;
                                </h5>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="error-msg">No Data Found</div>
                      )}
                      {/* Hourly forecast (next 4 hours) */}
                      <h4 className="hourly-forecast-heading">Next 4 Hours</h4>
                      {hourlyForecast?.length > 0 ? (
                        <div className="hourly-forecast-container">
                          {hourlyForecast.map((data, index) => {
                            const hour = new Date(data.dt_txt).getHours();
                            const temp = data.main.temp;
                            return (
                              <div className="hourly-forecast-box" key={index}>
                                <h5>{hour}:00</h5>
                                <img
                                  src={`https://openweathermap.org/img/wn/${data.weather[0].icon}.png`}
                                  alt="icon"
                                />
                                <h5>{temp}&deg;</h5>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="error-msg">No Data Found</div>
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
}

export default App;
