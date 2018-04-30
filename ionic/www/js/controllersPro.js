
angular.module('pim.controllersPro', []) 

.controller('ProSignUpCtrl', function($scope, GooglePlaces, $stateParams, $sce, $ionicLoading, $state, pickerView, Phone, Lists, User, SharedService, crypt, Go, $location, Alert, Geo, AuthService, $ionicModal, $filter, $translate) {
    $scope.data = {};
    $scope.data.IndicatifHQ = '+33';
    $scope.data.IndicatifShop = '+33';
    $scope.data.Indicatif = '+33'; 
    $scope.cgv = "";

    $scope.trustAsHtml = function(string) {
        return $sce.trustAsHtml(string);
    };


    $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams, $filter) {
        // //console.log("from state: ", fromState.name)
        if( fromState.name == "signin"){
            $scope.data = {};
            $scope.data.IndicatifHQ = '+33';
            $scope.data.IndicatifShop = '+33';
            $scope.data.Indicatif = '+33';
            $scope.data.shoptypeid = -1;
        }
    });


    var objlist = [{
        values: [Lists.Indicatifs],
        defaultIndex: 7
    }];


    $scope.loadCGV = function () {
        Go.post({
            task: "getcgv",
            isshop: 1,
            NoLoader: true,
            page  : $scope.cgvpage
        }).then(function (data) { 
            if(data.success == 1){
                $scope.cgvpage++;
                $scope.cgv += data.cgv;
                setTimeout(function () {
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                },1000)
                if(data.cgvend == 0){ 
                    $scope.canLoadMore = true; 
                }else{ 
                    $scope.canLoadMore = false; 
                } 
            }    
        }) 
    }

    if( $state.current.name == 'signuppro'){
        Go.post({
            "task": "SHOP_getTypes"
        }).then(function(data) {
            if(data.success == 1){
                $scope.dataTypes = data.businessType;
                $scope.data.shoptypeid = -1;
            }             
        }); 


        $scope.cgv = "";
        $scope.cgvpage= 0;
        $scope.loadCGV()

    }

    
    
    $scope.openPickerBusinessType = function() {  
        var objlist1 = [{
            values: [$scope.dataTypes],
            selectedIndex: -1
        }];
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
                    $scope.data.type = output[0].value;
                    $scope.data.shoptypeid = output[0].id;
                }
            });
        }
        
    };

     


    $scope.openPickerIndicatif = function() {
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


    $scope.openPickerIndicatifHQ = function() {
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
                    $scope.data.IndicatifHQ = output[0].id;
                }
            });
        }
    };

    $scope.openPickerIndicatifShop = function() {
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
                    $scope.data.IndicatifShop = output[0].id;
                }
            });
        }
    };



    if ($location.path() == '/sign-up-pro-step3') {

        $scope.settings = {
            theme: (ionic.Platform.isIOS()) ? 'ios' : 'pim-theme',
            display: 'bottom',
            lang : $translate.use(),
            multiline: 3,
            height: 50
        };


        var postData = {
            "task": "getQuestions",
            "isshop": 1
        };

        Go.post(postData).then(function(data) {
            if (data.success == 1) {

                $scope.listQuestions1 = data.listQuestions.listQuestions1;
                $scope.listQuestions2 = data.listQuestions.listQuestions2;
                $scope.listQuestions3 = data.listQuestions.listQuestions3;

                setTimeout(function () {
                    $("#q1 option:first").attr('disabled','disabled');
                    $("#q1 option:first").text( $filter('translate')('secret_questions.choose_a_question') );

                    $("#q2 option:first").attr('disabled','disabled');
                    $("#q2 option:first").text(  $filter('translate')('secret_questions.choose_a_question')  );

                    $("#q3 option:first").attr('disabled','disabled');
                    $("#q3 option:first").text(   $filter('translate')('secret_questions.choose_a_question')  );

                    $scope.loader = Alert.loader(false);
                })
            }

            
        });
    }








    $scope.signupPro = function() {
        var validationList = [
        {
            type: 'companyname',
            value: $scope.data.companyname
        },{
            type: 'brandname', 
            value: $scope.data.brand
        },{
            type: 'idbusinessType', 
            value: $scope.data.shoptypeid
        },{
            type: 'createdat', 
            value: $scope.data.createdat
        },{
            type: 'sharecapital', 
            value: $scope.data.sharecapital,
            lang: $translate.use()
        },{
            type: 'vat', 
            value: $scope.data.vta
        },{
            type: 'phoneFixe', 
            value: $scope.data.fixeNumber
        }, {
            type: 'phoneFixeShop', 
            value: $scope.data.fixeNumberShop
        }, {
            type: 'emailContact', 
            value: $scope.data.contactemail
        }, {
            type: 'website',
            value: $scope.data.website
        }, {
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
        }

    }; 

    $scope.AcceptCGV = function () {
        Alert.loader(true);
        $scope.closeModal();

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
             "task": "SHOP_InscriptionAllCompanyInfos",
             "companyname": $scope.data.companyname,
             "brandname": $scope.data.brand,

             "shoptypeid": $scope.data.shoptypeid,
             "createdat": new Date($scope.data.FormatedBirthdate.setHours(12,0,0,0)), 
             "sharecapital": $scope.data.sharecapital,
             "vta": $scope.data.vta,

             "IndicatifHQ": $scope.data.IndicatifHQ.replace('+', ''),
             "fixeNumberHQ": $scope.data.fixeNumber,
             "IndicatifShop": $scope.data.IndicatifShop.replace('+', ''),
             "fixeNumberShop": $scope.data.fixeNumberShop,
             "contactemail": $scope.data.contactemail,
             "website": $scope.data.website,
             // "emailpro": $scope.data.emailpro,
             "codemail": $stateParams.code,
             "password": crypt.sha256($scope.data.password),
             "confirmpassword": crypt.sha256($scope.data.confirmpassword),
             "lang": $translate.use(),
             "code" : crypt.sha256($scope.data.code),
             "confirmcode" : crypt.sha256($scope.data.confirmcode)

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

                    $state.go('signuppro-address');
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
                "task": "SHOP_InscriptionHqAddress",
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
                    $state.go('pro-signup-step2');
                }
            })   
        }
    };

    $scope.$on('place_changed', function (e, place, model) { 

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
                "task": "SHOP_InscriptionSendSMS",
                "indicatif": $scope.data.Indicatif.replace('+', ''),
                "mobilephone": $scope.data.mobileNumber
            };

            Go.post(postData).then(function(data) {
                Alert.loader(false);
                if (data.success == 1) {
                    User.Deconnect.mobile1 = data.mobileNumber;
                    User.Deconnect.Indicatif = data.Indicatif;
                    $state.go('pro-signup-step3');
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
                Alert.loader(true);
                var postData = {
                    "task": "SHOP_InscriptionSendAnswers",
                    "codesms": $scope.data.codeSMS,
                    "question1": $scope.data.idquestion1,
                    "question2": $scope.data.idquestion2,
                    "question3": $scope.data.idquestion3,
                    "answer1": crypt.sha256($scope.data.answer1.toLowerCase()),
                    "answer2": crypt.sha256($scope.data.answer2.toLowerCase()),
                    "answer3": crypt.sha256($scope.data.answer3.toLowerCase()),
                    "lat": pos.lat,
                    "long": pos.lng
                };
                Go.post(postData).then(function(data) {
                    Alert.loader(false);
                    if (data.success == 1) {
                        //AuthService.storeUserCredentials(data.userToken);
                        User.SetDetails(data.UserDetails);
                        User.IsNew = true;
                        
                        congratulation_msg = $filter('translate')('success_sign_up.congratulation');
                        Alert.Congratulation('signin', $filter('translate')('success_sign_up.go_to_sign_in'), congratulation_msg);
                    } else {
                        Alert.error(data.message);
                    }
                });
            });
        }
    };

    $scope.$watch('data.mobileNumber', function() {
        $scope.data.mobileNumber = Phone.watch($scope.data.mobileNumber);
    });
    $scope.$watch('data.fixeNumber', function() {
        $scope.data.fixeNumber = Phone.watch($scope.data.fixeNumber);
    });
    $scope.$watch('data.fixeNumberShop', function() {
        $scope.data.fixeNumberShop = Phone.watch($scope.data.fixeNumberShop);
    });
    $scope.$watch('data.website', function() {
        if(typeof $scope.data.website !== 'undefined'){
            $scope.data.website = ($scope.data.website).toLowerCase();
        }
    });




    



    $ionicModal.fromTemplateUrl('pro-CGV.html', {
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

.controller('SettingsProCtrl', function($scope,$cordovaBadge, $sce, $ionicModal, $ionicScrollDelegate, Geo, AuthService, DATA, $storage, $translate, User, $rootScope, $interval, Go, pickerView, SharedService, crypt, $state, Alert, $cordovaTouchID, AuthService,$location, $ionicHistory, $filter) {
    $scope.data = {}; 
    $scope.dataCP = {}
    $scope.$on('$ionicView.beforeEnter', function() {  
        $scope.RefreshSettings() 
    });

    $scope.$on('$ionicView.afterEnter', function() { 
        if( $rootScope.GetlistSettings ) {
            $rootScope.GetlistSettings();
        }  
    });

    $scope.RefreshSettings = function () {
        $scope.Appinfo = DATA; 
        
        var UserDetails = User.GetDetails(); 
         
        $scope.listSettings = UserDetails.listSettings;
        $scope.data.answer1 = '';
        $scope.data.answer2 = '';
        $scope.data.answer3 = '';
        $scope.dataCP.smscode = '';
        $scope.dataCP.current = '';
        $scope.dataCP.newpassword  = '';
        $scope.dataCP.confirmpassword = ''; 

        $scope.selectedLang = $translate.use();
        $rootScope.langs = JSON.parse( window.localStorage.getItem('langs') )

        setTimeout(function () {
            $scope.$apply(function () { 
                $scope.connectedUsers = $storage.getArrayOfObjects("connectedUsers");  
                $scope.userInfos = UserDetails.userInfos; 
            })
        })

        $scope.treezorid = parseInt(UserDetails.logsPhoto.treezorid.confirmed); 

        $scope.UserDetails = User.GetDetails();
        $scope.listSettings = $scope.UserDetails.listSettings;
        $scope.loader = Alert.loader(false);
 
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
    $scope.cgvpage= 1;
    
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
                }else{ 
                    $scope.canLoadMore = false; 
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


    $scope.$on('$ionicView.enter', function() {
        
    });
 


    $scope.progressval = 0;
    $scope.stopinterval = null;

    function startprogress() {

        //console.log('Pro ---> PROGRESSSSSSSSSSSSSSSSSSsssssssssssssssssssssssssssSSSsssSSSsssSSSsssSSSSSS');
        $scope.progressval = 0;
        if ($scope.stopinterval) {
            $interval.cancel($scope.stopinterval);
        }

        $scope.UserDetails = User.GetDetails();
        $scope.userInfos = $scope.UserDetails.userInfos; 

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
        startprogress(); 
        $scope.RefreshSettings()
    });




    $scope.$on('$ionicView.beforeEnter', function() {  
        $scope.dataCP = {};
    });
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
                "answer1": crypt.sha256($scope.data.answer1.toLowerCase()),
                "answer2": crypt.sha256($scope.data.answer2.toLowerCase()),
                "answer3": crypt.sha256($scope.data.answer3.toLowerCase())
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
        }else if(SamsungPass){
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

.controller('UpdateCompanyInfoCtrl', function($scope, $filter,$state, Alert, User, SharedService, Go, $rootScope, $timeout, crypt, $filter,$translate, DATA) {


    
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

    $scope.assoccommission = (DATA.paramAppli) ? DATA.paramAppli.assoccommission : 0.2;

    // ****************************************************************************************
    //////////////////////////////// commision Assoc  ///////////////////////////////////////
    $scope.commision = ["0.2","0.3","0.4","0.5","0.6","0.7","0.8","0.9","1"];   
    $scope.commisionSettings = {   
        theme: 'ios',
        highlight: false,
        onInit: function (event, inst) { 
            setTimeout(function () {
                inst.refresh()
                var labels = comissionAssoc.parentNode.querySelectorAll('.mbsc-progress-step-label'); 
                for (var i = 0; i < labels.length; ++i) { 
                    labels[i].innerHTML = $scope.commision[i]; 
                }
            })
           
        }
    };
    // ****************************************************************************************

    $scope.$on('$ionicView.beforeEnter', function() {
        $scope.data = {};
        $scope.UserDetails = User.GetDetails();   
        console.log("user",$scope.UserDetails.user) 
        $scope.data = $scope.UserDetails.user; 

        $scope.data.nbremployeIndex = $scope.arrayNbremploye.indexOf($scope.data.nbremploye);
        $scope.data.netincomeIndex = $scope.arrayNetincome.indexOf($scope.data.netincome);
        $scope.data.annualturnoverIndex = $scope.arrayAnnualturnover.indexOf($scope.data.annualturnover);
        if( $scope.data.nbremployeIndex < 0 ) $scope.data.nbremployeIndex = 0;
        if( $scope.data.netincomeIndex < 0 ) $scope.data.netincomeIndex = 0;
        if( $scope.data.annualturnoverIndex < 0 ) $scope.data.annualturnoverIndex = 0;

        $scope.data.comissiomassoc = $scope.UserDetails.user.comissiomassoc;
        $scope.data.comissionPim = $scope.UserDetails.user.comissiompim+"%";

        $scope.listSettings = $scope.UserDetails.listSettings;
        $scope.cover = $scope.data.cover;
        $scope.logo = $scope.data.logo_medium;
        $scope.initiales = $scope.data.initiales; 
 
 
        if( parseInt($scope.UserDetails.logsPhoto.shopname.confirmed) == -1 || parseInt($scope.UserDetails.logsPhoto.shopname.confirmed) == 2 ){
            $scope.showBtns = true; 
        }else{
            $scope.showBtns = false; 
        } 
        $scope.data.visibleinfrontshop = ( parseInt($scope.data.visibleinfrontshop) == 1 ) ? true : false;
        $scope.data.commentvisible = ( parseInt($scope.data.commentvisible)  == 1 ) ? true : false; 
 
    });

    
    

    $scope.changeVisibility = function () {  
        var UserDetails2 = User.GetDetails();  
        if (parseInt($scope.data.visibleinfrontshop) != parseInt(UserDetails2.user.visibleinfrontshop) || parseInt($scope.data.commentvisible) != parseInt(UserDetails2.user.commentvisible) ) { 
            $scope.updateVisibilityShop = true;
            console.log(0)
        }
    }

     
    $scope.calendarSettings = {
        lang : $translate.use(), 
        theme: 'mobiscroll', 
        display: 'bottom',
        max:  new Date()  
    };
     
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

                "visibleinfrontshop": ($scope.data.visibleinfrontshop) ? 1 : 0,
                "commentvisible" : ($scope.data.commentvisible) ? 1 : 0,
                "shopname": $scope.data.shopname,
                "createdat": new Date($scope.data.FormatedBirthdate.setHours(12,0,0,0)), 
                "brand": $scope.data.brand,

                "registrationnum": $scope.data.registrationnum,
                "nbremploye": $scope.arrayNbremploye[ $scope.data.nbremployeIndex ],
                "netincome": $scope.arrayNetincome[ $scope.data.netincomeIndex ],
                "annualturnover": $scope.arrayAnnualturnover[ $scope.data.annualturnoverIndex ],

                "siteweb": $scope.data.siteweb,
                "desc": $scope.data.desc,
                "sharecapital": $scope.data.sharecapital,
                "comissiomassoc": $scope.data.comissiomassoc
            };
            
            Go.post(postData).then(function(data) { 
                if(data.success == 1){
                       
 
                    congratulation_msg = $filter('translate')('company_informations.success_update');

                    if( parseInt( data.log ) > 0 ){ 
                        Alert.Congratulation('tab.ValidateDocument', $filter('translate')('global_fields.close'), congratulation_msg);  
                        $rootScope.validateData.logsPhoto = {
                            comment: "",
                            confirmed: -1,
                            doc: "",
                            photolibelle:""
                        } 
                        $rootScope.validateData.userlog = data.log;
                    }else{
                        swal({ 
                            type: 'success',
                            showCancelButton: false,
                            showConfirmButton: false,
                            timer: 2000
                        })
                    }   
                     
                    $rootScope.updateTouchIDList();
                    $rootScope.updateConnectedUser();
                } 
            });


        }
    };
    $scope.isEnter = false;
    $scope.requiredItemChanged = false;
    $scope.updateVisibilityShop = false;
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
                        if ($scope.data.comissiomassoc != UserDetails2.user.comissiompim) {
                            $scope.validation = true;
                            $scope.requiredItemChanged = true;
                            console.log(10)
                        } 

                        

                    }else{
                        $scope.isEnter = true;
                    }


                }, true);

                

             

        }
    });
})



