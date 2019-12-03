import stage from './stage';

let id = 0;
const snakeTimer = {};

function getRandomColor() {
    const rand = Math.floor(Math.random() * 0xFFFFFF).toString(16);
    if (rand.length === 6) {
        return rand;
    }

    return getRandomColor();
}

function getRGB(_color) {
    let color = _color.toLowerCase();

    if (color.length === 4) {
        let colorNew = '#';
        for (let i = 1; i < 4; i += 1) {
            colorNew += color.slice(i, i + 1).concat(color.slice(i, i + 1));
        }
        color = colorNew;
    }

    const colorChange = [];

    for (let i = 1; i < 7; i += 2) {
        colorChange.push(parseInt('0x' + color.slice(i, i + 2)));
    }

    return colorChange;
}

export default class SnakeLine {
    constructor(config = {}) {
        this.id = id++;
        this.direction = config.direction || parseInt(Math.random() * 360); // 0 ~ 359
        this.x = config.x || parseInt(Math.random() * stage.width);
        this.y = config.y || parseInt(Math.random() * stage.height);
        this.bodys = config.bodys || [[this.x, this.y]];
        this.space = config.space || 1;
        this.bodyColor = config.bodyColor || ('#' + getRandomColor());
        this.rgb = getRGB(this.bodyColor);
        this.speed = config.speed || 10; // interval参数
        this.weight = 0;
        this.speedBack = config.speedBack; // 保存历史的interval参数
        this.lv = config.lv || 1;
        this.width = 10;

        this.init();
    }

    init = () => {
        this.initBody();
        this.startMove();
    };

    changeColor = () => {
        this.bodyColor = '#' + getRandomColor();
        this.rgb = getRGB(this.bodyColor);
    };

    accelerate = () => {
        if (this.speed > 0) {
            this.speed--;
            console.log(this.speed);
            this.startMove();
        }
    };

    eatFood = () => {
        this.bodys.push([...this.bodys[this.bodys.length - 1]]);
    };

    checkBoundary = () => {
        // 左面墙的反射
        if (this.direction > 90 && this.direction < 270 && this.bodys[0][0] <= this.width / 2) {
            if (this.direction <= 180) {
                this.direction = 180 - this.direction;
            } else {
                this.direction = 540 - this.direction;
            }
        }

        // 顶部墙的反射
        if (this.direction > 0 && this.direction < 180 && this.bodys[0][1] <= this.width / 2) {
            if (this.direction <= 90) {
                this.direction = 360 - this.direction;
            } else {
                this.direction = 360 - this.direction;
            }
        }

        // 右边墙的反射
        if (((this.direction > 0 && this.direction < 90) || this.direction > 270) && this.bodys[0][0] >= (stage.width - this.width / 2)) {
            if (this.direction < 90) {
                this.direction = 180 - this.direction;
            } else {
                this.direction = 540 - this.direction;
            }
        }

        // 下面墙反射
        if (this.direction > 180 && this.direction < 360 && this.bodys[0][1] >= (stage.height - this.width / 2)) {
            this.direction = 360 - this.direction;
        }

        if (this.direction === 0 && this.bodys[0][0] >= stage.width - this.width / 2) {
            this.direction = 180;
        } else if (this.direction === 90 && this.bodys[0][0] <= 0) {
            this.direction = 270;
        } else if (this.direction === 180 && this.bodys[0][1] <= 0) {
            this.direction = 0;
        } else if (this.direction === 270 && this.bodys[0][1] >= stage.height - this.width / 2) {
            this.direction = 90;
        }
    };

    initBody = () => {
        for (let i = 0; i < 10; i++) {
            this.bodys.push([this.x, this.y]);
        }
    };

    startMove = () => {
        clearInterval(snakeTimer[this.id]);

        snakeTimer[this.id] = setInterval(this.move, this.speed);
    };

