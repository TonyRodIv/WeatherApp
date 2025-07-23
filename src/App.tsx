import LocalWeather from './components/LocalWeather';
// import WeatherDisplay from "./components/WeatherDisplay";

function App() {
  return (
    <main className="mainContainer progressive-blur-container">
        <section className="weatherInfo conteudo-frontal">
        <LocalWeather />
        {/* <WeatherDisplay  city="Fortaleza"/> */}
        </section>
      <figure className="weatherBg">
      </figure>
    </main>
  );
}

export default App;