.controller('ChangePhonemobileCtrl', function($scope, $rootScope, User, Alert, Phone,SharedService, Go, $state, $window, $filter, $stateParams) {
    $scope.data = {};
    $scope.title = $filter('translate')('mobile_phone.title_page');
    $scope.text =  $filter('translate')('mobile_phone.text');
    $scope.data.Indicatif ='+33';
    $scope.$on('$ionicView.afterEnter', function(e) {
        $scope.data = {};
        var UserDetails = User.GetDetails();
        $scope.data.phone = UserDetails.user.mobile ;
        $scope.data.Indicatif = UserDetails.user.mIndicatif ;
         
    });

    $scope.Update = function() {  
        var validationList = [{
            type: 'phone',
            value: $scope.data.phone
        }];
        if (SharedService.Validation(validationList, false)) {
            var postData = {
                "task": "SHOP_SettingsChangemobile",
                "confirmephone": $scope.data.phone,
                "phone": $scope.data.phone,
                "indicatif": $scope.data.Indicatif.replace('+', '')
            };
            Alert.loader(true);
            Go.post(postData).then(function(data) {
                if (data.success == 1) {
                    $window.localStorage['indicatif'] = $scope.data.Indicatif;
                    $window.localStorage['phone'] = $scope.data.phone;
                    $state.go('tab.SmsCodePro',{
                        indicatif: $scope.data.Indicatif,
                        phone: $scope.data.phone
                    });
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
            var postData = {
                "task": "SHOP_ValidatSms",
                "action": 'ChangePhone', // Changepassword, UserSuspended, ChangePhone
                "codesms": $scope.data.smscode
            };
            Alert.loader(true);
            Go.post(postData).then(function(req) {
                if (req.success == 1) {
                    var UserDetails = User.GetDetails();
                    $scope.data = UserDetails.user;
                    $scope.data.smscode = '';
                    $scope.data.mIndicatif = $window.localStorage['indicatif'];
                    $scope.data.mobile = $window.localStorage['phone'];
                    
                    Alert.success( $filter('translate')('mobile_phone.success_update') + ' : (' + $stateParams.indicatif + ') ' + $stateParams.phone );

                    User.UpdateDataPro($scope.data, 'phone');
                    setTimeout(function () {
                        $rootScope.GotoSettings();
                    },1500)
                }
            });
        }
    };
})

.controller('ChangePhoneshopCtrl', function($scope, User, Alert, Phone,SharedService, Go, $state, $filter) {
    $scope.data = {};
    $scope.title = $filter('translate')('shop_phone.title_page');
    $scope.text = $filter('translate')('shop_phone.text');
    $scope.data.Indicatif ='+33';
    $scope.$on('$ionicView.afterEnter', function(e) {
        $scope.data = {};
        var UserDetails = User.GetDetails();
        $scope.data.phone = UserDetails.user.shopphone ;
        $scope.data.Indicatif = UserDetails.user.shopIndicatif ;
        // $scope.data.Indicatif ='+33';
        // $scope.data.phone = "";
    });
    $scope.Update = function() {
        //console.log('phone',$scope.data.phone,$scope.data.Indicatif)
 
        var validationList = [{
            type: 'phone',
            value: $scope.data.phone
        }];
        if (SharedService.Validation(validationList, false)) {
            var postData = {
                "task": "SHOP_SettingsChangephone",
                "phone": $scope.data.phone,
                "indicatif": $scope.data.Indicatif.replace('+', '')
            };
            Alert.loader(true);
            Go.post(postData).then(function(data) {
                if (data.success == 1) {
                    var UserDetails = User.GetDetails();
                    $scope.scopeData = UserDetails.user;
                    $scope.scopeData.shopIndicatif = $scope.data.Indicatif;
                    $scope.scopeData.shopphone = $scope.data.phone;
                    User.UpdateDataPro($scope.scopeData, 'phoneShop');
                        
                    Alert.success( $filter('translate')('shop_phone.success_update') + ' : (' + $scope.scopeData.shopIndicatif + ') ' + $scope.scopeData.shopphone );
                     
                }
            });
        }
    };
    $scope.$watch('data.phone', function() {
        $scope.data.phone = Phone.watch($scope.data.phone);
    });    
})

.controller('ChangePhonehqCtrl', function($scope, User, Alert, Phone,SharedService, Go, $state, $filter){
    $scope.data = {};
    $scope.title = $filter('translate')('headquarter_phone.title_page');
    $scope.text = $filter('translate')('headquarter_phone.text');
    $scope.data.Indicatif ='+33';
    $scope.$on('$ionicView.afterEnter', function(e) {
        $scope.data = {};
        var UserDetails = User.GetDetails();
        $scope.data.phone = UserDetails.user.hqphone ;
        $scope.data.Indicatif = UserDetails.user.hqIndicatif ;
        // $scope.data.Indicatif ='+33';
        // $scope.data.phone = "";
    });

    $scope.Update = function() {
        //console.log('phone',$scope.data.phone,$scope.data.Indicatif)

        
        var validationList = [{
            type: 'phone',
            value: $scope.data.phone
        }];
        if (SharedService.Validation(validationList, false)) {
            //console.log('dfgdfg')
            var postData = {
                "task": "SHOP_SettingsChangehqphone",
                "confirmephone": $scope.data.phone,
                "phone": $scope.data.phone,
                "indicatif": $scope.data.Indicatif.replace('+', '')
            };
            Alert.loader(true);
            Go.post(postData).then(function(data) {
                if (data.success == 1) {
                    var UserDetails = User.GetDetails();
                    $scope.scopeData = UserDetails.user;
                    $scope.scopeData.hqIndicatif = $scope.data.Indicatif;
                    $scope.scopeData.hqphone = $scope.data.phone;
                    User.UpdateDataPro($scope.scopeData, 'phoneHQ');
                        
                    Alert.success($filter('translate')('headquarter_phone.sccess_update')+' : (' + $scope.scopeData.hqIndicatif + ') ' + $scope.scopeData.hqphone );
                    // $state.go('tab.settingsPro', {}, {
                    //     reload: true
                    // });
                }
            });
        }
    };
    $scope.$watch('data.phone', function() {
        $scope.data.phone = Phone.watch($scope.data.phone);
    });
})



.controller('ChangeCompanyEmailCtrl', function($scope, Alert, User, SharedService, Go, $state, $filter) {
    $scope.title = $filter('translate')('company_email.title_page');
    var UserDetails = User.GetDetails();
    $scope.User = UserDetails.user;
    $scope.data = {};
    $scope.data.newMail = UserDetails.user.newmail;
    $scope.isWaitingValidationEmail = (UserDetails.user.newmail != UserDetails.user.mail) ? true : false;

    
    $scope.Update = function() { 
        //console.log("$scope.Email",$scope.data.Email,$scope.data.ConfirmEmail)
        var validationList = [{
            type: 'email',
            value: $scope.data.Email
        }, {
            type: 'confirmemail',
            value: $scope.data.ConfirmEmail
        }];
        if (SharedService.Validation(validationList)) {
            var postData = {
                "task": "SHOP_SettingsChangemail",
                "email": $scope.data.Email,
                "confirmemail": $scope.data.ConfirmEmail
            };
            Alert.loader(true);
            Go.post(postData).then(function(data) {
                if (data.success == 1) {
                    
                    Alert.success( $filter('translate')('company_email.success_update') )

                    UserDetails = User.GetDetails();  
                    UserDetails.user.newmail = $scope.data.Email;
                    User.SetDetails( UserDetails );
                    UserDetails = User.GetDetails();   

                    $scope.data.newMail = UserDetails.user.newmail;
                    $scope.isWaitingValidationEmail = true;
                }
            });

        }
    };




 $scope.ResendEmailValidation = function() { 
        var postData = {
            "task": "resendvalidationmail",
            "field": "shopmail"
        };
        Go.post(postData).then(function(data) { 
            
            if(data.success == 1){
                Alert.success( $filter('translate')('change_email.resend_success') )
            }  
        });
    };

    $scope.CancelChangeEmail = function() { 
        var postData = {
            "task": "annulupdatemail",
            "field": "shopmail"
        };
        Go.post(postData).then(function(data) { 
            
            if(data.success == 1){ 

                var UserDetails = User.GetDetails();  
                UserDetails.user.newmail = UserDetails.user.mail; 
                User.SetDetails( UserDetails ); 
                $scope.isWaitingValidationEmail = false;
            }  
        });
    };
}) 

.controller('ChangeContactEmailCtrl', function($scope, Alert, User, SharedService, Go, $state, $filter){
    $scope.title = $filter('translate')('change_contact_email.title_page');
    $scope.contactMail = true;
    var UserDetails = User.GetDetails();
    $scope.User = UserDetails.user;
    $scope.data = {};
    $scope.data.visible = $scope.User.contactmailvisible;
    $scope.data.newMail = UserDetails.user.newcontactmail;

    ///// email Waiting validation
    $scope.isWaitingValidationEmail = (UserDetails.user.newcontactmail != UserDetails.user.contactmail) ? true : false;

    $scope.Update = function() {

         
        var validationList = [{
            type: 'email',
            value: $scope.data.Email
        }, {
            type: 'confirmemail',
            value: $scope.data.ConfirmEmail
        }];
        if (SharedService.Validation(validationList)) {
            
            var postData = {
                "task": "SHOP_SettingsChangeContactmail",
                "email": $scope.data.Email,
                "confirmemail": $scope.data.ConfirmEmail,
                "visible":$scope.data.visible
            };
            Alert.loader(true);
            Go.post(postData).then(function(data) {
                if (data.success == 1) {
                    Alert.success( $filter('translate')('change_contact_email.success_update') ) 

                    UserDetails = User.GetDetails();  
                    UserDetails.user.newcontactmail = $scope.data.Email;
                    User.SetDetails( UserDetails );
                    UserDetails = User.GetDetails();   

                    $scope.data.newMail = UserDetails.user.newcontactmail;
                    $scope.isWaitingValidationEmail = true;
                } 
            }) 

        }
    };

    $scope.ResendEmailValidation = function() { 
        var postData = {
            "task": "resendvalidationmail",
            "field": "shopcontactmail"
        };
        Go.post(postData).then(function(data) { 
            
            if(data.success == 1){
                Alert.success( $filter('translate')('change_email.resend_success') )
            }  
        });
    };

    $scope.CancelChangeEmail = function() { 
        var postData = {
            "task": "annulupdatemail",
            "field": "shopcontactmail"
        };
        Go.post(postData).then(function(data) { 
            
            if(data.success == 1){ 

                var UserDetails = User.GetDetails();  
                UserDetails.user.newcontactmail = UserDetails.user.contactmail; 
                User.SetDetails( UserDetails ); 
                $scope.isWaitingValidationEmail = false;
            }  
        });
    };
})


.controller('ShopAddressCtrl', function($scope,Alert, GooglePlaces, $rootScope, Geo, User, SharedService, Go, crypt, $state, $timeout, $filter) {
    $scope.title = $filter('translate')('shop_address.title_page');
    $scope.TextButtonValidate = $filter('translate')('shop_address.upload_your_lease_or_deed');

    $scope.data = {};
    $scope.$on('$ionicView.enter', function(e) { 

        $scope.showMap = false;
        $scope.validation = true;
        
        var UserDetails = User.GetDetails();



        ////////////////////////////////////////////////////////  desable Form edit  ///////////////////////////////////////////////////////////
        var validationTreezor = UserDetails.logsPhoto.treezorid.confirmed;
        if( 
            parseInt(UserDetails.logsPhoto.shopaddressid.confirmed) == -1 ||
            (parseInt(UserDetails.logsPhoto.shopaddressid.confirmed) ==  1 && parseInt(validationTreezor) == 1 ) ||
            parseInt(UserDetails.logsPhoto.shopaddressid.confirmed) ==  2
          ){
            $scope.showBtns = true; 
        }else{
            $scope.showBtns = false; 
        }
        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


        
        if (UserDetails != false) {
            $scope.data = UserDetails.user;
            $scope.data.fullAddress = UserDetails.user.shopfullAddress;
            $scope.data.line1 = UserDetails.user.shopline1;
            $scope.data.line2 = UserDetails.user.shopline2;
            $scope.data.city = UserDetails.user.shopcity;
            $scope.data.zip = UserDetails.user.shopzip;
            $scope.data.country = UserDetails.user.shopcountry;

            if ($scope.data.line1 == null && $scope.data.line2 == null && $scope.data.city == null && $scope.data.zip == null && $scope.data.country == null){
               //console.log('first is not valide 1')
                $scope.validation = true;
            }else{
                $scope.validation = false; 
            }

             
            


            $rootScope.validateData.Message = $filter('translate')('shop_address.validate_your_address_by_taking_a_real_picture_of_your_documents');
            $rootScope.validateData.userlog = UserDetails.logs.shopaddressid;
            $rootScope.validateData.logsPhoto = UserDetails.logsPhoto.shopaddressid;
            $rootScope.validateData.id = 1;
            $rootScope.validateData.N1 = 'logsPhoto';
            $rootScope.validateData.N2 = 'shopaddressid';
            $scope.validate = true;

            console.log('UserDetails.user.logconfirmed_shopaddress',UserDetails.logsPhoto.shopaddressid)

            $scope.commentAdmin = UserDetails.logsPhoto.shopaddressid.comment;

            switch (parseInt(UserDetails.logsPhoto.shopaddressid.confirmed)) {
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
                    $scope.ValidateMSG = "<span class='DocumentInValid'><i style='font-size:35px;' class='icon ion-alert-circled'></i> <br>"+ $filter('translate')('shop_address.in_compliance_with_the_regulatory_requirements_in_your_country__') +"</span>";
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
            var addressInfo = UserDetails2.listSettings.shop[2];
            // if (UserDetails2.user.logconfirmed_address != -1) {
            //     $scope.validation = false;
            // } 
            if ($scope.data.fullAddress != UserDetails2.user.shopfullAddress) {
                $scope.validation = true;
            }
            if ($scope.data.line1 != UserDetails2.user.shopline1) {
                $scope.validation = true;
            }
            if ($scope.data.line2 != UserDetails2.user.shopline2) {
                $scope.validation = true;
            }
            if ($scope.data.city != UserDetails2.user.shopcity) {
                $scope.validation = true;
            }
            if ($scope.data.zip != UserDetails2.user.shopzip) {
                $scope.validation = true;
            }
            if ($scope.data.country != UserDetails2.user.shopcountry) {
                $scope.validation = true;
            }
            if ($scope.data.line1 == null && $scope.data.line2 == null && $scope.data.city == null && $scope.data.zip == null && $scope.data.country == null){
               //console.log('first is not valide 2')
                $scope.validation = true;
            }
            if ($scope.data.line1 == '' && $scope.data.line2 == '' && $scope.data.city == '' && $scope.data.zip == '' && $scope.data.country == ''){
               //console.log('first is not valide 5')
                $scope.validation = true;
            }

        }, true);

    // }, 1000);
    });
    $scope.openMap = function() {
        $scope.showMap = true;
    };
    $scope.getpos = function(event) {
        $scope.latlng = [event.latLng.lat(), event.latLng.lng()];
    };

    $scope.center = [User.lat, User.lng];
    $scope.latlng = [User.lat, User.lng];

    $scope.setMyPositionToMap = function() {
        Geo.getPosition().then(function(data) {
            $scope.latlng = [data.lat, data.lng];
            $scope.center = [data.lat, data.lng];
        });
    };
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
              
            var postData = {
                "task": "SHOP_SettingsChangeaddress",
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
            Alert.loader(true);
            Go.post(postData).then(function(data) {

                if(data.success == 1){

                    if( parseInt( data.logid ) ){  
                             
                            $rootScope.validateData.logsPhoto ={
                                comment: "",
                                confirmed: -1,
                                doc: "",
                                photolibelle:""
                            }   
                            $rootScope.validateData.userlog = data.logid; 
                        
                        Alert.Congratulation('tab.ValidateDocument', $filter('translate')('global_fields.close'), $filter('translate')('shop_address.success_update'));
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
            $scope.data.lng = data.lng
            
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

.controller('HqAddressCtrl', function($scope,Alert,GooglePlaces, $rootScope, Geo, User, SharedService, Go, crypt, $state, $timeout, $filter) {
    $scope.title = $filter('translate')('headquarter_address.title_page');
    $scope.TextButtonValidate = $filter('translate')('headquarter_address.upload_your_lease_or_deed');

    $scope.data = {};
    $scope.$on('$ionicView.enter', function(e) {
        ///////////////////////////// auto comlete address /////////////////////////////
            
        ///////////////////////////////////////////////////////////////////////////////////
        $scope.showMap = false;
        $scope.validation = true;
        
        var UserDetails = User.GetDetails();


        ////////////////////////////////////////////////////////  desable Form edit  ///////////////////////////////////////////////////////////
        var validationTreezor = UserDetails.logsPhoto.treezorid.confirmed;
        if( 
            parseInt(UserDetails.logsPhoto.shophqaddressid.confirmed) == -1 ||
            (parseInt(UserDetails.logsPhoto.shophqaddressid.confirmed) ==  1 && parseInt(validationTreezor) == 1 ) ||
            parseInt(UserDetails.logsPhoto.shophqaddressid.confirmed) ==  2
          ){
            $scope.showBtns = true; 
        }else{
            $scope.showBtns = false; 
        }
        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
         

        if (UserDetails != false) {

            

            $scope.data = UserDetails.user;
            $scope.data.fullAddress = UserDetails.user.hqfullAddress;
            $scope.data.line1 = UserDetails.user.hqline1;
            $scope.data.line2 = UserDetails.user.hqline2;
            $scope.data.city = UserDetails.user.hqcity;
            $scope.data.zip = UserDetails.user.hqzip;
            $scope.data.country = UserDetails.user.hqcountry; 

            $rootScope.validateData.Message = $filter('translate')('headquarter_address.validate_your_address_by_taking_a_real_picture_of_your_documents');
            $rootScope.validateData.userlog = UserDetails.logs.shophqaddressid;
            $rootScope.validateData.logsPhoto = UserDetails.logsPhoto.shophqaddressid;
            $rootScope.validateData.N1 = 'logsPhoto';
            $rootScope.validateData.N2 = 'shophqaddressid';
            $rootScope.validateData.id = 2;
            $scope.validate = false;

            console.log("UserDetails.user.logconfirmed_hqaddress", UserDetails)

            $scope.commentAdmin = UserDetails.logsPhoto.shophqaddressid.comment;
             
            switch (parseInt(UserDetails.logsPhoto.shophqaddressid.confirmed)) {
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
                    $scope.ValidateMSG = "<span class='DocumentInValid'><i class='icon ion-alert-circled'></i> "+ $filter('translate')('personal_informations.your_document_was_refused_please_can_you_upload') +"<em ng-if='commentAdmin'><br><hr>"+$scope.commentAdmin+"<em></span>";
                    $scope.validate = false;
                    $scope.validation = false; 
                    break; 
                case -1:    
                    $scope.ValidateMSG = "<span class='DocumentInValid'><i style='font-size:35px;' class='icon ion-alert-circled'></i> <br>"+ $filter('translate')('headquarter_address.in_compliance_with_the_regulatory_requirements_in_your_country__') +"</span>";
                    $scope.validate = true;
                    $scope.validation = false; 
                    break;
            }
            // $scope.data.country = UserDetails.user.country;
        } 
        $scope.isEnter = false;
        // $timeout(function() {


    // }, 1000);
    });
    $scope.$watch('data', function() {
 
        var UserDetails2 = User.GetDetails(); 
        var addressInfo = UserDetails2.listSettings.hq[1];
        
        // if (UserDetails2.user.logconfirmed_address != -1) {
        //     $scope.validation = false;
        // }
        if ($scope.data.fullAddress != UserDetails2.user.hqfullAddress) {
            $scope.validation = true;
        }
        if ($scope.data.line1 != UserDetails2.user.hqline1) {
            $scope.validation = true;
        } 
        if ($scope.data.line2 != UserDetails2.user.hqline2) {
            $scope.validation = true;
        }
        if ($scope.data.city != UserDetails2.user.hqcity) {
            $scope.validation = true;
        }
        if ($scope.data.zip != UserDetails2.user.hqzip) {
            $scope.validation = true;
        }
        if ($scope.data.country != UserDetails2.user.hqcountry) {
            $scope.validation = true;
        }
        if ($scope.data.line1 == null && $scope.data.line2 == null && $scope.data.city == null && $scope.data.zip == null && $scope.data.country == null){
           //console.log('first is not valide 4')
            $scope.validation = true;
        }
        if ($scope.data.line1 == '' && $scope.data.line2 == '' && $scope.data.city == '' && $scope.data.zip == '' && $scope.data.country == ''){
           //console.log('first is not valide 5')
            $scope.validation = true;
        }
    }, true);
    $scope.openMap = function() {
        $scope.showMap = true;
    };
    $scope.getpos = function(event) {
        $scope.latlng = [event.latLng.lat(), event.latLng.lng()];
    };

    $scope.center = [User.lat, User.lng];
    $scope.latlng = [User.lat, User.lng];

    $scope.setMyPositionToMap = function() {
        Geo.getPosition().then(function(data) {
            $scope.latlng = [data.lat, data.lng];
            $scope.center = [data.lat, data.lng];
        });
    };
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
            
            var postData = {
                "task": "SHOP_SettingsChangeHQaddress",
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
            Alert.loader(true);
            Go.post(postData).then(function(data) {
                if(data.success == 1){ 

                    if( parseInt( data.logid ) ){ 
                         
                        $rootScope.validateData.logsPhoto = {
                            comment: "",
                            confirmed: -1,
                            doc: "",
                            photolibelle:""
                        }

                        $rootScope.validateData.userlog = data.logid; 

                        Alert.Congratulation('tab.ValidateDocument', $filter('translate')('global_fields.close'), $filter('translate')('headquarter_address.update_success'));
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





.controller('CoverCtrl', function($scope, $ionicActionSheet, $jrCrop, $rootScope, crypt, SharedService, $location, Camera, Go, Alert, User, $ionicLoading, $ionicScrollDelegate, $filter, $translate) {
    $scope.$on('$ionicView.beforeEnter', function(e) {
        $scope.pageCover = true;
        angular.element(document.querySelector('body')).removeClass('platform-android');

        UserDetails = User.GetDetails();  
        if (UserDetails != false) { 

            var image_string = UserDetails.user.cover;
            $scope.imgURI =  UserDetails.user.cover;
            // //console.log(imagege_string,image_string.indexOf('male') !== -1 )
            // //console.log(image_string.indexOf('male') == -1 ,image_string.indexOf('female') == -1 ,image_string.indexOf('male') == -1 && image_string.indexOf('female') == -1)
            if(image_string.indexOf('male') == -1){
                $scope.showtake = false;
            }else{
                $scope.showtake = true;
            }
            //console.log('use server')
             $scope.imgURI = image_string;
        }else{
            //console.log('no image')
             // $scope.imgURI = '';
             $scope.showtake = true;
        }

        $scope.showtake = true;
 
         
    });
 
    $scope.okCorp = true;
    $scope.Title = $filter('translate')('cover_photo.title_page');
    $scope.picture = '';
    $scope.Message = $filter('translate')('cover_photo.text');
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
                // circle: true,
                width: 640,
                height: 260
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
                quality: 100            // Higher is better
            };

            Camera.getGallery(options).then(function(imageData) {
                
                Alert.loader(false);
                $jrCrop.crop({
                    url: imageData,
                    // circle: true,
                    width: 640,
                    height: 260
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
                    // circle: true,
                    width: 640,
                    height: 260
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
            cropDim: [640, 260], 
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
            setTimeout(function () {
                winInappBrowser.close();
            })
            $scope.$apply(function () { 
                $scope.imgURI = data.url;  
                $scope.isOldImage = false;
                $scope.showtake = false;
                $scope.postData = data; 
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

        $scope.postData.task = "SHOP_SettingsChangeCover";

        Go.post( $scope.postData ).then(function(data) {
            
            if(data.success == 1){
                var UserDetails = User.GetDetails();
                UserDetails.user.cover = data.picto;
                UserDetails.user.cover_small = data.picto;
                UserDetails.user.cover_medium = data.picto;
                UserDetails.user.cover_large = data.picto;
                User.SetDetails(UserDetails); 
 
                 
                Alert.Congratulation('tab.Cover', $filter('translate')('global_fields.close'), $filter('translate')('cover_photo.success_update'));
            } 

        });
    };


    $scope.removePhoto = function() {
        Alert.loader(true);  

        var postData = {
            task:"SettingsDeleteCover"
        };

        Go.post( postData ).then(function(data) { 
            if(data.success == 1){
                $scope.imgURI = "";
                $scope.uploaded = false;
                $scope.showtake = true;

                var UserDetails = User.GetDetails(); 
                UserDetails.user.cover =  "";
                UserDetails.user.cover_small = "";
                UserDetails.user.cover_medium =  "";
                UserDetails.user.cover_large =  "";
                User.SetDetails(UserDetails);

                var UserMail = window.localStorage.getItem('username_a0f55e81c44553384a9421');
                window.localStorage.setItem('cover_a0f54hdu74j553384a9421' + UserMail, ""); 
                
                $rootScope.updateTouchIDList();
            }  
        });
    };
})

.controller('LogoCtrl', function($scope,$ionicActionSheet, $jrCrop, $rootScope, crypt, SharedService, $location, Camera, Go, Alert, User, $ionicLoading, $ionicScrollDelegate, $filter, $translate) {
    
    $scope.$on('$ionicView.beforeEnter', function(e) {
        angular.element(document.querySelector('body')).removeClass('platform-android');
        var UserMail = window.localStorage.getItem('username_a0f55e81c44553384a9421');
        var imageData = window.localStorage.getItem('logo_a0f54hdu74j553384a9421' + UserMail);
        if (imageData) {
            //console.log('get image')
            $scope.imgURI = imageData;
            $scope.showtake = false;
            $scope.isOldImage = true;
        } else {
            UserDetails = User.GetDetails();
            if (UserDetails != false) {
                var image_string = UserDetails.user.logo_large;
                // //console.log(image_string,image_string.indexOf('male') !== -1 )
                // //console.log(image_string.indexOf('male') == -1 ,image_string.indexOf('female') == -1 ,image_string.indexOf('male') == -1 && image_string.indexOf('female') == -1)
                if(image_string.indexOf('male') == -1){
                    $scope.showtake = false;
                }else{
                    $scope.showtake = true;
                }
                //console.log('use server')
                 $scope.imgURI = image_string;
            }else{
                 
                 $scope.showtake = true;
            }
        }
        $scope.showtake = true;
        

    });
 
    $scope.okCorp = true;
    $scope.Title = $filter('translate')('logo_company.title_page');
    $scope.picture = '';
    $scope.Message = $filter('translate')('logo_company.text');
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
            targetWidth: 600,
            targetHeight: 600,
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
                quality: 100            // Higher is better
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
                console.log( err )
            }).finally(function(){
                Alert.loader(false);
            }); 
        }else{
            Alert.loader(true);
            var options = {
                quality: 100,
                sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY,
                destinationType: navigator.camera.DestinationType.DATA_URL,
                targetWidth: 600,
                targetHeight: 600,
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
            conversions: ['crop', 'rotate', 'filter'],  
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
            setTimeout(function () {
                winInappBrowser.close();
            })
            $scope.$apply(function () { 
                $scope.imgURI = data.url;  
                $scope.isOldImage = false;
                $scope.showtake = false;
                $scope.postData = data; 
            })  
        },function(FPError){
            console.log(FPError);
        }); 
    } 

    $scope.other = function() { 
        $scope.choseAction();
    };
 

    $scope.send = function() { 
        $scope.postData.task = "SHOP_SettingsChangeLogo"; 

        Go.post( $scope.postData ).then(function(data) {
            if(data.success == 1){
                // User.UpdatePhotoMulti(data);
                var UserDetails = User.GetDetails();
                // User.UpdateLogo(UserDetails,$scope.imgURI);
                UserDetails.user.logo = data.picto;
                UserDetails.user.logo_small = data.picto_small;
                UserDetails.user.logo_medium = data.picto_medium;
                UserDetails.user.logo_large = data.picto_large;
                User.SetDetails(UserDetails);
                
                var UserMail = window.localStorage.getItem('username_a0f55e81c44553384a9421');
                window.localStorage.setItem('logo_a0f54hdu74j553384a9421' + UserMail, $scope.imgURI);
                 
                //console.log("congratulation_msg",congratulation_msg)
                Alert.Congratulation('tab.Logo', $filter('translate')('global_fields.close'), $filter('translate')('logo_company.success_update'));

                $rootScope.updateTouchIDList(); 
                $rootScope.updateConnectedUser();
            } 
        });
    };
    $scope.removePhoto = function() {
        Alert.loader(true);  

        var postData = {
            task:"SettingsDeleteLogo"
        };

        Go.post( postData ).then(function(data) { 
            if(data.success == 1){
                $scope.imgURI = "";
                $scope.uploaded = false;
                $scope.showtake = true;

                var UserDetails = User.GetDetails(); 
                UserDetails.user.logo =  "";
                UserDetails.user.logo_small = "";
                UserDetails.user.logo_medium =  "";
                UserDetails.user.logo_large =  "";
                User.SetDetails(UserDetails);

                var UserMail = window.localStorage.getItem('username_a0f55e81c44553384a9421');
                window.localStorage.setItem('logo_a0f54hdu74j553384a9421' + UserMail, ""); 
                 
                $rootScope.updateTouchIDList(); 
                $rootScope.updateConnectedUser();
            }  
        });
    };
})



.controller('LetterOfAuthorisationCtrl', function($scope,$state,$ionicHistory, $storage,$ionicActionSheet, $jrCrop, $rootScope, crypt, SharedService, $location, Camera, Go, Alert, User, $ionicLoading, $ionicScrollDelegate, $cordovaFileOpener2, $filter, API, $translate) {
    
     

    $scope.inputVal = '';
    $scope.addUserType = null; 

    $scope.selectedTab = 'beneficiaire'

    $scope.changeTab = function (type) {
       $scope.selectedTab = type;
    }
    
     
       

    

    $scope.previewFileOnCard = function ( filename ) {
        
        if( filename != ""  ){
            var array = filename.split('.'); 
            var extFile = array[ (array.length - 1) ];

            var imagesType = ["jpg", "jpeg","gif", "png"];
            if( imagesType.indexOf( extFile ) >= 0 ){
                $scope.typeFile = "image";
            }else{
                $scope.typeFile = "doc";
            }

            if( $scope.imgURI != '' ){
                $scope.showtake = false;
                $scope.isOldImage = true;
            }else{
                $scope.showtake = true;
                $scope.isOldImage = false;
            }
        }
    }  


    $scope.DownloadPdf = function() { 

        if( ionic.Platform.isIOS() ){
            $cordovaFileOpener2.open( 
                cordova.file.applicationDirectory+'www/docs/Autorisation_de_procuration_bancaire_PIM.pdf',
                'application/pdf'
            );
        }else{ 
            window.open(API.server+"docs/Autorisation_de_procuration_bancaire_PIM.pdf", '_system');
        } 
             

    };

    $scope.data = {}
 
    $scope.$on('$ionicView.beforeEnter', function(e) {
        angular.element(document.querySelector('body')).removeClass('platform-android'); 

        UserDetails = $storage.getObject('capitalSocial')[5]; 

        $scope.imgURI = UserDetails.logsPhoto.letterauthorisation.imgs;
        $scope.confirmed = UserDetails.logsPhoto.letterauthorisation.confirmed;
        $scope.comment = UserDetails.logsPhoto.letterauthorisation.comment; 
        $scope.logid = UserDetails.logsPhoto.letterauthorisation.logid; 
 
        $scope.data = {};
        $scope.data.complementaryInformations = UserDetails.user.letterauthorisation; 
        
        if( $scope.imgURI.length > 0 ){
            $scope.previewFileOnCard( $scope.imgURI[0].photoname );
        }
        
        $scope.showtake = ($scope.imgURI.length == 0) ? true : false;

        $scope.postData = { 
                "img": $scope.imgURI,
                 "client" : -1
        } 
    });


    $scope.Title = 'Validation';
    $scope.picture = '';
    $scope.imgURI = '';
    $scope.Message = $rootScope.validateData.Message;
    $scope.showtake = true;

    $scope.choseAction = function () { 
        angular.element(document.querySelector('body')).removeClass('platform-android');
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
    $scope.takePhoto = function(options) {
        Alert.loader(true);
        var options = {
            quality: 100,
            sourceType: navigator.camera.PictureSourceType.CAMERA,
            destinationType: navigator.camera.DestinationType.DATA_URL,
            targetWidth: 500,
            targetHeight: 500,
            saveToPhotoAlbum: false
        };
        Camera.getPicture(options).then(function(imageData) {
            
            $scope.previewFileOnCard( "image.jpg" );
            Alert.loader(false); 

            $scope.imgURI =[{
                photoname: "data:image/jpeg;base64," + imageData,
                photolibelle: "",
                client : "camera"
            }]

            $scope.showtake = false;
            $scope.isOldImage = false;

            $scope.showSaveBtn = true; 
 

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
 
    $scope.choosePhoto = function(options) {
        if(ionic.Platform.isIOS()){
            var options = {
                maximumImagesCount: 1, // Max number of selected images, I'm using only one for this example
                width: 600,
                height: 600,
                quality: 80            // Higher is better
            };
            Camera.getGallery(options).then(function(imageData) {
                $scope.previewFileOnCard( "image.jpg" );
                Alert.loader(false);
                
                $scope.imgURI =[{
                    photoname: imageData,
                    photolibelle: "",
                    client : "gallery"
                }]

                $scope.showtake = false;
                $scope.isOldImage = false;

                $scope.showSaveBtn = true;

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
                saveToPhotoAlbum: false
            };
            Camera.getPicture(options).then(function(imageData) {
                $scope.previewFileOnCard( "image.jpg" );
                Alert.loader(false); 

                $scope.imgURI =[{
                    photoname: "data:image/jpeg;base64," + imageData,
                    photolibelle: "",
                    client : "gallery"
                }]
                
                $scope.showtake = false;
                $scope.isOldImage = false;

                $scope.postData = { 
                    "img": $scope.imgURI,
                    "client" : "gallery",
                    "filename": ""
                }
                $scope.showSaveBtn = true;

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
            mimetypes: ['image/*', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
            container: 'window',
            cropForce: false,
            maxFiles: 1,
            conversions: ['crop', 'rotate'],   
            customCss:'https://dev.pim.life/filestrack/style.css',
            openTo: 'GOOGLE_DRIVE',
            language: $translate.use(),
            services: [ 
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
            console.log(data)
            setTimeout(function () {
                winInappBrowser.close();
            })
            $scope.$apply(function () { 

                $scope.previewFileOnCard( data.filename );
                data.photoname = data.url;
                data.photolibelle = data.filename;
                $scope.imgURI = [data]; 
                $scope.isOldImage = false;
                $scope.showtake = false;
                $scope.postData = data; 
                $scope.showSaveBtn = true;
            })  
        },function(FPError){
            console.log(FPError);
        }); 
    }
    $scope.other = function() {
        $scope.showtake = true; 
        $scope.choseAction()
    };

    $scope.removePhoto = function() {
        //Alert.loader(true);  

        // var postData = {
        //     task:"SettingsDeleteLogo"
        // };

        // Go.post( postData ).then(function(data) { 
        //     if(data.success == 1){
        //         $scope.imgURI = "";
        //         $scope.uploaded = false;
        //         $scope.showtake = true;

        //         var UserDetails = User.GetDetails(); 
        //         UserDetails.user.logo =  "";
        //         UserDetails.user.logo_small = "";
        //         UserDetails.user.logo_medium =  "";
        //         UserDetails.user.logo_large =  "";
        //         User.SetDetails(UserDetails);

        //         var UserMail = window.localStorage.getItem('username_a0f55e81c44553384a9421');
        //         window.localStorage.setItem('logo_a0f54hdu74j553384a9421' + UserMail, ""); 
                 
        //         $rootScope.updateTouchIDList();
        //     }  
        // });
        $scope.imgURI = "";
        $scope.showtake = true; 
    };
    $scope.previewFile = function () { 
        window.open($scope.imgURI[0].photoname, '_system'); 
    }
    $scope.send = function() { 
        console.log($scope.data)
        if($scope.postData){ 
            var UserDetails = User.GetDetails(); 

            Alert.loader(true);
            Go.post({
                task : "SHOP_SettingsSaveLetterAuthoris",
                log : $scope.logid,
                complementaryInfos : $scope.data.complementaryInformations,
                imgs: JSON.stringify($scope.imgURI)
            }).then(function(data) {
                $ionicLoading.hide();
                if (data.success == 1) {
                     

                    $ionicHistory.goBack() 
                    Alert.success( $filter('translate')('letter_of_authorisation.success_sent') ); 


                }
            }, function(err) {
                $ionicLoading.hide();
                // //console.log(err);
            });
        }else{
            //Alert.error('Missing document');
            Alert.loader(false);
        }
    };
    $scope.$on('$ionicView.enter', function(e) {
        $ionicScrollDelegate.scrollTop();
    });
})
.controller('businessinformations-typeCtrl', function($scope,$rootScope, $storage, User,Catgs, pickerView, Go, SharedService, Alert,$timeout, $filter) {
    
    $scope.$on('$ionicView.beforeEnter', function(e) {
        UserDetails = User.GetDetails();
        $scope.informationBusinessType = ( UserDetails.listSettings.hq[3].text == '_slug_' ) ? $filter('translate')('setting_pro.'+UserDetails.listSettings.hq[3].slug) : UserDetails.listSettings.hq[3].text;
        $scope.data = {};
    

        var postData = {
            "task": "SHOP_getTypes"
        }; 
        Go.post(postData).then(function(data) {
            if(data.success == 1){
                //console.log("data",data.businessType)
                var selectedIndexType = 0;var i = 0 ;
                data.businessType.forEach(function(element){
                    //console.log(element)
                    if(element.id == UserDetails.listSettings.hq[3].id){
                        selectedIndexType = i;
                    }
                    i++;
                });
                 
                $scope.openPickerBusinessType = function openPickerBusinessType() { 

                    var objlist1 = [{
                        values: [data.businessType],
                        selectedIndex: selectedIndexType
                    }];
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
                                $scope.informationBusinessType = output[0].value;
                                $scope.data.idbusinessType = output[0].id;
                            }
                        });
                    }
                    
                };
            }             
        });
    });
    $scope.Update = function(){
        var validationList = [{
                type: 'idbusinessType',
                value: $scope.data.idbusinessType
            }
        ];
        if (SharedService.Validation(validationList)) {
            Alert.loader(true);
            var postData = {
                "task": "SHOP_BRtype",
                "shoptypeid": $scope.data.idbusinessType
            };
            Go.post(postData).then(function(data) {
                console.log(data)
                if (data.success == 1) {
                    UserDetails.listSettings.hq[3].id = $scope.data.idbusinessType;
                    UserDetails.listSettings.hq[3].text = $scope.informationBusinessType;
                    User.SetDetails(UserDetails);
                    console.log(UserDetails.listSettings.hq)
                     
                    Alert.Congratulation('tab.businessinformations-type', $filter('translate')('global_fields.close'), $filter('translate')('company_type.sccess_update'));
                }
            });
        }
    }
    $scope.closeView = function() {
        pickerView.close();
    };
})

.controller('ape_nafCtrl', function($scope,$rootScope, $storage, User,Catgs, pickerView, Go, SharedService, Alert,$timeout, $filter) {
    
    $scope.$on('$ionicView.beforeEnter', function(e) {
        UserDetails = User.GetDetails();
        $scope.naf = ( UserDetails.user.naf == '' ) ? $filter('translate')('setting_pro.ape_naf') : UserDetails.user.naf;
        $scope.data = {}; 

        var postData = {
            "task": "SHOP_getNAFlist"
        }; 
        Go.post(postData).then(function(data) {
            if(data.success == 1){
                //console.log("data",data.businessType)
                var selectedIndexType = 0;var i = 0 ;
                data.naf.forEach(function(element){
                    //console.log(element)
                    if(element.id == UserDetails.user.naf){
                        selectedIndexType = i;
                    }
                    i++;
                });
                 
                $scope.openPickerBusinessType = function openPickerBusinessType() { 

                    var objlist1 = [{
                        values: [data.naf],
                        selectedIndex: selectedIndexType
                    }];
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
                                $scope.naf = output[0].value;
                                $scope.data.nafid = output[0].id;
                            }
                        });
                    }
                    
                };
            }             
        });
    });
    $scope.Update = function(){
        var validationList = [{
                type: 'idbusinessType',
                value: $scope.data.nafid
            }
        ];
        if (SharedService.Validation(validationList)) {
            Alert.loader(true);
            var postData = {
                "task": "SHOP_BRnaf",
                "nafid": $scope.data.nafid
            };
            Go.post(postData).then(function(data) {
                console.log(data)
                if (data.success == 1) {
                    UserDetails.user.nafid = $scope.data.nafid;
                    UserDetails.user.naf = $scope.naf;
                    User.SetDetails(UserDetails); 
                     
                    Alert.success($filter('translate')('ape__naf.sccess_update'));
                    setTimeout(function () {
                        $rootScope.GotoSettings();
                    },1500)
                }
            });
        }
    }
    $scope.closeView = function() {
        pickerView.close();
    };
})

.controller('businessinformations-vatCtrl', function($scope,$rootScope, $storage, User,Catgs, pickerView, Go, SharedService, Alert,$timeout, $filter) {
    var UserDetails = User.GetDetails();
    $scope.$on('$ionicView.beforeEnter', function(e) {
        var UserDetails = User.GetDetails();
        $scope.data = {};
        $scope.data.registred =  UserDetails.businessInfos.vta;
    });
    
    $scope.Update = function(){ 
        Alert.loader(true);
        var postData = {
            "task": "SHOP_BRvta", 
            "vta": $scope.data.registred
        };
        Go.post(postData).then(function(data) {
            if (data.success == 1) {
                UserDetails.listSettings.hq[4].text = UserDetails.businessInfos.vta = $scope.data.registred;  
                User.SetDetails(UserDetails);
 
                Alert.Congratulation('tab.businessinformations-vat', $filter('translate')('global_fields.close'), $filter('translate')('vat_number.sccess_update'));
            }
        });
    }
}) 
.controller('businessinformations-catCtrl', function($scope,$rootScope, $storage, User,Catgs, pickerView, Go, SharedService, Alert,$timeout, $filter, $ionicModal,$ionicScrollDelegate) {
    var UserDetails;
    $scope.$on('$ionicView.beforeEnter', function(e) {
        $scope.Myloader = Alert.loader(true);
        $scope.categories = Catgs.getNestedCats(); 
        UserDetails = User.GetDetails();

        ////////// Randem color category //////////////////////////////
        angular.forEach( $scope.categories, function (cat, key) {
            $scope.categories[key].color = getRandomColor(); 
            console.log(cat)
            angular.forEach( cat.listscats, function (subcat, k) {

                $scope.categories[key].listscats[k].color = getRandomColor();
            } )
        } )
        ////////////////////////////////////////////////////////////
        
    });
    
    $scope.data = {};
    $scope.$on('$ionicView.afterEnter', function(e) { 
            $scope.data = {  
                subCategoryName: UserDetails.listSettings.shop[3].text,
                subCategoryId : UserDetails.listSettings.shop[3].id,
                categoryName : false
            };  
    }); 
    $scope.Update = function(){ 

        var validationList = [{
            type: 'idcategories',
            value: $scope.data.subCategoryId
        }];
        if (SharedService.Validation(validationList)) {
            Alert.loader(true);
            var postData = {
                "task": "SHOP_BRcat",  
                "scatid": $scope.data.subCategoryId
            };
            Go.post(postData).then(function(data) {
                var mobiscrollselectId = $(".mobiscrollselect").attr( "id" );
                if (data.success == 1) {
                    UserDetails.businessInfos.scatid = $scope.data.subCategoryId
                    UserDetails.listSettings.shop[3].text = $scope.data.categoryName+" - "+$scope.data.subCategoryName
                    UserDetails.listSettings.shop[3].id = $rootScope.subCategoryId; 
                    UserDetails.listSettings.shop[3].valid = true;

                    User.SetDetails(UserDetails);
 
                    Alert.success($filter('translate')('company_category.success_update'));

                    setTimeout(function () {
                        $rootScope.GotoSettings();
                    },1500)
                }
            });
        }
    }

    $scope.ResetCat = function () {
        angular.forEach($scope.categories, function (Cat, key) {
            angular.forEach(Cat.listscats, function (subCat, k) {
                $scope.categories[key].listscats[k].selected = false;
            })
        })
        $scope.data.subCategoryName = false; 
        $scope.SubCatFilter.hide()
    }

    $scope.selectSubCat = function (key, subCat) { 
        console.log(subCat)
        $scope.categories[$scope.selectedCat].listscats[key].selected = !$scope.categories[$scope.selectedCat].listscats[key].selected; 

         
        angular.forEach($scope.categories, function (cat, i) {
            angular.forEach(cat.listscats, function (scat, j) {
                if( subCat.scatid !=  scat.scatid ){ 
                    $scope.categories[i].listscats[j].selected = false;
                }
            })
        }) 
        
        $scope.data.subCategoryId = subCat.scatid; 
        $scope.data.subCategoryName = subCat.scatlabel; 
        
        $scope.Filter.hide()
        $scope.SubCatFilter.hide()

    }

    $scope.finishFilter = function () {
        $scope.Filter.hide()
        $scope.SubCatFilter.hide()
    }


    $scope.showCategories = function(){  
        $scope.Filter.show();
    }
    $scope.showSubCat = function (idCat, categorie) {
        
        $scope.subCategorie = categorie.listscats;
        $scope.selectedCat = idCat;
        $scope.data.categoryName = categorie.catlabel;
        setTimeout(function () {
            $ionicScrollDelegate.$getByHandle('subCat').resize(); 
        })

        $scope.SubCatFilter.show()
    }

    $ionicModal.fromTemplateUrl('templates/Connect/filters/shop-filter-cat.html', {
        scope: $scope,
        animation: 'slide-in-up',
        hideDelay:200,
        showDelay:200
    }).then(function(modal) {
        $scope.Filter = modal; 
    });

    $ionicModal.fromTemplateUrl('templates/Connect/filters/shop-filter-subCat.html', {
        scope: $scope,
        animation: 'slide-in-up', // animated zoomIn
        hideDelay:200,
        showDelay:200
    }).then(function(modal) {
        $scope.SubCatFilter = modal;  
    }); 
})

.controller('capitalSocialCtrl', function($scope,$rootScope, $storage, $state, User,Alert, Catgs, pickerView, Go, SharedService, Alert,$timeout, $filter, $ionicModal,$ionicScrollDelegate) {
    
    $scope.shareCapital = {};

    $scope.$on('$ionicView.beforeEnter', function(e) {
        $scope.ShareCapitalGetData();  
        $scope.isshop = parseInt(User.GetDetails().isPro);  
    }); 

    $scope.checkbox = {}

    $scope.ShareCapitalGetData = function () {

        ///////////////////////////////////////////////////////////////////////////////////////////
        var dataShareCapital = $storage.getObject('capitalSocial'); 

        if( !$.isEmptyObject( dataShareCapital ) ){
            $scope.shareCapital.signataire = dataShareCapital[4] || false;
            $scope.shareCapital.representant = dataShareCapital[5] || false;
            $scope.shareCapital.beneficiary = dataShareCapital[6].beneficiary;
            $scope.shareCapital.other = dataShareCapital[6].other; 
            $scope.checkbox.signataire_is_rep = ( $scope.shareCapital.representant == false ) ? true : false ;
        } 

        ///////////////////////////////////////////////////////////////////////////////////////////

        var postData = {
            "task": "ShareCapitalGetData"
        };
        Alert.loader(true)
        Go.post(postData).then(function(data) {
            if( data.success == 1 ){
                $storage.setObject('capitalSocial', data.shareCapital);
                $scope.shareCapital.signataire = data.shareCapital[4] || false;
                $scope.shareCapital.representant = data.shareCapital[5] || false;
                $scope.shareCapital.beneficiary = data.shareCapital[6].beneficiary;
                $scope.shareCapital.other = data.shareCapital[6].other; 
                $scope.checkbox.signataire_is_rep = ( $scope.shareCapital.representant == false ) ? true : false ;
 
            }
        });
    }

    $rootScope.$on("GetShareCapitalData", function() {
        $scope.ShareCapitalGetData()
    });

    $scope.ChangeOptionSignataireIsRep = function (state) {

        if( state == true && $scope.shareCapital.representant ){


            Alert.ask( $filter('translate')('letter_of_authorisation.delete_representant') ).then(function() {
                console.log("Deleted");
                Go.post({
                    task: 'ShareCapitalDeleteSignataire',
                    isshop: 5,   
                }).then(function(data) {
                    if(data.success == 1){
                        $scope.shareCapital.representant = false;
                        $scope.ShareCapitalGetData()
                    }
                })
            }, function () {
                $scope.checkbox.signataire_is_rep = false;
            })
        }
        return false;
    }
 

    $scope.addUser = function ( type ) { 
        $state.go('tab.AddUserForshopPersonalInfos');
        $rootScope.AddUserForshopType = type;
    }

    $scope.removeUser = function ( type, idAssocier ) { 
        switch ( type ){
            case 'signataire':
                    Alert.ask( $filter('translate')('letter_of_authorisation.delete_signataire') ).then(function() {
                        Go.post({
                            task: 'ShareCapitalDeleteSignataire',
                            isshop: 4,  
                        }).then(function(data) {
                            if(data.success == 1){
                                $scope.ShareCapitalGetData()
                                $state.go('tab.capital-social')
                                Alert.success( $filter('translate')('capital_social.delete_success') )
                            }
                        }) 
                    })
                    
                break;

            case 'representant':  
                    Alert.ask( $filter('translate')('letter_of_authorisation.delete_representant') ).then(function() {
                        Go.post({
                            task: 'ShareCapitalDeleteSignataire',
                            isshop: 5,   
                        }).then(function(data) {
                            if(data.success == 1){
                                $scope.ShareCapitalGetData()
                                $state.go('tab.capital-social')
                                Alert.success( $filter('translate')('capital_social.delete_success') )
                            }
                        })
                    })
                break;

            case 'beneficiaire':
                    Alert.ask( $filter('translate')('letter_of_authorisation.delete_beneficiaire') ).then(function() { 

                        Go.post({
                            task: 'ShareCapitalDeleteAssocie',
                            associeid: idAssocier, 
                        }).then(function(data) {
                            if(data.success == 1){
                                $scope.ShareCapitalGetData();
                                $state.go('tab.capital-social')
                                Alert.success( $filter('translate')('capital_social.delete_success') )
                            }
                        })
                    }) 
                break;

            case 'actionnaire':  
                    Alert.ask( $filter('translate')('letter_of_authorisation.delete_actionnaire') ).then(function() {

                        Go.post({
                            task: 'ShareCapitalDeleteAssocie', 
                            associeid: idAssocier, 
                        }).then(function(data) {
                            if(data.success == 1){
                                $scope.ShareCapitalGetData();
                                $state.go('tab.capital-social')
                                Alert.success( $filter('translate')('capital_social.delete_success') )
                            }
                        }) 
                    })
                break;
        }
    }  
})  

.controller('AddUserForshopPersonalInfos', function($scope, Lists, pickerView, $rootScope, $state, Go, Alert, $filter, $translate, GooglePlaces, SharedService) {


    var RegionsList = [{
        values: [Lists.Countries[$translate.use()]]
    }];

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


    var now = new Date(),
        max = new Date(now.getFullYear() - 12, now.getMonth(), now.getDate());
        min = new Date(now.getFullYear() - 150, now.getMonth(), now.getDate());
       

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
    $scope.data = {}  
    $scope.$on('$ionicView.beforeEnter', function(e) {
        
        $scope.data.revenumoyen = 0;

        switch( $rootScope.AddUserForshopType ){
            case 'signataire':
                $scope.pageTitle = $filter('translate')('letter_of_authorisation.new_signataire'); 
                console.log('signataire')
                break;

            case 'representant':
                $scope.pageTitle = $filter('translate')('letter_of_authorisation.new_representative');
                console.log('representant')
                break;

            case 'beneficiare':
                $scope.pageTitle = $filter('translate')('letter_of_authorisation.new_beneficiarie');
                console.log('beneficiaire')

                break;

            case 'capitalesocial':
                $scope.pageTitle = $filter('translate')('letter_of_authorisation.ne_shareholder');
                console.log('actionnaire')
                break; 

        }
    }); 



    $scope.signup = function() {   

        Alert.loader(true);
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
        }];

        if( $rootScope.AddUserForshopType == 'beneficiare' ){
            validationList.push({
                type: 'beneficiare',
                value: $scope.data.percent
            })
        }
        if( $rootScope.AddUserForshopType == 'capitalesocial' ){
            validationList.push({
                type: 'capitalesocial',
                value: $scope.data.percent
            })
        } 
        validationList.push({
            type: 'email',
            value: $scope.data.email
        })

        if (SharedService.Validation(validationList)) {   
            
            
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
                "task": "ShareCapitalAddUserPersonalInfos",
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

                "email": $scope.data.email,
                "type": $rootScope.AddUserForshopType
            };
            if( $rootScope.AddUserForshopType == 'beneficiare' || $rootScope.AddUserForshopType == 'capitalesocial' ){
                postData.percent = $scope.data.percent
            }
            Go.post(postData).then(function(data) {
                Alert.loader(false);
                if (data.success == 1) {
                    $state.go('tab.AddUserForshopLocaladdress');    
                }
            });
        }else{
            setTimeout(function () {
               Alert.loader(false);
            },2000)
        }


    };




    $scope.$on('place_changed', function (e, place, model) { 
        var data = GooglePlaces.getInfoAddress(place);
         
        if(data.success){ 
            if( model == 'data.placebirth' ){
                $scope.data.placebirth = data.city;
                $scope.data.birthcountry = data.country;
                $scope.data.birthcountryalpha2 = data.codeCountry;
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
})
 
 
.controller('AddUserForshopLocaladdress', function($scope, $rootScope, $state, Go, Alert, $filter, $translate, GooglePlaces, SharedService) {

    $scope.data = {}
    
    $scope.$on('$ionicView.beforeEnter', function(e) { 

        switch( $rootScope.AddUserForshopType ){
            case 'signataire':
                $scope.pageTitle = $filter('translate')('letter_of_authorisation.new_signataire'); 
                console.log('signataire')
                break;

            case 'representant':
                $scope.pageTitle = $filter('translate')('letter_of_authorisation.new_representative');
                console.log('representant')
                break;

            case 'beneficiare':
                $scope.pageTitle = $filter('translate')('letter_of_authorisation.new_beneficiarie');
                console.log('beneficiaire')

                break;

            case 'capitalesocial':
                $scope.pageTitle = $filter('translate')('letter_of_authorisation.ne_shareholder');
                console.log('actionnaire')
                break; 

        }
    });


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
                    $state.go('tab.AddUserForshopPhoneNumber');
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
.controller('AddUserForshopPhoneNumber', function($scope, $rootScope, $state, Go, Alert, $filter, $translate, pickerView,Lists, SharedService) {

    $scope.data = {};
    $scope.data.Indicatif = '+33';
    $scope.data.mobileNumber = '';
    $scope.data.codeSMS = '';

    $scope.$on('$ionicView.beforeEnter', function(e) { 

        $scope.validatePhoneNumber = false;

        switch( $rootScope.AddUserForshopType ){
            case 'signataire':
                $scope.pageTitle = $filter('translate')('letter_of_authorisation.new_signataire'); 
                console.log('signataire')
                break;

            case 'representant':
                $scope.pageTitle = $filter('translate')('letter_of_authorisation.new_representative');
                console.log('representant')
                break;

            case 'beneficiare':
                $scope.pageTitle = $filter('translate')('letter_of_authorisation.new_beneficiarie');
                console.log('beneficiaire')

                break;

            case 'capitalesocial':
                $scope.pageTitle = $filter('translate')('letter_of_authorisation.ne_shareholder');
                console.log('actionnaire')
                break; 

        }
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


    $scope.enterphone = function() {
        $scope.validatePhoneNumber = false;
        $scope.data.codeSMS = ''
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
                console.log(data)
                Alert.loader(false);
                $scope.validatePhoneNumber = true;
            });
        }
    };

    $scope.validateSMS = function() { 
        var validationList = [{
            type: 'codesms',
            value: $scope.data.codeSMS
        }];
        if (SharedService.Validation(validationList)) {
            Alert.loader(true);  
            var postData = {
                "task": "InscriptionCheckCode",
                "codesms": $scope.data.codeSMS
            };
            Alert.loader(true);
            Go.post(postData).then(function(data) { 
                console.log(data)
                if (data.success == 1) { 
                    $state.go('tab.AddUserForshopValidationDocuments');  
                }
            }); 
        }
    };
})
.controller('AddUserForshopValidationDocuments', function($scope, $ionicHistory, $state,$rootScope, Go, Alert, $filter, $translate, $ionicScrollDelegate, $ionicActionSheet, User, Camera) {
    
    $scope.$on('$ionicView.beforeEnter', function(e) {
        $scope.arrayImgURIForIdentity = [];
        $scope.arrayImgURIForAddress = [];

        switch( $rootScope.AddUserForshopType ){
            case 'signataire':
                $scope.pageTitle = $filter('translate')('letter_of_authorisation.new_signataire'); 
                console.log('signataire')
                break;

            case 'representant':
                $scope.pageTitle = $filter('translate')('letter_of_authorisation.new_representative');
                console.log('representant')
                break;

            case 'beneficiare':
                $scope.pageTitle = $filter('translate')('letter_of_authorisation.new_beneficiarie');
                console.log('beneficiaire')

                break;

            case 'capitalesocial':
                $scope.pageTitle = $filter('translate')('letter_of_authorisation.ne_shareholder');
                console.log('actionnaire')
                break; 

        }
    });
    $scope.typeFileUploaded = function ( file ) {
        var filename = file.photoname;

        if( filename != "" && filename.search("data:image/") < 0 ){
            var array = filename.split('.'); 
            var extFile = array[ (array.length - 1) ];
            var imagesType = ["jpg", "jpeg","gif", "png"];

            //////***************** File Strack ******************/////
            if( file.filename ){
                var array = file.filename.split('.'); 
                extFile = array[ (array.length - 1) ];
                if( imagesType.indexOf( extFile ) >= 0  ){
                    return "image";
                }else{
                    return "doc";
                }
            }
            //////*********************************************///////
            if( imagesType.indexOf( extFile ) >= 0  ){
                return "image";
            }else{
                return "doc";
            } 
            
        }else if( filename.search("data:image/") >= 0 ){
            return "image";
        } else{
            return false;
        }
    }
    
    $scope.choseAction = function (type) { 
        $scope.typeDocumment = type;
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

    $scope.takePhoto = function(options) { 

        if(ionic.Platform.isIOS()){
            var options = { 
                destinationType: navigator.camera.DestinationType.DATA_URL,
                targetHeight: 500,
                targetWidth: 500,
                encodingType: navigator.camera.EncodingType.PNG,
                correctOrientation: false,
                quality: 100
            };
        }else{
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

        }

        Camera.getPicture(options).then(function(imageData) { 
            Alert.loader(false); 

            if( $scope.typeDocumment == 'identity' ){
                $scope.arrayImgURIForIdentity.push({
                    photoname:"data:image/jpeg;base64," + imageData,
                    photolibelle: "",
                    client : "camera"
                });
            }else{
                $scope.arrayImgURIForAddress.push({
                    photoname:"data:image/jpeg;base64," + imageData,
                    photolibelle: "",
                    client : "camera"
                });
            }
                

            setTimeout(function () {
                var width = 0;
                $(".multiphotoContinner:visible .container-addPhoto .item-photo").each(function () {
                    //console.log("test")
                    width += parseInt( $( this ).width()+10 );
                }) 
                $ionicScrollDelegate.scrollTo(width, 0, true)
            },500)

            $scope.Req_imgURI = "data:image/jpeg;base64," + imageData; 

            $scope.showSaveBtn = true;

        }, function(err) {
            Alert.loader(false);
            // //console.log(err);
        }).finally(function(){
            Alert.loader(false);
        });

        setTimeout(function () {
            window.localStorage.setItem('locked', 0)
        },1500)
    };
 
    $scope.choosePhoto = function(options) {
        if(ionic.Platform.isIOS()){
            var options = {
                maximumImagesCount: 1, // Max number of selected images, I'm using only one for this example
                width: 500,
                height: 500,
                quality: 100,            // Higher is better 
            };
            Camera.getGallery(options).then(function(imageData) {
                    console.log(imageData)
                Alert.loader(false);    
                

                if( $scope.typeDocumment == 'identity' ){ 
                    $scope.arrayImgURIForIdentity.push({
                        photoname: imageData,
                        photolibelle: "",
                        client : "gallery"
                    });
                }else{
                    $scope.arrayImgURIForAddress.push({
                        photoname: imageData,
                        photolibelle: "",
                        client : "gallery"
                    });
                }

                setTimeout(function () {
                    var width = 0;
                    $(".multiphotoContinner:visible .container-addPhoto .item-photo").each(function () {
                        //console.log("test")
                        width += parseInt( $( this ).width()+10 );
                    }) 
                    $ionicScrollDelegate.scrollTo(width, 0, true)
                },500)

                $scope.Req_imgURI = imageData; 
 
 
                $scope.showSaveBtn = true;

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
                $scope.Req_imgURI = "data:image/jpeg;base64," + imageData;
 

                if( $scope.typeDocumment == 'identity' ){ 
                    $scope.arrayImgURIForIdentity.push({
                        photoname: "data:image/jpeg;base64," + imageData,
                        photolibelle: "",
                        client : "gallery"
                    });
                }else{
                    $scope.arrayImgURIForAddress.push({
                        photoname: "data:image/jpeg;base64," + imageData,
                        photolibelle: "",
                        client : "gallery"
                    });
                }

                setTimeout(function () {
                    var width = 0;
                    $(".multiphotoContinner:visible .container-addPhoto .item-photo").each(function () {
                        //console.log("test")
                        width += parseInt( $( this ).width()+10 );
                    }) 
                    $ionicScrollDelegate.scrollTo(width, 0, true)
                },500)
                  


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
            mimetypes: ['image/*', 'application/pdf','application/msword','application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
            container: 'window',
            cropForce: false,
            maxFiles: 1, 
            conversions: ['crop', 'rotate'],   
            customCss:'https://dev.pim.life/filestrack/style.css',
            openTo: 'GOOGLE_DRIVE',
            language: $translate.use(),
            services: [ 
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
            setTimeout(function () {
                winInappBrowser.close();
            }) 
            $scope.$apply(function () {  

                data.photoname = data.url;
                data.photolibelle = data.filename;

               
                if( $scope.typeDocumment == 'identity' ){  
                    $scope.arrayImgURIForIdentity.push(data);
                }else{ 
                    $scope.arrayImgURIForAddress.push(data);
                }


                $scope.showSaveBtn = true;  

                setTimeout(function () {
                    var width = 0;
                    $(".multiphotoContinner:visible .container-addPhoto .item-photo").each(function () {
                        //console.log("test")
                        width += parseInt( $( this ).width()+10 );
                    }) 
                    $ionicScrollDelegate.scrollTo(width, 0, true)
                },500)
  
            })  
        },function(FPError){
            console.log(FPError);
        }); 
    }

    $scope.send = function() {
        // ////console.log("$scope.imgURI",$scope.imgURI)
        Alert.loader(true);  
        var postData = {
            task : "ShareCapitalAddUserSendDoc", 
            pi_doc : JSON.stringify($scope.arrayImgURIForIdentity), 
            address_doc : JSON.stringify($scope.arrayImgURIForAddress)
        }   

        Go.post(postData).then(function(data) {  

            if (data.success == 1) {   
                $ionicHistory.clearCache().then(function(){ $state.go('tab.capital-social');});
            }
        });
    };


    $scope.previewFile = function ( filname ) { 
        window.open(filname, '_system'); 
    }

    $scope.DeletePhoto = function( index, type ){
        
        if( type == 'identity' ){   
            $scope.arrayImgURIForIdentity.splice(index, 1);
        }else{ 
            $scope.arrayImgURIForAddress.splice(index, 1);
        }
        setTimeout(function () {
            $ionicScrollDelegate.resize(); 
        }) 
    } 
     
    $scope.$on('$ionicView.enter', function(e) {
        $ionicScrollDelegate.scrollTop();
    });
})

.controller('capitalSocialUpdateInfosCtrl', function($scope,$state,$rootScope, pickerView, Lists, SharedService, Go, $storage, $stateParams, Alert, $filter, $translate, $ionicScrollDelegate, $ionicActionSheet, User, Camera) {

    $scope.arrayRevenumoyen = ["0-18","19-23","24-27","28-35","36-56","57-*"]; 
    $scope.arrayRevenumoyenView = ["0-18","19-23","24-27","28-35","36-56","+57"]; 
    $scope.revenumoyenSettings = {   
        theme: 'ios',
        highlight: false,
        onInit: function (event, inst) { 
            setTimeout(function () {
                inst.refresh()
                var labels = sliderCS.parentNode.querySelectorAll('.mbsc-progress-step-label'); 
                for (var i = 0; i < labels.length; ++i) { 
                    labels[i].innerHTML = $scope.arrayRevenumoyenView[i]; 
                }
            })
           
        }
    };

    $scope.$on('$ionicView.beforeEnter', function(e) {
        $scope.capitalesocial = $storage.getObject('capitalSocial');
        
        switch( $stateParams.type ){
            case "1": 
                $scope.UserDetails = $scope.capitalesocial[4];
                $scope.isshop = 4;
                break;

            case "2": 
                $scope.UserDetails = $scope.capitalesocial[5];
                $scope.isshop = 5;
                break;

            case "3": 
                $scope.UserDetails = $scope.capitalesocial[6].beneficiary[$stateParams.index];
                $scope.isshop = 6;
                break;

            case "4": 
                $scope.UserDetails = $scope.capitalesocial[6].other[$stateParams.index];
                $scope.isshop = 6;
                break;
        }

        $scope.PersonaleData = $scope.UserDetails.user; 
        $scope.PersonaleData.revenumoyen = $scope.arrayRevenumoyen.indexOf($scope.UserDetails.user.revenumoyen);
        $scope.PersonaleData.sexe = ($scope.PersonaleData.sexe == 'Mr') ? false : true;

        console.log($scope.UserDetails)

        if( parseInt($scope.UserDetails.logsPhoto.userlname.confirmed) == -1 || parseInt($scope.UserDetails.logsPhoto.userlname.confirmed) == 2 ){
            $scope.showBtns = true; 
        }else{
            $scope.showBtns = false; 
        } 

        $rootScope.validateData = {}

        $rootScope.validateData.Message = $filter('translate')('personal_informations.validate_your_name_by_take_a_real_picture_of_your_document');
        $rootScope.validateData.userlog = $scope.UserDetails.logsPhoto.userlname.logid;
        $rootScope.validateData.id = 0;
        $rootScope.validateData.logsPhoto = $scope.UserDetails.logsPhoto.userlname;
        $rootScope.validateData.N1 = 'logsPhoto';
        $rootScope.validateData.N2 = 'userlname';



        $scope.commentAdmin = $scope.UserDetails.logsPhoto.userlname.comment;
        switch (parseInt($scope.UserDetails.logsPhoto.userlname.confirmed)) {
            case 0:  
                $scope.ValidateMSG = "<span class='DocumentInValid'><i class='icon ion-alert-circled'></i> "+ $filter('translate')('personal_informations.sorry_your_document_was_not_verified_please_wait_for_without_photo') +"</span>";
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

    });

    $scope.ChangeInfo = function () { 

        var validationList = [{
            type: 'firstname',
            value: $scope.PersonaleData.fname
        }, {
            type: 'lastname',
            value: $scope.PersonaleData.lname
        }, {
            type: 'birthdate',
            value: $scope.PersonaleData.birth,
            lang : $translate.use()
        }];
        if (SharedService.Validation(validationList)) {

            $tabDate = $scope.PersonaleData.birth.split('/')
            switch( $translate.use() ){
                case 'fr':
                    $scope.PersonaleData.FormatedBirthdate = new Date( $tabDate[2]+"/"+$tabDate[1]+"/"+$tabDate[0] );
                    break;

                case 'en':
                    $scope.PersonaleData.FormatedBirthdate = new Date( $tabDate[2]+"/"+$tabDate[0]+"/"+$tabDate[1] );
                    break;
            } 
            var postData = {
                "task": "ShareCapitalChangePersonalInfos",
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
                "isshop": $scope.isshop,
                "associeid": $scope.PersonaleData.associeid
            };

            if( $scope.isshop == '6' ){
                postData.percent = $scope.PersonaleData.percent
            }

            Alert.loader(true);
            Go.post(postData).then(function(data) { 
                if(data.success == 1){
                    $rootScope.$emit('GetShareCapitalData');
                    $scope.validation = false; 
                    if( parseInt( data.log ) > 0  ){
                        $rootScope.validateData.logsPhoto.confirmed = -1;
                        $rootScope.validateData.userlog = data.log;
                        Alert.Congratulation('tab.ValidateDocument', $filter('translate')('global_fields.close'), $filter('translate')('personal_informations.success_update'));
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
    }

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
})


.controller('capitalSocialUpdateAddressCtrl', function($scope,Alert, $stateParams, GooglePlaces, $storage, $rootScope, Geo, User, SharedService, Go, crypt, $state, $timeout, $filter) {

    var UserDetails;
    var validationTreezor;

    $scope.data = {}; 

    $scope.title = $filter('translate')('local_address.title_page');
    $scope.TextButtonValidate = $filter('translate')('local_address.upload_your_lease_or_deed');

    $scope.$on('$ionicView.beforeEnter', function() {


        $scope.capitalesocial = $storage.getObject('capitalSocial');
        
        switch( $stateParams.type ){
            case "1": 
                var UserDetails = $scope.capitalesocial[4];
                $scope.UserDetails = UserDetails;
                $scope.isshop = 4;
                break;

            case "2": 
                var UserDetails = $scope.capitalesocial[5];
                $scope.UserDetails = UserDetails;
                $scope.isshop = 5;
                break;

            case "3": 
                var UserDetails = $scope.capitalesocial[6].beneficiary[$stateParams.index];
                $scope.UserDetails = UserDetails;
                $scope.isshop = 6;
                break;

            case "4": 
                var UserDetails = $scope.capitalesocial[6].other[$stateParams.index];
                $scope.UserDetails = UserDetails;
                $scope.isshop = 6;
                break;
        } 

     
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
 
          
        if (UserDetails != false) {
            $scope.data = UserDetails.user;   

            $rootScope.validateData.Message = $filter('translate')('local_address.validate_your_address_by_taking_a_real_picture_of_your_documents____lease_contract___deed');
            $rootScope.validateData.userlog = UserDetails.logsPhoto.addressid.logid;
            $rootScope.validateData.id = 4;
            $rootScope.validateData.logsPhoto = UserDetails.logsPhoto.addressid;
            $rootScope.validateData.N1 = 'logsPhoto';
            $rootScope.validateData.N2 = 'addressid';
            
            $scope.validate = false;

            if( UserDetails.logsPhoto.addressid.comment ){
                $scope.commentAdmin = UserDetails.logsPhoto.addressid.comment;
            }

            switch (parseInt(UserDetails.logsPhoto.addressid.confirmed)) {
                case 0:  
                    $scope.ValidateMSG = "<span class='DocumentInValid'><i class='icon ion-alert-circled'></i> "+ $filter('translate')('local_address.sorry_your_document_was_not_verified_please_wait_for') +"</span>";
                    $scope.validate = false;
                    $scope.validation = true;
                    $scope.showBtns = false;
                    break;
                case 1:   
                    if( parseInt(validationTreezor) == 0 ){
                        $scope.ValidateMSG = "<span class='DocumentValid' ><i class='icon ion-android-checkmark-circle'></i> "+ $filter('translate')('personal_informations.all_your_informations_are_valid_you_can_use_pim_professionnal_account_valid') +"</span>"; 
                    }else{
                       $scope.ValidateMSG = "<span class='DocumentValid' ><i class='icon ion-android-checkmark-circle'></i> "+ $filter('translate')('personal_informations.all_your_informations_are_valid_you_can_use_pim_professionnal_account') +"</span>"; 
                    }
                    $scope.validate = true;
                    $scope.validation = true; 
                    $scope.showBtns = true;
                    break;
                case 2:  
                    $scope.ValidateMSG = "<span class='DocumentInValid'><i class='icon ion-alert-circled'></i> "+ $filter('translate')('personal_informations.your_document_was_refused_please_can_you_upload')  +"<em ng-if='commentAdmin'><br><hr>"+$scope.commentAdmin+"<em></span>";
                    $scope.validate = false;
                    $scope.validation = false;
                    $scope.showBtns = true;
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
                    $scope.showBtns = true;
                    break;
            }
            // $scope.data.country = UserDetails.user.country;
        } 
        $scope.isEnter = false;
        // $timeout(function() {
        $scope.$watch('data', function() {
 
            var UserDetails2 = $scope.UserDetails; 

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
                "task": "ShareCapitalChangeaddress",
                "fullAddress": $scope.data.fullAddress,
                "address1": $scope.data.line1,
                "address2": $scope.data.line2,
                "city": $scope.data.city,
                "zip": $scope.data.zip,
                "country": $scope.data.country,
                "countryalpha2" : $scope.data.countryalpha2,
                "lat" : $scope.data.lat,
                "lng" : $scope.data.lng,
                "isshop": $scope.isshop,
                "associeid": $scope.UserDetails.user.associeid
            };
            Go.post(postData).then(function(data) {
                if(data.success == 1){ 
                    $rootScope.$emit('GetShareCapitalData');
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

.controller('capitalSocialUpdateMailCtrl', function($scope, Alert, User, $rootScope, SharedService, Go, $state, $filter, $storage, $stateParams) {
    $scope.title = $filter('translate')('company_email.title_page');
    
    $scope.$on('$ionicView.beforeEnter', function() {


        $scope.capitalesocial = $storage.getObject('capitalSocial');
        
        switch( $stateParams.type ){
            case "1": 
                var UserDetails = $scope.capitalesocial[4]; 
                $scope.UserDetails = UserDetails;
                $scope.isshop = 4;
                break;

            case "2": 
                var UserDetails = $scope.capitalesocial[5];
                $scope.UserDetails = UserDetails; 
                $scope.isshop = 5;
                break;

            case "3": 
                var UserDetails = $scope.capitalesocial[6].beneficiary[$stateParams.index]; 
                $scope.UserDetails = UserDetails; 
                $scope.isshop = 6;
                break;

            case "4": 
                var UserDetails = $scope.capitalesocial[6].other[$stateParams.index]; 
                $scope.UserDetails = UserDetails;
                $scope.isshop = 6;
                break;
        } 

        $scope.User = UserDetails.user;
        $scope.dataCE = {};
        $scope.dataCE.newMail = UserDetails.user.newmail;
        $scope.isWaitingValidationEmail = (UserDetails.user.newmail != UserDetails.user.mail) ? true : false;
    })
    

    
    $scope.ChangeEmail = function() { 
        //console.log("$scope.Email",$scope.data.Email,$scope.data.ConfirmEmail)
        var validationList = [{
            type: 'email',
            value: $scope.dataCE.Email
        }, {
            type: 'confirmemail',
            value: $scope.dataCE.ConfirmEmail
        }];
        if (SharedService.Validation(validationList)) {
            var postData = {
                "task": "ShareCapitalChangemail",
                "email": $scope.dataCE.Email,
                "confirmemail": $scope.dataCE.ConfirmEmail,
                "isshop": $scope.isshop,
                "associeid": $scope.UserDetails.user.associeid
            };
            Alert.loader(true);
            Go.post(postData).then(function(data) {
                if (data.success == 1) {
                    $rootScope.$emit('GetShareCapitalData');
                    Alert.success( $filter('translate')('company_email.success_update') )  
                    $scope.UserDetails.user.newmail = $scope.dataCE.ConfirmEmail;
                    $scope.isWaitingValidationEmail = true;
                }
            });

        }
    };




 $scope.ResendEmailValidation = function() { 
        var postData = {
            "task": "ShareCapitalResendvalidationmail", 
            "isshop": $scope.isshop,
            "associeid": $scope.UserDetails.user.associeid
        };
        Go.post(postData).then(function(data) { 
            
            if(data.success == 1){ 
                Alert.success( $filter('translate')('change_email.resend_success') )
            }  
        });
    };

    $scope.CancelChangeEmail = function() { 
        var postData = {
            "task": "ShareCapitalAnnulupdatemail",
            "isshop": $scope.isshop,
            "associeid": $scope.UserDetails.user.associeid
        };
        Go.post(postData).then(function(data) { 
            
            if(data.success == 1){ 

                $rootScope.$emit('GetShareCapitalData');
                $scope.isWaitingValidationEmail = false;
            }  
        });
    };
}) 


.controller('capitalSocialUpdatePhoneCtrl', function($scope, $ionicHistory, Alert, User, $rootScope, Lists, pickerView, SharedService, $storage, Go, $state, $filter, $storage, $stateParams) {
    $scope.pageTitle = $filter('translate')('change_phone_number.title_page');
    $scope.data = {};
    $scope.data.Indicatif ='+33';
    $scope.validatePhoneNumber = false;
    $scope.$on('$ionicView.afterEnter', function(e) {
        $scope.data = {};
        
        $scope.capitalesocial = $storage.getObject('capitalSocial');
        
        switch( $stateParams.type ){
            case "1": 
                var UserDetails = $scope.capitalesocial[4]; 
                $scope.UserDetails = UserDetails;
                $scope.isshop = 4;
                break;

            case "2": 
                var UserDetails = $scope.capitalesocial[5];
                $scope.UserDetails = UserDetails; 
                $scope.isshop = 5;
                break;

            case "3": 
                var UserDetails = $scope.capitalesocial[6].beneficiary[$stateParams.index]; 
                $scope.UserDetails = UserDetails; 
                $scope.isshop = 6;
                break;

            case "4": 
                var UserDetails = $scope.capitalesocial[6].other[$stateParams.index]; 
                $scope.UserDetails = UserDetails;
                $scope.isshop = 6;
                break;
        } 

        $scope.data.mobileNumber = UserDetails.user.mobile ;
        $scope.data.Indicatif = UserDetails.user.Indicatif ;
         
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

    $scope.enterphone = function() {  
        var validationList = [{
            type: 'phone',
            value: $scope.data.mobileNumber
        }];
        if (SharedService.Validation(validationList, false)) {
            var postData = {
                "task": "ShareCapitalChangephone", 
                "phone": $scope.data.mobileNumber,
                "indicatif": $scope.data.Indicatif.replace('+', ''),
                "isshop": $scope.isshop,
                "associeid": $scope.UserDetails.user.associeid
            };
            Alert.loader(true);
            Go.post(postData).then(function(data) {
                if (data.success == 1) {
                    $rootScope.$emit('GetShareCapitalData');
                    $scope.validatePhoneNumber = true;
                }
            });
        }
    }; 

    $scope.validateSMS = function() { 
        var validationList = [{
            type: 'codesms',
            value: $scope.data.codeSMS
        }];
        if (SharedService.Validation(validationList)) {
            var postData = {
                "task": "ValidatSms",
                "action": 'ChangePhone', 
                "codesms": $scope.data.codeSMS
            };
            Alert.loader(true);
            Go.post(postData).then(function(req) {
                if (req.success == 1) { 
                    $rootScope.$emit('GetShareCapitalData'); 
                    Alert.success( $filter('translate')('mobile_phone.success_update') + ' : (' + $scope.data.Indicatif + ') ' + $scope.data.mobileNumber );
                    $scope.validatePhoneNumber = false;
                    setTimeout(function () {
                        $ionicHistory.goBack() 
                    },1500)
                }
            });
        }
    };
})




