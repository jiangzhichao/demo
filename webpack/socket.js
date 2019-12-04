let keyCodeObj = {};

this.addEventListener('message', msg => {
    keyCodeObj = msg.data.keyCodeObj || {};

    if (msg.data.begin) {
        const socket = io('', {path: '/ws'});

        socket.on('connect', () => {
            socket
                .emit('authenticate', { token: msg.data.cookie })
                .on('authenticated', () => {
                    socket.emit('login', msg.data.user);
                })
                .on('unauthorized', _msg => {
                    console.log(_msg);
                })
                .on('loop', res => {
                    socket.emit('ok', keyCodeObj);

                    this.postMessage(res);
                });
        });
    }

});
