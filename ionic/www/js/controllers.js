var congratulation_msg = "";
angular.module('pim.controllers', [])
 
.controller('AppCtrl', function($scope, User, $filter, Go,Alert,Accounts, $ionicGesture, $ionicPlatform, Catgs, $state, $ionicPopup, AuthService, AUTH_EVENTS, $ionicScrollDelegate, $rootScope, API) {
    $scope.isIOS = ionic.Platform.isIOS();
    $scope.isAndroid = ionic.Platform.isAndroid();
    $scope.isAndroid = true;
    $scope.devise = API.devise; 

    var countColor = 50;
    $rootScope.BlueColorList = randomColor({hue: 'blue',luminosity: 'dark',count:countColor});
    $rootScope.OrangeColorList = randomColor({hue: 'orange',luminosity: 'dark',count:countColor});
   
 
    $scope.$on('$ionicView.beforeLeave', function(e) {
        $scope.loader = Alert.loader(true);
    });
    $scope.$on('$ionicView.beforeEnter', function(e) {
        $scope.loader = Alert.loader(true); 
    });
    $scope.$on('$ionicView.afterEnter', function(e) {
        if(!Go.is('list-notifications') && !Go.is('info-compte') && !Go.is('statistics') && !Go.is('changequestions') && !Go.is('sign-up-step3')){
            $scope.loader = Alert.loader(false);
        }
    });


    $scope.InscriptionVerifEmail = function ( url_string ) { 
        var url = new URL(url_string);
        var code = url.searchParams.get("code");
        var isshop = url.searchParams.get("isshop");

        if( User.GetDetails() == false ){

            Go.post({
                task: "InscriptionVerifEmail",
                codemail: code
            }).then(function (data) {
                if (data.success == 1) {
                    if( data.reactivation == 1 ){
                        swal({
                            title: $filter('translate')('global_fields.information'), 
                            type: "info",
                            html: data.message,
                            showCancelButton: true,
                            confirmButtonColor: "#254e7b",
                            confirmButtonText: $filter('translate')('global_fields.yes'),
                            cancelButtonText: $filter('translate')('global_fields.no'),
                            customClass: "customSwal",
                            showLoaderOnConfirm: true,
                            preConfirm: function() {
                                Go.post({
                                    task: "ReactiveUser"
                                }).then(function(result) {
                                    if( result.success == 1 ){
                                        swal({
                                            title: $filter('translate')('global_fields.information'), 
                                            type: "info",
                                            html: result.message,
                                            showCancelButton: true,
                                            cancelButtonText: $filter('translate')('global_fields.close'),
                                            showConfirmButton: false,  
                                            showLoaderOnConfirm: true,
                                        })
                                        $state.go('signin');
                                    } 
                                })
                            },
                            preCancel: function() {
                                $state.go('signin');
                            },
                            allowOutsideClick: false
                        })
                    }else{ 
                        switch( isshop ){
                            case '0':
                                $state.go('signup',{
                                    code: code
                                })
                                break;

                            case '1':
                                $state.go('signuppro',{
                                    code: code
                                })
                                break;
                        }

                    }
                        
                } 
            })
            
        } 
    }



    $scope.contacts = [
        { name: 'Frank', img: 'frank.jpg', phone: '0101 123456', mobile: '0770 123456', email: 'frank@emailionicsorter.com' },
        { name: 'Susan', img: 'susan.jpg', phone: '0101 123456', mobile: '0770 123456', email: 'frank@emailionicsorter.com' },
        { name: 'Emma', img: 'emma.jpg', phone: '0101 123456', mobile: '0770 123456', email: 'frank@emailionicsorter.com' },
        { name: 'Scott', img: 'scott.jpg', phone: '0101 123456', mobile: '0770 123456', email: 'frank@emailionicsorter.com' },
        { name: 'Bob', img: 'bob.jpg', phone: '0101 123456', mobile: '0770 123456', email: 'frank@emailionicsorter.com' },
        { name: 'Olivia', img: 'olivia.jpg', phone: '0101 123456', mobile: '0770 123456', email: 'frank@emailionicsorter.com' },
        { name: 'Anne', img: 'anne.jpg', phone: '0101 123456', mobile: '0770 123456', email: 'frank@emailionicsorter.com' }
    ];

    $scope.onReorder = function (fromIndex, toIndex) {
        //console.log(fromIndex, toIndex)
        var moved = $scope.contacts.splice(fromIndex, 1);
        $scope.contacts.splice(toIndex, 0, moved[0]);
        //console.log($scope.contacts)
    };



    $rootScope.$on("AAlert", function(event, text) {
        alert(text);
     });



 


    // $scope.onGesture = function(gesture) {
    //     $rootScope.$emit("LogoutTimer", {});
    // }
    // var element = angular.element(document.querySelector('#content'));
    // $ionicGesture.on('tap', function(e) {
    //     $scope.$apply(function() {
    //         $rootScope.$emit("LogoutTimer", {});
    //     })
    // }, element);

    $rootScope.startUpTimer = null;
    if ($rootScope.logot_timer) {
        clearTimeout($rootScope.startUpTimer);
        $rootScope.startUpTimer = null;
    } 

    // , $rootScope, $ionicUser, $ionicPush
    $scope.$on(AUTH_EVENTS.notAuthorized, function(event) {
        var alertPopup = $ionicPopup.alert({
            title: 'Unauthorized!',
            template: 'You are not allowed to access this resource.'
        });
    });

    $scope.$on(AUTH_EVENTS.notAuthenticated, function(event) {
        AuthService.logout();
        $state.go('login');
        var alertPopup = $ionicPopup.alert({
            title: 'Session Lost!',
            template: 'Sorry, You have to login again.'
        });
    });


                        

    $rootScope.$on("AccountsUpdateSolde", function(event, idto, soldeto) {
        $scope.$apply(function(){
             alert(payload.idto + ' '+ payload.soldeto)

            if (typeof idto !== "undefined" && typeof soldeto !== "undefined") {

                  Accounts.UpdateSolde(idto, soldeto);
             }
        });
    });

    $scope.$on('$ionicView.enter', function(e) {
        $ionicScrollDelegate.scrollTop();
    });

    $scope.identifyUser = function() {
        // //console.log('identifyUser');
        var user = $ionicUser.get();
        // //console.log('user.user_id', user.user_id);
        if (!user.user_id) {
            // Set your user_id here, or generate a random one.
            user.user_id = $ionicUser.generateGUID();

        };
        // //console.log('user.user_id', user.user_id);


        // Metadata
        angular.extend(user, {
            name: 'Simon',
            bio: 'Author of Devdactic'
        });

        // Identify your user with the Ionic User Service
        $ionicUser.identify(user).then(function() {
            $scope.identified = true;
            // //console.log('Identified user ' + user.name + '\n ID ' + user.user_id);
        });
    };
    // Registers a device for push notifications
    $scope.pushRegister = function() {
        // //console.log('Ionic Push: Registering user');

        // Register with the Ionic Push service.  All parameters are optional.
        $ionicPush.register({
            canShowAlert: true, //Can pushes show an alert on your screen?
            canSetBadge: true, //Can pushes update app icon badges?
            canPlaySound: true, //Can notifications play a sound?
            canRunActionsOnWake: true, //Can run actions outside the app,
            onNotification: function(notification) {
                // Handle new push notifications here
                return true;
            }
        });
    };

    $rootScope.$on('$cordovaPush:tokenReceived', function(event, data) {
        alert("Successfully registered token " + data.token);
        // //console.log('Ionic Push: Got token ', data.token, data.platform);
        $scope.token = data.token;
    });
})

