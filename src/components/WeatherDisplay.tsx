// src/components/WeatherDisplay.tsx

import { useState, useEffect } from 'react';
import type { WeatherData } from '../types/weather';// Importando nosso tipo

// O componente pode receber a cidade como uma propriedade (props)
interface WeatherDisplayProps {
  city: string;
}

function WeatherDisplay({ city }: WeatherDisplayProps) {
  // Estados para guardar os dados, o estado de carregamento e possíveis erros
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // useEffect será executado quando o componente for montado ou a 'city' mudar
  useEffect(() => {
    // Função para buscar os dados da API
    const fetchWeatherData = async () => {
      // Pega a chave de API do arquivo .env.local
      const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;
      if (!apiKey) {
        setError("Chave da API não encontrada. Verifique o arquivo .env.local");
        setLoading(false);
        return;
      }

      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=pt_br`;

      try {
        setLoading(true);
        setError(null); // Limpa erros anteriores
        const response = await fetch(url);

        if (!response.ok) {
          // Se a resposta não for bem-sucedida (ex: erro 404), lança um erro
          throw new Error(`Erro: ${response.status} - Cidade não encontrada ou erro na API.`);
        }
        
        // Converte a resposta para JSON e define o tipo
        const data: WeatherData = await response.json();
        setWeatherData(data);

      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Ocorreu um erro desconhecido.");
        }
      } finally {
        // Garante que o 'loading' termine, independentemente do resultado
        setLoading(false);
      }
    };

    fetchWeatherData();
  }, [city]); // A dependência [city] faz com que a API seja chamada novamente se a cidade mudar

  // Renderização condicional baseada nos estados
  if (loading) {
    return <p>Carregando dados do tempo...</p>;
  }

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }

  if (!weatherData) {
    return null; // Não renderiza nada se não houver dados
  }

  // Renderiza os dados do tempo quando tudo estiver OK
  return (
    <div>
      <h2>Tempo em {weatherData.name}</h2>
      <p>Temperatura: {weatherData.main.temp.toFixed(1)}°C</p>
      <p>Sensação térmica: {weatherData.main.feels_like.toFixed(1)}°C</p>
      <p>Condição: {weatherData.weather[0].description}</p>
      <p>Umidade: {weatherData.main.humidity}%</p>
    </div>
  );
}

export default WeatherDisplay;