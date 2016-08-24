// --Author Muragijimana Richard <beastar457@gmail.com>
// var sync = angular.module("sync", ["ngRoute","angularFileUpload","ionic","ngResource","ui.bootstrap","infinite-scroll"]);


//remove dependecies
//,"infinite-scroll", ngfolderLists 'ng-mfb' ngContextMenu ngDialog
var Logger=angular.module("Logger",[]);
Logger.run(['$rootScope',function($rootScope){
      // $rootScope.endPoint='https://streamupbox.com';
      $rootScope.endPoint='http://localhost:8000';
}])
.constant('DEBUG',true);
Logger.directive('signup', [function () {
  return {
    restrict: 'AE',
    templateUrl:'App/scripts/views/signup.html'
  };
}])
.directive('login', [function () {
  return {
    restrict: 'AE',
    templateUrl:'App/scripts/views/login.html'
  };
}])
.directive('shortcut', [function () {
  return {
    restrict: 'AE',
    templateUrl:'App/scripts/views/shortcut.html'
  };
}]);
angular.module("sync", ["ngRoute","angularFileUpload","ui.bootstrap","ui.router",'ngMaterial', 'material.svgAssetsCache',"pascalprecht.translate","ui.select","ngSanitize"])
.constant('DEBUG',true)



.config(['$sceProvider','$httpProvider','$mdThemingProvider',function($sceProvider,$httpProvider,$mdThemingProvider) {
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
    $httpProvider.defaults.headers.post.Accept = 'application/json, text/javascript';
    $httpProvider.defaults.headers.post.Accept = 'application/json, text/javascript';
    $httpProvider.defaults.headers.common.authorization = 'Bearer 8EuqcMNkF2yP50Dicpv9hLRRp7WOSabPlCu22liY';
    $httpProvider.defaults.useXDomain = true;
    $sceProvider.enabled(false);

    
}])
.config(['$stateProvider','$urlRouterProvider',function($stateProvider, $urlRouterProvider,$scope){
          
          $stateProvider
          .state('Home', {

            url: "/Files",
            templateUrl:  "/views/files.html",
            controller: 'FilesController'
          });
          
          $urlRouterProvider.otherwise('/Files');
}])
//application components
.directive('files', [function () {
  return {
    restrict: 'E',
    templateUrl: '/views/components/files.html',
    link: function (scope, el, attr) {
      //implements hover on files
      // el.hover(function() {
       
      //   $(".share").css({
      //     display: 'inline',
          
      //   }).addClass('btn btn-success');
      // }, function() {
        
      //   $(".share").hide('slow', function() {
          
      //   });
      // });
    }
  };
}])
.directive('folders', [function () {
  return {
    restrict: 'E',
    templateUrl: '/views/components/folders.html',
    link: function (scope, el, iAttrs) {
      // el.hover(function() {
      //   /* Stuff to do when the mouse enters the element */
      //   $(".share").css({
      //     display: 'inline',
          
      //   }).addClass('btn btn-success');
      // }, function() {
      //   $(".share").hide('slow', function() {
          
      //   });
      // });
    }
  };
}]);
//-----------------------done with Muragijimana Richard <beastar457@gmail.com>---------------//
//-----------------------deal with user's actions and interaction with other users---------------//
