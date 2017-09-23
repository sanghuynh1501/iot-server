import moment from 'moment';
import { Tasks } from '../imports/api/tasks.js';

if (Meteor.isServer) {

  // Global API configuration
  var Api = new Restivus({
    useDefaultAuth: true,
    prettyJson: true
  });

  // Generates: GET, POST on /api/items and GET, PUT, DELETE on
  // /api/items/:id for the Items collection
  // Api.addCollection(Items);
  //
  // // Generates: POST on /api/users and GET, DELETE /api/users/:id for
  // // Meteor.users collection
  // Api.addCollection(Meteor.users, {
  //   excludedEndpoints: ['getAll', 'put'],
  //   routeOptions: {
  //     authRequired: true
  //   },
  //   endpoints: {
  //     post: {
  //       authRequired: false
  //     },
  //     delete: {
  //       roleRequired: 'admin'
  //     }
  //   }
  // });

  // Maps to: /api/articles/:id
  Api.addRoute('controlIOT/:data', {authRequired: false}, {
    get: function () {
      let json = JSON.parse(this.urlParams.data);
      json['checked'] = false;
      json['history'] = [];
      if(Tasks.find({deviceName: json.deviceName}).count() === 0) {
        Tasks.insert(json);
      } else {
          Tasks.update({deviceName: json.deviceName}, {$set: {
            ip: json.ip,
          }});
          Tasks.update({deviceName: json.deviceName}, {$push: {
            history: {
              action: json.action,
              user: 'Người dùng',
              time: moment().valueOf()
            },
          }});
      }
      return this.urlParams.data;
    },
    delete: {
      roleRequired: ['author', 'admin'],
      action: function () {
      }
    }
  });
}
