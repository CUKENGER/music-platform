import React, {FC} from 'react';
import {AppProps} from 'next/app';
import '../app/global.css'
import { wrapper } from '@/store';


const WrappedApp: FC<AppProps> = ({Component, pageProps}) => (
  <Component {...pageProps} />
);

export default wrapper.withRedux(WrappedApp)
