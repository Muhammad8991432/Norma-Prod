// Main App
// Initialize App with default landing page.
import { BrowserRouter } from 'react-router-dom';
import { TitleProvider } from '@context/Utils/Title';
import { AppRoutes } from '@config/AppRoutes';
import { ContextManager } from '@config/ContextManager';
import "./styles/global.scss";

function App() {
  return (
    <TitleProvider>
      <BrowserRouter>
        <ContextManager>
          <AppRoutes />
        </ContextManager>
      </BrowserRouter>
    </TitleProvider>
  );
}

export default App;
