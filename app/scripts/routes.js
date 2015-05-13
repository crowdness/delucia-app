'use strict';
/**
 * @ngdoc overview
 * @name deluciaApp:routes
 * @description
 * # routes.js
 *
 * Configure routes for use with Angular, and apply authentication security
 * Add new routes using `yo angularfire:route` with the optional --auth-required flag.
 *
 * Any controller can be secured so that it will only load if user is logged in by
 * using `whenAuthenticated()` in place of `when()`. This requires the user to
 * be logged in to view this route, and adds the current user into the dependencies
 * which can be injected into the controller. If user is not logged in, the promise is
 * rejected, which is handled below by $routeChangeError
 *
 * Any controller can be forced to wait for authentication to resolve, without necessarily
 * requiring the user to be logged in, by adding a `resolve` block similar to the one below.
 * It would then inject `user` as a dependency. This could also be done in the controller,
 * but abstracting it makes things cleaner (controllers don't need to worry about auth state
 * or timing of displaying its UI components; it can assume it is taken care of when it runs)
 *
 *   resolve: {
 *     user: ['Auth', function(Auth) {
 *       return Auth.$getAuth();
 *     }]
 *   }
 *
 */
angular.module('deluciaApp')
    .config(function($locationProvider) {
        $locationProvider.html5Mode(true);
    })

/**
 * Adds a special `whenAuthenticated` method onto $routeProvider. This special method,
 * when called, invokes Auth.$requireAuth() service (see Auth.js).
 *
 * The promise either resolves to the authenticated user object and makes it available to
 * dependency injection (see AccountCtrl), or rejects the promise if user is not logged in,
 * forcing a redirect to the /login page
 */
.config(['$routeProvider', 'SECURED_ROUTES', function($routeProvider, SECURED_ROUTES) {
    // credits for this idea: https://groups.google.com/forum/#!msg/angular/dPr9BpIZID0/MgWVluo_Tg8J
    // unfortunately, a decorator cannot be use here because they are not applied until after
    // the .config calls resolve, so they can't be used during route configuration, so we have
    // to hack it directly onto the $routeProvider object
    $routeProvider.whenAuthenticated = function(path, route) {
        route.resolve = route.resolve || {};
        route.resolve.user = ['Auth', function(Auth) {
            return Auth.$requireAuth();
        }];
        $routeProvider.when(path, route);
        SECURED_ROUTES[path] = true;
        return $routeProvider;
    };
}])

// configure views; whenAuthenticated adds a resolve method to ensure users authenticate
// before trying to access that route
.config(['$routeProvider', '$sceDelegateProvider', function($routeProvider, $sceDelegateProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'views/main.html',
            controller: 'MainCtrl'
        })
        .when('/login', {
            templateUrl: 'views/login.html',
            controller: 'LoginCtrl',
            resolve: {
                hideSearchBar: function() {
                    return true;
                }
            }
        })
        .when('/reset-password', {
            templateUrl: 'views/reset-password.html',
            controller: 'ResetPasswordCtrl',
            resolve: {
                hideSearchBar: function() {
                    return true;
                }
            }
        })
        .whenAuthenticated('/account', {
            templateUrl: 'views/account.html',
            controller: 'AccountCtrl',
            resolve: {
                hideSearchBar: function() {
                    return true;
                }
            }
        })
        .whenAuthenticated('/new-lesson', {
            templateUrl: 'views/new-lesson.html',
            controller: 'NewLessonCtrl'
        })
        .when('/l/:lessonId', {
            templateUrl: 'views/lesson-detail.html',
            controller: 'LessonDetailCtrl'
        })
        .whenAuthenticated('/l/:lessonId/add-translation', {
            templateUrl: 'views/add-translation.html',
            controller: 'AddTranslationCtrl'
        })
        .when('/l/:lessonId/:languageCode', {
            templateUrl: 'views/lesson-detail.html',
            controller: 'LessonDetailCtrl'
        })
        .whenAuthenticated('/l/:lessonId/:languageCode/upload-video', {
            templateUrl: 'views/upload-video.html',
            controller: 'UploadVideoCtrl'
        })
        .whenAuthenticated('/l/:lessonId/:languageCode/upload-video/callback', {
            templateUrl: 'views/upload-video-callback.html',
            controller: 'UploadVideoCallbackCtrl'
        })
        .when('/search', {
            templateUrl: 'views/search.html',
            controller: 'SearchCtrl'
        })
        .otherwise({
            redirectTo: '/'
        });

    $sceDelegateProvider.resourceUrlWhitelist([
        // Allow same origin resource loads.
        'self',
        // Allow loading from our assets domain.  Notice the difference between * and **.
        'https://player.vimeo.com/**'
    ]);
}])

/**
 * Apply some route security. Any route's resolve method can reject the promise with
 * "AUTH_REQUIRED" to force a redirect. This method enforces that and also watches
 * for changes in auth status which might require us to navigate away from a path
 * that we can no longer view.
 */
.run(['$rootScope', '$location', 'Auth', 'SECURED_ROUTES', 'loginRedirectPath', '$modal', 'Ref', '$firebaseArray', '$q', '_',
    function($rootScope, $location, Auth, SECURED_ROUTES, loginRedirectPath, $modal, Ref, $firebaseArray, $q, _) {
        $rootScope.location = $location;
        $rootScope.Auth = Auth;
        $rootScope.showSearchDialog = function() {
            $modal.open({
                templateUrl: 'views/search-modal.html'
            });
        };
        $rootScope.search = function(q, lang) {
            $location.path('/search').search({
                q: q,
                lang: lang.code
            });
        };
        $rootScope.searchVideos = function(lang, q) {
            q = q.toLowerCase();
            var deferred = $q.defer();

            $firebaseArray(Ref.child('lessons').orderByChild('languageCode').equalTo(lang.code)).$loaded(function(lessons) {
                deferred.resolve(_.filter(lessons, function(video) {
                    return video.title.toLowerCase().indexOf(q) > -1;
                }));
            });

            return deferred.promise.then(function(lessons) {
                return lessons;
            });
        };
        $rootScope.goToVideo = function(item) {
            $location.url('/l/' + (item.parentId || item.$id) + '/' + item.languageCode);
        };

        $rootScope.languages = [{
            code: 'en',
            name: 'English'
        }];
        var tempLanguages = $firebaseArray(Ref.child('languages'));
        tempLanguages.$loaded(function() {
            $rootScope.languages = _.map(tempLanguages, function(lang) {
                return {
                    code: lang.$id,
                    name: lang.$value
                };
            });
        });

        $rootScope.vimeoAccessToken = '3ddd650c8a4657c2cde8174fe91024ca';

        $rootScope.Utils = {
            keys: Object.keys
        };

        // watch for login status changes and redirect if appropriate
        Auth.$onAuth(check);

        // some of our routes may reject resolve promises with the special {authRequired: true} error
        // this redirects to the login page whenever that is encountered
        $rootScope.$on('$routeChangeError', function(e, next, prev, err) {
            if (err === 'AUTH_REQUIRED') {
                $location.path(loginRedirectPath);
            }
        });

        $rootScope.$on('$routeChangeSuccess', function(e, next) {
            $rootScope.hideSearchBar = next.locals.hideSearchBar || false;
        });

        function check(user) {
            if (!user && authRequired($location.path())) {
                $location.path(loginRedirectPath);
            }
        }

        function authRequired(path) {
            return SECURED_ROUTES.hasOwnProperty(path);
        }
    }
])

// used by route security
.constant('SECURED_ROUTES', {})
    .constant('_', window._)
    .constant('URI', window.URI);
