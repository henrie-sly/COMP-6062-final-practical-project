const app = Vue.createApp({
    data() {
        return {
            // Random User
            userName: "",
            userAge: "",
            userImage: "",

            // Weather
            city: "London",
            province: "Ontario",
            country: "Canada",
            temperature: "",
            wind: "",
            description: "",

            // Dictionary
            word: "",
            dictWord: "",
            phonetic: "",
            definition: ""
        }
    },

    methods: {

        // Random user
        async getUser() {
            const response = await fetch("https://randomuser.me/api/");
            const data = await response.json();

            const user = data.results[0];

            this.userName = user.name.first + " " + user.name.last;
            this.userAge = user.dob.age;
            this.userImage = user.picture.large;
        },

        // Weather 
        async getWeather() {
            const location = `${this.city} ${this.province} ${this.country}`;

            // Get coordinates
            const geoRes = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${location}`);
            const geoData = await geoRes.json();

            const lat = geoData[0].lat;
            const lon = geoData[0].lon;

            // Get weather
            const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`);
            const weatherData = await weatherRes.json();

            this.temperature = weatherData.current_weather.temperature;
            this.wind = weatherData.current_weather.windspeed;

            // 👇 IMPORTANT: convert weather code to text
            const code = weatherData.current_weather.weathercode;
            this.description = this.getWeatherDescription(code);
        },

        //Description
        getWeatherDescription(code) {
            const map = {
                0: "Clear sky ☀️",
                1: "Mainly clear 🌤️",
                2: "Partly cloudy ⛅",
                3: "Overcast ☁️",
                45: "Fog 🌫️",
                48: "Fog 🌫️",
                51: "Light drizzle 🌦️",
                61: "Rain 🌧️",
                63: "Moderate rain 🌧️",
                65: "Heavy rain 🌧️",
                71: "Snow ❄️",
                80: "Rain showers 🌦️"
            };

            return map[code] || "Unknown";
        },

        // Dictionary
        async getDefinition() {
            const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${this.word}`);
            const data = await res.json();

            this.dictWord = data[0].word;
            this.phonetic = data[0].phonetic;
            this.definition = data[0].meanings[0].definitions[0].definition;
        }
    },

    mounted(){
        this.getUser();
        this.getWeather();
    }
});

app.mount('#app');
