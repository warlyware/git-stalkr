'use strict()';
angular.module('GithubCardApp').controller('ProfileCtrl', function($scope, $http, $state, URLS) {
  console.log('ProfileCtrl');
  $http.get(URLS.api + '/users/data').then(function(user) {
    console.log(user.data);
    // if (!data.data.length) {
    //   $state.go('home');
    // } else {
      $scope.user = user.data;
    // }
  }, function(err) {
    console.log(err);
    $state.go('home');
  });

});
