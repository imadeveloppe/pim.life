angular.module('pim.directives', ['ngCordova'])
    .directive('blankDirective', [function() {

}])  
.filter('startFrom', function() {
    return function(input, start) {
        if (input) {
            start = +start; //parse to int
            return input.slice(start);
        }
        return [];
    }
}) 
.directive('googlePlace', function ($rootScope) {
    return {
        require: 'ngModel',
        scope: {
          ngModel: '=',
          details: '=?'
        },
        link: function(scope, element, attrs, model) {
             
          var options = {
            types: [],
            componentRestrictions: {}
          };
          if( attrs.ngType ){
            options.types.push(attrs.ngType)
          }
          console.log(options)
          scope.gPlace = new google.maps.places.Autocomplete(element[0], options);

          google.maps.event.addListener(scope.gPlace, 'place_changed', function() {
            scope.$apply(function() {
              scope.details = scope.gPlace.getPlace();
              model.$setViewValue(element.val());
              $rootScope.$broadcast('place_changed', scope.details, attrs.ngModel);
            });
          });
        }
      };
})
.directive('currencyInput', function() {
    return {
        restrict: 'A',
        scope: {
            field: '='
        },
        replace: true,
        template: '<span><input type="text" ng-model="field"></input>{{field}}</span>',
        link: function(scope, element, attrs) {

            $(element).bind('keyup', function(e) {
                var input = element.find('input');
                var inputVal = input.val();

                //clearing left side zeros
                while (scope.field.charAt(0) == '0') {
                    scope.field = scope.field.substr(1);
                }

                scope.field = scope.field.replace(/[^\d.\',']/g, '');

                var point = scope.field.indexOf(".");
                if (point >= 0) {
                    scope.field = scope.field.slice(0, point + 3);
                }

                var decimalSplit = scope.field.split(".");
                var intPart = decimalSplit[0];
                var decPart = decimalSplit[1];

                intPart = intPart.replace(/[^\d]/g, '');
                if (intPart.length > 3) {
                    var intDiv = Math.floor(intPart.length / 3);
                    while (intDiv > 0) {
                        var lastComma = intPart.indexOf(",");
                        if (lastComma < 0) {
                            lastComma = intPart.length;
                        }

                        if (lastComma - 3 > 0) {
                            intPart = intPart.splice(lastComma - 3, 0, ",");
                        }
                        intDiv--;
                    }
                }

                if (decPart === undefined) {
                    decPart = "";
                } else {
                    decPart = "." + decPart;
                }
                var res = intPart + decPart;

                scope.$apply(function() {
                    scope.field = res
                });

            });

        }
    };
})

