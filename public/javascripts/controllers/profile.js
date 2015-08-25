'use strict()';
angular.module('GithubCardApp').controller('ProfileCtrl', function($scope, $http, URLS) {
  console.log('ProfileCtrl');
  $http.get(URLS.api + '/users/data').then(function(data) {
    console.log(data);
    $scope.user = data;
  });

});
