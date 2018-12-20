import React, { PureComponent } from 'react';
import spinInit from 'utils/spin_init';

export default class SpinModal extends PureComponent {
    static propTypes = {

    };

    componentDidMount() {
        spinInit.init();
    }

    componentWillUnmount() {
        spinInit.clear();
    }

    render() {
        console.log('render SpinModal');

        return (
            <canvas
                width="400"
                height="400"
                style={{ width: '100px', height: '100px', borderRadius: '10px' }}
                id="j-spin"
            />
        );
    }
}
