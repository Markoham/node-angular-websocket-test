'user strict';

var myApp = angular.module('myApp', ['ui.router']);

myApp.config(function($stateProvider, $urlRouterProvider) {
  //
  // For any unmatched url, redirect to /state1
  $urlRouterProvider.otherwise("/");
  //
  // Now set up the states
  $stateProvider
    .state('main', {
      url: "/",
      templateUrl: "partials/main.html",
      controller: function($scope) {
          $scope.socket = io();
          $scope.elements = [];
          
          function updateElement(elem) {
              for(var i = 0, c = $scope.elements.length; i < c; i++)
              {
                  if($scope.elements[i].id === elem.id) {
                      $scope.elements[i].top = elem.top;
                      $scope.elements[i].left = elem.left;
                  }
              }
          }
          
          $scope.socket.on('all', function (data) {
              $scope.$apply(function () {
                $scope.elements = JSON.parse(data).elements;
              });
              console.log($scope.elements);
          });
          
          $scope.socket.on('update', function(data) {
              $scope.$apply(function () {
                  updateElement(JSON.parse(data).element);
              });
              console.log("update");
          });
          
          $scope.socket.emit('all');
          
          $scope.selected = null;
          $scope.pos = {top: 0, left:0};
          $scope.start = function(elem, event)
          {
              $scope.selected = elem;
              $scope.pos.top = elem.top - event.clientY;
              $scope.pos.left = elem.left - event.clientX;
          }
          
          $scope.drag = function(event)
          {
              if($scope.selected)
              {
                  $scope.selected.top = event.clientY + $scope.pos.top;
                  $scope.selected.left = event.clientX + $scope.pos.left;
              }
          }
          
          $scope.stop = function()
          {
              $scope.socket.emit('update', JSON.stringify({element: $scope.selected}));
              $scope.selected = null;
              $scope.pos = {top: 0, left:0};
          }
      }
    });
});