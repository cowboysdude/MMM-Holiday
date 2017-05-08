/* Magic Mirror
 * Module: MMM-Holiday
 *
 * By Cowboysdude
 *
 */
const NodeHelper = require('node_helper');
const request = require('request');
var moment = require('moment');


module.exports = NodeHelper.create({

    start: function() {
        console.log("Starting module: " + this.name);
    },

    getHoliday: function(url) {
        request({
            url: url,
            method: 'GET'
        }, (error, response, body) => {
            if (!error && response.statusCode == 200) {
                var result = JSON.parse(body);
                this.sendSocketNotification('HOLIDAY_RESULT', result);
            }
        });
    },

    socketNotificationReceived: function(notification, payload) {
        if (notification === 'GET_HOLIDAY') {
            this.getHoliday(payload);
        }
    }
});