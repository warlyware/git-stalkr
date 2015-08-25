'use strict()';

angular.module('GithubCardApp', ['ui.router'])
  .config(function($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/');

    $stateProvider
      .state('home', {url: '/', templateUrl: '/templates/home.html', controller: "HomeCtrl"})
      .state('profile', {url: '/profile', templateUrl: '/templates/profile.html', controller: "ProfileCtrl"});
  }).run(function(){
    console.log('GithubCards Online');
  })
  .constant('URLS',{
    'api': 'http://localhost:3000'
  });
