import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Route, Switch, Redirect, HashRouter as Router } from 'react-router-dom';
import {
    App,
    Home,
} from 'containers';

@connect(state => ({ user: state.app.user }), {})
export default class Routes extends PureComponent {
    static propTypes = {
        user: PropTypes.any,
    };

    render() {
        console.log('render routes');

        return (
            <Router>
                <Route
                    render={props => (
                        <App {...props}>
                            <Switch>
                                <Route exact path="/" component={Home} />
                                <Redirect to="/" />
                            </Switch>
                        </App>
                    )} />
            </Router>
        );
    }
}
