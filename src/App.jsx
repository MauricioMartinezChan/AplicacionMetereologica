import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Container,
  TextField,
  Typography,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";

const API_KEY = "4490f3b5fd564a37ac8143640232405";
const API_WEATHER = `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&aqi=no`;

const ERROR_MESSAGES = {
  cityRequired: "El campo ciudad es obligatorio",
};

const LOADING_MESSAGES = {
  searching: "Buscando...",
};

const App = () => {
  const [city, setCity] = useState("");
  const [error, setError] = useState({ error: false, message: "" });
  const [loading, setLoading] = useState(false);
  const [weather, setWeather] = useState({
    city: "",
    country: "",
    temperature: 0,
    condition: "",
    conditionText: "",
    icon: "",
  });
  const [searchHistory, setSearchHistory] = useState([]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError({ error: false, message: "" });
    setLoading(true);

    try {
      if (!city.trim()) {
        throw new Error(ERROR_MESSAGES.cityRequired);
      }

      const res = await fetch(`${API_WEATHER}&q=${encodeURIComponent(city)}`);
      const data = await res.json();

      if (data.error) {
        throw new Error(data.error.message);
      }

      const { location, current } = data;

      const newWeather = {
        city: location.name,
        country: location.country,
        temperature: current.temp_c,
        condition: current.condition.code,
        conditionText: current.condition.text,
        icon: current.condition.icon,
      };

      setWeather(newWeather);
      setSearchHistory((prevHistory) => [...prevHistory, newWeather]);
    } catch (error) {
      console.log(error);
      setError({ error: true, message: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 2 }}>
      <Typography variant="h3" component="h1" align="center" gutterBottom className="title">
        Aplicación Meteorológica
      </Typography>

      {weather.city && (
        <Box sx={{ mt: 2 }}>
          <Card>
            <CardContent>
              <Typography variant="h4" component="h2" className="weather-title">
                {weather.city}, {weather.country}
              </Typography>
              <Box
                component="img"
                alt={weather.conditionText}
                src={weather.icon}
                sx={{ margin: "0 auto" }}
              />
              <Typography variant="h5" component="h3" className="temperature">
                {weather.temperature} °C
              </Typography>
              <Typography variant="h6" component="h4" className="condition">
                {weather.conditionText}
              </Typography>
            </CardContent>
          </Card>
        </Box>
      )}

      {searchHistory.length > 0 && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="h4" component="h2" className="history-title">
            Busquedas Pasadas
          </Typography>
          {searchHistory.map((weatherData, index) => (
            <Card key={index} className="history-card">
              <CardContent>
                <Typography variant="h5" component="h3">
                  {weatherData.city}, {weatherData.country}
                </Typography>
                <Box
                  component="img"
                  alt={weatherData.conditionText}
                  src={weatherData.icon}
                  sx={{ margin: "0 auto" }}
                />
                <Typography variant="body1" component="p">
                  {weatherData.temperature} °C
                </Typography>
                <Typography variant="body2" component="p">
                  {weatherData.conditionText}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}

      <Box
        component="form"
        autoComplete="off"
        onSubmit={onSubmit}
        sx={{ display: "grid", gap: 2, mt: 2 }}
      >
        <TextField
          id="city"
          label="Ciudad"
          variant="outlined"
          size="small"
          required
          value={city}
          onChange={(e) => setCity(e.target.value)}
          error={error.error}
          helperText={error.message}
        />

        <LoadingButton
          type="submit"
          variant="contained"
          loading={loading}
          loadingIndicator={LOADING_MESSAGES.searching}
          className="search-button"
        >
          Buscar
        </LoadingButton>
      </Box>

      <Typography textAlign="center" sx={{ mt: 2, fontSize: "10px" }} className="footer-text">
        {/* Otros elementos */}
      </Typography>
    </Container>
  );
};

export default App;
