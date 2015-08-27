'use strict()';
angular.module('GithubCardApp').controller('DashboardCtrl', function($scope, $rootScope, $http, $state, URLS) {
  console.log('DashboardCtrl');

  $http.get(URLS.api + '/users/data').then(function(user) {
    console.log(user.data);
    user.image = '/images/identicon.png';
    $rootScope.user = user.data;
  }, function(err) {
    console.log(err);
    $state.go('home');
  });

  $scope.errorFindingUser = false;

  $scope.searchGithubUser = function () {


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

  $scope.addGithubUser = function() {
    console.log('add here', $scope.userToAdd.login);
    $http.post(URLS.api + '/watch/', {
      currentUserID: $rootScope.user.id,
      gitUser: $scope.userToAdd.login
    }).then(function(user) {
        $scope.userToAdd = undefined;
        if (user.data === 'already added user') {
          Materialize.toast('user has already been added', 3000, 'rounded');
        } else {
          console.log('added user', user);
        }
    }, function(err) {
      console.log('err:', err);
    });
  };



  $(document).ready(function(){
  // the "href" attribute of .modal-trigger must specify the modal ID that wants to be triggered
    $('.modal-trigger').leanModal();
    // $('.tooltipped').tooltip({delay: 50});

  });
});