    move = () => {
        this.checkBoundary();

        const head = this.bodys[0];
        const headBack = this.bodys.map(i => [...i]);

        if (this.direction > 0 && this.direction < 90) {
            head[0] = head[0] + Math.abs(this.space * Math.cos(Math.PI / 180 * this.direction));
            head[1] = head[1] - Math.abs(this.space * Math.sin(Math.PI / 180 * this.direction));
        } else if (this.direction > 90 && this.direction < 180) {
            head[0] = head[0] - Math.abs(this.space * Math.cos(Math.PI / 180 * this.direction));
            head[1] = head[1] - Math.abs(this.space * Math.sin(Math.PI / 180 * this.direction));
        } else if (this.direction > 180 && this.direction < 270) {
            head[0] = head[0] - Math.abs(this.space * Math.cos(Math.PI / 180 * this.direction));
            head[1] = head[1] + Math.abs(this.space * Math.sin(Math.PI / 180 * this.direction));
        } else if (this.direction > 270 && this.direction < 360) {
            head[0] = head[0] + Math.abs(this.space * Math.cos(Math.PI / 180 * this.direction));
            head[1] = head[1] + Math.abs(this.space * Math.sin(Math.PI / 180 * this.direction));
        }

        if (this.direction === 0) {
            head[0] += this.space;
        } else if (this.direction === 90) {
            head[1] -= this.space;
        } else if (this.direction === 180) {
            head[0] -= this.space;
        } else if (this.direction === 270) {
            head[1] += this.space;
        }

        this.bodys.forEach((i, index, arr) => {
            if (index !== 0) {
                arr[index] = headBack[index - 1];
            }
        });
    };

    keyControl = codeObj => {
        const changeRate = 30;

        if (codeObj['38']) {
            if (!(this.direction === 90 || this.direction === 270)) {
                if (this.direction > 90 && this.direction < 270) {
                    this.direction -= changeRate;
                } else {
                    this.direction += changeRate;
                }
            }
        } else if (codeObj['39']) {
            if (!(this.direction === 0 || this.direction === 180)) {
                if (this.direction > 0 && this.direction < 180) {
                    this.direction -= changeRate;
                } else {
                    this.direction += changeRate;
                }
            }
        } else if (codeObj['40']) {
            if (!(this.direction === 90 || this.direction === 270)) {
                if (this.direction > 90 && this.direction < 270) {
                    this.direction += changeRate;
                } else {
                    this.direction -= changeRate;
                }
            }
        } else if (codeObj['37']) {
            if (!(this.direction === 0 || this.direction === 180)) {
                if (this.direction > 0 && this.direction < 180) {
                    this.direction += changeRate;
                } else {
                    this.direction -= changeRate;
                }
            }
        }

        if (codeObj['32']) {
            this.accelerate();
        }

        if (this.direction >= 360) {
            this.direction = 0;
        }

        if (this.direction < 0) {
            this.direction = 359;
        }

    };

    changeDirection = () => {

    };

    goDie = () => {
        clearInterval(snakeTimer[this.id]);

        delete snakeTimer[this.id];
    }
}






let id = 0;
let messageId = 0;

export default {
    width: 2000,
    height: 2000,
    points: [],
    message: [],
    addPoints() {
        const r = Math.floor(Math.random() * 256);
        const g = Math.floor(Math.random() * 256);
        const b = Math.floor(Math.random() * 256);
        const color = '#' + r.toString(16) + g.toString(16) + b.toString(16);

        this.points.push({
            id: id,
            x: parseInt(Math.random() * this.width),
            y: parseInt(Math.random() * this.height),
            width: parseInt(Math.random() * 2 + 2),
            color, r, g, b
        });

        id++;

        if (this.points.length > 1000) this.points.splice(0, this.points.length - 1000);
    },
    addCustomPoints(x, y) {
        const r = Math.floor(Math.random() * 256);
        const g = Math.floor(Math.random() * 256);
        const b = Math.floor(Math.random() * 256);
        const color = '#' + r.toString(16) + g.toString(16) + b.toString(16);

        this.points.push({
            id: id,
            x: parseInt(Math.random() * 11 + x),
            y: parseInt(Math.random() * 11 + y),
            width: parseInt(Math.random() * 2 + 2),
            color, r, g, b
        });

        id++;

        if (this.points.length > 3000) this.points.splice(0, this.points.length - 3000);
    },
    initPoints() {
        for (let i = 0; i < 300; i++) {
            this.addPoints();
        }
    },
    addMsg(obj) {
        if (this.message.length > 100) {
            this.message.shift();
        } else {
            this.message.push({ ...obj, id: messageId++ });
        }
    }
};





