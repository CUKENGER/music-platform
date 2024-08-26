import ReactDOM from 'react-dom/client'
import './index.scss'
import { AppProvider } from './AppProvider'
import BaseLayout from './BaseLayout'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <AppProvider>
    <BaseLayout/>
  </AppProvider>
)
