import LocalWeather from './components/LocalWeather';
// import WeatherDisplay from "./components/WeatherDisplay";
import NavigationRail from './components/navigation';

function App() {
  return (
    <main className="mainContainer progressive-blur-container">
      <section className="weatherContainer conteudo-frontal">
        <NavigationRail />
        <main className='weatherInfo'>
          <LocalWeather />
          {/* <WeatherDisplay  city="Fortaleza"/> */}
        </main>
      </section>
    </main>
  );
}

export default App;