.controller('BeforeSignUpCtrl', function($scope,$rootScope,DATA, AuthService, $stateParams, $state, Go, SharedService, $ionicHistory, $filter, $ionicActionSheet ) {
    $scope.data = {}
    $scope.firstVisite = true;
    $scope.$on('$ionicView.beforeEnter', function() { 

        console.log($ionicHistory.viewHistory())
        if( $ionicHistory.viewHistory().forwardView){
            $scope.firstVisite = false;
        }else{
            $scope.firstVisite = true;
        }
        
        $scope.data.mail = $rootScope.mailFirstStepSignup;
    });

    $scope.sendEmail = function () {
        var validationList = [{
            type: 'email',
            value: $scope.data.mail
        }];
        if (SharedService.Validation(validationList)) {
            Go.post({
                task: "InscriptionSendEmail",
                tmpmail: $scope.data.mail,
                isshop: $stateParams.isshop,
                tokendevice: DATA.token
            }).then(function (data) {
                if (data.success == 1) {
                    if( data.reactivation == 1 ){
                        
                        swal({
                            title: $filter('translate')('global_fields.information'), 
                            type: "info",
                            html: data.message,
                            showCancelButton: true,
                            confirmButtonColor: "#254e7b",
                            confirmButtonText: $filter('translate')('global_fields.yes'),
                            cancelButtonText: $filter('translate')('global_fields.no'),
                            customClass: "customSwal",
                            showLoaderOnConfirm: true,
                            preConfirm: function() {
                                Go.post({
                                    task: "ReactiveUser"
                                }).then(function(result) {
                                    if( result.success == 1 ){
                                        swal({
                                            title: $filter('translate')('global_fields.information'), 
                                            type: "info",
                                            html: result.message,
                                            showCancelButton: true,
                                            cancelButtonText: $filter('translate')('global_fields.close'),
                                            showConfirmButton: false,  
                                            showLoaderOnConfirm: true,
                                        })
                                        $state.go('signin');
                                    } 
                                })
                            },
                            preCancel: function() {
                                $state.go('signin');
                            },
                            allowOutsideClick: false
                        })
                    }else{ 
                        $rootScope.mailFirstStepSignup = $scope.data.mail;
                        $state.go('signup-validate-email-sent');

                    }
                        
                }
            })
        }
    }

    $scope.openMailApp = function () {


        if( ionic.Platform.isIOS() ){
            window.open('message://');
        }else{
            
            window.plugins.launcher.canLaunch({packageName:'com.google.android.gm'}, function(data) {
                $scope.chooseMailClient();
            }, function(err) {
                window.plugins.launcher.launch({packageName:'com.samsung.android.email.ui'})
            });
        }
    }

    $scope.chooseMailClient = function () {  
 
        angular.element(document.querySelector('body')).removeClass('platform-android');
        $ionicActionSheet.show({
         buttons: [
           { text: "Email" },
           { text: "Gmail" }
         ], 
         cancelText: $filter('translate')('feedback.cancel'),
         cancel: function() {
              
        },
         buttonClicked: function(index) {
            switch(index) {
                case 0:
                     window.plugins.launcher.launch({packageName:'com.samsung.android.email.ui'})
                    break;
                case 1:
                     window.plugins.launcher.launch({packageName:'com.google.android.gm'})
                    break;  
            } 
            return true;
         }
       })
    }

    $scope.dontReceiveMail = function () {
        $ionicHistory.goBack()
    }
})
.controller('SignInCtrl', function($scope, Alert, $rootScope, $sce, Catgs, $rootScope, User, $state, $location, AuthService, crypt, $ionicLoading, $cordovaTouchID, $ionicModal, Go, $translate, $filter, $ionicHistory) {
    
    $scope.trustAsHtml = function(string) {
        return $sce.trustAsHtml(string);
    };

    $scope.AutentificateUser = function ( login ) {
        Alert.loader(true);
        var tokenTouchId = crypt.sha256( login+window.localStorage.getItem('sessionID_a0f55e81c4455f584a9421') );
        AuthService.login( login, "NoPassword", tokenTouchId).then(function(dataUser) {

            $scope.closeModal(); 
            Alert.loader(false);

            $scope.datalogin.username = login;
            window.localStorage.setItem('username_a0f55e81c44553384a9421', $scope.datalogin.username);
            $scope.datalogin = {
                username: $scope.datalogin.username,
                password: ''
            };
            User.UserEmail = $scope.datalogin.username; 
            $rootScope.FirstTimeInSettings = true;
            Catgs.Sync(true); 

            /////////******************* Accept CGV *****************************
            if( parseInt( dataUser.user.cgvvalid ) == 0 ){
                $scope.cgv = dataUser.cgv;
                $scope.cgvModal.show();
            }
            /////////*********************************************************

        }, function(err) {
            Alert.loader(false); 
        }).finally(function() {
            $scope.closeModal();
            Alert.loader(false);  
        });
    }

    $rootScope.DeleteaccountFromList = function (id) {

        angular.forEach($rootScope.availableAccounts, function (value, index) {
            if( value.id == id ){
                $rootScope.availableAccounts.splice(index, 1)
            }
        })
        setTimeout(function () {
             window.localStorage.setItem('TokenTouchIds', JSON.stringify($rootScope.availableAccounts))  
             if( $rootScope.availableAccounts.length == 0 ){
                $scope.closeModal(); 
                $("#page-login.page-login ion-content").addClass("noTouchId");
             }
        })
    }
     
    $scope.$on('$ionicView.beforeEnter', function(e) {    



        $(".mbsc-fr-btn-c > div").click()
        $("html").removeClass("mbsc-fr-lock");
        ////////////////////////// ** if registred account for touch ID ** //////////////////////////
        if( !window.localStorage.getItem('TokenTouchIds') || window.localStorage.getItem('TokenTouchIds') == '' || window.localStorage.getItem('TokenTouchIds') == '[]'  ){
            $("#page-login.page-login ion-content").addClass("noTouchId");
            window.localStorage.setItem('TokenTouchIds', "");
        }else if( window.localStorage.getItem('TokenTouchIds') != '' && window.localStorage.getItem('TokenTouchIds') != '[]' ){
            $("#page-login.page-login ion-content").removeClass("noTouchId");
        }   
        $rootScope.availableAccounts = (window.localStorage.getItem('TokenTouchIds')!='') ? JSON.parse( window.localStorage.getItem('TokenTouchIds')) : [] ;
        

        ////// get session ID when app is started and app is Loged
        if (!Go.is('addprofile')) { 
            console.log("is page Signin")
            var postData = {
                task: "getSessionID",
                lang: $translate.use()
            }
            Go.post(postData).then(function(data) {
                if (data.success == 1) {
                     window.localStorage.setItem('sessionID_a0f55e81c4455f584a9421', data.id);
                     AuthService.storeUserCredentials( data.id )

                } 
            })
            $rootScope.newSignup = true; 
        }
        /////

        
    })
      
    $scope.touchId = function () { 
        
        if( ionic.Platform.isIOS() ){
           $cordovaTouchID.authenticate( $filter('translate')('touch_id.fingerprint') ).then(function() { 
                if( $rootScope.availableAccounts.length == 1 ){
                    $scope.AutentificateUser( $rootScope.availableAccounts[0].id )
                }else if( $rootScope.availableAccounts.length == 0 ){
                    setTimeout(function () {
                        $scope.touchId();
                    },1000)
                }else{
                    $scope.openModal();
                }
            }, function () {}); 
       }else{
            if( window.SamsungPass ){
                SamsungPass.startIdentifyWithDialog(function() {
                   if( $rootScope.availableAccounts.length == 1 ){
                        $scope.AutentificateUser( $rootScope.availableAccounts[0].id )
                    }else{
                        $scope.openModal();
                    }
                }, function() {});
            }
       }
        
    }
    $ionicModal.fromTemplateUrl('ListTouchId-Modal.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.modal = modal;
    });


    $scope.cgv = "";
    $ionicModal.fromTemplateUrl('templates/Deconnect/cgv.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.cgvModal = modal;
    });

    $scope.AcceptCGV = function () {
        var postData = {
            task: "setcgv"
        }
        Go.post(postData).then(function(data) {
            if (data.success == 1) {
                $scope.cgvModal.hide();
            } 
        })
    }

    $scope.RefuseCGV = function () {
        AuthService.Directlogout();
        $state.go('signin');
        $scope.cgvModal.hide()
    }

    $rootScope.availableAccounts = [];



    $scope.openModal = function() {   
        var arrayTokens = JSON.parse( window.localStorage.getItem('TokenTouchIds') );
        $rootScope.availableAccounts = arrayTokens;
        
        var users = [];
        var shops = [];
        angular.forEach(arrayTokens, function (value, index) {
            if(value.isshop == 0){
                users.push(value.idUser);
            }else{ 
                shops.push(value.idUser);
            }
        })
        setTimeout(function () {
            var postData = {
                'task': "getListNbrNotif",
                'users': users.join(","),
                'shops': shops.join(",")
            }
            console.log(JSON.stringify(arrayTokens))
            console.log(postData)
            Go.post(postData).then(function(data) {
                if (data.success == 1) {
                    angular.forEach(arrayTokens, function (value, index) {

                        angular.forEach(data.ListNbrNotif, function (v, i) {
                            if( parseInt(value.idUser) == parseInt(v.id) && parseInt(value.isshop) == parseInt(v.isshop) ){
                                arrayTokens[index].NbrNotifNonVu = v.NbrNotifNonVu;
                                arrayTokens[index].initiales = v.initiales;
                                arrayTokens[index].name = v.name;
                                arrayTokens[index].picto = v.picto;
                            }
                        })
                    })
                    setTimeout(function () {
                        window.localStorage.setItem('TokenTouchIds', JSON.stringify(arrayTokens));
                        $rootScope.availableAccounts = arrayTokens;
                    })
                } 
            })
        })

        $scope.modal.show();
    };
  

    $scope.closeModal = function() {
        $scope.modal.hide();
    };
 

    $scope.login = function() {
        //console.log('go login ===>>>>')
        $ionicLoading.show({
            content: 'Loading',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
        });
        AuthService.login($scope.datalogin.username, crypt.sha256($scope.datalogin.password), 0).then(function(dataUser) {
            window.localStorage.setItem('username_a0f55e81c44553384a9421', $scope.datalogin.username);
            $scope.datalogin = {
                username: $scope.datalogin.username,
                password: ''
            };
            User.UserEmail = $scope.datalogin.username;
            $ionicLoading.hide();
            $rootScope.FirstTimeInSettings = true;
            Catgs.Sync(true); 


            /////////******************* Accept CGV *****************************
            if( parseInt( dataUser.user.cgvvalid ) == 0 ){
                $scope.cgv = dataUser.cgv;
                $scope.cgvModal.show();
            }
            /////////*********************************************************


        }, function(err) {
            $ionicLoading.hide();
        });
    };
    $scope.$on('$ionicView.enter', function(e) {

        if (!Go.is('addprofile')) { 
            $ionicHistory.clearHistory();
            $ionicHistory.clearCache();

            var LOCAL_TOKEN_KEY = '12fb0UJZ88d9afSDad0sfRF55e8d1c4Zg4ff553SDf384gZ94DdwH92';
            window.localStorage.removeItem(LOCAL_TOKEN_KEY);
            //         var data = window.localStorage.getItem(LOCAL_TOKEN_KEY);
            // data = JSON.parse(data);
            // //console.log("in login remove and get DATA: ", data);
            // var UserDetails = User.GetDetails();
            // //console.log('UserDetails',UserDetails)


            $rootScope.isHerList = [];
            $scope.data = {};
            //console.log('in login email stored')
            var data2 = window.localStorage.getItem('username_a0f55e81c44553384a9421');

            // //console.log("username_a0f55e81c44553384a942 ", data2);
            // data2 = JSON.parse(data2);
            if (data2) {
                // data2 = JSON.parse(data2);
                $scope.datalogin = {
                    username: data2,
                    password: ''
                };
            } else {
                $scope.datalogin = {};
            } 
        }


        if (Go.is('addprofile')) { 
            $scope.datalogin = {}; 
        }
    });
 

    
})

