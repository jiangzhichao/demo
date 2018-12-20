import { showLoading, hideLoading } from 'react-redux-loading-bar';
import { message } from 'antd';

export default client => ({ dispatch, getState }) => next => action => {
    if (typeof action === 'function') {
        return action(dispatch, getState);
    }

    const { promise, types, show, ...rest } = action;
    if (!promise) return next(action);

    const isShowLoading = typeof show === 'undefined' ? true : show;
    const [REQUEST, SUCCESS, FAILURE] = types ? types : ['', rest.type, ''];

    if (REQUEST) next({ ...rest, type: REQUEST });
    if (isShowLoading) next(showLoading());

    const actionPromise = promise(client);

    actionPromise
        .then(
            result => {
                if (isShowLoading) next(hideLoading());
                if (SUCCESS) next({ ...rest, result, type: SUCCESS });
            },
            error => {
                if (isShowLoading) next(hideLoading());
                if (FAILURE) next({ ...rest, error, type: FAILURE });

                message.error(error);
            }
        )
        .catch(error => {
            if (isShowLoading) next(hideLoading());
            if (FAILURE) next({ ...rest, error, type: FAILURE });

            message.error(error);
        });


    return actionPromise;
};

