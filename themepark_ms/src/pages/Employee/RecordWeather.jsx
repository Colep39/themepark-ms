import {useState, useEffect} from "react";
import './RecordWeather.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function RecordWeather() {
    const [weatherData, setWeatherData] = useState({
        temperature: '',
        is_raining: '',
        date: ''
    });
    const [fetchedWeather, setFetchedWeather] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const token = localStorage.getItem("token");

    const handleChange = (e) => {
        setWeatherData({ ...weatherData, [e.target.name]: e.target.value });
    };

    useEffect(() => {
        const fetchTemp = async () => {
            try {
                const res = await fetch("https://api.open-meteo.com/v1/forecast?latitude=29.76&longitude=-95.36&current=temperature_2m,precipitation&temperature_unit=fahrenheit");
                const data = await res.json();

                const precip = data.current.precipitation;
                setFetchedWeather({
                    temperature: data.current.temperature_2m,
                    is_raining: precip > 0 ? "yes" : "no",
                });
            } catch (error) {
                console.error("Failed to fetch temp:", error);
            }
        };
        fetchTemp();
    }, []);
    

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

         // Transform "yes"/"no" to 1/0
         const formattedData = {
            temperature: weatherData.temperature,
            rainOut: weatherData.is_raining.toLowerCase() === "yes", // returns true or false
            date: weatherData.date
        };
        console.log(formattedData);    

        try {
            const response = await fetch("https://themepark-backend-bcfpc8dvabedfcbt.centralus-01.azurewebsites.net/api/weather", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify(formattedData),
            });

            if (!response.ok) throw new Error("Failed to record weather data");

            toast.success("Weather data recorded successfully!");

            
            setWeatherData({
                temperature: '',
                is_raining: '',
                date: ''
            });
        } catch (error) {
            console.error("Error recording weather data:", error);
            alert("Failed to record weather data.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const populateForm = () => {
        if (fetchedWeather) {
            setWeatherData({
                ...fetchedWeather,
                date: new Date().toISOString().split('T')[0]
            });
        }
    };

    return(
        <div className="record-weather-page">
           <div className="weather-container">
           <h3>Todays Weather</h3>
                {fetchedWeather ? (
                    <ul>
                        <li><strong>Temperature:</strong> {fetchedWeather.temperature}°F</li>
                        <li><strong>Is it Raining?</strong> {fetchedWeather.is_raining}</li>
                    </ul>
                ) : (
                    <p>Loading weather data...</p>
                )}

                <button onClick={populateForm}>Use This Weather Info</button>

                <h4>Record Weather Data</h4>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="temperature"
                        placeholder="Temperature (°F)"
                        value={weatherData.temperature}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="text"
                        name="is_raining"
                        placeholder="Rain (yes/no)"
                        value={weatherData.is_raining}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="date"
                        name="date"
                        value={weatherData.date}
                        onChange={handleChange}
                        required
                    />
                    <button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Submitting..." : "Submit Weather"}
                    </button>
                </form>
           </div>

        </div>
    );
}