.controller('SignUpCtrl', function($scope, $rootScope, $stateParams, GooglePlaces, $sce, $ionicLoading,$ionicPlatform, $cordovaDatePicker ,$filter, $window ,$timeout, $state, pickerView, Phone, Lists, User, SharedService, crypt, Go, $location, Alert, Geo, AuthService, $ionicModal, $translate, $ionicHistory) {
     

    $scope.trustAsHtml = function(string) {
        return $sce.trustAsHtml(string);
    };

    $scope.arrayRevenumoyen = ["0-18","19-23","24-27","28-35","36-56","57-*"];
    $scope.revenumoyenSettings = {   
        theme: 'ios',
        highlight: false,
        onInit: function (event, inst) { 
            var labels = slider.parentNode.querySelectorAll('.mbsc-progress-step-label');

            for (var i = 0; i < labels.length; ++i) { 
                labels[i].innerHTML = $scope.arrayRevenumoyen[i]; 
            }
        }
    };

    $scope.cgv = ""; 

    $scope.$on('$ionicView.beforeEnter', function(e) { 
         
            if( !$scope.data || $rootScope.newSignup ){
                $scope.data = {}
                $rootScope.newSignup = false;  
            }
 
            $scope.disableddate = true; 

            $scope.data.Indicatif = '+33';
            $scope.data.mobileNumber = '';
            $scope.data.revenumoyen = 0;

            $scope.data.maxDate = new Date() 
  
            Go.post({
                task: "getcgv",
                isshop: 0,
                hideLoader: true
            }).then(function (data) {
                if(data.success == 1){
                     $scope.cgv = data.cgv;
                }   
            })  
    });
    
    var objlist = [{
        values: [Lists.Indicatifs],
        defaultIndex: 7
    }];

    var RegionsList = [{
        values: [Lists.Countries[$translate.use()]]
    }];
     
    $scope.openPickerIndicatif = function () {
        var picker = pickerView.show({
            titleText: '',
            doneButtonText: $filter('translate')('global_fields.ok'),
            cancelButtonText: $filter('translate')('global_fields.close'),
            obj: objlist
        });
        if (picker) {
            picker.then(function (output) {
                if (output) {
                    objlist[0].defaultIndex = output[0].selectedIndex;
                    $scope.data.Indicatif = output[0].id;
                }
            });
        }
    };

    $scope.openPickerNationality = function () {
        var picker = pickerView.show({
            titleText: '',
            doneButtonText: $filter('translate')('global_fields.ok'),
            cancelButtonText: $filter('translate')('global_fields.close'),
            obj: RegionsList
        });
        if (picker) {
            picker.then(function (output) { 
                if( output ){
                    $scope.data.nationality = output[0].value;
                    $scope.data.nationalityalpha2 = output[0].id;
                    RegionsList[0].defaultIndex = output[0].selectedIndex;
                }
            });
        }
    };

    if ($location.path() == '/sign-up-step3') {

        $scope.settings = {
            theme: (ionic.Platform.isIOS()) ? 'ios' : 'pim-theme',
            display: 'bottom',
            lang : $translate.use(),
            multiline: 3,
            height: 50
        };

        var postData = {
            "task": "getQuestions",
            "isshop": 0
        };

        Go.post(postData).then(function(data) {
            if (data.success == 1) { 
                
                $scope.listQuestions1 = data.listQuestions.listQuestions1;
                $scope.listQuestions2 = data.listQuestions.listQuestions2;
                $scope.listQuestions3 = data.listQuestions.listQuestions3;
 
            }

            setTimeout(function () {
                $("#q1 option:first").attr('disabled','disabled');
                $("#q1 option:first").text( $filter('translate')('secret_questions.choose_a_question') );

                $("#q2 option:first").attr('disabled','disabled');
                $("#q2 option:first").text(  $filter('translate')('secret_questions.choose_a_question')  );

                $("#q3 option:first").attr('disabled','disabled');
                $("#q3 option:first").text(   $filter('translate')('secret_questions.choose_a_question')  );

                $scope.loader = Alert.loader(false);
            })
        });
    }

    $scope.signup = function() { 
         
        var validationList = [{
            type: 'sexe',
            value: $scope.data.sexe
        }, {
            type: 'firstname',
            value: $scope.data.fname
        }, {
            type: 'lastname',
            value: $scope.data.lname
        }, {
            type: 'birthdate',
            value: $scope.data.birthdate,
            lang: $translate.use()
        },{
            type: 'placebirth',
            value: $scope.data.placebirth
        },{
            type: 'birthcountry',
            value: $scope.data.birthcountry
        },{
            type: 'nationality',
            value: $scope.data.nationality
        },   {
            type: 'password',
            value: $scope.data.password
        }, {
            type: 'confirmePassword',
            value: $scope.data.confirmpassword
        },{
            type: 'lockCode',
            value: $scope.data.code
        }, {
            type: 'confirmLockCode',
            value: $scope.data.confirmcode
        }];

        if (SharedService.Validation(validationList)) {   
            $scope.openModal();
        }else{
            setTimeout(function () {
               Alert.loader(false);
            },2000)
        }


    };

    $scope.AcceptCGV = function () {
        $scope.closeModal();
        Alert.loader(true);

        $tabDate = $scope.data.birthdate.split('/')
        switch( $translate.use() ){
            case 'fr':
                $scope.data.FormatedBirthdate = new Date( $tabDate[2]+"/"+$tabDate[1]+"/"+$tabDate[0] );
                break;

            case 'en':
                $scope.data.FormatedBirthdate = new Date( $tabDate[2]+"/"+$tabDate[0]+"/"+$tabDate[1] );
                break;
        } 

        var postData = {
            "task": "InscriptionAllPersonalInfos",
            "sexe": $scope.data.sexe,
            "firstname": $scope.data.fname,
            "lastname": $scope.data.lname,
            "birthdate": new Date($scope.data.FormatedBirthdate.setHours(12,0,0,0)),

            "placebirth": $scope.data.placebirth,
            "birthcountry": $scope.data.birthcountry,
            "birthcountryalpha2": $scope.data.birthcountryalpha2,
            "nationality": $scope.data.nationality,
            "nationalityalpha2": $scope.data.nationalityalpha2,
            "revenumoyen": $scope.arrayRevenumoyen[$scope.data.revenumoyen],

            "codemail": $stateParams.code,
            "password": crypt.sha256($scope.data.password),
            "confirmpassword": crypt.sha256($scope.data.confirmpassword),
            "lang": $translate.use(),
            "code" : $scope.data.code,
            "confirmcode" : $scope.data.confirmcode
        };
        Go.post(postData).then(function(data) {
            Alert.loader(false);
            if (data.success == 1) {
                if( data.reactivation == 1 ){
                    swal({
                        title: $filter('translate')('global_fields.information'), 
                        type: "info",
                        html: data.message,
                        showCancelButton: true,
                        confirmButtonColor: "#254e7b",
                        confirmButtonText: $filter('translate')('global_fields.yes'),
                        cancelButtonText: $filter('translate')('global_fields.no'),
                        customClass: "customSwal",
                        showLoaderOnConfirm: true,
                        preConfirm: function() {
                            Go.post({
                                task: "ReactiveUser"
                            }).then(function(result) {
                                if( result.success == 1 ){
                                    swal({
                                        title: $filter('translate')('global_fields.information'), 
                                        type: "info",
                                        html: result.message,
                                        showCancelButton: true,
                                        cancelButtonText: $filter('translate')('global_fields.close'),
                                        showConfirmButton: false,  
                                        showLoaderOnConfirm: true,
                                    })
                                    $state.go('signin');
                                } 
                            })
                        },
                        preCancel: function() {
                            $state.go('signin');
                        },
                        allowOutsideClick: false
                    })
                }else{
                    User.Deconnect.sexe = data.sexe;
                    User.Deconnect.fname = data.fname;
                    User.Deconnect.lname = data.lname;
                    User.Deconnect.email = data.email;
                    User.Deconnect.birthdate = new Date(data.birthdate);

                    $state.go('signup-address');
                }
                    
            }
        });
    }
 
    $scope.InscriptionAddress = function(ValidationGo) {
            Alert.loader(true);
            var validationList = [{
                type: 'fullAddress',
                value: $scope.data.fullAddress
            },{
                type: 'adressLine1',
                value: $scope.data.line1
            }, {
                type: 'city',
                value: $scope.data.city
            }, {
                type: 'country',
                value: $scope.data.country
            }]; 
            if (SharedService.Validation(validationList)) { 
                Alert.loader(true);
                var postData = {
                    "task": "InscriptionAddress",
                    "fullAddress": $scope.data.fullAddress,
                    "address1": $scope.data.line1,
                    "address2": $scope.data.line2,
                    "city": $scope.data.city,
                    "zip": $scope.data.zip,
                    "country": $scope.data.country,
                    "countryalpha2": $scope.data.countryalpha2,
                    "lat": $scope.data.lat,
                    "lng": $scope.data.lng
                };
                Go.post(postData).then(function(data) {
                     
                    Alert.loader(false);
                    if (data.success == 1) {  
                        $state.go('signup-step2');
                    }
                }) 

            }
        };
        $scope.$on('place_changed', function (e, place, model) { 
            var data = GooglePlaces.getInfoAddress(place);
             
            if(data.success){
                if( model == 'data.fullAddress' ){
                    if(data.street_number != ""){ // route
                        $scope.data.line1 = data.street_number+" "+data.route;
                    }else{$scope.data.line1 = data.route}

                    $scope.data.city = data.city;
                    $scope.data.zip = data.zipcode;
                    $scope.data.country = data.country;  
                    $scope.data.countryalpha2 = data.codeCountry;  
                    $scope.data.lat = data.lat;  
                    $scope.data.lng = data.lng;  
                }
                if( model == 'data.placebirth' ){
                    $scope.data.placebirth = data.city;
                    $scope.data.birthcountry = data.country;
                    $scope.data.birthcountryalpha2 = data.codeCountry;
                }
                if( model == 'data.nationality' ){ 
                    $scope.data.nationality = data.country;
                    $scope.data.nationalityalpha2 = data.codeCountry;
                } 
 
            }
        });
        $scope.disableTap = function(){
            container = document.getElementsByClassName('pac-container');
            // disable ionic data tab
            angular.element(container).attr('data-tap-disabled', 'true');
            // leave input field if google-address-entry is selected
            angular.element(container).on("click", function(){
                document.getElementsByName('autocomplete').blur();
            });
        }

    $scope.enterphone = function() {
        // send sms code to phone
        var validationList = [{
            type: 'phone',
            value: $scope.data.mobileNumber
        }];
        if (SharedService.Validation(validationList)) {
            Alert.loader(true);
            // sauvgarder le num tel et envoyer le code            
            var postData = {
                "task": "InscriptionSendSMS",
                "indicatif": $scope.data.Indicatif.replace('+', ''),
                "mobilephone": $scope.data.mobileNumber
            };
            Go.post(postData).then(function(data) {
                Alert.loader(false);
                if (data.success == 1) {
                    User.Deconnect.mobile1 = data.mobileNumber;
                    User.Deconnect.Indicatif = data.Indicatif;
                    $state.go('signup-step3');
                } else {
                    Alert.error(data.message);
                }
            });
        }
    };

    $scope.questions = function() {
        Alert.loader(true);
        var validationList = [{
            type: 'codesms',
            value: $scope.data.codeSMS
        }, {
            type: 'question1',
            value: $scope.data.idquestion1
        }, {
            type: 'answer1',
            value: $scope.data.answer1
        }, {
            type: 'question2',
            value: $scope.data.idquestion2
        }, {
            type: 'answer2',
            value: $scope.data.answer2
        }, {
            type: 'question3',
            value: $scope.data.idquestion3
        }, {
            type: 'answer3',
            value: $scope.data.answer3
        }];
        if (SharedService.Validation(validationList)) {
            Alert.loader(true);
            Geo.getPosition().then(function(pos) {
                Alert.loader(false);
                var postData = {
                    "task": "InscriptionSendAnswers",
                    "codesms": $scope.data.codeSMS,
                    "question1": $scope.data.idquestion1,
                    "question2": $scope.data.idquestion2,
                    "question3": $scope.data.idquestion3,
                    "answer1": $scope.data.answer1,
                    "answer2": $scope.data.answer2,
                    "answer3": $scope.data.answer3,
                    "lat": pos.lat,
                    "long": pos.lng
                };
                Alert.loader(true);
                Go.post(postData).then(function(data) {
                    Alert.loader(false);
                    $ionicLoading.hide();
                    if (data.success == 1) {

                        if( data.reactivation == 1 ){
                            swal({
                                title: $filter('translate')('global_fields.information'), 
                                type: "info",
                                html: data.message,
                                showCancelButton: true,
                                confirmButtonColor: "#254e7b",
                                confirmButtonText: $filter('translate')('global_fields.yes'),
                                cancelButtonText: $filter('translate')('global_fields.no'),
                                customClass: "customSwal",
                                showLoaderOnConfirm: true,
                                preConfirm: function() {
                                    Go.post({
                                        task: "ReactiveUser"
                                    }).then(function(result) {
                                        if( result.success == 1 ){
                                            swal({
                                                title: $filter('translate')('global_fields.information'), 
                                                type: "info",
                                                html: result.message,
                                                showCancelButton: true,
                                                cancelButtonText: $filter('translate')('global_fields.close'),
                                                showConfirmButton: false,  
                                                showLoaderOnConfirm: true,
                                            })
                                            $state.go('signin');
                                        } 
                                    })
                                },
                                preCancel: function() {
                                    $state.go('signin');
                                },
                                allowOutsideClick: false
                            })
                        }else{

                            //AuthService.storeUserCredentials(data.userToken);
                            User.SetDetails(data.UserDetails);
                            User.IsNew = true;
                            // congratulation_msg = "You have subscribed to PIM, the first free banking global network! In order to activate your account and access our network; access your mailbox and <b>click on the link</b>";
                            congratulation_msg = $filter('translate')('success_sign_up.congratulation');
                            Alert.Congratulation('signin', $filter('translate')('success_sign_up.go_to_sign_in'), congratulation_msg);
                        }
                    }
                });
            });
        }
    };

    $scope.$watch('data.mobileNumber', function() {
        $scope.data.mobileNumber = Phone.watch($scope.data.mobileNumber);
    });



    $ionicModal.fromTemplateUrl('personnal-CGV.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.modal = modal;
    });
    $scope.openModal = function() {
        $scope.modal.show();
    };
    $scope.closeModal = function() {
        $scope.modal.hide();
    };

    $scope.RefuseCGV = function () {
        $scope.closeModal(); 
    } 
    

})

