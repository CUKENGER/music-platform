import ReactDOM from 'react-dom/client';
import './index.scss';
import { AppProvider } from './AppProvider';
import BaseLayout from './BaseLayout';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import 'react-tooltip/dist/react-tooltip.css';
import 'flatpickr/dist/flatpickr.min.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <AppProvider>
    <BaseLayout />
  </AppProvider>,
);
