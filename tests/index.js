'use strict'

const queue = require('global-queue');
const Adapter = require('../src/adapter.js');
const uuid = require('node-uuid');
let adapter = new Adapter();

queue.addAdapter('event', adapter);
queue.addAdapter('task', adapter);

let responses = 0;
let data = {};
for (var i = 0; i < 1000; i++) {
	data[uuid.v1()] = Math.random();
}

setTimeout(() => {
	queue.on('event', (data) => console.log('event data:', data));

	queue.emit('event', 'event-data');

	queue.command('test-task', {
		data: data
	})
}, 1000);

setTimeout(function () {
	console.log(responses);

}, 2000);
