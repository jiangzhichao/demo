import superagent from 'superagent';

const methods = ['get', 'post', 'put', 'patch', 'del'];
const formatUrl = path => '/api' + (path[0] !== '/' ? '/' + path : path);

export default class ApiClient {
    constructor() {
        methods.forEach(method =>
            this[method] = (path, { params, data } = {}, { custom } = {}) => new Promise((resolve, reject) => {
                const request = superagent[method](custom ? path : formatUrl(path));

                if (params) request.query(params);
                if (data) request.send(data);

                request.end((err, { text } = {}) => {
                    if (err) return reject(err.message);

                    const body = JSON.parse(text);
                    return (body.retcode !== 0) ? reject(body.retmsg) : resolve(body);
                });
                // setTimeout(resolve, 50000);
            }));
    }

    empty() {
    }
}
