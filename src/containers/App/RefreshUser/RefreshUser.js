import { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { refreshUser } from 'redux/modules/app';
import { connect } from 'react-redux';

@connect(() => ({}), { refreshUser })
export default class RefreshUser extends PureComponent {
    static propTypes = {
        refreshUser: PropTypes.func,
    };

    constructor(...arg) {
        super(...arg);

        this.props.refreshUser('');
        const user = JSON.parse(window.sessionStorage.getItem('user'));
        if (user) this.props.refreshUser(user.userId);
    }

    render() {
        return null;
    }
}
