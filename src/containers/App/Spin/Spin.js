import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// import Spinner from 'react-spinkit';
import { SpinModal } from 'components';

@connect(state => ({ loadingBar: state.loadingBar }), {})
export default class Spin extends PureComponent {
    static propTypes = {
        loadingBar: PropTypes.any,
    };

    constructor(...arg) {
        super(...arg);
        const types = ['pacman', 'ball-scale-ripple-multiple', 'ball-scale-multiple'];
        this.state = {
            types,
            current: Math.floor(Math.random() * types.length)
        };
    }

    render() {
        if ((this.props.loadingBar && this.props.loadingBar.default > 0)) {
            // const { types, current } = this.state;
            // const type = types[current];
            return (
                <div className="app-spin">
                    {/*<Spinner name={type} color="rgb(37, 214, 70)" />*/}
                    <SpinModal />
                </div>
            );
        }

        return null;
    }
}
