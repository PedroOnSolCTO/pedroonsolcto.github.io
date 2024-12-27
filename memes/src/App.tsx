import { FC } from 'react';
import './App.css';
import { Controls } from './components/Controls';
import { Header } from './components/Header';
import { Preview } from './components/Preview';
import { Templates } from './components/Templates';
import { TemplateProvider } from './contexts/TemplateContext';

export const App: FC = () => {
  return (
    <TemplateProvider>
      <div className="app">
        <Header />
        <div className="wrapper">
          <Preview />
          <Controls>
            <Templates />
          </Controls>
        </div>
      </div>
    </TemplateProvider>
  );
};

export default App;
