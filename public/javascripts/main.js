'use strict()';

angular.module('GithubCardApp', ['ui.router'])
  .config(function($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/');

    $stateProvider
      .state('home', {url: '/', templateUrl: '/templates/home.html', controller: "HomeCtrl"});
  }).run(function(){
    console.log('GithubCards Online');
  })
  .constant('urls',{
    'apiUrl': 'http://localhost:3000'
  });
