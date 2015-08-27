'use strict()';
angular.module('GithubCardApp').controller('DashboardCtrl', function($scope, $rootScope, $http, URLS) {
  console.log('DashboardCtrl');

  $scope.searchGithubUser = function () {
    console.log('search here');

    console.log('searching user', $scope.userToSearch)
    $http.get(URLS.api + '/github/user/' + $scope.userToSearch)
      .then(function(user) {
        console.log(user);
        $scope.userToAdd = user.data;
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
