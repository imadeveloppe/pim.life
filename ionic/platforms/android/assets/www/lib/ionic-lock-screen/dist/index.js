"use strict";
var lockScreenService=function(n) {
    return {
        show:function(o) {
 

              n.$broadcast("ionic-lock-screen:show", {
                  touchId: o.touchId||!1, 
                  ACDelbuttons: o.ACDelbuttons||!1, 
                  passcode: o.code, 
                  onCorrect: o.onCorrect||null, 
                  onWrong: o.onWrong||null, 
                  passcodeLabel: o.passcodeLabel||"Enter Passcode", 
                  touchLabel: o.touchLabel, 
                  textLink: o.textLink, 
                  backgroundColor: o.backgroundColor||"#F1F1F1", 
                  textColor: o.textColor||"#464646", 
                  buttonColor: o.buttonColor||"#F8F8F8", 
                  buttonTextColor: o.buttonTextColor||"#464646", 
                  buttonPressed: o.buttonPressed||"#E0E0E0", 
                  buttonACColor: o.buttonACColor||"#F8F8F8", 
                  buttonACTextColor: o.buttonACTextColor||"#464646", 
                  buttonDelColor: o.buttonDelColor||"#F8F8F8", 
                  buttonDelTextColor: o.buttonDelTextColor||"#464646",
                  cancelBtn: o.cancelBtn||null
              }) 

        },
        hide:function () {
            n.$broadcast('ionic-lock-screen:hide');
        },
        resetAttempt:function () {
            n.$broadcast('ionic-lock-screen:resetAttempt');
        }
    }
};