.controller('PesonnalInformationCtrl', function($scope,$state, Lists, pickerView,  Alert, User, SharedService, Go, $rootScope, $timeout, crypt, $filter, GooglePlaces, $translate) {
    var UserDetails;
    $scope.$on('$ionicView.beforeEnter', function() {
        UserDetails = User.GetDetails();

        if( parseInt(UserDetails.logsPhoto.userlname.confirmed) == -1 || parseInt(UserDetails.logsPhoto.userlname.confirmed) == 2 ){
            $scope.showBtns = true; 
        }else{
            $scope.showBtns = false; 
        } 
 
    });

    $scope.arrayRevenumoyen = ["0-18","19-23","24-27","28-35","36-56","57-*"]; 
    $scope.arrayRevenumoyenView = ["0-18","19-23","24-27","28-35","36-56","+57"]; 
    $scope.revenumoyenSettings = {   
        theme: 'ios',
        highlight: false,
        onInit: function (event, inst) { 
            setTimeout(function () {
                inst.refresh()
                var labels = slider.parentNode.querySelectorAll('.mbsc-progress-step-label'); 
                for (var i = 0; i < labels.length; ++i) { 
                    labels[i].innerHTML = $scope.arrayRevenumoyenView[i]; 
                }
            })
           
        }
    };

    
 
    
    // http://lorempixel.com/100/100/people/?1
    $scope.ValidateInfo = function() {
        swal({ 
            text: $filter('translate')('validate_document.confirm_text'),
            type: "info",
            showCancelButton: true,
            confirmButtonColor: "#254e7b",
            confirmButtonText: $filter('translate')('log_out.yes'),
            cancelButtonText: $filter('translate')('log_out.no'),
            customClass: "customSwal",
            showLoaderOnConfirm: true,  
            allowOutsideClick: false
        }).then(function (confirm) {
            if(  confirm ){
                $state.go('tab.ValidateDocument');
            }
        }, function () {
            
        })
    };
    console.log(UserDetails);

    $scope.ChangeInfo = function(ValidationGo) {
        var validationList = [{
            type: 'firstname',
            value: $scope.PersonaleData.fname
        }, {
            type: 'lastname',
            value: $scope.PersonaleData.lname
        }, {
            type: 'birthdate',
            value: $scope.PersonaleData.birthdate,
            lang : $translate.use()
        }];
        if (SharedService.Validation(validationList)) {




            $tabDate = $scope.PersonaleData.birthdate.split('/')
            switch( $translate.use() ){
                case 'fr':
                    $scope.PersonaleData.FormatedBirthdate = new Date( $tabDate[2]+"/"+$tabDate[1]+"/"+$tabDate[0] );
                    break;

                case 'en':
                    $scope.PersonaleData.FormatedBirthdate = new Date( $tabDate[2]+"/"+$tabDate[0]+"/"+$tabDate[1] );
                    break;
            } 
            
            var postData = {
                "task": "SettingsChangePersonalInfos",
                "firstname": $scope.PersonaleData.fname,
                "lastname": $scope.PersonaleData.lname,
                "birthdate": new Date($scope.PersonaleData.FormatedBirthdate.setHours(12,0,0,0)),
                "placebirth": $scope.PersonaleData.placebirth,
                "birthcountry": $scope.PersonaleData.birthcountry,
                "birthcountryalpha2": $scope.PersonaleData.birthcountryalpha2,
                "nationality": $scope.PersonaleData.nationality,
                "nationalityalpha2": $scope.PersonaleData.nationalityalpha2,
                "revenumoyen": $scope.arrayRevenumoyen[$scope.PersonaleData.revenumoyen],
                "sexe": $scope.PersonaleData.sexe,
                "log": UserDetails.user.logid_name
            };

            console.log(postData);
            // return false;

            

            Alert.loader(true);
            Go.post(postData).then(function(data) {

                if(data.success == 1){ 


                    if( parseInt( data.log ) > 0  ){ 
                        $rootScope.validateData.logsPhoto ={
                            comment: "",
                            confirmed: -1,
                            doc: "",
                            photolibelle:""
                        }
                        $rootScope.validateData.userlog = data.log;

                        $rootScope.updateTouchIDList(); 
                        $rootScope.updateConnectedUser();

                        Alert.Congratulation('tab.ValidateDocument', $filter('translate')('global_fields.close'), $filter('translate')('personal_informations.success_update'));
                    }else{
                        swal({ 
                            type: 'success',
                            showCancelButton: false,
                            showConfirmButton: false,
                            timer: 2000
                        })
                    }
                    $scope.validation = false;  
 
                    
                } 

 
            });


        }
    };
    $scope.isEnter = false; 
    $scope.validation = false; 
    $scope.$on('$ionicView.beforeEnter', function(e) {
        UserDetails = User.GetDetails(); 

        console.log(UserDetails)
        if (UserDetails != false) {
            $scope.listSettings = UserDetails.listSettings;
            $scope.data = UserDetails.user;
            $scope.PersonaleData = {
                picto: UserDetails.user.picto_medium,
                fname: UserDetails.user.fname,
                lname: UserDetails.user.lname,
                sexe: (UserDetails.user.sexe == 'Mrs') ? true : false,
                birthdate: UserDetails.user.birth,
                placebirth: UserDetails.user.placebirth,
                birthcountry: UserDetails.user.birthcountry,
                birthcountryalpha2: UserDetails.user.birthcountryalpha2,
                nationality: UserDetails.user.nationality,
                nationalityalpha2: UserDetails.user.nationalityalpha2,    
                revenumoyen: $scope.arrayRevenumoyen.indexOf(UserDetails.user.revenumoyen),    
            }; 
 

            if (UserDetails.user.logconfirmed_name == 1) {
                $scope.readonlyDB = true;
            } else {
                $scope.readonlyDB = false;
            }

            $rootScope.validateData.Message = $filter('translate')('personal_informations.validate_your_name_by_take_a_real_picture_of_your_document');
            $rootScope.validateData.userlog = UserDetails.user.logid_name;
            $rootScope.validateData.id = 0;
            $rootScope.validateData.logsPhoto = UserDetails.logsPhoto.userlname;
            $rootScope.validateData.N1 = 'logsPhoto';
            $rootScope.validateData.N2 = 'userlname';
            $scope.validate = false; 

            $scope.commentAdmin = UserDetails.logsPhoto.userlname.comment;
            switch (parseInt(UserDetails.logsPhoto.userlname.confirmed)) {
                case 0:  
                    $scope.ValidateMSG = "<span class='DocumentInValid'><i class='icon ion-alert-circled'></i> "+ $filter('translate')('personal_informations.sorry_your_document_was_not_verified_please_wait_for') +"</span>";
                    $scope.validate = false;
                    $scope.validation = true;
                    break;
                case 1:  
                    $scope.ValidateMSG = "<span class='DocumentValid' ><i class='icon ion-android-checkmark-circle'></i> "+ $filter('translate')('personal_informations.all_your_informations_are_valid_you_can_use_pim_professionnal_account') +"</span>";
                    $scope.validate = true;
                    $scope.validation = true; 
                    break;
                case 2:  
                    $scope.ValidateMSG = "<span class='DocumentInValid'><i class='icon ion-alert-circled'></i> "+ $filter('translate')('personal_informations.your_document_was_refused_please_can_you_upload') +"<em ng-if='commentAdmin'><br><hr>"+$scope.commentAdmin+"<em></span>";
                    $scope.validate = false;
                    $scope.validation = false;
                    break;
                // case 3:  
                //     $scope.ValidateMSG = "<span class='DocumentInValid'><i style='font-size:35px;' class='icon ion-alert-circled'></i> <br>In compliance with the regulatory requirements in your country, we need to confirm your ID Card. Please, confirm your identity to avoid services interruptions.</span>";
                //     $scope.validate = false;
                //     $scope.validation = false;
                //     break;
                case -1:    
                    $scope.ValidateMSG = "<span class='DocumentInValid'><i style='font-size:35px;' class='icon ion-alert-circled'></i> <br>"+ $filter('translate')('personal_informations.in_compliance_with_the_regulatory_requirements_in_your_country__') +"</span>";
                    $scope.validate = true;
                    $scope.validation = false;
                    break;
            }
            // $timeout(function() {
                $scope.isEnter = false; 
                $scope.$watch('PersonaleData', function() {
                    //console.log('isEnter',$scope.isEnter)
                    if ($scope.isEnter) {
                    // // //console.log('$scope.PersonaleData', $scope.PersonaleData)
                        $scope.validation = false;
                        var UserDetails2 = User.GetDetails();
                        //console.log("UserDetails2",UserDetails2)
                        var NameInfo = UserDetails2.listSettings.PersonalInfos[0];
                        if (NameInfo.valid == false && NameInfo.log != 0 && UserDetails2.user.logconfirmed_name != 0) {
                            $scope.validation = false;
                            //console.log(0)
                        }else if($scope.PersonaleData.lname == '' && $scope.PersonaleData.lname != UserDetails2.user.lname == ''){
                            $scope.validation = false;
                        }
                        var sexe = true ;
                        if(UserDetails2.user.sexe == 'Mr')sexe = false;

                         if ($scope.PersonaleData.sexe != sexe) {
                            $scope.validation = true;
                            //console.log(1)
                        }
                        if ($scope.PersonaleData.fname != UserDetails2.user.fname) {
                            $scope.validation = true;
                            //console.log(2)
                        }
                        if ($scope.PersonaleData.lname != UserDetails2.user.lname) {
                            $scope.validation = true;
                            //console.log(3)
                        }
                        if ($filter('date')($scope.PersonaleData.birthdate,"MM/dd/y") != $filter('date')(UserDetails2.user.birth,"MM/dd/y")  ) {
                            $scope.validation = true;
                            //console.log(4,$filter('date')($scope.PersonaleData.birthdate,"MM/dd/y") ,$filter('date')(UserDetails2.user.birth,"MM/dd/y") , $scope.PersonaleData.birthdate )
                        }
                        if ($scope.PersonaleData.placebirth != UserDetails2.user.placebirth) {
                            $scope.validation = true; 
                        }
                        if ($scope.PersonaleData.birthcountry != UserDetails2.user.birthcountry) {
                            $scope.validation = true; 
                        }
                        if ($scope.PersonaleData.nationality != UserDetails2.user.nationality) {
                            $scope.validation = true; 
                        }  
                    }else{
                        $scope.isEnter = true;
                    }
                }, true);

            // }, 1000);

        }
    });

    $scope.disableTap = function(){
        container = document.getElementsByClassName('pac-container');
        // disable ionic data tab
        angular.element(container).attr('data-tap-disabled', 'true');
        // leave input field if google-address-entry is selected
        angular.element(container).on("click", function(){
            document.getElementsByName('autocomplete').blur();
        });
    }
    $scope.$on('place_changed', function (e, place, model) { 
        var data = GooglePlaces.getInfoAddress(place);

        if( model == 'PersonaleData.placebirth' ){
            $scope.PersonaleData.placebirth = data.city;
            $scope.PersonaleData.birthcountry = data.country;
            $scope.PersonaleData.birthcountryalpha2 = data.codeCountry;
        } 
    });


    var RegionsList = [{
        values: [Lists.Countries[$translate.use()]]
    }];
    $scope.openPickerNationality = function (isvalid) {
        if( isvalid ){
            var picker = pickerView.show({
                titleText: '',
                doneButtonText: $filter('translate')('global_fields.ok'),
                cancelButtonText: $filter('translate')('global_fields.close'),
                obj: RegionsList
            });
            if (picker) {
                picker.then(function (output) {
                    if( output ) {
                        $scope.PersonaleData.nationality = output[0].value;
                        $scope.PersonaleData.nationalityalpha2 = output[0].id;
                        RegionsList[0].defaultIndex = output[0].selectedIndex;
                    }
                    
                });
            }
        } 
    };
     
})