/**
 * Created by jiang on 2017/3/6.
 */
import socketioJwt from 'socketio-jwt';
import config from '../config';
import stage from './stage';
import Snake from './snake';
import SnakeLine from './SnakeLine';

let timer;
let addPointTimer;

const getNewSnake = (snakes) => {
    let snake;
    let max = 350;

    const checkCrash = () => {
        snake = new Snake();
        let result = true;

        for (const key in snakes) {
            const _bodys = snakes[key].bodys;
            const head = snake.bodys[0];

            if (!result) break;

            for (let k = 0; k < _bodys.length; k++) {
                const _body = _bodys[k];

                if (
                    !(
                        head.x > _body.x + _body.width + max ||
                        head.x + head.width  < _body.x - max ||
                        head.y + head.width  < _body.y - max ||
                        head.y > _body.y + _body.width + max
                    )
                ) {
                    result = false;
                    break;
                }
            }
        }

        if (!result && max > 0) {
            max--;
            checkCrash();
        }
    };

    checkCrash();

    snake.direction = parseInt(Math.random() * 4);

    return snake;
};

const dieCheck = (snakes) => {
    for (const key in snakes) {
        const snake = snakes[key];

        if (snake.checked) {
            delete snake.checked;
            continue;
        }



        if (snake.user.name === '姜大爷在线玩蛇') {
            continue;
        }



        for (const _key in snakes) {
            const _snake = snakes[_key];

            if (_snake.checked) {
                delete _snake.checked;
                continue;
            }



            if (key !== _key) {
                const _bodys = _snake.bodys;
                const head = snake.bodys[0];
                const user = snake.user;


                for (let k = 0; k < _bodys.length; k++) {
                    const _body = _bodys[k];

                    if (
                        !(
                            head.x > _body.x + _body.width ||
                            head.x + head.width < _body.x ||
                            head.y + head.width < _body.y ||
                            head.y > _body.y + _body.width
                        )
                    ) {
                        snakes[user._id] = getNewSnake(snakes);
                        snakes[user._id].user = user;
                        snakes[user._id].checked = true;

                        snake.bodys.forEach(i => {
                            for (let j = 0; j < 6; j++) {
                                stage.addCustomPoints(i.x, i.y);
                            }
                        });

                        stage.addMsg({
                            from: '系统',
                            content: snakes[_key].user.name + ' 击杀了 ' + user.name
                        });

                        break;
                    }

                }
            }
        }
    }
};

const crashCheck = (snakes) => {
    for (const key in snakes) {
        const snake = snakes[key];

        stage.points.forEach((food, index) => {
            if (
                food &&
                !(
                    snake.bodys[0][0] > food.x + food.width ||
                    snake.bodys[0][0] + snake.width < food.x ||
                    snake.bodys[0][1] + snake.width < food.y ||
                    snake.bodys[0][1] > food.y + food.width)
            ) {
                stage.points[index] = null;
                snake.eatFood();
            }
        });
    }

    stage.points = stage.points.filter(i => i);
};

const check = (snakes, io) => {
    crashCheck(snakes, io);
};

