import LocalWeather from './components/LocalWeather';
// import WeatherDisplay from "./components/WeatherDisplay";
import NavigationRail from './components/navigation';

function App() {
  return (
    <div id='backgroundChanger'>
      <main className="mainContainer progressive-blur-container">
        <section className="weatherContainer conteudo-frontal">
          <NavigationRail />
          <main className='weatherInfo'>
            <LocalWeather />
            {/* <WeatherDisplay  city="Buenos Aires"/> */}
          </main>
        </section>
      </main>
    </div>
  );
}

export default App;