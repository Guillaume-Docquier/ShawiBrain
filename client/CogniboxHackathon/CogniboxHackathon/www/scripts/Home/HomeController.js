(function () {

    angular
      .module('Home')
      .controller('HomeController', HomeController)


    HomeController.$inject = ['$rootScope', '$scope', '$location'];

    function HomeController($rootScope, $scope, $location) {
        $scope.navigate = function (target) {
            $location.url(target);
        };
    }


})()