export default function ioConnect(io, runnable) {
    const onlineUsers = {};
    const snakes = {};
    stage.initPoints();

    io.path('/ws');
    io
        .on('connection', socketioJwt.authorize({
            secret: config.tokenSecret,
            timeout: 15000
        }))
        .on('authenticated', (socket) => {

            socket.shouldSend = true;

            socket.on('login', data => {
                socket.user = data;

                if (!snakes[data._id]) {
                    snakes[data._id] = new SnakeLine();
                    snakes[data._id].user = data;
                }

                onlineUsers[data._id] = data;
                onlineUsers[data._id].socketId = socket.id;
                console.log(`在线人数: ${Object.keys(onlineUsers).length}    ${data.name}上线`);

                stage.addMsg({
                    from: '系统',
                    content: data.name + '上线'
                });

                clearInterval(socket.timer);
                socket.timer = setInterval(() => {
                    if (socket.shouldSend) {
                        socket.shouldSend = false;
                        socket.emit('loop', { snakes, stage });
                        // socket.emit('loop', { snakes });
                    }
                }, 1);
            });

            socket.on('ok', codeObj => {
                socket.shouldSend = true;

                if (!socket.user) return;

                const _id = socket.user._id;
                const self = snakes[_id];

                self.keyControl(codeObj);
            });

            socket.on('disconnect', () => {
                if (!socket.user) return;

                delete onlineUsers[socket.user._id];

                console.log(`在线人数: ${Object.keys(onlineUsers).length}    ${socket.user.name}下线`);

                stage.addMsg({
                    from: '系统',
                    content: socket.user.name + '下线'
                });
            });

            socket.on('message', msg => {
                if (!socket.user) return;

                stage.addMsg({
                    from: socket.user.name,
                    content: msg
                });
            });

            socket.on('reset', () => {
                if (!socket.user) return;

                // snakes[socket.user._id] = new Snake();
                // snakes[socket.user._id].user = socket.user;

                snakes[socket.user._id].changeColor();
            });
        });

    io.listen(runnable);

    clearInterval(timer);
    timer = setInterval(() => {
        check(snakes, io);
        // dieCheck(snakes);
    }, 1);
    //
    clearInterval(addPointTimer);
    addPointTimer = setInterval(() => {
        for (let i = 0; i < 10; i++) {
            stage.addPoints();
        }
    }, 3000);
}





import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
// import * as THREE from 'three';
// import io from 'socket.io-client';
import Cookies from 'js-cookie';
import * as THREE from '../../lib/three/build/three.module.js';

import Stats from '../../lib/three/examples/jsm/libs/stats.module.js';
// import { GUI } from '../../lib/three/examples/jsm/libs/dat.gui.module.js';
import {OrbitControls} from '../../lib/three/examples/jsm/controls/OrbitControls.js';
import {Line2} from '../../lib/three/examples/jsm/lines/Line2.js';
import {LineMaterial} from '../../lib/three/examples/jsm/lines/LineMaterial.js';
import {LineGeometry} from '../../lib/three/examples/jsm/lines/LineGeometry.js';
// import { GeometryUtils } from '../../lib/three/examples/jsm/utils/GeometryUtils.js';

@connect(
    state => ({
        user: state.auth.user,
    })
)
export default class WebGlStage extends Component {
    static propTypes = {
        user: PropTypes.object,
        actions: PropTypes.object
    };

    constructor(...arg) {
        super(...arg);

        this.keyCodeObj = {};
        this.snakesLine = {};
    }

    componentDidMount() {
        window.THREE = THREE;

        this.init();
        this.animate();
        this.initSocket();
    }

    componentWillUnmount() {
        cancelAnimationFrame(this.time);
        THREE.Cache.clear();
    }

    drawPoints = stage => {
        const geometry = new THREE.BufferGeometry();
        const positions = [];
        const colors = [];

        stage.points.forEach(i => {
            positions.push(i.x, 10, i.y);
            colors.push(i.r / 255, i.g / 255, i.b / 255);
        });

        geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
        geometry.computeBoundingSphere();

        const material = new THREE.PointsMaterial({size: 15, vertexColors: THREE.VertexColors});

        this.scene.remove(this.points);

        const points = this.points = new THREE.Points(geometry, material);
        this.scene.add(points);
    };

