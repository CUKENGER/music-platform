import React, {FC} from 'react';
import {AppProps} from 'next/app';
import '../app/global.css'
import { store} from '@/store';
import { Provider } from 'react-redux';
import PageTransition from '@/UI/PageTransition/PageTransition';


const WrappedApp: FC<AppProps> = ({Component, pageProps}) => (
  <PageTransition>
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  </PageTransition>
);


export default WrappedApp

// export default wrapper.withRedux(WrappedApp)
