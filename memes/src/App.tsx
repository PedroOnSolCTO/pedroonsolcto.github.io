import { FC } from 'react';
import './App.css';
import { Controls } from './components/Controls';
import { Header } from './components/Header';
import { Preview } from './components/Preview';
import { Templates } from './components/Templates';
import { StickersProvider } from './contexts/StickersContext';
import { TemplateProvider } from './contexts/TemplateContext';

export const App: FC = () => {
  return (
    <TemplateProvider>
      <StickersProvider>
        <div className="app">
          <Header />
          <div className="wrapper">
            <div className="main-content">
              <div className="editor-section">
                <Preview />
              </div>
              <div className="controls-section">
                <Controls />
              </div>
            </div>
          </div>
        </div>
      </StickersProvider>
    </TemplateProvider>
  );
};

export default App;
