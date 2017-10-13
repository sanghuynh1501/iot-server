import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';  

export const WifiRouters = new Mongo.Collection('wifiRouters');

WifiRouters.allow({
    insert: function () {
        return true;
    },
    update: function () {
        return true;
    },
    remove: function () {
        return true;
    }
});

if (Meteor.isServer) {
  Meteor.publish('routers', function routerPublication() {
    return WifiRouters.find({});
  });
}
