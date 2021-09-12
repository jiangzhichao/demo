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