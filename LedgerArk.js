'use strict';

var Q = require('q');
var utils = require('./utils');

var LedgerArk = function(comm) {
	this.comm = comm;
	this.comm.setScrambleKey('w0w');
}

LedgerArk.prototype.getAddress_async = function(path, boolDisplay, boolChaincode) {
	var splitPath = utils.splitPath(path);
	var buffer = new Buffer(5 + 1 + splitPath.length * 4);
	buffer[0] = 0xe0;
	buffer[1] = 0x02;
	buffer[2] = 0x01;
	buffer[3] = 0x40;
	buffer[4] = 1 + splitPath.length * 4;
	buffer[5] = splitPath.length;
	splitPath.forEach(function (element, index) {
		buffer.writeUInt32BE(element, 6 + 4 * index);
	});
	return this.comm.exchange(buffer.toString('hex'), [0x9000]).then(function(response) {
		var result = {};
    console.log(response);
		var response = new Buffer(response, 'hex');
		var publicKeyLength = response[0];
		var addressLength = response[1 + publicKeyLength];
		result['publicKey'] = response.slice(1, 1 + publicKeyLength).toString('hex');
		result['address'] = response.slice(1 + publicKeyLength + 1, 1 + publicKeyLength + 1 + addressLength).toString('ascii');
		if (boolChaincode) {
			result['chainCode'] = response.slice(1 + publicKeyLength + 1 + addressLength, 1 + publicKeyLength + 1 + addressLength + 32).toString('hex');
		}
		return result;
	});
}

LedgerArk.prototype.signTransaction_async = function(path, rawTxHex) {
	var splitPath = utils.splitPath(path);
	var offset = 0;
	var rawTx = new Buffer(rawTxHex, 'hex');
	var apdus = [];
	var response = [];
	var self = this;
	while (offset != rawTx.length) {
		var maxChunkSize = (offset == 0 ? (250 - 1 - splitPath.length * 4) : 250)
		var chunkSize = (offset + maxChunkSize > rawTx.length ? rawTx.length - offset : maxChunkSize);
		var buffer = new Buffer(offset == 0 ? 5 + 1 + splitPath.length * 4 + chunkSize : 5 + chunkSize);
		buffer[0] = 0xe0;
		buffer[1] = 0x04;
		buffer[2] = (offset == 0 ? 0x00 : 0x80);
		buffer[3] = 0x40;
		buffer[4] = (offset == 0 ? 1 + splitPath.length * 4 + chunkSize : chunkSize);
		if (offset == 0) {
			buffer[5] = splitPath.length;
			splitPath.forEach(function (element, index) {
				buffer.writeUInt32BE(element, 6 + 4 * index);
			});
			rawTx.copy(buffer, 6 + 4 * splitPath.length, offset, offset + chunkSize);
		}
		else {
			rawTx.copy(buffer, 5, offset, offset + chunkSize);
		}
		apdus.push(buffer.toString('hex'));
		offset += chunkSize;
	}
	return utils.foreach(apdus, function(apdu) {
    console.log(apdu);
		return self.comm.exchange(apdu, [0x9000]).then(function(apduResponse) {
			response = apduResponse;
		})
	}).then(function() {
		response = new Buffer(response, 'hex');
		var result = {};
		result['v'] = response.slice(0, 1).toString('hex');
		result['r'] = response.slice(1, 1 + 32).toString('hex');
		result['s'] = response.slice(1 + 32, 1 + 32 + 32).toString('hex');
		return result;
	})
}

LedgerArk.prototype.getAppConfiguration_async = function() {
	var buffer = new Buffer(5);
	buffer[0] = 0xe0;
	buffer[1] = 0x06;
	buffer[2] = 0x00;
	buffer[3] = 0x00;
	buffer[4] = 0x00;
	return this.comm.exchange(buffer.toString('hex'), [0x9000]).then(function(response) {
			var result = {};
			var response = new Buffer(response, 'hex');
			result['arbitraryDataEnabled'] = (response[0] & 0x01);
			result['version'] = "" + response[1] + '.' + response[2] + '.' + response[3];
			return result;
	});
}

LedgerArk.prototype.signPersonalMessage_async = function(path, messageHex) {
	var splitPath = utils.splitPath(path);
	var offset = 0;
	var message = new Buffer(messageHex, 'hex');
	var apdus = [];
	var response = [];
	var self = this;
	while (offset != message.length) {
		var maxChunkSize = (offset == 0 ? (150 - 1 - splitPath.length * 4 - 4) : 150)
		var chunkSize = (offset + maxChunkSize > message.length ? message.length - offset : maxChunkSize);
		var buffer = new Buffer(offset == 0 ? 5 + 1 + splitPath.length * 4 + 4 + chunkSize : 5 + chunkSize);
		buffer[0] = 0xe0;
		buffer[1] = 0x08;
		buffer[2] = (offset == 0 ? 0x00 : 0x80);
		buffer[3] = 0x00;
		buffer[4] = (offset == 0 ? 1 + splitPath.length * 4 + 4 + chunkSize : chunkSize);
		if (offset == 0) {
			buffer[5] = splitPath.length;
			splitPath.forEach(function (element, index) {
				buffer.writeUInt32BE(element, 6 + 4 * index);
			});
			buffer.writeUInt32BE(message.length, 6 + 4 * splitPath.length);
			message.copy(buffer, 6 + 4 * splitPath.length + 4, offset, offset + chunkSize);
		}
		else {
			message.copy(buffer, 5, offset, offset + chunkSize);
		}
		apdus.push(buffer.toString('hex'));
		offset += chunkSize;
	}
	return utils.foreach(apdus, function(apdu) {
		return self.comm.exchange(apdu, [0x9000]).then(function(apduResponse) {
			response = apduResponse;
		})
	}).then(function() {
		response = new Buffer(response, 'hex');
		var result = {};
		result['v'] = response[0];
		result['r'] = response.slice(1, 1 + 32).toString('hex');
		result['s'] = response.slice(1 + 32, 1 + 32 + 32).toString('hex');
		return result;
	})
}

module.exports = LedgerArk;
