(function () {
  'use strict';

  angular
    .module('app.layout')
    .controller('SidebarController', SidebarController);

  SidebarController.$inject = ['$scope', '$state', 'routerHelper', 'authentication'];
  /* @ngInject */
  function SidebarController($scope, $state, routerHelper, authentication) {
    const vm = this;
    const states = routerHelper.getStates();
    let role = authentication.getUser() ? authentication.getUser().role : 'guest';
    vm.isCurrent = isCurrent;
    vm.logout = authentication.logout;

    activate();

    $scope.$on('user-login', (user) => {
      role = authentication.getUser() ? authentication.getUser().role : 'guest';
      activate();
    });

    $scope.$on('user-logout', () => {
      role = 'guest';
      activate();
    });

    function activate() {
      vm.user = authentication.getUser();
      getNavRoutes();
    }

    function getNavRoutes() {
      vm.navRoutes = states.filter(r => {
        if (r.settings && !r.settings.roles) {
          console.log('Please configure roles', r);
        }
        return r.settings && r.settings.nav && r.settings.roles.indexOf(role) !== -1;
      }).sort((r1, r2) => {
        return r1.settings.nav - r2.settings.nav;
      });
    }

    function isCurrent(route) {
      if (!route.title || !$state.current || !$state.current.title) {
        return '';
      }
      return $state.current.title.substr(0, route.title.length) === route.title ? 'current' : '';
    }
  }
}());