.controller('AddressCtrl', function($scope, GooglePlaces, Alert, $rootScope, Geo, User, SharedService, Go, crypt, $state, $timeout, $filter) {

    var UserDetails;
    var validationTreezor;
    $scope.$on('$ionicView.beforeEnter', function() {

        $scope.data = {};
        $scope.showMap = false;
        $scope.validation = true; 
        $scope.title = $filter('translate')('local_address.title_page');
        $scope.TextButtonValidate = $filter('translate')('local_address.upload_your_lease_or_deed');

    
        UserDetails = User.GetDetails();
        validationTreezor = UserDetails.logsPhoto.treezorid.confirmed;
        if( 
            parseInt(UserDetails.logsPhoto.addressid.confirmed) == -1 ||
            (parseInt(UserDetails.logsPhoto.addressid.confirmed) ==  1 && parseInt(validationTreezor) == 1 ) ||
            parseInt(UserDetails.logsPhoto.addressid.confirmed) ==  2
          ){
            $scope.showBtns = true; 
        }else{
            $scope.showBtns = false; 
        }

    });

    $scope.$on('$ionicView.enter', function(e) { 
         
        var UserDetails = User.GetDetails();
        if (UserDetails != false) {
            $scope.data = UserDetails.user; 
            if ($scope.data.line1 == null && $scope.data.line2 == null && $scope.data.city == null && $scope.data.zip == null && $scope.data.country == null){
               //console.log('first is not valide')
                $scope.validation = true;
            }else{
                $scope.validation = false; 
            }


            $rootScope.validateData.Message = $filter('translate')('local_address.validate_your_address_by_taking_a_real_picture_of_your_documents____lease_contract___deed');
            $rootScope.validateData.userlog = UserDetails.user.logid_address;
            $rootScope.validateData.id = 4;
            $rootScope.validateData.logsPhoto = UserDetails.logsPhoto.addressid;
            $rootScope.validateData.N1 = 'logsPhoto';
            $rootScope.validateData.N2 = 'addressid';
            
            $scope.validate = false;

            $scope.commentAdmin = UserDetails.logsPhoto.addressid.comment;

            switch (parseInt(UserDetails.logsPhoto.addressid.confirmed)) {
                case 0:  
                    $scope.ValidateMSG = "<span class='DocumentInValid'><i class='icon ion-alert-circled'></i> "+ $filter('translate')('local_address.sorry_your_document_was_not_verified_please_wait_for') +"</span>";
                    $scope.validate = false;
                    $scope.validation = true;
                    break;
                case 1:   
                    if( parseInt(validationTreezor) == 0 ){
                        $scope.ValidateMSG = "<span class='DocumentValid' ><i class='icon ion-android-checkmark-circle'></i> "+ $filter('translate')('personal_informations.all_your_informations_are_valid_you_can_use_pim_professionnal_account_valid') +"</span>"; 
                    }else{
                       $scope.ValidateMSG = "<span class='DocumentValid' ><i class='icon ion-android-checkmark-circle'></i> "+ $filter('translate')('personal_informations.all_your_informations_are_valid_you_can_use_pim_professionnal_account') +"</span>"; 
                    }
                    $scope.validate = true;
                    $scope.validation = true; 
                    break;
                case 2:  
                    $scope.ValidateMSG = "<span class='DocumentInValid'><i class='icon ion-alert-circled'></i> "+ $filter('translate')('personal_informations.your_document_was_refused_please_can_you_upload')  +"<em ng-if='commentAdmin'><br><hr>"+$scope.commentAdmin+"<em></span>";
                    $scope.validate = false;
                    $scope.validation = false;
                    break;
                // case 3:  
                //     $scope.ValidateMSG = "<span class='DocumentInValid'><i style='font-size:35px;' class='icon ion-alert-circled'></i> <br>In compliance with the regulatory requirements in your country, we need to confirm your ID Card. Please, confirm your identity to avoid services interruptions.</span>";
                //     $scope.validate = false;
                //     $scope.validation = false;
                //     break;
                case -1:    
                    $scope.ValidateMSG = "<span class='DocumentInValid'><i style='font-size:35px;' class='icon ion-alert-circled'></i> <br>"+ $filter('translate')('local_address.in_compliance_with_the_regulatory_requirements_in_your_country__') +"</span>";
                    $scope.validate = true;
                    $scope.validation = false;
                    break;
            }
            // $scope.data.country = UserDetails.user.country;
        } 
        $scope.isEnter = false;
        // $timeout(function() {
        $scope.$watch('data', function() {
 
            var UserDetails2 = User.GetDetails();
            var addressInfo = UserDetails2.listSettings.PersonalInfos[4];
            // if (UserDetails2.user.logconfirmed_address != -1) {
            //     $scope.validation = false;
            //     //console.log(1)
            // }
            //console.log('$scope.data.city',$scope.data.city)
            if ($scope.data.fullAddress != UserDetails2.user.fullAddress) {
                $scope.validation = true;
                //console.log(2)
            }
            if ($scope.data.line1 != UserDetails2.user.line1) {
                $scope.validation = true;
                //console.log(2)
            }
            if ($scope.data.line2 != UserDetails2.user.line2) {
                $scope.validation = true;
                //console.log(3)
            }
            if ($scope.data.city != UserDetails2.user.city) {
                $scope.validation = true;
                //console.log(4)
            }
            if ($scope.data.zip != UserDetails2.user.zip) {
                $scope.validation = true;
                //console.log(5)
            }
            if ($scope.data.country != UserDetails2.user.country) {
                $scope.validation = true;
                //console.log(6)
            }
            if ($scope.data.line1 == null && $scope.data.line2 == null && $scope.data.city == null && $scope.data.zip == null && $scope.data.country == null){
               //console.log('is not valide')
                $scope.validation = true;
            }
        }, true);

    // }, 1000);
    });
    
    // $scope.openMap = function() {
    //     $scope.showMap = true;
    // };
    // $scope.getpos = function(event) {
    //     $scope.latlng = [event.latLng.lat(), event.latLng.lng()];
    // };

    // $scope.center = [User.lat, User.lng];
    // $scope.latlng = [User.lat, User.lng];

    // $scope.setMyPositionToMap = function() {
    //     Geo.getPosition().then(function(data) {
    //         $scope.latlng = [data.lat, data.lng];
    //         $scope.center = [data.lat, data.lng];
    //     });
    // };
    $scope.getAddressFromMap = function() {
        $scope.showMap = false;
        Geo.getAddress($scope.latlng[0], $scope.latlng[1]).then(function(data) {
            (data.route != null) ? $scope.data.line1 = data.route: $scope.data.line1 = '';
            (data.neighborhood != null) ? $scope.data.line2 = data.neighborhood: $scope.data.line2 = '';
            (data.locality != null) ? $scope.data.city = data.locality: $scope.data.city = '';
            (data.postal_code != null) ? $scope.data.zip = data.postal_code: $scope.data.zip = '';
            (data.country != null) ? $scope.data.country = data.country: $scope.data.country = '';
        });
    };
    $scope.ValidateAddress = function() {
        swal({ 
            text: $filter('translate')('validate_document.confirm_text'),
            type: "info",
            showCancelButton: true,
            confirmButtonColor: "#254e7b",
            confirmButtonText: $filter('translate')('log_out.yes'),
            cancelButtonText: $filter('translate')('log_out.no'),
            customClass: "customSwal",
            showLoaderOnConfirm: true,  
            allowOutsideClick: false
        }).then(function (confirm) {
            if(  confirm ){
                $state.go('tab.ValidateDocument');
            }
        }, function () {
            
        })
    };
    $scope.ChangeAddress = function(ValidationGo) {
        Alert.loader(true);
        var validationList = [{
            type: 'fullAddress',
            value: $scope.data.fullAddress
        },{
            type: 'adressLine1',
            value: $scope.data.line1
        }, {
            type: 'city',
            value: $scope.data.city
        }, {
            type: 'country',
            value: $scope.data.country
        }]; 
        if (SharedService.Validation(validationList)) { 
            Alert.loader(true);
            var postData = {
                "task": "SettingsChangeaddress",
                "fullAddress": $scope.data.fullAddress,
                "address1": $scope.data.line1,
                "address2": $scope.data.line2,
                "city": $scope.data.city,
                "zip": $scope.data.zip,
                "country": $scope.data.country,
                "countryalpha2" : $scope.data.countryalpha2,
                "lat" : $scope.data.lat,
                "lng" : $scope.data.lng
            };
            Go.post(postData).then(function(data) {
                if(data.success == 1){
                      
                    
                    if( data.logid ){
                        Alert.success($filter('translate')('local_address.success_send'));
                        $scope.validation = false;  
                        $rootScope.validateData.logsPhoto ={
                            comment: "",
                            confirmed: -1,
                            imgs: [],
                            photolibelle:""
                        }   
                        $rootScope.validateData.userlog = data.logid; 
                    }else{
                        swal({ 
                            type: 'success',
                            showCancelButton: false,
                            showConfirmButton: false,
                            timer: 2000
                        })
                    }
                } 

                
            }) 

        }
    };
    $scope.$on('place_changed', function (e, place) { 
        var data = GooglePlaces.getInfoAddress(place);
        if(data.success){
            if(data.street_number != ""){ /// route
                $scope.data.line1 = data.street_number+" "+data.route;
            }else{$scope.data.line1 = data.route}

            $scope.data.city = data.city;
            $scope.data.zip = data.zipcode;
            $scope.data.country = data.country;  
            $scope.data.countryalpha2 = data.codeCountry;  
            $scope.data.lat = data.lat;  
            $scope.data.lng = data.lng;  
            
        }
    });
    $scope.disableTap = function(){
        container = document.getElementsByClassName('pac-container');
        // disable ionic data tab
        angular.element(container).attr('data-tap-disabled', 'true');
        // leave input field if google-address-entry is selected
        angular.element(container).on("click", function(){
            document.getElementsByName('autocomplete').blur();
        });
    } 
})

