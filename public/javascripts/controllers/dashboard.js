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
    setTimeout(function() {
      TweenLite.from($(".github-user-card"), 1, {bottom: -1000});
    }, 1);

  }, function(err) {
    console.log(err);
    $state.go('home');
  });

  $scope.clearGitSearchModal = function() {
    $scope.userToAdd = undefined;
  };

  $scope.openGitUserInfo = function (watchedUser) {
      ngDialog.open({
        template: '/templates/gituserinfo.html',
        className: 'ngdialog-theme-default',
        data: watchedUser
      });
  };

  $scope.openGitUserImport = function (user) {

    console.log(user);

    $http.get(URLS.api + '/github/following/' + user._id).then(function(filteredFollowing) {

      console.log(filteredFollowing);

      // console.log(followingArray);
      ngDialog.open({
        template: '/templates/gituserimport.html',
        className: 'ngdialog-theme-default',
        controller: 'GitImportCtrl',
        data: filteredFollowing
      });
    });

  };

  $scope.errorFindingUser = false;

  $scope.searchGithubUser = function () {

    $scope.searchGithubUserPromise = $http.get(URLS.api + '/github/user/' + $scope.userToSearch)
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

  $scope.removeWatchedUser = function(watchedUser, $event) {
    console.log($event);
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
        var watchedArray = $rootScope.watchedUsers;
        console.log(watchedArray);
        // setTimeout(function() {
          for (var i = 0; i < watchedArray.length; i++) {
            console.log(watchedArray[i]);
            console.log(watchedUser);
            if (watchedArray[i] === watchedUser) {
              watchedArray.splice(i, 1);
            }
          }
        // }, 500);

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
          var watchedArray = $rootScope.watchedUsers;
          var userToAdd = $scope.userToAdd;
          watchedArray.push(user.data);
          console.log('added user', user);
          Materialize.toast('user added', 3000, 'rounded');
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
    $('.collapsible').collapsible();
  });
});
