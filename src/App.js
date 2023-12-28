import './App.css';
import Navbar from './components/navbar';
import MoviesList from './screens/moviesList';

function App() {
  return (
    <div className="App">
     <Navbar />
     <MoviesList />
    </div>
  );
}

export default App;
