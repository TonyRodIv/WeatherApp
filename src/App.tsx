// import LocalWeather from './components/LocalWeather';
import WeatherDisplay from "./components/WeatherDisplay";

function App() {
  return (
    <main className="mainContainer progressive-blur-container">
        <section className="weatherInfo conteudo-frontal">
        <h3>Tempo Atual</h3>
        {/* <LocalWeather /> */}
        <WeatherDisplay  city="Fortaleza"/>
        </section>
      <figure className="weatherBg">
        teste
      </figure>
    </main>
  );
}

export default App;