.factory('pickerView', ['$compile', '$cordovaKeyboard', '$rootScope', '$timeout', '$q', '$ionicScrollDelegate', '$ionicBackdrop',
    function($compile, $cordovaKeyboard, $rootScope, $timeout, $q, $ionicScrollDelegate, $ionicBackdrop) {

        var i, j, k, tmpVar;

        var domBody, pickerCtnr, pickerInfo, objlist;

        var isInit, isShowing;

        var setElementRotate = function setElementRotate(elemList, ni) {
            if (ni < 0 || ni === undefined) {
                return;
            }

            if (ni - 2 >= 0)
                angular.element(elemList[ni - 2]).removeClass('pre-select');
            if (ni - 1 >= 0)
                angular.element(elemList[ni - 1]).removeClass('selected').addClass('pre-select');

            angular.element(elemList[ni]).removeClass('pre-select').addClass('selected');
            if (ni + 1 < elemList.length)
                angular.element(elemList[ni + 1]).removeClass('selected').addClass('pre-select');
            if (ni + 2 < elemList.length)
                angular.element(elemList[ni + 2]).removeClass('pre-select');
        };

        var init = function init() {
            if (isInit) {
                return;
            }

            var template =
                '<div class="picker-view"> ' +
                '<div class="picker-accessory-bar">' +
                '<a class="button button-clear" on-tap="pickerEvent.onCancelBuuton()" ng-bind-html="pickerOptions.cancelButtonText"></a>' +
                '<h3 class="picker-title" ng-bind-html="pickerOptions.titleText"></h3>' +
                '<a class="button button-clear" on-tap="pickerEvent.onDoneBuuton()" ng-bind-html="pickerOptions.doneButtonText"></a>' +
                '</div>' +
                '<div class="picker-content">' +
                '<ion-scroll ng-repeat="(idx, item) in pickerOptions.items" ' +
                'class="picker-scroll" ' +
                'delegate-handle="{{ \'pickerScroll\' + idx }}" ' +
                'direction="y" ' +
                'scrollbar-y="false" ' +
                'has-bouncing="true" ' +
                'overflow-scroll="false" ' +
                'on-touch="pickerEvent.scrollTouch(idx)" ' +
                'on-release="pickerEvent.scrollRelease(idx)" ' +
                'on-scroll="pickerEvent.scrollPicking(event, scrollTop, idx)">' +
                '<div ng-repeat="val in item.values" ng-bind-html="val" class="oneLine"></div>' +
                '</ion-scroll>' +
                '</div>' +
                '</div>';

            pickerCtnr = $compile(template)($rootScope);
            pickerCtnr.addClass('hide');

            ['webkitAnimationStart', 'animationstart'].forEach(function runAnimStartHandle(eventKey) {
                pickerCtnr[0].addEventListener(eventKey, function whenAnimationStart() {
                    if (pickerCtnr.hasClass('picker-view-slidein')) {
                        // Before Show Picker View
                        $ionicBackdrop.retain();
                        isShowing = true;
                    } else if (pickerCtnr.hasClass('picker-view-slideout')) {
                        // Before Hide Picker View
                        isShowing = false;
                    }
                }, false);
            });

            ['webkitAnimationEnd', 'animationend'].forEach(function runAnimEndHandle(eventKey) {
                pickerCtnr[0].addEventListener(eventKey, function whenAnimationEnd() {
                    if (pickerCtnr.hasClass('picker-view-slidein')) {
                        // After Show Picker View
                        pickerCtnr.removeClass('picker-view-slidein');
                    } else if (pickerCtnr.hasClass('picker-view-slideout')) {
                        // After Hide Picker View
                        pickerCtnr.addClass('hide').removeClass('picker-view-slideout');
                        $ionicBackdrop.release();
                    }
                }, false);
            });

            if (!domBody) {
                domBody = angular.element(document.body);
            }
            domBody.append(pickerCtnr);
            isInit = true;
        };

        var dispose = function dispose() {
            pickerCtnr.remove();

            for (k in $rootScope.pickerOptions) {
                delete $rootScope.pickerOptions[k];
            }
            delete $rootScope.pickerOptions;
            for (k in $rootScope.pickEvent) {
                delete $rootScope.pickEvent[k];
            }
            delete $rootScope.pickEvent;

            pickerCtnr = pickerInfo = i = j = k = tmpVar = null;

            isInit = isShowing = false;
        };

        var close = function close() {
            if (!isShowing) {
                return;
            }

            pickerCtnr.addClass('picker-view-slideout');
        };
        var show = function show(opts) {
            var q = $q.defer();
            var isVisible = false;
            if ($rootScope.isDev == false) {
                isVisible = $cordovaKeyboard.isVisible();
            }
            if (isVisible) {
                // $cordovaKeyboard.hideAccessoryBar(true);
                // $cordovaKeyboard.disableScroll(true);
                $cordovaKeyboard.close();
                $timeout(function() {
                    show2(opts).then(function(data) {
                        q.resolve(data);
                    }, function(err) {
                        q.reject(err);
                    });
                }, 1000);
            } else {
                show2(opts).then(function(data) {
                    q.resolve(data);
                }, function(err) {
                    q.reject(err);
                });
            }
            return q.promise;
        };
        var show2 = function show2(opts) {
            if (!isInit || typeof opts !== 'object') {
                return undefined;
            }
            objlist = opts;

            var pickerShowDefer = $q.defer();

            opts.titleText = opts.titleText || '';
            opts.doneButtonText = opts.doneButtonText || 'Done';
            opts.cancelButtonText = opts.cancelButtonText || 'Cancel';

            pickerInfo = [];
            opts.items = [];
            for (i = 0; i < opts.obj.length; i++) {
                for (k = 0; k < opts.obj[i].values[0].length; k++) {
                    if (k == 0) {
                        var defaultIndex = 0
                        if (opts.obj[i].defaultIndex === undefined) {
                            opts.obj[i].defaultIndex = 0;
                        }
                        opts.items.push({
                            values: [opts.obj[i].values[0][k].view],
                            defaultIndex: opts.obj[i].defaultIndex
                        });
                    } else {
                        if( opts.items[i].values.indexOf( opts.obj[i].values[0][k].view ) == -1 ){
                            
                            opts.items[i].values.push(
                                opts.obj[i].values[0][k].view
                            );
                        }
                            
                    }
                }
                // push a empty string to last, because the scroll height problem
                opts.items[i].values.push('&nbsp;');
                pickerInfo.push({
                    id: opts.obj[i].values[0][opts.items[i].defaultIndex].id,
                    scrollTopLast: undefined,
                    scrollMaxTop: undefined,
                    eachItemHeight: undefined,
                    nowSelectIndex: opts.items[i].defaultIndex,
                    output: opts.items[i].values[opts.items[i].defaultIndex],
                    isTouched: false,
                    isFixed: false,
                    scrollStopTimer: null
                });
            }

            for (k in $rootScope.pickerOptions) {
                delete $rootScope.pickerOptions[k];
            }
            delete $rootScope.pickerOptions;
            for (k in $rootScope.pickEvent) {
                delete $rootScope.pickEvent[k];
            }
            delete $rootScope.pickEvent;

            $rootScope.pickerOptions = opts;
            $rootScope.pickerEvent = {
                onDoneBuuton: function onDoneBuuton() {
                    var pickerOutput = (function() {
                        var totalOutput = [];
                        for (i = 0; i < $rootScope.pickerOptions.items.length; i++) {
                            // totalOutput.push(pickerInfo[i].output);
                            totalOutput.push({
                                id: pickerInfo[i].id,
                                value: pickerInfo[i].output,
                                selectedIndex: pickerInfo[i].nowSelectIndex
                            });
                        }
                        return totalOutput;
                    })();
                    pickerShowDefer.resolve(pickerOutput);
                    close();
                },
                onCancelBuuton: function onCancelBuuton() {
                    pickerShowDefer.resolve();
                    close();
                },
                scrollTouch: function scrollTouch(pickerIdx) {
                    pickerInfo[pickerIdx].isTouched = true;
                    pickerInfo[pickerIdx].isFixed = false;
                },
                scrollRelease: function scrollRelease(pickerIdx) {
                    pickerInfo[pickerIdx].isTouched = false;
                },
                scrollPicking: function scrollPicking(e, scrollTop, pickerIdx) {
                    if (!$rootScope.pickerOptions) {
                        return;
                    }

                    if (!pickerInfo[pickerIdx].isFixed) {
                        pickerInfo[pickerIdx].scrollTopLast = scrollTop;

                        // update the scrollMaxTop (only one times)
                        if (pickerInfo[pickerIdx].scrollMaxTop === undefined) {
                            pickerInfo[pickerIdx].scrollMaxTop = e.target.scrollHeight - e.target.clientHeight + e.target.firstElementChild.offsetTop;
                        }

                        // calculate Select Index
                        tmpVar = Math.round(pickerInfo[pickerIdx].scrollTopLast / pickerInfo[pickerIdx].eachItemHeight);

                        if (tmpVar < 0) {
                            tmpVar = 0;
                        } else if (tmpVar > e.target.firstElementChild.childElementCount - 2) {
                            tmpVar = e.target.firstElementChild.childElementCount - 2;
                        }

                        if (pickerInfo[pickerIdx].nowSelectIndex !== tmpVar) {
                            pickerInfo[pickerIdx].nowSelectIndex = tmpVar;
                            pickerInfo[pickerIdx].output = $rootScope.pickerOptions.items[pickerIdx].values[pickerInfo[pickerIdx].nowSelectIndex];
                            pickerInfo[pickerIdx].id = objlist.obj[pickerIdx].values[0][pickerInfo[pickerIdx].nowSelectIndex].id;


                            // update item states
                            setElementRotate(e.target.firstElementChild.children,
                                pickerInfo[pickerIdx].nowSelectIndex);
                        }
                    }


                    if (pickerInfo[pickerIdx].scrollStopTimer) {
                        $timeout.cancel(pickerInfo[pickerIdx].scrollStopTimer);
                        pickerInfo[pickerIdx].scrollStopTimer = null;
                    }
                    if (!pickerInfo[pickerIdx].isFixed) {
                        pickerInfo[pickerIdx].scrollStopTimer = $timeout(function() {
                            $rootScope.pickerEvent.scrollPickStop(pickerIdx);
                        }, 80);
                    }
                },
                scrollPickStop: function scrollPickStop(pickerIdx) {
                    if (pickerInfo[pickerIdx].isTouched || pickerIdx === undefined) {
                        return;
                    }

                    pickerInfo[pickerIdx].isFixed = true;

                    // check each scroll position
                    for (j = $ionicScrollDelegate._instances.length - 1; j >= 1; j--) {
                        if ($ionicScrollDelegate._instances[j].$$delegateHandle !== ('pickerScroll' + pickerIdx)) {
                            continue;
                        }

                        // fixed current scroll position
                        tmpVar = pickerInfo[pickerIdx].eachItemHeight * pickerInfo[pickerIdx].nowSelectIndex;
                        if (tmpVar > pickerInfo[pickerIdx].scrollMaxTop) {
                            tmpVar = pickerInfo[pickerIdx].scrollMaxTop;
                        }
                        $ionicScrollDelegate._instances[j].scrollTo(0, tmpVar, true);
                        break;
                    }
                }
            };

            (function listenScrollDelegateChanged(options) {
                var waitScrollDelegateDefer = $q.defer();

                var watchScrollDelegate = $rootScope.$watch(function getDelegate() {
                    return $ionicScrollDelegate._instances;
                }, function delegateChanged(instances) {
                    watchScrollDelegate(); // remove watch callback
                    watchScrollDelegate = null;

                    var waitingScrollContentUpdate = function waitingScrollContentUpdate(prIdx, sDele) {
                        $timeout(function contentRefresh() {
                            watchScrollDelegate = $rootScope.$watch(function getUpdatedScrollView() {
                                return sDele.getScrollView();
                            }, function scrollViewChanged(sView) {
                                watchScrollDelegate();
                                watchScrollDelegate = null;

                                pickerInfo[prIdx].eachItemHeight = sView.__content.firstElementChild.clientHeight;

                                // padding the first item
                                sView.__container.style.paddingTop = (pickerInfo[prIdx].eachItemHeight * 1.5) + 'px';

                                // scroll to default index (no animation)
                                sDele.scrollTo(0, pickerInfo[prIdx].eachItemHeight * options.items[prIdx].defaultIndex, false);

                                // update item states
                                setElementRotate(sView.__content.children,
                                    options.items[prIdx].defaultIndex);
                            });
                        }, 20);
                    };

                    var dele;
                    for (i = 0; i < options.items.length; i++) {
                        dele = null;
                        for (j = instances.length - 1; j >= 1; j--) {
                            if (instances[j].$$delegateHandle === undefined) {
                                continue;
                            }

                            if (instances[j].$$delegateHandle === ('pickerScroll' + i)) {
                                dele = instances[j];
                                break;
                            }
                        }

                        if (dele) {
                            waitingScrollContentUpdate(i, dele);
                        }
                    }

                    waitScrollDelegateDefer.resolve();
                });

                return waitScrollDelegateDefer.promise;
            })(opts).then(function preparePickerViewFinish() {
                if (!isShowing) {
                    pickerCtnr.removeClass('hide').addClass('picker-view-slidein');
                }
            });

            pickerShowDefer.promise.close = close;
            return pickerShowDefer.promise;
        };

        var getIsInit = function getIsInit() {
            return isInit;
        };
        var getIsShowing = function getIsShowing() {
            return isShowing;
        };

        ionic.Platform.ready(init); // when DOM Ready, init Picker View

        return {
            init: init,
            dispose: dispose,
            show: show,
            close: close,
            isInit: getIsInit,
            isShowing: getIsShowing
        };
    }
]);

String.prototype.splice = function(idx, rem, s) {
    return (this.slice(0, idx) + s + this.slice(idx + Math.abs(rem)));
};