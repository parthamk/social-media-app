import React from 'react'; // Import React library
import ReactDOM from 'react-dom/client'; // Import ReactDOM for rendering React components
import App from './App.jsx'; // Import the root component App
import { BrowserRouter } from 'react-router-dom'; // Import BrowserRouter for routing
import { Provider } from 'react-redux'; // Import Provider to connect Redux store to React components
import { store } from './redux/store.js'; // Import Redux store
import { PersistGate } from 'redux-persist/integration/react'; // Import PersistGate for persisting Redux store
import { persistor } from './redux/store.js'; // Import persistor for Redux store
import { HelmetProvider } from 'react-helmet-async'; // Import HelmetProvider for managing document head tags

ReactDOM.createRoot(document.getElementById('root')).render( // Render the app into the root DOM element
  <React.StrictMode> {/* Enable React strict mode */}
    <HelmetProvider> {/* Wrap the application with HelmetProvider for managing document head tags */}
      <BrowserRouter> {/* Provide the application with the BrowserRouter for routing */}
        <Provider store={store}> {/* Connect the Redux store to the application */}
          <PersistGate loading={null} persistor={persistor}> {/* Provide the application with PersistGate for persisting Redux store */}
            <App /> {/* Render the root component App */}
          </PersistGate>
        </Provider>
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode> // End of React strict mode
);
