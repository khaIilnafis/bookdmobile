/**
 * Created by khalilbrown on 6/5/16.
 */
angular.module('bookd.factories', [])
  .factory('auth', ['$http', '$window', '$rootScope', '$state', '$q', function ($http, $window, $rootScope, $state) {
    var auth = {
      /**
       * Save the users authentication token
       *
       * @param token
       * @param user
       */
      saveUser: function (token, user) {
        if (user) {
          $window.localStorage['user'] = angular.toJson(user);
        }
        if (token) {
          $window.localStorage['bookd-token'] = token;
        }
      },
      /**
       * Retrieve the authentication token currently stored
       *
       * @returns {*}
       */
      getToken: function () {
        return $window.localStorage['bookd-token'];
      },
      getUser: function () {
        return $window.localStorage['user'];
      },
      /**
       * Save the provider information so it's not lost when the
       * bookd token changes
       *
       * @param info
       */
      saveProviderInfo: function (info) {
        $window.localStorage['providerInfo'] = info;
      },
      /**
       * Retrieve the provider info
       *
       * @returns {*}
       */
      getProviderInfo: function () {
        return $window.localStorage['providerInfo'];
      },
      isLoggedIn: function () {
        var token = auth.getToken();

        if (token !== 'undefined' && angular.isDefined(token)) {
          var payload = angular.fromJson($window.atob(token.split('.')[1]));

          return payload.exp > Date.now() / 1000;
        } else {
          return false;
        }
      },
      currentUser: function () {
        if (auth.isLoggedIn()) {
          var user = angular.fromJson(auth.getUser());
          user.providerInfo = auth.getProviderInfo();
          return user;
        }
      },
      register: function (user, info) {
        return $http.post('http://localhost:3002/register', user)
          .then(function (data) {
            auth.saveUser(data.data.token, data.data.user);
            if (info) {
              auth.saveProviderInfo(info);
            }
            $rootScope.currentUser = angular.fromJson(auth.currentUser());
            $rootScope.currentUser.providerInfo = auth.getProviderInfo();
            //socketService.emit('authorizationRes', $rootScope.currentUser._id);
          }, function (error) {
            throw error.data;
          });
      },
      logIn: function (user, info) {
        return $http.post('http://localhost:3002/login', user)
          .then(function (data) {
            auth.saveUser(data.data.token, data.data.user);
            if (info) {
              auth.saveProviderInfo(info);
            }
            $window.localStorage.setItem('monthYear', '');
            $window.localStorage.setItem('masterList', angular.toJson({}));
            $window.localStorage.setItem('monthYearArray', '');
            $window.localStorage.setItem('previousBusiness', '');
            $window.localStorage.setItem('previousPersonalMonthYear', '');
            $rootScope.currentUser = angular.fromJson(auth.currentUser());
            $rootScope.currentUser.providerInfo = auth.getProviderInfo();
            //socketService.emit('authorizationRes', $rootScope.currentUser._id);
          }, function (error) {
            throw error.data;
          });
      },
      logOut: function () {
        $window.localStorage.removeItem('bookd-token');
        $window.localStorage.removeItem('monthYear');
        $window.localStorage.removeItem('masterList');
        $window.localStorage.removeItem('monthYearArray');
        $window.localStorage.removeItem('providerInfo');
        $window.localStorage.removeItem('previousBusiness');
        $window.localStorage.removeItem('previousPersonalMonthYear');
        $window.localStorage.removeItem('oauthio_provider_google_plus');
        $rootScope.currentUser = null;
        $state.go('landing');
      },
      reset: function (email) {
        var data = {
          email: email
        };
        return $http.post('http://localhost:3002/user/reset', data)
          .then(function (data) {
            console.log(data);
          }, function (error) {
            throw error.data;
          });
      },
      newPassword: function (password, token) {
        var data = {
          password: password,
          token: token
        };
        return $http.post('http://localhost:3002/user/reset/new', data)
          .then(function (data) {
            console.log(data);
          }, function (error) {
            throw error.data;
          });
      }
    };

    return auth;
  }])
  .factory('notificationFactory', function ($http, auth, $q) {
    var o = {};
    o.addNotification = function (id, content, type, sendEmail, date) {
      var body = {
        id: id,
        content: content,
        type: type,
        sendEmail: sendEmail,
        date: date
      };
      return $http.post('/user/notifications/create', body, {
        headers: {Authorization: 'Bearer ' + auth.getToken()}
      }).then(function (response) {
        return response.data;
      }, function (err) {
        handleError(err);
        return err.data;
      });
    };

    o.getNotifications = function () {
      return $http.get('/user/notifications', {
        headers: {Authorization: 'Bearer ' + auth.getToken()}
      }).then(function (response) {
        return response.data;
      }, function (err) {
        handleError(err);
        return err.data;
      });
    };

    /**
     * Route to change all non-viewed notifications to viewed.
     * @returns {*}
     */
    o.notificationsViewed = function () {
      return $http.get('/user/notifications/viewed', {
        headers: {Authorization: 'Bearer ' + auth.getToken()}
      }).then(function (response) {
        return response.data;
      }, function (err) {
        handleError(err);
        return err.data;
      });
    };

    /**
     * Route to change one non-viewed notifications to viewed given it's ID.
     * @param id
     * @returns {*}
     */
    o.notificationViewed = function (id) {
      var body = {
        id: id
      };
      return $http.post('/user/notification/viewed', body, {
        headers: {Authorization: 'Bearer ' + auth.getToken()}
      }).then(function (response) {
        return response.data;
      }, function (err) {
        handleError(err);
        return err.data;
      });
    };

    return o;

    // I transform the error response, unwrapping the application dta from
    // the API response payload.
    function handleError(response) {
      // The API response from the server should be returned in a
      // normalized format. However, if the request was not handled by the
      // server (or what not handles properly - ex. server error), then we
      // may have to normalize it on our end, as best we can.
      if (!angular.isObject(response.data) || !response.data.message) {
        return ( $q.reject('An unknown error occurred.') );
      }
      // Otherwise, use expected error message.
      return ( $q.reject(response.data.message) );
    }
  });
