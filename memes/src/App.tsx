import { FC } from 'react';
import { MemeGenerator } from './components/MemeGenerator';
import './App.css';

const App: FC = () => {
  return (
    <>
      <header>
        <h1>Meme Generator</h1>
      </header>

      <MemeGenerator />
    </>
  );
}

export default App;
