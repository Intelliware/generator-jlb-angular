angular.module('configuration.identity', ['configuration.rest', 'ngCookies', 'ui.router'])

    .controller('identityController', function($scope, identityService, authenticationService, $resource, restConfigService) {

        $scope.identity = identityService.getIdentity();

        $scope.$on('auth.login', function() {
            $scope.identity = identityService.getIdentity();
        });

        $scope.signOut = function () {            
            delete $scope.identity;
            authenticationService.signOut();
            identityService.clear();
        };
    })

    .service('identityService', function($q, $http, $resource, $cookies, $log, restConfigService) {

        var identity;
        var Identity = $resource(restConfigService.getIdentityOperation());
        var cookieTimeOutMinutes = 120;
        var cookieTimeOutMillis = new Date(new Date().getTime() + cookieTimeOutMinutes * 60 * 1000);

        return {

            getIdentity: function () {
                if (identity) {
                    return identity;
                }

                if($cookies.get("username") && $cookies.get("authorities")) {
                    identity = {username: $cookies.get("username"), authorities: $cookies.get("authorities").split(",")};
                    return identity;
                }
                return null;
            },

            update: function (newIdentity) {
                identity = newIdentity;
                $cookies.put("username" , identity.username, {expires: new Date(2016, 1, 1)});
                $cookies.put("authorities" , identity.authorities.join(), {expires: cookieTimeOutMillis });
            },

            clear: function() {
                identity = null;
                $cookies.remove("username");
                $cookies.remove("authorities");
            }
        };
    });
