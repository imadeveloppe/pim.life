(function() {
  'use strict';

  angular
    .module('dbaq.ionNumericKeyboard', [])
    .directive('ionNumericKeyboard', ['$document', '$timeout', '$compile', function($document, $timeout, $compile) {

    /**
     * default options
     */
    var defaultsOpts = {
        visible: true, // visible
        hideOnOutsideClick: false, // do not hide by default to ensure backward compatibility
        leftControl: null, // no left control
        rightControl: '<i class="icon ion-backspace-outline"></i>',
        onKeyPress: angular.noop,
        button: null
    }; 
    var appendDefaultCss = function(headElem) {
      var css =  '<style type="text/css">@charset "UTF-8";' +
                    '.ion-numeric-keyboard {' +
                    '    z-index: 12;' +
                    '    bottom: 0;' +
                    '    left: 0;' +
                    '    right: 0;' +
                    '    position: absolute; ' +
                    '    width: 100%;' +
                    '}' +
                    '.backdrop-numeric-keyboard {' +
                    '    background-color: transparent;' +
                    '}' +
                    '.ion-numeric-keyboard .row {' +
                    '    padding: 0;' +
                    '    margin: 0;' +
                    '}' +
                    '.ion-numeric-keyboard .key {' +
                    '    border: 0;' +
                    '    border-radius: 0;' +
                    '    padding: 0;' +
                    '    background-color: transparent;' +
                    '    font-size: 180%;' +
                    '    border-style: solid;' +
                    '    color: #fefefe;' +
                    '    border-color: #444;' +
                    '    background-color: #333;' +
                    '}' +
                    '.ion-numeric-keyboard .control-key {' +
                    '    background-color: #242424;' +
                    '}' +
                    '.ion-numeric-keyboard .key.activated {'+
                    '    box-shadow: inset 0 1px 4px rgba(0, 0, 0, .1);'+
                    '    background-color: rgba(68, 68, 68, 0.5);'+
                    '}' +
                    '.ion-numeric-keyboard .row:nth-child(1) .key {' +
                    '    border-top-width: 1px;' +
                    '}' +
                    '.ion-numeric-keyboard .row:nth-child(1) .key,' +
                    '.ion-numeric-keyboard .row:nth-child(2) .key,' +
                    '.ion-numeric-keyboard .row:nth-child(3) .key ,' +
                    '.ion-numeric-keyboard .row:nth-child(4) .key {' +
                    '    border-bottom-width: 1px;' +
                    '}' +
                    '.ion-numeric-keyboard .row .key:nth-child(1),' +
                    '.ion-numeric-keyboard .row .key:nth-child(2) {' +
                    '    border-right-width: 1px;' +
                    '}' +
                    '.has-ion-numeric-keyboard {' +
                    '    bottom: 188px;' +
                    '}' +
                    '.has-ion-numeric-keyboard.has-ion-numeric-keyboard-top-bar {' +
                    '    bottom: 228px;' +
                    '}' +
                    '.ion-numeric-keyboard-top-bar {' +
                    '    background-color: #242424;' +
                    '}' +
                  '</style>';
      headElem.append(css);
    };

    var resizeIonContent = function(isKeyboardVisible, ionContentElem, hasTopBar) {
      if (ionContentElem) {
        if (isKeyboardVisible) {
          ionContentElem.addClass('has-ion-numeric-keyboard');
          if (hasTopBar) {
            ionContentElem.addClass('has-ion-numeric-keyboard-top-bar');
          }
        }
        else {
          ionContentElem.removeClass('has-ion-numeric-keyboard');
          ionContentElem.removeClass('has-ion-numeric-keyboard-top-bar');
        }
      }
    }

    return {
      restrict: 'E',
      replace: true,
      template: '<div id="asjasjdk" click-outside="hide()" outside-if-not="numeric-keyboard-source" class="ion-numeric-keyboard ng-hide" ng-show="opts.visible" ng-class="{\'with-top-bar\': opts.button}">' +
                  '<div class="row ion-numeric-keyboard-top-bar" ng-show="opts.button">' +
                    '<div class="col">' +
                      '<button class="{{opts.button.class}}" ng-click="opts.button.onClick()" ng-bind-html="opts.button.content"></button>' + 
                    '</div>' + 
                  '</div>' +
                  '<div class="row">' +
                    '<button class="col key button" ng-click="opts.onKeyPress(1, \'NUMERIC_KEY\')" ng-bind-html="1"></button>'+
                    '<button class="col key button" ng-click="opts.onKeyPress(2, \'NUMERIC_KEY\')" ng-bind-html="2"></button>'+
                    '<button class="col key button" ng-click="opts.onKeyPress(3, \'NUMERIC_KEY\')" ng-bind-html="3"></button>'+
                  '</div>' +
                  '<div class="row">' +
                    '<button class="col key button" ng-click="opts.onKeyPress(4, \'NUMERIC_KEY\')" ng-bind-html="4"></button>'+
                    '<button class="col key button" ng-click="opts.onKeyPress(5, \'NUMERIC_KEY\')" ng-bind-html="5"></button>'+
                    '<button class="col key button" ng-click="opts.onKeyPress(6, \'NUMERIC_KEY\')" ng-bind-html="6"></button>'+
                  '</div>' +
                  '<div class="row">' +
                    '<button class="col key button" ng-click="opts.onKeyPress(7, \'NUMERIC_KEY\')" ng-bind-html="7"></button>'+
                    '<button class="col key button" ng-click="opts.onKeyPress(8, \'NUMERIC_KEY\')" ng-bind-html="8"></button>'+
                    '<button class="col key button" ng-click="opts.onKeyPress(9, \'NUMERIC_KEY\')" ng-bind-html="9"></button>'+
                  '</div>' +
                  '<div class="row">' +
                    '<button class="col key button control-key left-control-key" ng-click="opts.onKeyPress(opts.leftControl, \'LEFT_CONTROL\')" ng-bind-html="opts.leftControl" ng-show="opts.leftControl"></button>'+
                    '<div class="col key  control-key right-control-key" ng-show="!opts.leftControl"></div>' +
                    '<button class="col key button" ng-click="opts.onKeyPress(0, \'NUMERIC_KEY\')" ng-bind-html="0"></button>'+
                    '<button class="col key button control-key right-control-key" ng-click="opts.onKeyPress(opts.rightControl, \'RIGHT_CONTROL\')" ng-bind-html="opts.rightControl" ng-show="opts.rightControl"></button>'+
                    '<div class="col key  control-key right-control-key" ng-show="!opts.rightControl"></div>' +
                  '</div>' +
                '</div>',
      scope: {
            options: '='
      },
      link: function($scope, $element, $attr) {

        // add default css to <head>
        appendDefaultCss($document.find('head'));
        // ion content element
        var ionContentElem = $element.parent().find('ion-content');

        $scope.hide = function() {
          if ($scope.opts.hideOnOutsideClick) {
            $scope.opts.visible = false;
            console.log('okokjjhgjhgj')
            $('.tabs').show();
            resizeIonContent($scope.opts.visible, ionContentElem);
          }
        }

        // merge options
        $scope.opts = angular.merge({}, defaultsOpts, $scope.options || {});
        // if the keyboard is visible, the ion content needs to be resized
        resizeIonContent($scope.opts.visible, ionContentElem, $scope.opts.button !== null);

        // watch the options to update the visibility of the keyboard
        $scope.$watchCollection('options', function(newValue, oldValue){
          if (newValue !== oldValue) {
            $scope.opts = angular.merge({}, defaultsOpts, newValue);
            resizeIonContent($scope.opts.visible, ionContentElem, $scope.opts.button !== null);
          }
        });
      }
    };
  }])  
  //an angular directive to detect a click outside of an elements scope
  //@author https://github.com/IamAdamJowett
  .directive('clickOutside', ['$document', '$parse', function ($document, $parse) { 
    return {
      restrict: 'A',
      link: function($scope, elem, attr) {
        var classList = (attr.outsideIfNot !== undefined) ? attr.outsideIfNot.replace(', ', ',').split(',') : [],
          fn = $parse(attr['clickOutside']);

        // add the elements id so it is not counted in the click listening
        if (attr.id !== undefined) {
          classList.push(attr.id);
        }

        var eventHandler = function(e) {
          //check if our element already hiden
          if(angular.element(elem).hasClass("ng-hide")){ 
              return;
          }

          var i = 0,
              element;

          // if there is no click target, no point going on
          if (!e || !e.target) {
              return;
          }

          // loop through the available elements, looking for classes in the class list that might match and so will eat
          for (element = e.target; element; element = element.parentNode) {
            var id = element.id,
                classNames = element.className,
                l = classList.length;

            // Unwrap SVGAnimatedString
            if (classNames && classNames.baseVal !== undefined) {
              classNames = classNames.baseVal;
            }

            // loop through the elements id's and classnames looking for exceptions
            for (i = 0; i < l; i++) {
              // check for id's or classes, but only if they exist in the first place
              if ((id !== undefined && id.indexOf(classList[i]) > -1) || (classNames && classNames.indexOf(classList[i]) > -1)) {
                // now let's exit out as it is an element that has been defined as being ignored for clicking outside
                return;
              }
            }
          }
          
          // if we have got this far, then we are good to go with processing the command passed in via the click-outside attribute
          return $scope.$apply(function () {
              angular.element("html").removeClass("keyboardOn");
              angular.element(".numeric-keyboard-amount").parent("label").removeClass("cursonInInput");
            return fn($scope);
          });
        };

        // assign the document click handler to a variable so we can un-register it when the directive is destroyed
        $document.on('click', eventHandler);

        // when the scope is destroyed, clean up the documents click handler as we don't want it hanging around
        $scope.$on('$destroy', function() {
          $document.off('click', eventHandler);
        });
      }
    };
  }]); 
})();