'use strict'

const queue = require('global-queue');
const Adapter = require('../src/adapter.js');
const Promise = require('bluebird');

let adapter = new Adapter();

queue.addAdapter('event', adapter);
queue.addAdapter('task', adapter);

let start;
let counter = 0;

queue.on('event', (data) => console.log('other thread event data:', data));
queue.listenTask('test-task', (data) => {
	if (!start) start = Date.now();
	counter++;
	if (counter >= 1000) console.log(Date.now() - start);
	return true;
});
