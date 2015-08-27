'use strict()';
angular.module('GithubCardApp').controller('DashboardCtrl', function($scope, $rootScope, $http, URLS) {
  console.log('DashboardCtrl');

  $scope.errorFindingUser = false;

  $scope.searchGithubUser = function () {
    console.log('search here');

    $http.get(URLS.api + '/github/user/' + $scope.userToSearch)
      .then(function(user) {
        if (user.data === 'user not found') {
          $scope.errorFindingUser = true;
        } else {
          console.log(user);
          $scope.errorFindingUser = false;
          $scope.userToAdd = user.data;
          $scope.userToSearch = '';
        }

      },
      function(err) {
        console.log(err);
      });

  };




  $(document).ready(function(){
  // the "href" attribute of .modal-trigger must specify the modal ID that wants to be triggered
    $('.modal-trigger').leanModal();
  });
});
