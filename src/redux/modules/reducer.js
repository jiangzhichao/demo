import { combineReducers } from 'redux';
import { loadingBarReducer as loadingBar } from 'react-redux-loading-bar';

import app from './app';

export default combineReducers({
    loadingBar,
    app,
});
