// Personal API Key for OpenWeatherMap API
const apiKey = '5905daf45d736cd4787cc7b389b32f47';


// Base URL for OpenWeatherMap API
const baseURL = 'https://api.openweathermap.org/data/2.5/weather?zip=';

// Event listener for the "Generate" button
document.getElementById('generate').addEventListener('click', performAction);

// Function to handle button click
function performAction() {
    const zip = document.getElementById('zip').value;
    const feelings = document.getElementById('feelings').value;

    // Get weather data
    getWeatherData(baseURL, zip, apiKey)
        .then(data => {
            if (!data || !data.main) {
                throw new Error('Invalid weather data received.');
            }
            const today = new Date();
            const formattedDate = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;

            // Post data to server
            postData('http://localhost:3001/add', {
                date: formattedDate,
                temp: data.main.temp,
                feel: feelings,
            });

        })
        .then(() => {
            // Update UI

            updateUI();
        });
}


const getWeatherData = async (baseURL, zip, apiKey) => {
    try {
        const response = await fetch(baseURL + zip + '&appid=' + apiKey);

        // Check the currency status
        if (!response.ok) {
            throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching weather data:', error.message);
        alert('Failed to fetch weather data. Please check the ZIP code and try again.');
    }
};

// Function to POST data to the server
const postData = async (url = '', data = {}) => {
    const response = await fetch(url, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    try {
        return await response.json();
    } catch (error) {
        console.error('Error posting data:', error);
    }
};

// Function to GET data from the server and update UI
const updateUI = async () => {
    const request = await fetch('http://localhost:3001/all');

    try {
        // console.log(request.json())
        const allData = await request.json();
        // console.log(allData)
        document.getElementById('date').innerHTML = `Date: ${allData.date}`;
        document.getElementById('temp').innerHTML = `Temperature: ${allData.temp}°F`;
        document.getElementById('content').innerHTML = `Feelings: ${allData.feel}`;
        // console.log(request.json())

    } catch (error) {
        console.error('Error updating UI:', error);
    }
};
