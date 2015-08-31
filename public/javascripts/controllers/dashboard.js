'use strict()';
angular.module('GithubCardApp').controller('DashboardCtrl', function($scope, $rootScope, $http, $state, URLS, ngDialog) {
  console.log('DashboardCtrl');

  $http.get(URLS.api + '/users/data').then(function(user) {
    console.log(user.data);
    user.image = '/images/identicon.png';

    if (user.data.github) {
      if (!user.data.watched.length && user.data.github.token) {
        // Add modal here for import from follow
        $scope.openGitUserImport(user.data);
      }
    }


    $rootScope.user = user.data;
    $rootScope.watchedUsers = user.data.watched;
  }, function(err) {
    console.log(err);
    $state.go('home');
  });


  $scope.openGitUserInfo = function (watchedUser) {
      ngDialog.open({
        template: '/templates/gituserinfo.html',
        className: 'ngdialog-theme-default',
        data: watchedUser
      });
  };

  $scope.openGitUserImport = function (user) {

    console.log(user);

      $http.get(URLS.api + '/github/following/' + user.github.token).then(function(following) {
        console.log(following);
        ngDialog.open({
          template: '/templates/gituserimport.html',
          className: 'ngdialog-theme-default',
          controller: 'GitImportCtrl',
          data: following
        });
      });

  };

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

  $scope.removeWatchedUser = function(watchedUser) {
    var currentUserID = $rootScope.user._id;
    var gitUser = watchedUser.username;

    swal({
      title: 'stop watching ' + gitUser + '?',
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#37C1D1",
      confirmButtonText: "yes",
    },
    function(){
      $http.delete(URLS.api + '/watch/' + currentUserID + '/' + gitUser).then(function(user) {
        Materialize.toast(gitUser + ' has been removed', 3000, 'rounded');
        $state.reload();
      }, function(err) {
        console.log(err);
      });
    });


  };

  $scope.addGithubUser = function() {
    console.log('add here', $scope.userToAdd.login);
    $http.post(URLS.api + '/watch/', {
      currentUserID: $rootScope.user._id,
      gitUser: $scope.userToAdd.login
    }).then(function(user) {
        $scope.userToAdd = undefined;
        if (user.data === 'already added user') {
          Materialize.toast('user has already been added', 3000, 'rounded');
        } else {
          console.log('added user', user);
          Materialize.toast('user added', 3000, 'rounded');
          $state.reload();
        }
    }, function(err) {
      console.log('err:', err);
    });
  };

  // var currentUser = $rootScope.user;
  // $scope.$watch(function(currentUser) {
  //   $scope.watchedUsers = user.data.watched;
  //   console.log('function watched');
  //   return currentUser;
  // });

  $(document).ready(function(){
    // the "href" attribute of .modal-trigger must specify the modal ID that wants to be triggered
    $('.modal-trigger').leanModal();
    // $('.tooltipped').tooltip({delay: 50});
    $('.tooltipped').tooltip({delay: 50});
  });
});
