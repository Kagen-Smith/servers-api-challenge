import { Router } from 'express';
const router = Router();

// import HistoryService from '../../service/historyService.js';
import HistoryService from '../../service/historyService.js';

// import WeatherService from '../../service/weatherService.js';
import WeatherService from '../../service/weatherService.js';
// TODO: POST Request with city name to retrieve weather data
router.post('/', async (req, res) => {
  const cityName = req.body.ciryName;
  if (!cityName) {
    return res.status(400).json({ error: 'City name is required.'});
  }
  try {
    const weatherData = await WeatherService.getWeatherForCity(cityName);
    await HistoryService.addCity(cityName);
    return res.status(200).json({ weatherData });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to get weather data.'});
  }

});

// TODO: GET search history
router.get('/history', async (_req, res) => {
  try {
    const history = await HistoryService.getCities();
    res.status(200).json({ history });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to get search history.'});
  }
});

// * BONUS TODO: DELETE city from search history
router.delete('/history/:id', async (req, res) => {
  const {id} = req.params;
  try {
    const deleteCity = await HistoryService.removeCity(id);
    res.status(200).json({ deleteCity });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: `Failed to delete city`});
  }
 });

export default router;
