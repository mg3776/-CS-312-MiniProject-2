const express = require("express");
const axios = require("axios");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// 🔑 Replace with your OpenWeatherMap API key
const API_KEY = "6a64acb518f24ed45295e3e5493512c5";

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));

// GET home page
app.get("/", (req, res) => {
  res.render("index", { weather: null, error: null });
});

// POST city form
app.post("/", async (req, res) => {
  const city = req.body.city.trim();

  if (!city) {
    return res.render("index", { weather: null, error: "⚠️ Please enter a city." });
  }

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
    city
  )}&appid=${API_KEY}&units=metric`;

  try {
    const response = await axios.get(url);
    const data = response.data;

    // Map API main weather to CSS class
    let mainWeather = data.weather[0].main.toLowerCase();

    const weatherMap = {
      haze: "mist",
      smoke: "mist",
      dust: "mist",
      sand: "mist",
      ash: "mist",
      squall: "thunderstorm",
      tornado: "thunderstorm"
    };

    if (weatherMap[mainWeather]) mainWeather = weatherMap[mainWeather];

    const weather = {
      city: data.name,
      temp: data.main.temp,
      desc: data.weather[0].description, // e.g., "overcast clouds"
      icon: `http://openweathermap.org/img/w/${data.weather[0].icon}.png`,
      class: mainWeather
    };

    console.log("API main weather:", data.weather[0].main);
    console.log("CSS class applied:", mainWeather);

    res.render("index", { weather, error: null });
  } catch (err) {
    console.error("API Error:", err.response ? err.response.data : err.message);
    res.render("index", { weather: null, error: "❌ Could not fetch weather. Try another city." });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
