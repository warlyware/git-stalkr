'use strict()';
angular.module('GithubCardApp').controller('ProfileCtrl', function($scope, $http, $state, URLS) {
  console.log('ProfileCtrl');
  $http.get(URLS.api + '/users/data').then(function(user) {
    console.log(user.data);
    user.image = '/images/identicon.png';
    $scope.user = user.data;
  }, function(err) {
    console.log(err);
    $state.go('home');
  });

});
