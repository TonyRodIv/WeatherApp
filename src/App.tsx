import LocalWeather from './components/LocalWeather';

function App() {
  return (
    <div style={{ textAlign: 'center' }}>
      <h1>Meu App de Previsão do Tempo</h1>
      
      <section>
        <h3>Tempo na sua Localização Atual</h3>
        <LocalWeather />
      </section>

      <hr style={{ margin: '2rem 0' }} />
    </div>
  );
}

export default App;