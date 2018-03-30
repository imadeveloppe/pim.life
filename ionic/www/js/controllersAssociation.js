var congratulation_msg = "";
angular.module('pim.controllersAssociation', []) 

.controller('SettingsAssociationCtrl', function($scope,$cordovaBadge, $sce, $ionicModal, $ionicScrollDelegate, Geo, AuthService, DATA, $storage, $translate, User, $rootScope, $interval, Go, pickerView, SharedService, crypt, $state, Alert, $cordovaTouchID, AuthService,$location, $ionicHistory, $filter) {
    $scope.data = {}; 

    $scope.$on('$ionicView.beforeEnter', function() {  
        $scope.RefreshSettings() 
    });

    $scope.$on('$ionicView.afterEnter', function() { 
        if( $rootScope.GetlistSettings ) {
            $rootScope.GetlistSettings();
        }  
    });

    $scope.RefreshSettings = function () {
        var UserDetails = User.GetDetails();

        $scope.Appinfo = DATA;
        
        $scope.UserDetails = User.GetDetails(); 
        $scope.loader = Alert.loader(false); 

        $scope.listSettings = UserDetails.listSettings; 
         

        console.log($scope.UserDetails)

        $scope.data.answer1 = '';
        $scope.data.answer2 = '';
        $scope.data.answer3 = '';
        $scope.dataCP.smscode = '';
        $scope.dataCP.current = '';
        $scope.dataCP.newpassword  = '';
        $scope.dataCP.confirmpassword = ''; 

        $scope.selectedLang = $translate.use();
        $rootScope.langs = JSON.parse( window.localStorage.getItem('langs') )

        $scope.treezorid = parseInt(UserDetails.logsPhoto.treezorid.confirmed);

        setTimeout(function () {
            $scope.$apply(function () { 
                $scope.connectedUsers = $storage.getArrayOfObjects("connectedUsers");  
                $scope.userInfos = UserDetails.userInfos; 
            })
        })
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
                        $ionicScrollDelegate.resize();
                    })
                    $storage.setArrayOfObjects("connectedUsers", array);

                })
            }
        });
    }
    $scope.connexionDATA = {};
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
                    $storage.setObject('capitalSocial', {});
                    $scope.connexionDATA = data;
                    $scope.connexionDATA.position = {
                            lat: position.lat,
                            lng: position.lng
                    }

                    if( parseInt( data.UserDetails.user.cgvvalid ) == 0 ){ 
                        $scope.cgv = data.UserDetails.cgv;
                        $scope.UserData = data;
                        $scope.cgvModal.show();
                        $scope.loadCGV();
                        
                    }else{
                        $scope.acceptedCGV( $scope.connexionDATA )
                    }
                
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

    $scope.cgv = "";
    $scope.canLoadMore = true; 
    $scope.cgvpage= 0;
    
    $scope.loadCGV = function () { 
        Go.post({
            task: "getcgv",
            isshop: $scope.UserData.userInfos.isshop,
            NoLoader: true,
            page  : $scope.cgvpage
        }).then(function (data) { 
            if(data.success == 1){
                $scope.cgvpage++;
                $scope.cgv += data.cgv;
                setTimeout(function () {
                    $scope.$apply(function () {
                        $scope.$broadcast('scroll.infiniteScrollComplete');
                    })
                })
                if(data.cgvend == 0){ 
                    $scope.canLoadMore = true; 
                } 
            }    
        }) 
    }

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
        
        $location.path("/tab/home");

        $ionicHistory.clearHistory();
        $ionicHistory.clearCache(); 
        // ******************************************************************************************************************************
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
 


    $scope.progressval = 0;
    $scope.stopinterval = null;

    function startprogress() {
        //console.log('Pro ---> PROGRESSSSSSSSSSSSSSSSSSsssssssssssssssssssssssssssSSSsssSSSsssSSSsssSSSSSS');
        $scope.progressval = 0;
        if ($scope.stopinterval) {
            $interval.cancel($scope.stopinterval);
        }
        if(typeof $scope.UserDetails.user.percentage !== 'undefined'){
            $scope.stopinterval = $interval(function() {
                    $scope.progressval = $scope.progressval + 1;
                    if ($scope.progressval >= $scope.UserDetails.user.percentage) {
                        $interval.cancel($scope.stopinterval);
                        return;
                    }
                

            }, 20);
        }
    } 
    $rootScope.$on("settingStartprogress", function() { 
        //console.log('garet emit')
        startprogress();
        $scope.RefreshSettings() 
    });




    $scope.dataCP = {};
    $scope.ChangePassword = function() {
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
            Alert.loader(true)
            var postData = {
                "task": "SHOP_SettingsChangepassword",
                "actualpassword": crypt.sha256($scope.dataCP.current),
                "password": crypt.sha256($scope.dataCP.newpassword),
                "confirmepassword": crypt.sha256($scope.dataCP.confirmpassword)
            };
            Go.post(postData).then(function(data) {
                if (data.success == 1) {
                    $scope.dataCP.smscode = '';

                    $state.go('tab.SmsCodePwdPro');
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
                "task": "SHOP_ValidatSms",
                "action": 'Changepassword', // Changepassword, UserSuspended, ChangePhone
                "codesms": $scope.dataCP.smscode
            };
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


    $scope.$on('$ionicView.beforeEnter', function() {
        if (Go.is('changequestions')) {
            var postData = {
                "task": "getQuestions",
                'isshop': 1
            };

            $scope.settings = {
                theme: (ionic.Platform.isIOS()) ? 'ios' : 'pim-theme',
                display: 'bottom',
                lang : $translate.use(),
                multiline: 3,
                height: 50
            };


            Go.post(postData).then(function(data) {
                if (data.success == 1) {
                    //console.log(data)
                    

                    $scope.listQuestions1 = data.listQuestions.listQuestions1;
                    $scope.listQuestions2 = data.listQuestions.listQuestions2;
                    $scope.listQuestions3 = data.listQuestions.listQuestions3;


                    //console.log('$scope.UserDetails.user.idquestion1',$scope.UserDetails.user.idquestion1)
                    $scope.data.idquestion1 = $scope.UserDetails.user.idquestion1;
                    $scope.data.idquestion2 = $scope.UserDetails.user.idquestion2;
                    $scope.data.idquestion3 = $scope.UserDetails.user.idquestion3; 

                } else {
                    Alert.error('No questions');
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
            })
        }
    })
    $scope.ChangeQuestions = function() {
        //console.log('$scope.data',$scope.data)
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
                "task": "SHOP_SettingsChangeQuestionsAnswers",
                "question1": $scope.data.idquestion1,
                "question2": $scope.data.idquestion2,
                "question3": $scope.data.idquestion3,
                "answer1": $scope.data.answer1,
                "answer2": $scope.data.answer2,
                "answer3": $scope.data.answer3
            };
            Alert.loader(true)
            Go.SPost(postData).then(function(data) { 
                if(data.success == 1){
                    UserDetails = User.GetDetails(); 
                    UserDetails.user.idquestion1 = $scope.data.idquestion1;
                    UserDetails.user.idquestion2 = $scope.data.idquestion2;
                    UserDetails.user.idquestion3 = $scope.data.idquestion3;

                    User.SetDetails(UserDetails);

                    Alert.success( $filter('translate')('security_questions.success_send') )
                    
                    $state.go('tab.ChangeQuestionsPro', {}, {
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
                            "task": "SHOP_SettingsDeleteAcount",
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
                                                "task": "SHOP_SettingsConfirmDeleteAcount"
                                            };
                                            Go.post(postData, false).then(function(data) {
                                                if (data.success == 1) { 
                                                    var UserDetails = User.GetDetails();
                                                    var userInfos = UserDetails.userInfos;
                                                    $rootScope.deteleUserFromConnectedUserList(userInfos.id, userInfos.isshop)

                                                    
                                                    AuthService.destroyUserCredentials();
                                                    $rootScope.DeleteaccountFromList( window.localStorage.getItem('username_a0f55e81c44553384a9421') );// remove from Touch ID
                                                    window.localStorage.setItem('username_a0f55e81c44553384a9421', '');

                                                    $rootScope.isLogin = false;  
                                                    isLogout = true; 
                                                    $('.wrapper.page').addClass('isLogout');
                                                    $ionicHistory.clearHistory();
                                                    $ionicHistory.clearCache();

                                                    $location.path('/');
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

    //////// Touch Id /////////
    $scope.touchID = {};
    $scope.touchID.value = false;
    $scope.CheckedTouchID = false;
    $scope.$on('$ionicView.beforeEnter', function() {
        
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

.controller('UpdateAssociationInfoCtrl', function($scope, $filter,$state, Alert, User, SharedService, Go, $rootScope, $timeout, crypt, $filter,$translate, pickerView) {
    
    // ****************************************************************************************
    //////////////////////////////// Nombre d'employee  ///////////////////////////////////////
    $scope.arrayNbremploye = ["0","1-9","10-99","100-249","250-*"]; 
    $scope.arrayNbremployeView = ["0","1-9","10-99","100-249","+250"]; 
    $scope.nbremployeSettings = {   
        theme: 'ios',
        highlight: false,
        onInit: function (event, inst) { 
            setTimeout(function () {
                inst.refresh()
                var labels = nbremploye.parentNode.querySelectorAll('.mbsc-progress-step-label'); 
                for (var i = 0; i < labels.length; ++i) { 
                    labels[i].innerHTML = $scope.arrayNbremployeView[i]; 
                }
            })
           
        }
    };
    // ****************************************************************************************


    // ****************************************************************************************
    //////////////////////////////// Revenu NET  //////////////////////////////////////////////

    $scope.arrayNetincome = ["0-4","5-9","10-49","50-149","150-499","500-*"];  
    $scope.arrayNetincomeView = ["0-4","5-9","10-49","50-149","150-499","+500"]; 
    $scope.netincomeSettings = {   
        theme: 'ios',
        highlight: false,
        onInit: function (event, inst) { 
            setTimeout(function () {
                inst.refresh()
                var labels = netincome.parentNode.querySelectorAll('.mbsc-progress-step-label'); 
                for (var i = 0; i < labels.length; ++i) { 
                    labels[i].innerHTML = $scope.arrayNetincomeView[i]; 
                }
            })
           
        }
    };
    // ****************************************************************************************

    //////////////////////// Chiffre d'affaires annuel légal  ///////////////////////////////// 
 
    $scope.arrayAnnualturnover = ["0-39","40-99","100-249","250-999","1000-2999","3000-9999","10000-99999","100000-*"]; 
    $scope.arrayAnnualturnoverView = ["0-39","40-99","100-249","250-999","1K-2K","3K-9K","10K-99K","+100K"];
    $scope.annualturnoverSettings = {   
        theme: 'ios',
        highlight: false,
        onInit: function (event, inst) { 
            setTimeout(function () {
                inst.refresh()
                var labels = annualturnover.parentNode.querySelectorAll('.mbsc-progress-step-label'); 
                for (var i = 0; i < labels.length; ++i) { 
                    labels[i].innerHTML = $scope.arrayAnnualturnoverView[i]; 
                }
            })
           
        }
    };
    // ****************************************************************************************

    $scope.$on('$ionicView.beforeEnter', function() {
        $scope.data = {};
        $scope.UserDetails = User.GetDetails();   
        console.log("user",$scope.UserDetails) 
        $scope.data = $scope.UserDetails.user; 

        $scope.data.assocmission =  $scope.UserDetails.assocdetails.assocmission;

        $scope.data.nbremployeIndex = $scope.arrayNbremploye.indexOf($scope.data.nbremploye);
        $scope.data.netincomeIndex = $scope.arrayNetincome.indexOf($scope.data.netincome);
        $scope.data.annualturnoverIndex = $scope.arrayAnnualturnover.indexOf($scope.data.annualturnover);
        if( $scope.data.nbremployeIndex < 0 ) $scope.data.nbremployeIndex = 0;
        if( $scope.data.netincomeIndex < 0 ) $scope.data.netincomeIndex = 0;
        if( $scope.data.annualturnoverIndex < 0 ) $scope.data.annualturnoverIndex = 0;

        $scope.listSettings = $scope.UserDetails.listSettings;
        $scope.cover = $scope.data.cover;
        $scope.logo = $scope.data.logo_medium;
        $scope.initiales = $scope.data.initiales; 
        
 
 
        if( parseInt($scope.UserDetails.logsPhoto.shopname.confirmed) == -1 || parseInt($scope.UserDetails.logsPhoto.shopname.confirmed) == 2 ){
            $scope.showBtns = true; 
        }else{
            $scope.showBtns = false; 
        }  
 
    });

     
     
    var UserDetails = $scope.UserDetails;
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
    $scope.ChangeInfo = function(ValidationGo) { 
        var validationList = [{
            type: 'companyname', //
            value: $scope.data.shopname 
        }, {
            type: 'createdat', //
            value: $scope.data.createdat,
            lang: $translate.use()
        }, {
            type: 'brandname', //
            value: $scope.data.brand
        },{
            type: 'idbusinessType', //
            value: $scope.data.idbusinessType
        }, {
            type: 'website', //
            value: $scope.data.siteweb.toLowerCase() 
        },{
            type: 'sharecapital', //
            value: $scope.data.sharecapital 
        },
        {
            type: 'registrationnum', //
            value: $scope.data.registrationnum 
        }
        ];
        if (SharedService.Validation(validationList)) {
            Alert.loader(true) 
            

            $tabDate = $scope.data.createdat.split('/')
            switch( $translate.use() ){
                case 'fr':
                    $scope.data.FormatedBirthdate = new Date( $tabDate[2]+"/"+$tabDate[1]+"/"+$tabDate[0] );
                    break;

                case 'en':
                    $scope.data.FormatedBirthdate = new Date( $tabDate[2]+"/"+$tabDate[0]+"/"+$tabDate[1] );
                    break;
            } 

            var postData = {
                "task": "SHOP_SettingsChangeCompanyInfos",
                "shopname": $scope.data.shopname,
                "createdat": new Date($scope.data.FormatedBirthdate.setHours(12,0,0,0)), 
                "brand": $scope.data.brand,
                "shopslogan": $scope.data.slogan,
                "assoctypeid": $scope.data.idbusinessType,

                "registrationnum": $scope.data.registrationnum,
                "nbremploye": $scope.arrayNbremploye[ $scope.data.nbremployeIndex ],
                "netincome": $scope.arrayNetincome[ $scope.data.netincomeIndex ],
                "annualturnover": $scope.arrayAnnualturnover[ $scope.data.annualturnoverIndex ],

                "siteweb": $scope.data.siteweb,
                "desc": $scope.data.desc,
                "assocmission": $scope.data.assocmission,
                "sharecapital": $scope.data.sharecapital,

                "facebook": $scope.data.facebook,
                "twitter": $scope.data.twitter
            };
            
            Go.SPost(postData).then(function(data) { 
                if(data.success == 1){
                     
                    var UserDetails =  User.GetDetails();  

                    if( $translate.use() == 'en' ){
                        $scope.data.createdat = $filter('date')($scope.data.createdat,"MM/dd/y");
                    }else{
                        $scope.data.createdat = $filter('date')($scope.data.createdat,"dd/MM/y");
                    }
                    $scope.data.nbremploye = $scope.arrayNbremploye[ $scope.data.nbremployeIndex ]
                    $scope.data.netincome = $scope.arrayNetincome[ $scope.data.netincomeIndex ]
                    $scope.data.annualturnover = $scope.arrayAnnualturnover[ $scope.data.annualturnoverIndex ]

                    congratulation_msg = $filter('translate')('company_informations.success_update');


                    if( data.log > 0 ){
                        UserDetails.user = $scope.data;

                        UserDetails.assocdetails.assoctypelabel = $scope.data.informationBusinessType;
                        UserDetails.assocdetails.assoctypeid = $scope.data.idbusinessType;
                        UserDetails.assocdetails.assocmission = $scope.data.assocmission; 

                        Alert.Congratulation('tab.ValidateDocument', $filter('translate')('global_fields.close'), congratulation_msg); 

                        UserDetails.logsPhoto.shopname.confirmed = {
                            comment: "",
                            confirmed: -1,
                            doc: "",
                            photolibelle:""
                        }
                        $rootScope.validateData.logsPhoto = UserDetails.logsPhoto.shopname ={
                            comment: "",
                            confirmed: -1,
                            doc: "",
                            photolibelle:""
                        }
                    }else{
                        swal({ 
                            type: 'success',
                            showCancelButton: false,
                            showConfirmButton: false,
                            timer: 2000
                        })
                    }
                    
                    User.SetDetails(UserDetails);  

                    $rootScope.updateTouchIDList();
                    $rootScope.updateConnectedUser(); 
                } 
            });


        }
    };
    $scope.isEnter = false;
    $scope.requiredItemChanged = false;
    $scope.NotrequiredItemChanged = false;

    $scope.$on('$ionicView.enter', function(e) {
        UserDetails = User.GetDetails();
        if (UserDetails != false) {
            
 
            if (UserDetails.user.logconfirmed_name == 1) {
                $scope.readonlyDB = true;
            } else {
                $scope.readonlyDB = false;
            }

            $rootScope.validateData.Message = $filter('translate')('company_informations.upload_your_corporate_statutes');
            // $rootScope.validateData.userlog = UserDetails.logs.shopname + ',' + UserDetails.logs.shopcreatedat + ',' + UserDetails.logs.shopbrand + ',' + UserDetails.logs.shopsiteweb + ',' + UserDetails.logs.shopdesc;
            $rootScope.validateData.userlog = UserDetails.logs.shopname;
       
            $rootScope.validateData.id = 0;
            $rootScope.validateData.logsPhoto = UserDetails.logsPhoto.shopname;
            $rootScope.validateData.N1 = 'logsPhoto';
            $rootScope.validateData.N2 = 'shopname';
            ///console.log("UserDetails.user.logconfirmed_name", UserDetails.logsPhoto.shopname.confirmed)
            
            $scope.commentAdmin = UserDetails.logsPhoto.shopname.comment;
            
            switch ( parseInt( UserDetails.logsPhoto.shopname.confirmed ) ) {
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
                    $scope.ValidateMSG = "<span class='DocumentInValid'><i style='font-size:35px;' class='icon ion-alert-circled'></i> <br>"+ $filter('translate')('company_informations.in_compliance_with_the_regulatory_requirements_in_your_country__') +"</span>";
                    $scope.validate = true;
                    $scope.validation = false;
                    break;
            }
             
                $scope.isEnter = false; 

                 

                $scope.$watch('data', function(newVal, oldVal) {
                    
                    if(newVal.desc.length > 300) {  
                        $scope.data.desc = oldVal.desc.substr(0, 296)+"...";
                    }

                    var UserDetails2 = User.GetDetails();  

                    //console.log('isEnter',$scope.isEnter)
                    if ($scope.isEnter) {
                    // // //console.log('$scope.PersonaleData', $scope.PersonaleData) 

                       

                        if ($scope.data.shopname != UserDetails2.user.shopname) {
                            $scope.validation = true;
                            $scope.requiredItemChanged = true;
                            console.log(1)
                        }
                        if ($scope.data.brand != UserDetails2.user.brand) {
                            $scope.validation = true;
                            $scope.requiredItemChanged = true;
                            console.log(2)
                        }
                        if ($scope.data.siteweb != UserDetails2.user.siteweb) {
                            $scope.validation = true;
                            $scope.requiredItemChanged = true;
                            console.log(3)
                        }
                        if ($scope.data.desc != UserDetails2.user.desc) {
                            $scope.validation = true;
                            $scope.requiredItemChanged = true;
                            console.log(4)
                        }
                        if ($scope.data.sharecapital != UserDetails2.user.sharecapital) {
                            $scope.validation = true;
                            $scope.requiredItemChanged = true;
                            console.log(5)
                        }
                        if ($filter('date')($scope.data.createdat,"MM/dd/yyyy") != UserDetails2.user.createdat  && $translate.use() == 'en' ) {
                            $scope.validation = true; 
                            $scope.requiredItemChanged = true;
                            console.log(6.1)
                        }

                        if ($filter('date')($scope.data.createdat,"dd/MM/yyyy") != UserDetails2.user.createdat  && $translate.use() != 'en' ) {
                            $scope.validation = true; 
                            $scope.requiredItemChanged = true;
                            console.log(6.2,$filter('date')($scope.data.createdat,"dd/MM/yyyy"), UserDetails2.user.createdat )
                        }

                        if ($scope.data.nbremployeIndex != UserDetails2.user.nbremployeIndex) {
                            $scope.validation = true;
                            $scope.requiredItemChanged = true;
                            console.log(7)
                        }
                        if ($scope.data.netincomeIndex != UserDetails2.user.netincomeIndex) {
                            $scope.validation = true;
                            $scope.requiredItemChanged = true;
                            console.log(8)
                        }
                        if ($scope.data.annualturnoverIndex != UserDetails2.user.annualturnoverIndex) {
                            $scope.validation = true;
                            $scope.requiredItemChanged = true;
                            console.log(9)
                         } 
                            
                        if ($scope.data.facebook != UserDetails2.user.facebook || $scope.data.twitter != UserDetails2.user.twitter) {
                            $scope.validation = true;
                            $scope.NotrequiredItemChanged = true;
                            console.log(11)
                        }

                    }else{
                        $scope.isEnter = true;
                    }


                }, true);

             

        }
    }); 

    $scope.$on('$ionicView.beforeEnter', function(e) {
        UserDetails = User.GetDetails();
        $scope.data.informationBusinessType = UserDetails.assocdetails.assoctypelabel;
        $scope.data.idbusinessType = UserDetails.assocdetails.assoctypeid;

        var postData = {
            "task": "SHOP_getAssocTypes"
        }; 
        Go.post(postData).then(function(data) {
            if(data.success == 1){

                var selectedIndexType = 0;var i = 0 ;
                data.associationType.forEach(function(element){
                    //console.log(element)
                    if(element.id == UserDetails.assocdetails.assoctypeid){
                        selectedIndexType = i;
                    }
                    i++;
                }); 

                $scope.associationType = data.associationType;
            }             
        });
    });

    $scope.openPickerBusinessType = function (isvalid) {
        
        if( isvalid ){
            var selectedIndexType = 0;
            var objlist1 = [{
                values: [$scope.associationType],
                selectedIndex: selectedIndexType
            }];
            var picker = pickerView.show({
                titleText: '', // default empty string
                doneButtonText: $filter('translate')('global_fields.ok'), // dafault 'Done'
                cancelButtonText: $filter('translate')('global_fields.close'), // default 'Cancel' 
                obj: objlist1
            });  
            if (picker) {
                picker.then(function (output) {
                    if (output) {
                        objlist1[0].defaultIndex = output[0].selectedIndex;
                        $scope.data.informationBusinessType = output[0].value;
                        $scope.data.idbusinessType = output[0].id;
                    }
                });
            }
        } 
        
    };

    $scope.closeView = function() {
        pickerView.close();
    };
})

.controller('businessinformations-catAssociationCtrl', function($scope,$rootScope, $storage, User,Catgs, pickerView, Go, SharedService, Alert,$timeout, $filter, $ionicModal) {
 
    var UserDetails;
    $scope.data = {};
    $scope.$on('$ionicView.beforeEnter', function(e) {
        UserDetails = User.GetDetails(); 
        $scope.SelectedCat = UserDetails.assocdetails.assoccatlabel;
        $scope.SelectedCatId = UserDetails.assocdetails.assoccatid;
        Go.post({
            task: "SHOP_getAssocCategories"
        }).then(function (data) {
            if(data.success == 1){
                $scope.categories = data.associationCat;
                ////////// Randem color category //////////////////////////////
                angular.forEach( $scope.categories, function (cat, key) {
                    $scope.categories[key].color = getRandomColor();  
                } )
                ////////////////////////////////////////////////////////////
            }
        })
    }); 
    $scope.Update = function(){

        $rootScope.$emit('getSelectedCat')

        var validationList = [{
            type: 'idcategories',
            value: $rootScope.selectedCategoryId
        }];
        if (SharedService.Validation(validationList)) {
            Alert.loader(true);
            var postData = {
                "task": "SHOP_SettingsChangeAssoccat",  
                "assoccatid": $scope.SelectedCatId
            };
            Go.post(postData).then(function(data) { 
                if (data.success == 1) {
                    UserDetails.assocdetails.assoccatlabel = $scope.SelectedCat; 
                    UserDetails.assocdetails.assoccatid = $scope.selectedCategoryId;
                    User.SetDetails(UserDetails);
 
                    Alert.success($filter('translate')('company_category.success_update'));
                }
            });
        }
    }

    $scope.showCategories = function(){  
        $scope.Filter.show();
    }

    $scope.showSubCat = function (idCat, categorie ) {
        $scope.SelectedCat = categorie.catlabel;
        $scope.SelectedCatId = categorie.catid;

        $scope.Filter.hide()
    }

    $ionicModal.fromTemplateUrl('templates/Connect/filters/shop-filter-cat.html', {
        scope: $scope,
        animation: 'slide-in-up',
        hideDelay:200,
        showDelay:200
    }).then(function(modal) {
        $scope.Filter = modal; 
    });
})