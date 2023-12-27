import './App.css';
import GenreFilter from './components/genreFilter';
import Navbar from './components/navbar';
import Movies from './screens/movies';

function App() {
  return (
    <div className="App">
     <Navbar />
     <GenreFilter />
     <Movies />
    </div>
  );
}

export default App;
