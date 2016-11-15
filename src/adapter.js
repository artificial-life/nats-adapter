'use strict';

const _ = require('lodash');
const nats = require('nats')
const Promise = require('bluebird');
const uuid = require('node-uuid');

class NatsAdapter {
	constructor(opts) {
		this.nats = nats.connect(opts);
		this.id = `${uuid.v1()}-{process.pid}`;
	}
	addTask(taskname, params) {
		let data_string = JSON.stringify(params);

		return new Promise((resolve, reject) => {
			this.nats.request(taskname, data_string, {
				'max': 1
			}, resolve);
		}).then(JSON.parse);
	}
	listenTask(taskname, callback) {
		this.nats.subscribe(taskname, (request, replyTo) => {
			let request_data = JSON.parse(request);

			Promise.resolve(callback(request_data))
				.then((data) => this.nats.publish(replyTo, JSON.stringify(data)));
		});
	}
	command(taskname, params) {
		let data_string = JSON.stringify(params);

		this.nats.request(taskname, data_string, {
			'max': 1
		}, () => {
			console.log('noop');
		});
	}
	stoplistenTask(taskname) {
		return this.nats.unsubscribe(taskname);
	}
	subscribe(event_name) {
		return this.nats.subscribe(event_name, (response) => {
			let message = JSON.parse(response);
			(this.id != message._id) && this.callback(event_name, message.data);
		});
	}
	unsubscribe(event_name) {
		return this.nats.unsubscribe(event_name);
	}
	emit(event_name, data) {
		let data_string = JSON.stringify({
			_id: this.id,
			data: data
		});
		this.nats.publish(event_name, data_string);
	}
	onMessage(callback) {
		this.callback = callback;
	}
	close() {
		return this.nats.close();
	}
}

module.exports = NatsAdapter;
