(function () {
    'use strict';

    angular
        .module('CogniboxHackathon.routes')
        .config(config);

    config.$inject = ['$routeProvider', '$locationProvider'];

    /**
    * @name config
    * @desc Define valid application routes
    */
    function config($routeProvider, $locationProvider) {
        $routeProvider
      .when('/Home', {
          controller: 'HomeController',
          controllerAs: 'vm',
          templateUrl: 'templates/home/Home.html',
          resolve:
              {
                  "check": function ($location) {
                  }
              }
      })
      .otherwise('/Home');
    }
})();