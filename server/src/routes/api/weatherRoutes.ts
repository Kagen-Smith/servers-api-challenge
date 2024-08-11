import { Router } from 'express';
const router = Router();

// import HistoryService from '../../service/historyService.js';
import HistoryService from '../../service/historyService.js';
const historyService = new HistoryService();
// import WeatherService from '../../service/weatherService.js';
import WeatherService from '../../service/weatherService.js';
const weatherService = new WeatherService();
// TODO: POST Request with city name to retrieve weather data
router.post('/', (req, res) => {
  const { city } = req.body;

  if (!city) {
    return res.status(400).json({ error: `Ciry name is required` });
  }
  // TODO: GET weather data from city name
  try {
    const locationData = weatherService.fetchLocationData(city);
    const weatherData = weatherService.fetchWeatherData(locationData);
    const currentWeather = weatherService.parseCurrentWeather(weatherData);
    const forecastArray = weatherService.buildForcastArray(currentWeather, weatherData.list);
    // TODO: save city to search history

    const citySaved = historyService.citySaved(city);

    return res.status(200).json({ currentWeather, forecastArray, citySaved });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ Error: `Failed to get weather data.` });
  }
});

// TODO: GET search history
router.get('/history', async (req, res) => { 
  try { 
    const searchHistory = await historyService.getSearchHistory();
    res.status(200).json({searchHistory})
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to get search history.'})
  }
});

// * BONUS TODO: DELETE city from search history
router.delete('/history/:id', async (req, res) => {
  const {id} = req.params;
  try {
    const deleteCity = await historyService.deleteCity(id);
    res.status(200).json({ deleteCity });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: `Failed to delete city`});
  }
 });

export default router;
