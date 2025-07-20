export interface WeatherData {
  name: string; // Nome da cidade
  main: {
    temp: number; // Temperatura em Celsius
    feels_like: number; // Sensação térmica
    humidity: number; // Umidade
  };
  weather: [
    {
      description: string; // Descrição do tempo (ex: "nuvens dispersas")
      icon: string; // Código do ícone do tempo
    }
  ];
  wind: {
    speed: number; // Velocidade do vento
  };
}