.controller('PhotoProfileCtrl', function($scope, API,$ionicActionSheet, $cordovaInAppBrowser, $cordovaFileTransfer, $jrCrop, $rootScope, crypt, SharedService, $location, Camera, Go, Alert, User, $ionicLoading, $ionicScrollDelegate, $filter, $translate ) {

    $scope.$on('$ionicView.beforeEnter', function(e) { 
        angular.element(document.querySelector('body')).removeClass('platform-android');
        var UserMail = window.localStorage.getItem('username_a0f55e81c44553384a9421');
        var imageData = window.localStorage.getItem('userphoto_a0f54hdu74j553384a9421' + UserMail);
        console.log(imageData)
        if (imageData) { 
            $scope.imgURI = imageData;
            $scope.showtake = false; 
        } else {
            UserDetails = User.GetDetails();
            if (UserDetails != false) {
                var image_string = UserDetails.user.picto_large;
                 if(image_string.indexOf('male') == -1){
                    $scope.showtake = false;
                }else{
                    $scope.showtake = true;
                }
                //console.log('use server')
                 $scope.imgURI = image_string;
            }else{
                //console.log('no image')
                 $scope.imgURI = '';
                 $scope.showtake = true;
            }
        }
        $scope.showtake = true;
        $scope.isOldImage = true;
        $scope.pagePhotoProfile = true;
    });

 

    $scope.okCorp = true;
    $scope.Title = $filter('translate')('upload_profile_photo.title_page');
    $scope.picture = '';
    $scope.Message = $filter('translate')('upload_profile_photo.text');
    $scope.showtake = true;

    $scope.choseAction = function () { 
        $ionicActionSheet.show({
         buttons: [
           { text: $filter('translate')('upload_profile_photo.take_picture') },
           { text: $filter('translate')('upload_profile_photo.open_gallery') },
           { text: $filter('translate')('upload_profile_photo.other') }
         ], 
         cancelText: $filter('translate')('upload_profile_photo.cancel'),
         cancel: function() {
              
        },
         buttonClicked: function(index) {
            switch(index) {
                case 0:
                    $scope.takePhoto();
                    break;
                case 1:
                    $scope.choosePhoto();
                    break;
                case 2:
                    $scope.CloudFIles();
                    break;
                default:
                     $scope.takePhoto();
                    break; 
            } 
            return true;
         }
       })
    }

    $scope.takePhoto = function() {
        Alert.loader(true);
        var options = {
            quality: 100,
            sourceType: navigator.camera.PictureSourceType.CAMERA,
            destinationType: navigator.camera.DestinationType.DATA_URL,
            targetWidth: 500,
            targetHeight: 500,
            // allowEdit: true,
            correctOrientation: true,
            // encodingType: 1,
            saveToPhotoAlbum: false
        };
        Camera.getPicture(options).then(function(imageData) {
            
            Alert.loader(false);
            // $scope.okCorp = false;
            var newimage = "data:image/jpeg;base64," + imageData;
            $jrCrop.crop({
                url: newimage,
                circle: true,
                width: 300,
                height: 300
            }).then(function(canvas) {
                // success!
                var image = canvas.toDataURL();
                $scope.imgURI = image;
                $scope.showtake = false;
                $scope.isOldImage = false; 
                
                $scope.postData = { 
                    "img": image,
                    "client" : "camera"
                }

            }, function() {
                $ionicLoading.hide();
                // User canceled or couldn't load image.
            });
            
        }, function(err) {
            Alert.loader(false);
            // //console.log(err);
        }).finally(function(){
            Alert.loader(false);
        });

        setTimeout(function () {
            window.localStorage.setItem('locked', 0)
        },3000)
    };

    $scope.choosePhoto = function() {
        if(ionic.Platform.isIOS()){
            var options = {
                maximumImagesCount: 1, // Max number of selected images, I'm using only one for this example
                width: 600,
                height: 600,
                quality: 80            // Higher is better
            };

            Camera.getGallery(options).then(function(imageData) { 
                Alert.loader(false);
                $jrCrop.crop({
                    url: imageData,
                    circle: true,
                    width: 300,
                    height: 300
                }).then(function(canvas) {
                    // success!
                    var image = canvas.toDataURL();
                    $scope.imgURI = image;
                    $scope.showtake = false;
                    $scope.isOldImage = false;

                    $scope.postData = { 
                        "img": image,
                        "client" : "gallery"
                    }

                }, function() {
                    $ionicLoading.hide();
                    // User canceled or couldn't load image.
                });
            }, function(err) {
                Alert.loader(false);
                // //console.log(err);
            }).finally(function(){
                Alert.loader(false);
            }); 

        }else{
            Alert.loader(true);
            var options = {
                quality: 100,
                sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY,
                destinationType: navigator.camera.DestinationType.DATA_URL,
                targetWidth: 500,
                targetHeight: 500,
                // allowEdit: true,
                correctOrientation: true,
                // encodingType: 1,
                saveToPhotoAlbum: false
            };
            Camera.getPicture(options).then(function(imageData) { 
                Alert.loader(false);
                // $scope.okCorp = false;
                var newimage = "data:image/jpeg;base64," + imageData;
                $jrCrop.crop({
                    url: newimage,
                    circle: true,
                    width: 300,
                    height: 300
                }).then(function(canvas) {
                    // success!
                    var image = canvas.toDataURL();
                    $scope.imgURI = image;
                    $scope.showtake = false;
                    $scope.isOldImage = false;

                    $scope.postData = { 
                        "img": image,
                        "client" : "gallery"
                    }
                }, function() {
                    $ionicLoading.hide();
                    // User canceled or couldn't load image.
                });
            }, function(err) {
                Alert.loader(false);
                // //console.log(err);
            }).finally(function(){
                Alert.loader(false);
            });
        }

        setTimeout(function () {
            window.localStorage.setItem('locked', 0)
        },3000)
    };

    $scope.CloudFIles = function () { 
        filepicker.pick({ 
            cropDim: [400, 400], 
            mimetype: 'image/*',
            container: 'window',
            cropForce: false,
            maxFiles: 1,
            conversions: ['crop', 'rotate'],  
            customCss:'https://dev.pim.life/filestrack/style.css', 
            openTo: 'GOOGLE_DRIVE',
            language: $translate.use(),
            services: [
                'CONVERT', 
                'BOX',
                'DROPBOX',
                'EVERNOTE',
                'FACEBOOK',
                'GMAIL',
                'IMAGE_SEARCH',
                'FLICKR',
                'GOOGLE_DRIVE',
                'SKYDRIVE',
                'PICASA',
                'CLOUDDRIVE'
            ], 

        },function(data){    
            $scope.$apply(function () { 
                $scope.imgURI = data.url;  
                $scope.isOldImage = false;
                $scope.showtake = false;
                $scope.postData = data; 
                setTimeout(function () {
                    winInappBrowser.close();
                },500)
            })  
        },function(FPError){
            console.log(FPError);
        }); 
    } 

    $scope.other = function() { 
        $scope.choseAction();
    };



    $scope.send = function() {
        Alert.loader(true);  

        $scope.postData.task = "SettingsChangePhoto";

        Go.post( $scope.postData ).then(function(data) {
            if(data.success == 1){
                // User.UpdatePhotoMulti(data);
                $scope.imgURI = data.picto;
                $scope.uploaded = true;
                User.UpdatePhoto(data);
                var UserMail = window.localStorage.getItem('username_a0f55e81c44553384a9421');
                window.localStorage.setItem('userphoto_a0f54hdu74j553384a9421' + UserMail, $scope.imgURI); 
                congratulation_msg = $filter('translate')('upload_profile_photo.success_update');
                Alert.success( congratulation_msg) ;

                $rootScope.updateTouchIDList(); 
                $rootScope.updateConnectedUser();

           }
        });
    };

    $scope.removePhoto = function() {
        Alert.loader(true);  

        var postData = {
            task:"SettingsDeletePhoto"
        };

        Go.post( postData ).then(function(data) { 
            if(data.success == 1){
                $scope.imgURI = "";
                $scope.showtake = true;
                var UserMail = window.localStorage.getItem('username_a0f55e81c44553384a9421');
                window.localStorage.setItem('userphoto_a0f54hdu74j553384a9421' + UserMail, ""); 
                User.RemovePhoto();
                $rootScope.updateTouchIDList();
            }  
        });
    };
})