    drawLine = snakes => {
        const snakeKey = Object.keys(snakes);

        snakeKey.forEach(j => {
            this.scene.remove(this.snakesLine[j]);

            const snake = snakes[j];
            const bodys = snake.bodys;

            const _positions = [];
            const _colors = [];
            bodys.forEach(i => {
                _positions.push(i[0], 10, i[1]);
                _colors.push(snake.rgb[0] / 255, snake.rgb[1] / 255, snake.rgb[2] / 255);
            });

            const geometry = this.snakesLine[j + 'geometry'] = new LineGeometry();
            geometry.setPositions(_positions);
            geometry.setColors(_colors);


            const matLine = this.snakesLine[j + 'matLine'] = new LineMaterial({
                color: 0xffffff,
                linewidth: snake.width,
                vertexColors: THREE.VertexColors,
                dashed: false
            });

            const line = new Line2(geometry, matLine);
            line.computeLineDistances();
            // line.scale.set(1, 1, 1);
            this.snakesLine[j] = line;

            this.scene.add(line);
        });
    };

    initSocket = () => {
        // const socket = io('', {path: '/ws'});
        const worker = new Worker('/worker/socket.js');

        worker.postMessage({
            begin: true,
            cookie: Cookies.get('token'),
            user: this.props.user
        });

        worker.onmessage = res => {
            this.drawLine(res.data.snakes);
            this.drawPoints(res.data.stage);

            worker.postMessage({keyCodeObj: this.keyCodeObj});
        };

        // socket.on('connect', () => {
        //     socket
        //         .emit('authenticate', { token: Cookies.get('token') })
        //         .on('authenticated', () => {
        //             socket.emit('login', this.props.user);
        //         })
        //         .on('unauthorized', msg => {
        //             console.log(msg);
        //         })
        //         .on('loop', ({ snakes, stage }) => {
        //             socket.emit('ok', this.keyCodeObj);
        //             console.log('ok');
        //
        //             this.drawLine(snakes);
        //             this.drawPoints(stage);
        //         });
        // });

        document.addEventListener('keydown', e => this.keyCodeObj[e.keyCode] = true);
        document.addEventListener('keyup', e => delete this.keyCodeObj[e.keyCode]);
    };

    init = () => {
        const width = window.innerWidth;
        const height = window.innerHeight;
        const ele = document.getElementById('web-gl-stage');

        this.stats = new Stats();

        this.container = ele;
        this.camera = new THREE.PerspectiveCamera(30, width / height, 1, 10000);
        this.camera.position.set(1000, 1910, 3160);

        this.renderer = new THREE.WebGLRenderer({antialias: true});
        this.renderer.setSize(width, height);
        this.renderer.setClearColor(0x000000, 0.0);
        this.renderer.setPixelRatio(window.devicePixelRatio);


        this.container.appendChild(this.renderer.domElement);
        this.container.appendChild(this.stats.dom);

        const controls = new OrbitControls(this.camera, this.renderer.domElement);
        controls.maxPolarAngle = Math.PI * 0.5;
        controls.minDistance = 500;
        controls.maxDistance = 5000;
        controls.enableKeys = false;
        controls.target.x = 1000;
        controls.target.y = 0;
        controls.target.z = 1280;

        this.camera.lookAt(1000, 0, 1280);

        this.scene = new THREE.Scene();
        this.scene.add(new THREE.AmbientLight(0x666666));
        this.scene.add(new THREE.GridHelper(4000, 2));
    };

    animate = () => {
        this.time = requestAnimationFrame(this.animate);

        this.stats.update();

        this.renderer.setViewport(0, 0, window.innerWidth, window.innerHeight);

        for (const key in this.snakesLine) {
            if (key.includes('matLine')) {
                this.snakesLine[key].resolution.set(window.innerWidth, window.innerHeight);
            }
        }

        this.renderer.render(this.scene, this.camera);
    };

    render() {
        return (
            <div id="web-gl-stage" style={{height: '100%'}}/>
        );
    }
}


