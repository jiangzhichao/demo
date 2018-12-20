/**
 * Created by jiang on 2017/7/3.
 */
import 'babel-polyfill';
import './utils/customPolyfill';
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import 'moment/locale/zh-cn';
import { LocaleProvider } from 'antd';
import moment from 'moment';
import Routes from './routes';
import createStore from './redux/create';
import ApiClient from './helpers/ApiClient.js';

const root = document.getElementById('root');
const store = createStore(new ApiClient());
moment.locale('zh-cn');

if (__DEVELOPMENT__ && !window.devToolsExtension) {
    // const DevTools = require('./components/DevTools/DevTools');
    render(
        <Provider store={store} key="provider">
            <LocaleProvider locale={zhCN}>
                {/*<div>*/}
                <Routes />
                {/* <DevTools /> */}
                {/*</div>*/}
            </LocaleProvider>
        </Provider>, root
    );
} else {
    render(
        <Provider store={store} key="provider">
            <LocaleProvider locale={zhCN}>
                <Routes />
            </LocaleProvider>
        </Provider>, root
    );
}
