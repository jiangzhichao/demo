const CHANGE = 'app/CHANGE';
const REFRESH_SUCCESS = 'app/REFRESH_SUCCESS';

const initialState = {
    user: JSON.parse(window.sessionStorage.getItem('user')),
    searchValue: ''
};

export default function reducer(state = initialState, action = {}) {
    switch (action.type) {
        case CHANGE:
            return {
                ...state,
                ...action.arg
            };
        case REFRESH_SUCCESS:
            return {
                ...state,
                user: action.result.resultData
            };
        default:
            return state;
    }
}

export const changeAny = arg => ({ type: CHANGE, arg });

export const refreshUser = (userId) => ({
    type: '',
    promise: client => client.get('/freq/user/queryUserInfo', { params: { userId } })
});

export const destroyUser = (userId) => ({
    type: '',
    promise: client => client.post('/freq/user/logout', { data: { userId } })
});

export const lockUser = (data) => ({
    types: '',
    promise: client => client.post('/freq/user/lock', { data })
});
