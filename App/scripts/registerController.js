angular.module("Logger")
.controller('RegisterController', ['$scope','$rootScope','$http','DEBUG',function ($scope,$rootScope,$http,DEBUG) {
    var options = {
        'password-notMatch': 'password do not match',
        'SignUpInProgress' : 'Wait we are setting up your account.'
    };
    function messageRemove(){
            $('.register-form-main-message').removeClass('show error');
    }
    function redirecting(){
            window.location = '/checkEmail';
    }
    $scope.register=function(user){
      $('.register-form-main-message').addClass('show success').html(options.SignUpInProgress);
        if($('#password').val() !== $('#password-confirm').val()){
          $('.register-form-main-message').addClass('show error').html(options['password-notMatch']);
          setTimeout(messageRemove, 2000);
          
          return;
        }
        var username=$('#username').val();
        var email=$('#email').val();


        jQuery.post('/register', {username: username, password:user.password, email:email, option:user.option, phone:user.phone}, function(data, textStatus, xhr) {
            if(data.status === 200){
                 redirecting();
            }else if(data !==200){
                if(DEBUG === true)
                    console.log("can not sign up!what?");
                // console.log('we are fired this can not happen');
            }
        }).error(function(error) {
            if(DEBUG === true)
                console.log(error);
        });
        
    };
}]);
angular.module("Logger")
.directive('uniqueUsername', ['isUsernameAvailable',function(isUsernameAvailable) {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, element, attrs, ngModel) {
            ngModel.$asyncValidators.uniqueUsername = isUsernameAvailable;
        }
    };
}]);
angular.module("Logger")
.factory('isUsernameAvailable', ['$q','$http','$rootScope',function($q, $http,$rootScope) {
     function messageRemove(){
            $('.register-form-main-message').removeClass('show success');
     }
      function usernameTaken(){
            $('.register-form-main-message').removeClass('show error');
        }
    var options = {
        'btn-loading': '<i class="fa fa-spinner fa-pulse"></i>',
        'btn-success': '<i class="fa fa-check"></i>',
        'btn-error': '<i class="fa fa-remove"></i>',
        'msg-success': 'All Good! redirecting...',
        'msg-username-available': 'good username available!',
        'msg-username-taken'    : 'oops username taken',
        'msg-email-taken'       : 'email taken',
        'msg-your-phone-suck'   : 'your phone is not valid',
        'useAJAX': true,
    };
    return function(username) {

        var deferred = $q.defer();

        $http.get($rootScope.endPoint + '/api/v1/users?username=' + username + '&access_token=8EuqcMNkF2yP50Dicpv9hLRRp7WOSabPlCu22liY').success(function(data){
            if(data  === 'available'){
                $('.register-form-main-message').addClass('show success').html(options['msg-username-available']);
                setTimeout(messageRemove, 2000);
               
            }else if(data === 'taken'){
                $('.register-form-main-message').addClass('show error').html(options['msg-username-taken']);
                setTimeout(usernameTaken, 2000);
               
            }
            deferred.reject();
        }).error(function(err) {
           deferred.resolve();
        });
        return deferred.promise;
    };
}]);
angular.module("Logger")
.directive('uniqueEmail', ['isEmailAvailable',function(isEmailAvailable) {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, element, attrs, ngModel) {
            ngModel.$asyncValidators.uniqueEmail = isEmailAvailable;
        }
    };
}]);
angular.module("Logger")
.factory('isEmailAvailable', ['$q','$http','$rootScope',function ($q, $http, $rootScope) {
    var options = {
        'btn-loading': '<i class="fa fa-spinner fa-pulse"></i>',
        'btn-success': '<i class="fa fa-check"></i>',
        'btn-error': '<i class="fa fa-remove"></i>',
        'msg-success': 'All Good! redirecting...',
        'msg-username-available': 'good username available!',
        'msg-username-taken'    : 'oops username taken',
        'msg-email-taken'       : 'email taken',
        'msg-email-available'   : 'email available',
        'msg-your-phone-suck'   : 'your phone is not valid',
        'useAJAX': true,
    };
    function messageEmailTaken(){
        $('.register-form-main-message').removeClass('show error');
    }
     function messageRemove(){
                    $('.register-form-main-message').removeClass('show success');
                }
    return function(email) {
         var deferred = $q.defer();

        $http.get($rootScope.endPoint + '/api/v1/users?email=' + email + '&access_token=8EuqcMNkF2yP50Dicpv9hLRRp7WOSabPlCu22liY').success(function(data){

            if(data === 'email-available'){
                $('.register-form-main-message').addClass('show success').html(options['msg-email-available']);
                setTimeout(messageRemove, 2000);
               

            }else if(data === 'email-taken'){
                $('.register-form-main-message').addClass('show error').html(options['msg-email-taken']);
                setTimeout(messageEmailTaken, 2000);
                
            }
             deferred.reject();
         }).error(function() {
            deferred.resolve();
         });
         return deferred.promise;
    };
}]);