lockScreenService.$inject=["$rootScope"];
var lockScreenDirective=function(n,$filter, $cordovaTouchID, crypt, LockScreen) {
    var passcodeAttempts = 0;
    return {
        restrict:"E",
        scope: {}
        ,
        link:function(o) {
            var e=0;
            o.enteredPasscode="",
 



            o.$on("ionic-lock-screen:show", function(e, t) {

              // console.log("window.localStorage.getItem('locked')", window.localStorage.getItem('locked'))
              // console.log("window.localStorage.getItem('loged')", window.localStorage.getItem('loged'))

              if( (parseInt(window.localStorage.getItem('locked')) == 1 && parseInt(window.localStorage.getItem('loged')) == 1) || t.cancelBtn ){
                  o._showLockScreen=!0, 
                  o.ACDelbuttons=t.ACDelbuttons, 
                  o.passcode=t.passcode, 
                  o.onCorrect=t.onCorrect, 
                  o.onWrong=t.onWrong, 
                  o.passcodeLabel=t.passcodeLabel,
                  o.textLink=t.textLink, 
                  o.touchLabel=t.touchLabel, 
                  o.backgroundColor=t.backgroundColor, 
                  o.textColor=t.textColor, 
                  o.buttonColor=t.buttonColor, 
                  o.buttonTextColor=t.buttonTextColor, 
                  o.buttonPressed=t.buttonPressed, 
                  o.buttonACColor=t.buttonACColor, 
                  o.buttonACTextColor=t.buttonACTextColor, 
                  o.buttonDelColor=t.buttonDelColor, 
                  o.buttonDelTextColor=t.buttonDelTextColor,
                  o.cancelBtn=t.cancelBtn
   
                  n(() => {
                    if (t.touchId) {
                        if( ionic.Platform.isIOS() ){
                            
                            $cordovaTouchID.authenticate( $filter('translate')('touch_id.fingerprint') ).then(function() {

                              n(() => {

                                o.$apply(function () {
                                    o._showLockScreen=!1;
                                    o.enteredPasscode = '';
                                    o.passcodeAttempts = 0;
                                    o.passcodeWrong = false;
                                    o.onCorrect&&o.onCorrect();
                                }); 

                              }, 50);

                            }, function () {}); 
                           
                        }else{
                            SamsungPass.startIdentifyWithDialog(function() {
                              
                              n(() => {

                                o.$apply(function () {
                                    o._showLockScreen=!1;
                                    o.enteredPasscode = ''; 
                                    o.passcodeWrong = false;
                                    o.onCorrect&&o.onCorrect();
                                }); 

                              }, 50); 

                            }, function() {});
                        } 
                    }
                  }, 50);
                }
            }),

            o.$on('ionic-lock-screen:hide', (e)=>{
                    o._showLockScreen = false;
                    o.enteredPasscode = ''; 
                    o.passcodeWrong = false;
            }),

            o.$on('ionic-lock-screen:resetAttempt', (e)=>{
                    passcodeAttempts = 0;
            }),

            o.all_clear=function() {
                o.enteredPasscode=""
            }
            ,
            o["delete"]=function() {
                o.enteredPasscode=o.enteredPasscode.slice(0, -1)
            }
            ,
            o.digit=function(digit) { 

                o.selected = +digit;
                if (o.passcodeWrong) {
                  return;
                }
                o.enteredPasscode += '' + digit;
                if (o.enteredPasscode.length >= 4) {
                  if ( crypt.sha256(o.enteredPasscode) === '' + o.passcode) {
                    o.enteredPasscode = '';
                    passcodeAttempts = 0;
                    o.onCorrect && o.onCorrect();
                    o._showLockScreen = false;
                  } else {
                    o.passcodeWrong = true;
                    passcodeAttempts++;
                    o.onWrong && o.onWrong(passcodeAttempts);
                    n(() => {
                      o.enteredPasscode = '';
                      o.passcodeWrong = false;
                    }, 800);
                     
                  }
                } 
            },
            o.serviceClient=function () {
                $('body').removeClass('lockScreen');   
                o._showLockScreen = false;
            },
            o.cancelILS_lock=function () { 
              o._showLockScreen = false;
              o.enteredPasscode = ''; 
              o.passcodeWrong = false;
              if( parseInt(window.localStorage.getItem('locked')) == 1 && parseInt(window.localStorage.getItem('loged')) == 1 ){
                LockScreen.show();
              }
            }
        }
        ,
        template:` 
              <div class="ILS_lock" ng-class="!_showLockScreen ?  'ILS_lock-hidden' : ''">
                <div class="ILS_label-row">
                  {{passcodeLabel}}
                </div>
                <div class="ILS_circles-row" ng-class="passcodeWrong ?  'ILS_shake' : ''">
                  <div class="ILS_circle" ng-class=" enteredPasscode.length>0 ? 'ILS_full' : ''"></div>
                  <div class="ILS_circle" ng-class=" enteredPasscode.length>1 ? 'ILS_full' : ''"></div>
                  <div class="ILS_circle" ng-class=" enteredPasscode.length>2 ? 'ILS_full' : ''"></div>
                  <div class="ILS_circle" ng-class=" enteredPasscode.length>3 ? 'ILS_full' : ''"></div>
                  <button class="button button-clear bt-cleancode" ng-show="enteredPasscode.length>0" ng-click="delete()">
                        <i class="icon ion-backspace"></i>
                  </button>
                </div>
                <div class="ILS_numbers-row">
                  <div ng-click="digit(1)" class="ILS_digit">1</div>
                  <div ng-click="digit(2)" class="ILS_digit">2</div>
                  <div ng-click="digit(3)" class="ILS_digit">3</div>
                </div>
                <div class="ILS_numbers-row">
                  <div ng-click="digit(4)" class="ILS_digit">4</div>
                  <div ng-click="digit(5)" class="ILS_digit">5</div>
                  <div ng-click="digit(6)" class="ILS_digit">6</div>
                </div>
                <div class="ILS_numbers-row">
                  <div ng-click="digit(7)" class="ILS_digit">7</div>
                  <div ng-click="digit(8)" class="ILS_digit">8</div>
                  <div ng-click="digit(9)" class="ILS_digit">9</div>
                </div>
                <div class="ILS_numbers-row">
                  <div ng-show="ACDelbuttons" ng-click="all_clear()" class="ILS_digit ILS_ac">AC</div>
                  <div ng-click="digit(0)" class="ILS_digit">0</div>
                  <div ng-show="ACDelbuttons" ng-click="delete()" class="ILS_digit ILS_del">DEL</div>
                </div>
                <a class="bottom-link" ng-show="cancelBtn" ng-click="cancelILS_lock()" style="left:10px; right:auto"> {{cancelBtn}} </a>
                <a href="/customer-service" class="bottom-link" ui-sref="customerService" ng-click="serviceClient()"> {{textLink}} </a>
              </div>
    `
    }
}

;
lockScreenDirective.$inject=["$timeout","$filter", "$cordovaTouchID", "crypt", "LockScreen"],
angular.module("ionic-lock-screen", []),
angular.module("ionic-lock-screen").directive("lockScreen", lockScreenDirective),
angular.module("ionic-lock-screen").service("$lockScreen", lockScreenService);