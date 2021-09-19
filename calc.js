const ball = require('./ball.json');
const brain = require('brain.js');
const network = new brain.NeuralNetwork();
const list = [];
const data = ball.data;

for (let i = 0; i < data.length; i++) {
    if (i < data.length - 1) {
        const result = {
            input: [],
            output: [data[i + 1].ball.split(' ')],
        };

        for (let j = 0; j <= i; j++) {
            result.input.push(data[j].ball.split(' '));
        }

        list.push(result);
    }
}

console.log('1');

network.train(list);

console.log('2');

const demo = data.map(i => i.ball.split(' '));
const result = network.run(demo);

console.log(result);




const data = require('./ball.json');
const convnetjs = require("convnetjs");
const ball = data.data;
const nets = [];
const results = [];
const red = [];
const blue = [];

for (let i = 0; i < 5; i++) {
    nets.push([new convnetjs.Net(), new convnetjs.Net()]);
}

for (let i = 1; i <= 33; i++) {
    red.push(i);
}

for (let i = 1; i <= 16; i++) {
    blue.push(i);
}

function getLayerDefs(isBlue) {
    const layer = [];

    layer.push({ type: 'input', out_sx: 1, out_sy: 1, out_depth: 2 });
    // 链接层  type:fc是链接层 num_neurons:神经元数目 activation:网络层间传递信息激活函数 relu:默认的常规激活函数
    layer.push({ type: 'fc', num_neurons: 20, activation: 'relu' });
    layer.push({ type: 'fc', num_neurons: 20, activation: 'relu' });
    // 输出层 type:softmax是输出层 softmax:限制了输出的概率总和为1 num_classes:概率分类数量
    layer.push({ type: 'softmax', num_classes: isBlue ? blue.length : red.length });

    return layer;
}

function start() {
    nets.forEach((netItem, index) => {
        const oneResult = [];

        netItem.forEach((net, subIndex) => {
            const isBlue = subIndex > 0;

            net.makeLayers(getLayerDefs(isBlue));

            const listVol = new convnetjs.Vol(isBlue ? blue : red);
            const trainer = new convnetjs.Trainer(net, { learning_rate: 0.0001, l2_decay: 0.01 });

            for (let i = 0; i < ball.length; i++) {
                const current = ball[i].ball.split(' ').slice(isBlue ? 6 : 0, isBlue ? 7 : -1).map(i => parseInt(i));
                current.forEach(i => trainer.train(listVol, i));
            }

            const probability = net.forward(listVol);
            const result = {};
            const tmpRed = [];
            const tmpBlue = [];

            probability.w.forEach((i, index) => result[i] = index + 1);

            [...probability.w].sort((a, b) => b - a).forEach((i, index) => {
                if (isBlue) {
                    if (index === 0) tmpBlue.push(result[i]);
                } else {
                    if (index < 6) tmpRed.push(result[i]);
                }
            });

            tmpRed.sort((a, b) => a - b);

            oneResult.push(...tmpRed, ...tmpBlue);
        });

        results.push(oneResult);
    });

    results.forEach(i => console.log(i.join(' ')));
}

start();
