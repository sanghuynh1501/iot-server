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
  Api.addRoute('controlIOT/:ip', {authRequired: false}, {
    get: function () {
      console.log('abc def ', this.urlParams.ip);
      if(Tasks.find({ip: this.urlParams.ip}).count() === 0) {
        Tasks.insert({
          ip: this.urlParams.ip,
          text: this.urlParams.ip,
          checked: false
        })
      }
      return this.urlParams.ip;
    },
    delete: {
      roleRequired: ['author', 'admin'],
      action: function () {
        // if (Articles.remove(this.urlParams.id)) {
        //   return {status: 'success', data: {message: 'Article removed'}};
        // }
        // return {
        //   statusCode: 404,
        //   body: {status: 'fail', message: 'Article not found'}
        // };
      }
    }
  });
}
