import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import './Home.scss';
import { Input, Button } from 'antd';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as Actions from 'redux/modules/app';

@connect(
    state => ({ app: state.app }),
    dispatch => ({
        actions: bindActionCreators(Actions, dispatch),
    }))
export default class Home extends PureComponent {
    static propTypes = {
        app: PropTypes.any,
        actions: PropTypes.any
    };

    render() {
        console.log('render Home');
        const { app, actions } = this.props;

        return (
            <div style={{ textAlign: 'center', paddingTop: '60px' }}>
                <img
                    style={{ width: '200px' }}
                    src="/public/images/logo.png"
                />
                <h1>sefonsoft-react-starter-kit</h1>
                <Input
                    onChange={e => actions.changeAny({ searchValue: e.target.value })}
                    value={app.searchValue}
                    style={{ width: '50%' }}
                />
                <Button
                    style={{ marginLeft: '10px' }}
                    type="primary"
                    icon="poweroff"
                >
                    Click me!
                </Button>
            </div>
        );
    }
}
