const TEST_PROXY = 'text';
const TEXT = 'text';

const initialState = {
    text: 'hello'
};

export default function info(state = initialState, action = {}) {
    switch (action.type) {
        case TEXT:
            return {
                ...state,
                text: action.text
            };
        case TEST_PROXY:
            return {
                ...state,
                testData: action.result
            };
        default:
            return state;
    }
}

export function changeText(text) {
    return { type: TEXT, text };
}

export function testProxy() {
    return {
        types: ['', TEST_PROXY, ''],
        promise: (client) => client.get('/freq/diy/band/node/get', { params: { areaCode: 5201, userId: '123456' } })
    };
}
