
import { useEffect } from 'react';
import './App.css';
import Navigation from './components/Navigation';

function App( ) {
  useEffect(()=>{
    document.title = "Ememo Application"
  },[])
  return (
   <Navigation />
  );
}

export default App;
