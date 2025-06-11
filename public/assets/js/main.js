const apiKey = 'a2f7a208ac574e9d986163436251106'; // your key
const placeHolder = document.getElementById('weather-info');
const input = document.getElementById('city-input');
const button = document.getElementById('search-btn');
const daySelect = document.getElementById('day-select');

let forecastData = null; // store forecast data

// Search on click
button.addEventListener('click', () => {
  const city = input.value.trim();
  if (city) {
    getForecast(city);
  } else {
    placeHolder.innerHTML = '<p>Please enter a city name.</p>';
  }
});

// Support Enter key
input.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') button.click();
});

// Change forecast day
daySelect.addEventListener('change', () => {
  const dayIndex = parseInt(daySelect.value);
  if (forecastData) {
    displayForecast(dayIndex);
  }
});

// Fetch forecast data (up to 4 days)
async function getForecast(city) {
  const apiUrl = `https://api.weatherapi.com/v1/forecast.json?q=${city}&days=4&key=${apiKey}`;
  placeHolder.innerHTML = `<p>Loading...</p>`;

  try {
    const res = await fetch(apiUrl);
    const result = await res.json();

    if (result.error) {
      placeHolder.innerHTML = `<p> ${result.error.message}</p>`;
      return;
    }

    forecastData = result;
    daySelect.style.display = 'inline-block'; // show dropdown
    daySelect.value = "0"; // reset to today
    displayForecast(0); // show today's weather

  } catch (err) {
    console.error(err);
    placeHolder.innerHTML = `<p> Failed to fetch forecast.</p>`;
  }
}

// Show selected day's forecast
function displayForecast(dayIndex) {
  const day = forecastData.forecast.forecastday[dayIndex];
  const date = day.date;
  const city = forecastData.location.name;
  const country = forecastData.location.country;
  const temp = day.day.avgtemp_c;
  const condition = day.day.condition.text;
  const icon = day.day.condition.icon;

  placeHolder.innerHTML = `
    <p><strong>${city}, ${country}</strong></p>
    <p>${date}</p>
    <p>${temp}°C <img src="${icon}" alt="${condition}" /> - ${condition}</p>
  `;
}
