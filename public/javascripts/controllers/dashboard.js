'use strict()';
angular.module('GithubCardApp').controller('DashboardCtrl', function($scope, $rootScope) {
  console.log('DashboardCtrl');

  $scope.searchGithubUser = function () {
    console.log('search here');
  }




  $(document).ready(function(){
  // the "href" attribute of .modal-trigger must specify the modal ID that wants to be triggered
    $('.modal-trigger').leanModal();
  });
});
