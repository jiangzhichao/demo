import { createStore as _createStore, applyMiddleware, compose } from 'redux';
import createMiddleware from './middleware/clientMiddleware';

export default function createStore(client) {
    const middleware = [createMiddleware(client)];

    let finalCreateStore;
    if (__DEVELOPMENT__) {
        const { persistState } = require('redux-devtools');
        const DevTools = require('../components/DevTools/DevTools');

        finalCreateStore = compose(
            applyMiddleware(...middleware),
            window.devToolsExtension ? window.devToolsExtension() : DevTools.instrument(),
            persistState(window.location.href.match(/[?&]debug_session=([^&]+)\b/))
        )(_createStore);
    } else {
        finalCreateStore = applyMiddleware(...middleware)(_createStore);
    }

    const reducer = require('./modules/reducer');
    const store = finalCreateStore(reducer);

    if (__DEVELOPMENT__ && module.hot) {
        module.hot.accept('./modules/reducer', () => {
            store.replaceReducer(require('./modules/reducer'));
        });
    }

    return store;
}
