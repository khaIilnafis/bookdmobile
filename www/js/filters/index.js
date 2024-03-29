/**
 * Created by khalilbrown on 11/28/15.
 */

var app = require('angular').module('bookd');

app.filter('notificationFilter', require('./notificationFilter'));
app.filter('newNotificationFilter', require('./newNotificationFilter'));
app.filter('staticMapsFilter', require('./staticMapsFilter'));
app.filter('timeStampFilter', require('./timeStampFilter'));
app.filter('availabilityFilter', require('./availabilityFilter'));
app.filter('humanizeDurationFilter', require('./humanize-duration'))
app.filter('notificationDateFilter', require('./notificationDateFilter'));
