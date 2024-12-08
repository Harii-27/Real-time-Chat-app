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
const appId = "25e9b67830d60ad916e46f8cdd004adc";

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
  const [currentDateTime, setCurrentDateTime] = useState<Date>(new Date());

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


  // Update the time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  // Determine greeting
  const currentHour = currentDateTime.getHours();
  let greeting;
  if (currentHour < 12) {
    greeting = "Good Morning";
  } else if (currentHour < 17) {
    greeting = "Good Afternoon";
  } else {
    greeting = "Good Evening";
  }


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
  

  // Filter data for the next 6 hours
  const hourlyForecast = forecastData?.list?.slice(0, 6);
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
          <button type="submit">Search</button>
        </form>

        {/* Left side of the UI */}
        <div className="current-weather-details-box">

          
        <h4>{currentDateTime.toLocaleDateString()}</h4>
 
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
                          
                              <h1>{citySearchData.main.temp}°</h1>
                            </div>
                            <h4 className="description">
                              {citySearchData.weather[0].description}
                            </h4>

                            <div className="key-value-box">
                              <div className="key">
                                <Icon icon={droplet} size={20} className="icon" />
                               
                              </div>
                              <div className="value">
                                <span>{citySearchData.main.humidity}%</span>
                              </div>
                            </div>

                            <div className="key-value-box">
                              <div className="key">
                                <Icon icon={wind} size={20} className="icon" />
                               
                              </div>
                              <div className="value">
                                <span>{citySearchData.wind.speed}kph</span>
                              </div>
                            </div>

                                                  {/* Day wise report*/}
                      {filteredForecast.length > 0 ? (
                        <div className="day-forecasts-container">
                          {filteredForecast.map((data, index) => {
                            const date = new Date(data.dt_txt);
                            const day = date.toLocaleDateString("en-US", {
                              weekday: "short",
                            });
                            return (
                              <div className="forecast-box" key={index}>
                                <h5>{day}</h5>
                                <h5 className="max-temp">
                                  {data.main.temp_max}°
                                </h5>
                                <h5 className='description'>{data.weather[0].description}</h5>
                           
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div>No Day Forecast Data Available</div>
                      )}
                      
                          </div>




                  
{/* //right side of the ui */}


                          <div className="metrices">
                          <h3>{greeting}</h3>
                          <h4>
            {currentDateTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </h4>

                          <div className="details">
                           
                            <div className="icon-and-temp">
                          
                              <h1>{citySearchData.main.temp}°</h1>
                            </div>
                            <h4 className="description">
                              {citySearchData.weather[0].description}
                            </h4>

                            <div className="key-value-box">
                              <div className="key">
                                <Icon icon={droplet} size={20} className="icon" />
                               
                              </div>
                              <div className="value">
                                <span>{citySearchData.main.humidity}%</span>
                              </div>
                            </div>

                            <div className="key-value-box">
                              <div className="key">
                                <Icon icon={wind} size={20} className="icon" />
                               
                              </div>
                              <div className="value">
                                <span>{citySearchData.wind.speed}kph</span>
                              </div>
                            </div>
                            </div>

                              <h4>
                              Feels like {citySearchData.main.feels_like}°
                            </h4>

                                     {/* Hourly forecast data */}
                      <h4 className="hourly-forecast-heading">Hourly Forecast</h4>
                      {hourlyForecast && hourlyForecast.length > 0 ? (
                        <div className="hourly-forecasts-container">
                          {hourlyForecast.map((data, index) => {
                            const hour = new Date(data.dt_txt).getHours();
                            return (
                              <div className="forecast-box" key={index}>
                                <h5>{hour}:00</h5>
                                {/* <img
                                  src={`https://openweathermap.org/img/wn/${data.weather[0].icon}.png`}
                                  alt="icon"
                                /> */}
                                    <h5 className="max-temp">
                                  {data.main.temp_max}°
                                </h5>
                                <h5 className='description'>{data.weather[0].description}</h5>
                          
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div>No Hourly Forecast Data Available</div>
                      )}
                         
                     </div>
                        </div>
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
