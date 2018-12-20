import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
// import LoadingBar from 'react-redux-loading-bar';
import RefreshUser from './RefreshUser/RefreshUser';
import Spin from './Spin/Spin';
import './App.scss';

export default class App extends PureComponent {
    static propTypes = {
        children: PropTypes.any,
        history: PropTypes.any,
        loadingBar: PropTypes.any
    };

    static contextTypes = {
        store: PropTypes.object,
    };

    constructor(...arg) {
        super(...arg);
    }

    render() {
        console.log('render App');

        return (
            <div>
                <RefreshUser />
                <Spin />
                {/*<LoadingBar className="loading-bar" />*/}
                {this.props.children}
            </div>
        );
    }
}
