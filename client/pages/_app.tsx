import React, {FC} from 'react';
import {AppProps} from 'next/app';
import '../app/global.css'
import { store, wrapper } from '@/store';
import { Provider } from 'react-redux';


const WrappedApp: FC<AppProps> = ({Component, pageProps}) => (
  <Provider store={store}>
    <Component {...pageProps} />
  </Provider>
);


export default WrappedApp

// export default wrapper.withRedux(WrappedApp)
