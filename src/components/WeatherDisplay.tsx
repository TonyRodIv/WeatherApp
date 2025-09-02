import { useState, useEffect } from 'react';
import type { WeatherData } from '../types/weather';

interface WeatherDisplayProps {
    city?: string;
    coords?: {
        lat: number;
        lon: number;
    };
    onCityNameLoad?: (name: string) => void;
}

function WeatherDisplay({ city, coords, onCityNameLoad }: WeatherDisplayProps) {
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

                const minimumTimePromise = new Promise(resolve => setTimeout(resolve, 1000));

                const fetchPromise = fetch(url).then(response => {
                    if (!response.ok) {
                        throw new Error(`Erro: ${response.status} - Verifique a localização.`);
                    }
                    return response.json();
                });

                const [data] = await Promise.all([fetchPromise, minimumTimePromise]);

                setWeatherData(data);
                if (coords && onCityNameLoad) {
                    onCityNameLoad(data.name);
                }

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
    }, [city, coords, onCityNameLoad]);

    if (loading) return <div className="loader-wrapper"><div className="loader"></div></div>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;
    if (!weatherData) return null;

    let weatherMessage = "Condição do tempo não identificada.";
    const weatherMain = weatherData.weather[0].main;
   
    switch (weatherMain) {
        case "Thunderstorm":
            weatherMessage = "Tem uma <span class='weatherMessageSpan'>Tempestade</span> rolando! Melhor ficar em casa se puder.";
            break;
        case "Drizzle":
            weatherMessage = "Tá caindo uma <span class='weatherMessageSpan'>Garoa</span> bem de leve agora.";
            break;
        case "Rain":
            weatherMessage = "Está <span class='weatherMessageSpan'>Chovendo</span> por aqui. Pega o guarda-chuva!";
            break;
        case "Snow":
            weatherMessage = "Neve à vista! Está <span class='weatherMessageSpan'>Nevando</span> agora.";
            break;
        case "Mist":
        case "Smoke":
        case "Haze":
        case "Dust":
        case "Fog":
        case "Sand":
        case "Ash":
        case "Squall":
        case "Tornado":
            weatherMessage = `O tempo está com <span class='weatherMessageSpan'>${weatherMain}</span>.`;
            break;
        case "Clouds":
            weatherMessage = "Está bem <span class='weatherMessageSpan'>Nublado</span> agora.";
            break;
        case "Clear":
            weatherMessage = "O céu está incrivelmente <span class='weatherMessageSpan'>Limpo</span><br> agora.";
            break;
    }

    return (
        <div>
            <article className='weatherCityTemp'>
                <p>{weatherData.name}</p>
                <h1>{weatherData.main.temp.toFixed(1)}°</h1>
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