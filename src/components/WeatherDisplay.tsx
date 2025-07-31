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

        // Casos para o grupo "Atmosphere"
        case "Mist":
            weatherMessage = "Tem uma <span class='weatherMessageSpan'>Névoa</span> pairando no ar agora.";
            break;

        case "Smoke":
            weatherMessage = "O ar está cheio de <span class='weatherMessageSpan'>Fumaça</span> agora.";
            break;

        case "Haze":
            weatherMessage = "O tempo está meio <span class='weatherMessageSpan'>Embaçado</span> com névoa seca.";
            break;

        case "Dust":
            weatherMessage = "Tem <span class='weatherMessageSpan'>Poeira</span> no ar. Melhor proteger os olhos!";
            break;

        case "Fog":
            weatherMessage = "A <span class='weatherMessageSpan'>Neblina</span> está densa por aqui agora.";
            break;

        case "Sand":
            weatherMessage = "Uma tempestade de <span class='weatherMessageSpan'>Areia</span> está rolando no momento.";
            break;

        case "Ash":
            weatherMessage = "Cuidado! Cinzas vulcânicas (<span class='weatherMessageSpan'>Ash</span>) estão no ar.";
            break;

        case "Squall":
            weatherMessage = "Rajadas de vento (<span class='weatherMessageSpan'>Squall</span>) estão passando agora.";
            break;

        case "Tornado":
            weatherMessage = "Alerta! <span class='weatherMessageSpan'>Tornado</span> detectado na região!";
            break;

        case "Clouds":
            weatherMessage = "Está muito <span class='weatherMessageSpan'>Nublado</span> agora.";
            break;

        case "Clear":
            weatherMessage = "O céu está incrivelmente <span class='weatherMessageSpan'>Limpo</span><br> agora.";
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