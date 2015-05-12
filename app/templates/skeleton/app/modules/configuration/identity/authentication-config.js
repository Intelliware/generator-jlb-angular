angular.module('configuration.identity.authentication', ['configuration.identity', 'configuration.state', 'ngCookies', 'ui.router'])

    .controller('authenticationController', function($scope, $state, $location, authenticationService) {

        $scope.signIn = function (username, password) {

            authenticationService.authenticate(username, password)
                .then(function (identity) {
                    $scope.authenticationError = false;
                    authenticationService.setCredentials(identity, password);
                    $state.go('page.home');
                }, function (error) {
                    $scope.authenticationError = true;
                });
        };
    })

    .service('authenticationService', function($q, $http, $resource, $cookies, $rootScope, restConfigService, identityService, Base64) {

        var Authentication = $resource(restConfigService.getAuthenticationOperation());

        var _loginEvent = function(identity) { $rootScope.$broadcast('auth.login', identity); };
        var _logoutEvent = function() { $rootScope.$broadcast('auth.logout'); };

        return {

            clear: function () {
                delete $cookies.currentUserId;
                $http.defaults.headers.common.Authorization = 'Basic ';
                _logoutEvent();
                identityService.clear();
            },

            authenticate: function (username, password, callback) {
                return Authentication.save({username : username, password: password}).$promise;
            },

            setCredentials: function (identity, password) {
                var authData = Base64.encode(identity.username + ':' + password);
                identity.authData = authData;
                identityService.update(identity);

                $cookies.currentUserId = identity.id;
                $http.defaults.headers.common['Authorization'] = 'Basic ' + authData;
                //_loginEvent();
            },

            isAuthenticated: function() {
                return $q.when(identityService.getIdentity() || identityService.ping())
                    .then(function(identity) {
                        if(!identity) { return false; }
                        _loginEvent(identity);
                        return true;
                    }, function() { return false; });
            }
        };
    })

    .factory('Base64', function () {
        /* jshint ignore:start */

        var keyStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

        return {
            encode: function (input) {
                var output = "";
                var chr1, chr2, chr3 = "";
                var enc1, enc2, enc3, enc4 = "";
                var i = 0;

                do {
                    chr1 = input.charCodeAt(i++);
                    chr2 = input.charCodeAt(i++);
                    chr3 = input.charCodeAt(i++);

                    enc1 = chr1 >> 2;
                    enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                    enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                    enc4 = chr3 & 63;

                    if (isNaN(chr2)) {
                        enc3 = enc4 = 64;
                    } else if (isNaN(chr3)) {
                        enc4 = 64;
                    }

                    output = output +
                    keyStr.charAt(enc1) +
                    keyStr.charAt(enc2) +
                    keyStr.charAt(enc3) +
                    keyStr.charAt(enc4);
                    chr1 = chr2 = chr3 = "";
                    enc1 = enc2 = enc3 = enc4 = "";
                } while (i < input.length);

                return output;
            },

            decode: function (input) {
                var output = "";
                var chr1, chr2, chr3 = "";
                var enc1, enc2, enc3, enc4 = "";
                var i = 0;

                // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
                var base64test = /[^A-Za-z0-9\+\/\=]/g;
                if (base64test.exec(input)) {
                    window.alert("There were invalid base64 characters in the input text.\n" +
                    "Valid base64 characters are A-Z, a-z, 0-9, '+', '/',and '='\n" +
                    "Expect errors in decoding.");
                }
                input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

                do {
                    enc1 = keyStr.indexOf(input.charAt(i++));
                    enc2 = keyStr.indexOf(input.charAt(i++));
                    enc3 = keyStr.indexOf(input.charAt(i++));
                    enc4 = keyStr.indexOf(input.charAt(i++));

                    chr1 = (enc1 << 2) | (enc2 >> 4);
                    chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                    chr3 = ((enc3 & 3) << 6) | enc4;

                    output = output + String.fromCharCode(chr1);

                    if (enc3 != 64) {
                        output = output + String.fromCharCode(chr2);
                    }
                    if (enc4 != 64) {
                        output = output + String.fromCharCode(chr3);
                    }

                    chr1 = chr2 = chr3 = "";
                    enc1 = enc2 = enc3 = enc4 = "";

                } while (i < input.length);

                return output;
            }
        };
        /* jshint ignore:end */
    })

    .config(function($stateProvider) {

        $stateProvider

            .state('page.login', {
                url: '/login',
                controller: 'authenticationController',
                templateUrl: 'modules/configuration/identity/partial/login.html'
            })

            .state('page.logout', {
                url: '/logout',
                controller: 'authenticationController',
                templateUrl: 'modules/configuration/identity/partial/logout.html'
            });
    })

    .run(function($rootScope, $state, authenticationService) {

        $rootScope.$on('$stateChangeStart', function (event, toState) {
            authenticationService.isAuthenticated().then(function(isAuthenticated) {

                if(toState.name !== 'page.login' && !isAuthenticated) {
                    $state.go('page.login');
                    event.preventDefault();
                }
                else if(toState.name === 'page.login' && isAuthenticated) {
                    $state.go('page.home');
                    event.preventDefault();
                }

            });
        });
    });
