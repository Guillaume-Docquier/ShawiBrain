(function() {
    'use strict';
    
    var cognibox = angular.module("CogniboxHackathon", ['CogniboxHackathon.routes',                
        'ngMaterial',
        'Home',
        'ngCordova',
        'ngMessages'
    ]);

    angular.module('CogniboxHackathon.routes', ['ngRoute']);
    angular.module('Home', ['ngRoute',]);

    cognibox.run();

    //Change the color palette
    cognibox.config(theming);
    theming.$inject = ['$mdThemingProvider'];
    function theming($mdThemingProvider)
    {
        $mdThemingProvider.theme('default')
        .primaryPalette('deep-purple')
        .accentPalette('deep-orange')
        .warnPalette('red');
    }
})()