.controller('SettingsCtrl', function($scope,$sce, $ionicModal, Geo, $cordovaBadge, AuthService, DATA, $storage, $translate, $cordovaTouchID, ResetePage, $interval, $rootScope, $window, $state, Phone, pickerView, Chats, User, $location, Lists, SharedService, Go, crypt, Alert, AuthService, $timeout, $ionicHistory, $filter, $translate) {
     

    $scope.data = {};
    var UserDetails = User.GetDetails(); 
    $scope.$on('$ionicView.enter', function() { 
        $scope.Appinfo = DATA; 

        $scope.loader = Alert.loader(false); 
        $rootScope.langs = JSON.parse( window.localStorage.getItem('langs') )
    });

    $scope.$on('$ionicView.afterEnter', function() {
         $scope.loader = Alert.loader(false);
    });

    $scope.$on('$ionicView.beforeEnter', function() {  
        $scope.RefreshSettings() 
    });

    $scope.$on('$ionicView.afterEnter', function() { 
        if( $rootScope.GetlistSettings ) {
            $rootScope.GetlistSettings();
        }  
    });

    $scope.RefreshSettings = function () {

        $scope.UserDetails = User.GetDetails();  
        $scope.userInfos = $scope.UserDetails.userInfos;

        if (ResetePage.go != 'settings') {
            $state.go('tab.settings');
            ResetePage.go = 'settings';
        }

        $scope.selectedLang = $translate.use();
     
        $scope.data.answer1 = '';
        $scope.data.answer2 = '';
        $scope.data.answer3 = '';
        
        $scope.connectedUsers = $storage.getArrayOfObjects("connectedUsers");   

        $scope.treezorid = parseInt(UserDetails.logsPhoto.treezorid.confirmed); 

        ///// email Waiting validation
        $scope.isWaitingValidationEmail = ($scope.UserDetails.user.newmail != $scope.UserDetails.user.mail) ? true : false;

        UserDetails = User.GetDetails(); 
        if (UserDetails != false) {
            $scope.listSettings = UserDetails.listSettings;
            $scope.data = UserDetails.user;
            if (UserDetails.user.logconfirmed_birth == 1) {
                $scope.readonlyDB = true;
            } else {
                $scope.readonlyDB = false;
            }
 
        }
    }

    $scope.unlink = function (id, isshop) {
        var postData = {
            "task": "UnlinkProfil",
            "isshop": id,
            "id": isshop
        };
        Go.post(postData).then(function(data) {
            if (data.success == 1) {
                var array = [];
                angular.forEach( $scope.connectedUsers, function (object, index) {
                    if( object.id != id || object.isshop != isshop ){
                        array.push(object);
                    }
                })
                setTimeout(function () {
                    $scope.$apply(function () {
                        $scope.connectedUsers = array;
                    })
                    $storage.setArrayOfObjects("connectedUsers", array);
                })
            }
        });
    }
    $scope.connexionDATA = {}
    $scope.switch = function (id, isshop) {
        Alert.loader(true)
        Geo.getPosition().then(function(position) {
            console.log(position)
            var postData = {
                "task": "ChangeCurrentUser",
                "timeecart": new Date().getTimezoneOffset() / 60,
                "id": id, 
                "isshop": isshop,
                "lat": position.lat,
                "long": position.lng
            } 
            if (DATA.token != '') {
                postData.tokendevice = DATA.token;
            }

            Go.post(postData).then(function(data) {
                Alert.loader(false) 
                if(data.success == 1){

                    $scope.connexionDATA = data;
                    $scope.connexionDATA.position = {
                            lat: position.lat,
                            lng: position.lng
                    }

                    if( parseInt( data.UserDetails.user.cgvvalid ) == 0 ){ 
                        $scope.cgv = data.UserDetails.cgv;
                        $scope.cgvModal.show();
                        
                    }else{
                        $scope.acceptedCGV( $scope.connexionDATA )
                    }

                    // ******************************************************************************************************************************
                }else{
                    var array = [];
                    angular.forEach( $scope.connectedUsers, function (object, index) {
                        if( object.id != id || object.isshop != isshop ){
                            array.push(object);
                        }
                    })
                    setTimeout(function () {
                        $scope.$apply(function () {
                            $scope.connectedUsers = array;
                        })
                        $storage.setArrayOfObjects("connectedUsers", array);
                    })
                }
            })
        }) 
    }

    $scope.trustAsHtml = function(string) {
        return $sce.trustAsHtml(string);
    };

    $scope.cgv = "";
    $ionicModal.fromTemplateUrl('templates/Deconnect/cgv.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.cgvModal = modal;
    });

    $scope.acceptedCGV = function (data) { 
        // ******************************************************************************************************************************
        //AuthService.storeUserCredentials(data.userToken);
        

        User.lat = data.position.lat;
        User.lng = data.position.lng;


        ////////////////////////////////////////////////// add User connected ///////////////////////////////////////////////
        
        userInfos = data.userInfos;

        var connectedUsers = $storage.getArrayOfObjects("connectedUsers");
        var finded = false; 

        
        angular.forEach(connectedUsers, function (object, index) {
            if( parseInt(userInfos.id) == parseInt(object.id) && parseInt(userInfos.isshop) == parseInt(object.isshop) ){ 
                connectedUsers[index] = userInfos;
                $storage.setArrayOfObjects("connectedUsers", connectedUsers);
            }
        })  
        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


        $rootScope.isLogin = true;
         
        
        isLogin = true;
        
        DATA.badgeCount = data.NbrNotifNonVu;
        DATA.Nbr_notif = data.NbrAllNotif;

        if(window.cordova){
            $cordovaBadge.clear();
            $cordovaBadge.set(data.NbrNotifNonVu)
        } 

        data.UserDetails.isPro = data.isshop ;
        $rootScope.isPro = data.isshop ;
        data.UserDetails.userInfos = data.userInfos;
        User.SetDetails(data.UserDetails); 

        $translate.use( data.UserDetails.user.lang );
        window.localStorage.setItem('langCode', data.UserDetails.user.lang)
        window.localStorage.setItem('lockCode', data.UserDetails.user.code)

        $location.path("/tab/home")

        $ionicHistory.clearHistory();
        $ionicHistory.clearCache();
    }

    $scope.AcceptCGV = function () {
        var postData = {
            task: "setcgv"
        }
        Go.post(postData).then(function(data) {
            if (data.success == 1) {

                $scope.acceptedCGV( $scope.connexionDATA )
                $scope.cgvModal.hide(); 
                
            } 
        })
    }

    $scope.RefuseCGV = function () { 
        $scope.cgvModal.hide()
    }
 
    if (UserDetails == false) {
        //// //console.log("UserDetails=false");
        Alert.error($filter('translate')("api.1001")); // Session expired
        $location.path('/sign-in');
    }


    vm = this;
    $scope.AccountEtat = function() {
        if (vm.Accountetat) {
            vm.Account_etat_View = 'Profile activated';
            $('#settings-toggle-account').css({
                'color': '#254E7B'
            });
        } else {
            vm.Account_etat_View = 'Profile Desactivated';
            $('#settings-toggle-account').css({
                'color': '#444'
            });
        }
    };
    // vm.Accountetat = UserDetails.listSettings.Account.activated;
    $scope.AccountEtat();
 
     
    $scope.progressval = 0;
    $scope.stopinterval = null; 
    function startprogress() { 
        
        $scope.progressval = 0;
        if ($scope.stopinterval) {
            $interval.cancel($scope.stopinterval)
        } 

        $scope.UserDetails = User.GetDetails(); 
        // $scope.userInfos = UserDetails.userInfos; 

        console.log( "After startprogress", User.GetDetails() )

        if($scope.UserDetails.user.percentage){ 

            $scope.stopinterval = $interval(function() { 
                    $scope.progressval = $scope.progressval + 1;
                    if ($scope.progressval == UserDetails.user.percentage) { 
                        $interval.cancel($scope.stopinterval);
                        return;
                    }
            }, 20);
        } 
    }
     
    $rootScope.$on("settingStartprogress", function() {
        console.log( "Before startprogress", User.GetDetails() )
        startprogress();
        $scope.RefreshSettings() 
    });
     

    var objlist = [{
        values: [Lists.Indicatifs],
        defaultIndex: 7
    }];
    $scope.openPickerIndicatif = function openPickerIndicatif() {
        var picker = pickerView.show({
            titleText: '',
            doneButtonText: $filter('translate')('global_fields.ok'),
            cancelButtonText: $filter('translate')('global_fields.close'),
            obj: objlist
        });
        if (picker) {
            picker.then(function pickerViewFinish(output) {
                if (output) {
                    objlist[0].defaultIndex = output[0].selectedIndex;
                    $scope.data.Indicatif = output[0].id;
                }
            });
        }
    };

    $scope.$on('$ionicView.beforeEnter', function() {  
        $scope.dataCP = {};
    });
    
    $scope.ChangePassword = function() {
        console.log($scope.dataCP)
        var validationList = [{
            type: 'actualpassword',
            value: $scope.dataCP.current
        }, {
            type: 'password',
            value: $scope.dataCP.newpassword
        }, {
            type: 'confirmePassword',
            value: $scope.dataCP.confirmpassword
        }];
        if (SharedService.Validation(validationList)) {
            var postData = {
                "task": "SettingsChangepassword",
                "actualpassword": crypt.sha256($scope.dataCP.current),
                "password": crypt.sha256($scope.dataCP.newpassword),
                "confirmepassword": crypt.sha256($scope.dataCP.confirmpassword)
            };
            Go.post(postData).then(function(data) {
                if (data.success == 1) {
                    $state.go('tab.SmsCodePwd');
                }
            });
        }
    };
    $scope.ValidateSMSpwd = function() {
        var validationList = [{
            type: 'codesms',
            value: $scope.dataCP.smscode
        }];
        if (SharedService.Validation(validationList)) {
            var postData = {
                "task": "ValidatSms",
                "action": 'Changepassword', // Changepassword, UserSuspended, ChangePhone
                "codesms": $scope.dataCP.smscode
            };
            Alert.loader(true)
            Go.post(postData).then(function(req) {
                if (req.success == 1) {  
                    Alert.success( $filter('translate')('sms_code_pwd.success_send') )

                    setTimeout(function () {
                        $rootScope.GotoSettings();
                    },1500) 
                }
            });
        }
    };

    $scope.dataCE = {}; 
    $scope.ChangeEmail = function() {
        var validationList = [{
            type: 'email',
            value: $scope.dataCE.Email
        }, {
            type: 'confirmemail',
            value: $scope.dataCE.ConfirmEmail
        }];
        if (SharedService.Validation(validationList)) {
            var postData = {
                "task": "SettingsChangemail",
                "email": $scope.dataCE.Email,
                "confirmemail": $scope.dataCE.ConfirmEmail
            };
            Go.post(postData).then(function(data) { 
                
                if(data.success == 1){
                    Alert.success( $filter('translate')('change_email.success_send') )

                    $scope.data.mail = $scope.dataCE.Email;   

                    $scope.UserDetails = User.GetDetails();  
                    $scope.UserDetails.user.newmail = $scope.data.mail; 
                    User.SetDetails( $scope.UserDetails );
                    $scope.UserDetails = User.GetDetails();   

                    $scope.isWaitingValidationEmail = true; 
                } 
 
            });

        }
    };

    $scope.ResendEmailValidation = function() { 
        var postData = {
            "task": "resendvalidationmail"
        };
        Go.post(postData).then(function(data) { 
            
            if(data.success == 1){
                Alert.success( $filter('translate')('change_email.resend_success') )
            }  
        });
    };

    $scope.CancelChangeEmail = function() { 
        var postData = {
            "task": "annulupdatemail"
        };
        Go.post(postData).then(function(data) { 
            
            if(data.success == 1){ 
                $scope.UserDetails = User.GetDetails();  
                $scope.UserDetails.user.newmail = $scope.UserDetails.user.mail; 
                User.SetDetails( $scope.UserDetails ); 
                $scope.isWaitingValidationEmail = false;
            }  
        });
    };



    $scope.ChangePhone = function() { 
        var validationList = [{
            type: 'phone',
            value: $scope.data.phone
        }];
        if (SharedService.Validation(validationList, false)) {
            Alert.loader(true);
            var postData = {
                "task": "SettingsChangephone",
                "phone": $scope.data.phone, 
                "indicatif": $scope.data.Indicatif.replace('+', '')
            };
            Go.post(postData).then(function(data) {
                if (data.success == 1) { 
                    $state.go('tab.SmsCode');
                }
            });

        }
    };
    $scope.$watch('data.phone', function() {
        $scope.data.phone = Phone.watch($scope.data.phone);
    });

    $scope.ValidateSMS = function() {
        
        var validationList = [{
            type: 'codesms',
            value: $scope.data.smscode
        }];
        if (SharedService.Validation(validationList)) {
            Alert.loader(true);
            var postData = {
                "task": "ValidatSms",
                "action": 'ChangePhone', // Changepassword, UserSuspended, ChangePhone
                "codesms": $scope.data.smscode
            };
            Go.post(postData).then(function(req) {
                if (req.success == 1) {
                    $scope.data.smscode = '';
                    $scope.data.Indicatif = $window.localStorage['indicatif'];
                    $scope.data.phone = $window.localStorage['phone'];
                        
                    Alert.success( $filter('translate')('sms_code.success_send') + ' : (' + $scope.data.Indicatif + ') ' + $scope.data.phone );
 
                    $rootScope.GotoSettings()
                }
            });
        }
    };
    
    $scope.$on('$ionicView.beforeEnter', function() {
        if ($location.path() == '/tab/settings/changequestions') { 

            $scope.settings = {
                theme: (ionic.Platform.isIOS()) ? 'ios' : 'pim-theme',
                display: 'bottom',
                lang : $translate.use(),
                multiline: 3,
                height: 50
            };

            var postData = {
                "task": "getQuestions"
            };
            Go.post(postData).then(function(data) {

                if (data.success == 1) { 

                         $scope.listQuestions1 = data.listQuestions.listQuestions1;
                         $scope.listQuestions2 = data.listQuestions.listQuestions2;
                         $scope.listQuestions3 = data.listQuestions.listQuestions3; 

                            var objlist1 = [{
                                values: [data.listQuestions.listQuestions1],
                                selectedIndex: 0
                            }];
                            var objlist2 = [{
                                values: [data.listQuestions.listQuestions2],
                                selectedIndex: 0
                            }];
                            var objlist3 = [{
                                values: [data.listQuestions.listQuestions3],
                                selectedIndex: 0
                            }];
                            $scope.openPickerQuestion1 = function openPickerQuestion1() {
                                //                            // //console.log('open pikcer openPickerQuestion1');
                                var picker = pickerView.show({
                                    titleText: '', // default empty string
                                    doneButtonText: $filter('translate')('global_fields.ok'), // dafault 'Done'
                                    cancelButtonText: $filter('translate')('global_fields.close'), // default 'Cancel'
                                    obj: objlist1
                                });

                                if (picker) {
                                    picker.then(function pickerViewFinish(output) {
                                        if (output) {
                                            objlist1[0].defaultIndex = output[0].selectedIndex;
                                            $scope.data.question1 = output[0].value;
                                            $scope.data.idquestion1 = output[0].id;
                                        }
                                    });
                                }
                            };
                            $scope.closeView = function() {
                                pickerView.close();
                            };

                            $scope.openPickerQuestion2 = function openPickerQuestion2() {
                                //                            // //console.log('open pikcer openPickerQuestion2');
                                var picker = pickerView.show({
                                    titleText: '', // default empty string
                                    doneButtonText: $filter('translate')('global_fields.ok'), // dafault 'Done'
                                    cancelButtonText: $filter('translate')('global_fields.close'), // default 'Cancel'
                                    obj: objlist2
                                });

                                if (picker) {
                                    picker.then(function pickerViewFinish(output) {
                                        if (output) {
                                            objlist2[0].defaultIndex = output[0].selectedIndex;
                                            $scope.data.question2 = output[0].value;
                                            $scope.data.idquestion2 = output[0].id;
                                        }
                                    });
                                }
                            };

                            $scope.openPickerQuestion3 = function openPickerQuestion3() {
                                //                            // //console.log('open pikcer openPickerQuestion3');
                                var picker = pickerView.show({
                                    titleText: '', // default empty string
                                    doneButtonText: $filter('translate')('global_fields.ok'), // dafault 'Done'
                                    cancelButtonText: $filter('translate')('global_fields.close'), // default 'Cancel'
                                    obj: objlist3
                                });

                                if (picker) {
                                    picker.then(function pickerViewFinish(output) {
                                        if (output) {
                                            objlist3[0].defaultIndex = output[0].selectedIndex;
                                            $scope.data.question3 = output[0].value;
                                            $scope.data.idquestion3 = output[0].id;
                                        }
                                    });
                                }
                            };
                } 
                setTimeout(function () {
                    $("#q1 option:first").attr('disabled','disabled');
                    $("#q1 option:first").text("Choose a Question");

                    $("#q2 option:first").attr('disabled','disabled');
                    $("#q2 option:first").text("Choose a Question");

                    $("#q3 option:first").attr('disabled','disabled');
                    $("#q3 option:first").text("Choose a Question");

                    $scope.loader = Alert.loader(false);
                })
            });
        }
    })

    $scope.ChangeQuestions = function() {
        var validationList = [{
            type: 'question1',
            value: $scope.data.idquestion1
        }, {
            type: 'answer1',
            value: $scope.data.answer1
        }, {
            type: 'question2',
            value: $scope.data.idquestion2
        }, {
            type: 'answer2',
            value: $scope.data.answer2
        }, {
            type: 'question3',
            value: $scope.data.idquestion3
        }, {
            type: 'answer3',
            value: $scope.data.answer3
        }];

        if (SharedService.Validation(validationList)) {
            var postData = {
                "task": "SettingsChangeQuestionsAnswers",
                "question1": $scope.data.idquestion1,
                "question2": $scope.data.idquestion2,
                "question3": $scope.data.idquestion3,
                "answer1": $scope.data.answer1,
                "answer2": $scope.data.answer2,
                "answer3": $scope.data.answer3
            };
            Alert.loader(true)
            Go.post(postData).then(function(data) {

                if(data.success == 1){
                    UserDetails = User.GetDetails();

                    UserDetails.user.idquestion1 = $scope.data.idquestion1;
                    UserDetails.user.idquestion2 = $scope.data.idquestion2;
                    UserDetails.user.idquestion3 = $scope.data.idquestion3;

                    User.SetDetails(UserDetails);

                    Alert.success( $filter('translate')('security_questions.success_send') )
                        

                    $state.go('tab.ChangeQuestions', {}, {
                        reload: true
                    });
                } 
            });

        }
    }; 

    $scope.DeleteAccount = function() { 
        swal({
            title: $filter('translate')('delete_profile_enter_password.your_password'),
            input: 'password',
            confirmButtonColor: '#254E7B',
            showCancelButton: true,
            confirmButtonText: $filter('translate')('delete_profile_enter_password.submit'),
            cancelButtonText: $filter('translate')('delete_profile_enter_password.cancel'),
            customClass: "customSwal",
            showLoaderOnConfirm: true,
            preConfirm: function(password) {
                return new Promise(function(resolve, reject) {
                    var validationList = [{
                        type: 'password',
                        value: password
                    }];
                    var Result1 = SharedService.Validation(validationList, false);
                    if (Result1 == true) {
                        var postData = {
                            "task": "SettingsDeleteAcount",
                            "password": crypt.sha256(password)
                        };
                        Go.post(postData, false).then(function(data) {
                            if (data.success == 1) {
                                swal({
                                    title: $filter('translate')('delete_profile_confirm_deleting.confirmation'),
                                    text: $filter('translate')('delete_profile_confirm_deleting.text'),
                                    type: "info",
                                    showCancelButton: true,
                                    confirmButtonColor: "#254e7b",
                                    confirmButtonText: $filter('translate')('delete_profile_confirm_deleting.yes'),
                                    cancelButtonText: $filter('translate')('delete_profile_confirm_deleting.no'),
                                    customClass: "customSwal",
                                    showLoaderOnConfirm: true,
                                    preConfirm: function() {
                                        return new Promise(function(resolve, reject) {
                                            var postData = {
                                                "task": "SettingsConfirmDeleteAcount"
                                            };
                                            Go.post(postData, false).then(function(data) {
                                                if (data.success == 1) { 
                                                    var UserDetails = User.GetDetails();
                                                    var userInfos = UserDetails.userInfos;
                                                    $rootScope.deteleUserFromConnectedUserList(userInfos.id, userInfos.isshop);


                                                    AuthService.destroyUserCredentials();
                                                    $rootScope.DeleteaccountFromList( window.localStorage.getItem('username_a0f55e81c44553384a9421') );// remove from Touch ID
                                                    window.localStorage.setItem('username_a0f55e81c44553384a9421', '');

                                                    $rootScope.isLogin = false;  
                                                    isLogout = true; 
                                                    $('.wrapper.page').addClass('isLogout');
                                                    $ionicHistory.clearHistory();
                                                    $ionicHistory.clearCache();

                                                    $location.path('/sign-in');
                                                    Alert.success( $filter('translate')('delete_profile_confirm_deleting.account_deleted') );  
                                                    resolve();
                                                } else {
                                                    Alert.error(data.message);
                                                }
                                            });
                                        });
                                    },
                                    preCancel: function() {
                                        return new Promise(function(resolve, reject) {
                                            resolve();
                                        });
                                    },
                                    allowOutsideClick: false
                                });
                            } else {
                                reject(data.message);
                            }
                        });
                    } else if (Result1 != false) {
                        reject(Result1);
                    }
                });
            },
            allowOutsideClick: false
        }).then(function(etat) {
            if (etat) { 
                $state.go('/', {}, {
                    reload: true
                });
            }
        });
    }; 


    $scope.validation = false; 


    //////// Touch Id /////////
    $scope.$on('$ionicView.beforeEnter', function() {
        $scope.touchID = {};
        $scope.touchID.value = false;
        $scope.CheckedTouchID = false;

        if( ionic.Platform.isIOS() ){
            $cordovaTouchID.checkSupport().then(function() {  

                var tookens = JSON.parse( window.localStorage.getItem('TokenTouchIds') ) 
                if( tookens != '' && tookens != '[]' ){
                    var userEmail = window.localStorage.getItem('username_a0f55e81c44553384a9421'); 
                    var findedUser = false;
                    angular.forEach(tookens, function (value, index) {
                        if( value.id == userEmail ){
                            findedUser = true;
                        }
                    })
                    $scope.CheckedTouchID = true;
                    setTimeout(function () {
                        if( findedUser ){
                            $scope.$apply(function () {
                                $scope.touchID.value = true;
                            })
                        }else{
                            $scope.$apply(function () {
                                $scope.touchID.value = false;
                            }) 
                        }   
                    })
                }   
                    
                
            }); 
        }else{
            if( window.SamsungPass ){
                SamsungPass.checkForRegisteredFingers(function() {
                    var tookens = JSON.parse( window.localStorage.getItem('TokenTouchIds') ) 
                    if( tookens != '' && tookens != '[]' ){
                        var userEmail = window.localStorage.getItem('username_a0f55e81c44553384a9421'); 
                        var findedUser = false;
                        angular.forEach(tookens, function (value, index) {
                            if( value.id == userEmail ){
                                findedUser = true;
                            }
                        })
                        $scope.CheckedTouchID = true;
                        setTimeout(function () {
                            if( findedUser ){
                                $scope.$apply(function () {
                                    $scope.touchID.value = true;
                                })
                            }else{
                                $scope.$apply(function () {
                                    $scope.touchID.value = false;
                                }) 
                            }   
                        })
                    }  
                }, function() {});
            } 
        }
    });
    $scope.stateTouchID = function () { 
        var userEmail = window.localStorage.getItem('username_a0f55e81c44553384a9421');
        var tookens = JSON.parse( window.localStorage.getItem('TokenTouchIds') )
        if( $scope.touchID.value ){ 
            tookens.push( {id: userEmail} )  
            window.localStorage.setItem('TokenTouchIds', JSON.stringify(tookens)) 
        }else{
            angular.forEach(tookens, function (value, index) {
                if( value.id == userEmail ){
                    tookens.splice(index, 1)
                }
            })
            setTimeout(function () {
                 window.localStorage.setItem('TokenTouchIds', JSON.stringify(tookens))  
            })
        }

    }


    
    ////////////////////////////////
})

