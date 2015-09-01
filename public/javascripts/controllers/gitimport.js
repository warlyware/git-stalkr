'use strict()';
angular.module('GithubCardApp').controller('GitImportCtrl', function($scope, $rootScope, $http, $state, URLS, ngDialog) {

    $scope.importGithubUser = function(userToImport) {
      console.log('add here', userToImport);
      console.log('currentUser', $rootScope.user);
      $http.post(URLS.api + '/watch/', {
        currentUserID: $rootScope.user.id,
        gitUser: userToImport.login
      }).then(function(savedImport) {
        Materialize.toast('user added', 3000, 'rounded');
        console.log('added user to', savedImport);
        $rootScope.watchedUsers.push(savedImport.data);
        var followersArray = $scope.ngDialogData.data;
        var index = followersArray.indexOf(userToImport.login);
        for (var i = 0; i < followersArray.length; i++) {
          if (followersArray[i] === userToImport) {
            followersArray.splice(i, 1);
          }
        }
      }, function(err) {
        console.log('err:', err);
      });
    };

});
