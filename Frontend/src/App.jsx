import React, { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Provider, useSelector } from 'react-redux';
import { HelmetProvider } from 'react-helmet-async';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Toaster } from 'react-hot-toast';

import { store } from './store/store';
import AppRoutes from './routes/AppRoutes';
import ErrorBoundary from './components/common/ErrorBoundary';
import NotificationListener from './components/common/NotificationListener';

// Inner component so it can access Redux store
const ThemedApp = () => {
  const theme = useSelector((state) => state.ui.theme);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  return (
    <BrowserRouter>
      <NotificationListener />
      <AppRoutes />
      <ToastContainer position="bottom-right" theme={theme} />
      <Toaster position="top-right" containerStyle={{ top: 20, right: 20 }} />
    </BrowserRouter>
  );
};

function App() {
  return (
    <Provider store={store}>
      <HelmetProvider>
        <ErrorBoundary>
          <ThemedApp />
        </ErrorBoundary>
      </HelmetProvider>
    </Provider>
  );
}

export default App;