.controller('BlockedCtrl', function($scope, $state, pickerView, User, SharedService, Go, $location, Alert, Geo, AuthService, $filter) {
    SMSaction = "UserSuspended";
    MessageCongratulation = 'You have successfully unlocked your account.';
    $scope.dataBS = {
        "SMStext1": $filter('translate')('unlock_blocked_account_by_sms.text'),
        "SMStext2": $filter('translate')('unlock_blocked_account_by_sms.text2'),
        "SMStext3": $filter('translate')('unlock_blocked_account_by_sms_answer.text')
    };
    $scope.dataBA = {};

    if ($location.path() == '/unblock-bysmsanswers') {
        var postData = {
            "task": "getPartOfPhone",
            "action": SMSaction // Changepassword, UserSuspended, ChangePhone
        };
        Go.post(postData).then(function(data) {
            if (data.success == 1) {
                $scope.dataBS.SMStext3 = $scope.dataBS.SMStext3 + ' *******' + data.part_of_phone;
                $scope.isShop = data.isshop;
            }
        });

        var postData = {
            "task": "getUserQuestions",
            "action": SMSaction // ForgotPassword, UserSuspended
        };
        Go.post(postData).then(function(data) {
            if (data.success == 1) {
                $scope.dataBA.question1 = data.questions[0].question;
                $scope.dataBA.question2 = data.questions[1].question;
                $scope.dataBA.question3 = data.questions[2].question;
            }
        });
    }

    $scope.confirmSMSAnswers = function() {
        Alert.loader(true);
        var validationList = [{
            type: 'codesms',
            value: $scope.dataBS.smscode
        }, {
            type: 'answer1',
            value: $scope.dataBA.answer1
        }, {
            type: 'answer2',
            value: $scope.dataBA.answer2
        }, {
            type: 'answer3',
            value: $scope.dataBA.answer3
        }];
        if (SharedService.Validation(validationList)) {
            var postData = { 
                "action": SMSaction, // Changepassword, UserSuspended, ChangePhone
                "codesms": $scope.dataBS.smscode,
                "answer1": $scope.dataBA.answer1,
                "answer2": $scope.dataBA.answer2,
                "answer3": $scope.dataBA.answer3
            }; 

            if( $scope.isShop == 0 ){
                postData.task = "SmsAnswersValidation";
            }else{
                postData.task = "SHOP_SmsAnswersValidation";
            }

            Geo.getPosition().then(function(pos) {
                postData.lat = pos.lat;
                postData.long = pos.lng;
                Go.post(postData).then(function(data) {
                    if (data.success == 1) {
                        //AuthService.storeUserCredentials(data.userToken);
                        User.SetDetails(data.UserDetails);
                        swal({
                            title: "Confirmation",
                            text: MessageCongratulation,
                            type: 'success',
                            timer: 3000,
                            showConfirmButton: false
                        });
                        $scope.dataBS.smscode = "";
                        $scope.dataBA.answer1 = "";
                        $scope.dataBA.answer2 = "";
                        $scope.dataBA.answer3 = "";

                        $location.path('/sign-in');
                        resolve();
                    }
                });
            });
        }
    };

    if ($location.path() == '/unblock-bysms') {
        var postData = {
            "task": "getPartOfPhone",
            "action": SMSaction // Changepassword, UserSuspended, ChangePhone
        };
        Go.post(postData).then(function(data) {
            if (data.success == 1) {
                $scope.dataBS.SMStext1 = $scope.dataBS.SMStext1 + ' *******' + data.part_of_phone;
                $scope.isShop = data.isshop;
            }
        });
    }

    $scope.SmsUnblock = function() {
        //        $state.go('unblock-bysms');
        $state.go('unblock-bysmsanswers');
    };

    $scope.confirmSMS = function() {
        Alert.loader(true);
        var validationList = [{
            type: 'codesms',
            value: $scope.dataBS.smscode
        }];
        if (SharedService.Validation(validationList)) {
            var postData = { 
                "action": SMSaction, // Changepassword, UserSuspended, ChangePhone
                "codesms": $scope.dataBS.smscode
            };
            if( $scope.isShop == 0 ){
                postData.task = "ValidatSms";
            }else{
                postData.task = "SHOP_ValidatSms";
            }
            Geo.getPosition().then(function(pos) {
                postData.lat = pos.lat;
                postData.long = pos.lng;
                Go.post(postData).then(function(data) {
                    if (data.success == 1) {
                        //AuthService.storeUserCredentials(data.userToken);
                        User.SetDetails(data.UserDetails);
                        $state.go('unblock-byanswers');
                        resolve();
                    }
                });
                $scope.dataBS.smscode = "";
            });
        }
    };

    if ($location.path() == '/unblock-byanswers') {
        var postData = {
            "task": "getUserQuestions",
            "action": SMSaction // ForgotPassword, UserSuspended
        };
        Go.post(postData).then(function(data) {
            if (data.success == 1) {
                $scope.dataBA.question1 = data.questions[0].question;
                $scope.dataBA.question2 = data.questions[1].question;
                $scope.dataBA.question3 = data.questions[2].question;
            }
        });
    }

    $scope.confirmAnswers = function() {
        Alert.loader(true);
        var validationList = [{
            type: 'answer1',
            value: $scope.dataBA.answer1
        }, {
            type: 'answer2',
            value: $scope.dataBA.answer2
        }, {
            type: 'answer3',
            value: $scope.dataBA.answer3
        }];
        if (SharedService.Validation(validationList)) {
            var postData = { 
                "action": SMSaction, // Changepassword, UserSuspended, ChangePhone
                "answer1": $scope.dataBA.answer1,
                "answer2": $scope.dataBA.answer2,
                "answer3": $scope.dataBA.answer3
            };
            if( $scope.isShop == 0 ){
                postData.task = "AnswersValidation";
            }else{
                postData.task = "SHOP_AnswersValidation";
            }
            Geo.getPosition().then(function(pos) {
                postData.lat = pos.lat;
                postData.long = pos.lng;
                Go.post(postData).then(function(data) {
                    if (data.success == 1) {
                        //AuthService.storeUserCredentials(data.userToken);
                        User.SetDetails(data.UserDetails);
                        
                        Alert.success( MessageCongratulation );

                        $scope.dataBA.answer1 = "";
                        $scope.dataBA.answer2 = "";
                        $scope.dataBA.answer3 = "";

                        $location.path('/sign-in');
                        resolve();
                    }
                });
            });
        }
    };
}) 
