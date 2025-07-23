import { useState, useEffect } from 'react';
import type { WeatherData } from '../types/weather';

interface WeatherDisplayProps {
    city?: string;
    coords?: {
        lat: number;
        lon: number;
    };
}

function WeatherDisplay({ city, coords }: WeatherDisplayProps) {
    const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!city && !coords) {
            setError("Nenhuma localização fornecida.");
            setLoading(false);
            return;
        }

        const fetchWeatherData = async () => {
            const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;
            if (!apiKey) {
                setError("Chave da API não encontrada.");
                setLoading(false);
                return;
            }

            let url = `https://api.openweathermap.org/data/2.5/weather?appid=${apiKey}&units=metric&lang=pt_br`;
            if (coords) {
                url += `&lat=${coords.lat}&lon=${coords.lon}`;
            } else if (city) {
                url += `&q=${city}`;
            }

            try {
                setLoading(true);
                setError(null);

                const minimumTimePromise = new Promise(resolve => setTimeout(resolve, 2000));

                const fetchPromise = fetch(url).then(response => {
                    if (!response.ok) {
                        throw new Error(`Erro: ${response.status} - Verifique a localização.`);
                    }
                    return response.json();
                });

                const [data] = await Promise.all([fetchPromise, minimumTimePromise]);

                setWeatherData(data);

            } catch (err) {
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError("Ocorreu um erro desconhecido.");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchWeatherData();
    }, [city, coords]);

    if (loading) return <div className="loader-wrapper"><div className="loader"></div></div>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;
    if (!weatherData) return null;

    console.log(weatherData.weather[0].main)
    let weatherMessage = null;

    // Supondo que 'weatherData' seja o objeto recebido da API OpenWeatherMap
    switch (weatherData.weather[0].main) {
        case "Thunderstorm":
            weatherMessage = "Hoje o tempo está com trovoada! ⛈️";
            break;

        case "Drizzle":
            weatherMessage = "Está chuviscando lá fora. 🌦️";
            break;

        case "Rain":
            weatherMessage = "Não se esqueça do guarda-chuva, está chovendo! 🌧️";
            break;

        case "Snow":
            weatherMessage = "Tempo de neve! ❄️";
            break;

        // Casos para o grupo "Atmosphere"
        case "Mist":
        case "Smoke":
        case "Haze":
        case "Dust":
        case "Fog":
        case "Sand":
        case "Ash":
        case "Squall":
        case "Tornado":
            weatherMessage = "Atenção: A visibilidade pode estar reduzida. 🌫️";
            break;

        case "Clear":
            weatherMessage = "O céu está limpo! Um ótimo dia para aproveitar. ☀️";
            break;

        case "Clouds":
            weatherMessage = "Está <span class='weatherMessageSpan'>Nublado</span><br> Pra caralho agora.";
            break;

        default:
            weatherMessage = "Condição do tempo não identificada.";
            console.log('Condição não tratada:', weatherData.weather[0].main);
            break;
    }

    console.log(weatherMessage);

    return (
        <div>
            <article className='weatherCityTemp'>
                <p>{weatherData.name}</p>
                    <h1>{weatherData.main.temp.toFixed(1)}°C</h1>
            </article>
            <h1
                className='weatherMessage'
                dangerouslySetInnerHTML={{ __html: weatherMessage }}
            />
            <span>Sensação Térmica: {weatherData.main.feels_like.toFixed(1)}°C</span>
        </div>
    );
}

export default WeatherDisplay;