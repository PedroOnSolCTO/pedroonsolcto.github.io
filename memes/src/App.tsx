import { FC } from 'react';
import { Controls } from './components/Controls';
// import { Frames } from './components/Frames';
import { Header } from './components/Header';
import { Preview } from './components/Preview';
import './App.css';

const App: FC = () => {
  return (
    <>
      <Header />

      <div className="wrapper">
        {/* <Frames /> */}
        <Preview />
        <Controls />
      </div>
    </>
  );
};

export default App;
