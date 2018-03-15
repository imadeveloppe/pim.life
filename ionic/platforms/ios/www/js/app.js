var winInappBrowser;  
// document.addEventListener("deviceready", function () {
//     setTimeout(function () {
//         window.navigator.splashscreen.hide();
//     },500)

// }, false); 

function handleOpenURL(url) {
    console.log("//////**** handleOpenURL ****//////")
    console.log(url);
    console.log("////////////////////////////////////")

    if( url.search("pimlife") >= 0 && url.search("code") >= 0 && url.search("isshop") >= 0){
        var body = document.getElementsByTagName("body")[0];
        var appLaunchedController = angular.element(body).scope();
        appLaunchedController.InscriptionVerifEmail(url);
    }
        
}

ionic.Gestures.gestures.Hold.defaults.hold_threshold = 5; 

angular.module('pim', ['ionic', 'pim.controllers', 'angular-filepicker', 'pim.controllersPro','pim.controllersAssociation', 'pim.routes', 'pim.services', 'pim.directives', 'pim.constant', 'pim.controllersShared', 'pim.utils', 'ngCordovaOauth','pascalprecht.translate', 'ionic-lock-screen','mobiscroll-calendar','mobiscroll-form', 'ngMask'])
 
.config(['$mdIconProvider', function($mdIconProvider, $mdThemingProvider ) {
    $mdIconProvider.icon('md-close', 'img/icons/ic_close_24px.svg', 24); 
}])

.config(function($ionicConfigProvider, $translateProvider, API){
  $ionicConfigProvider.tabs.position("bottom");
  $ionicConfigProvider.tabs.style("standard");
  $ionicConfigProvider.navBar.alignTitle("center");
  //$ionicConfigProvider.backButton.text( "Back" ).icon('ion-ios-arrow-left');
  $ionicConfigProvider.backButton.previousTitleText(false);

    
    $.getJSON('js/language.json', function(data) {  
        var langs = []; 
        angular.forEach(data, function (value, key) {  
            $translateProvider.translations(key, value); 
            langs.push( {
                "key": key,
                "label": value.label
            });
        }) 
        setTimeout(function () {
            window.localStorage.setItem('langs', JSON.stringify(langs) ); 
            $.getJSON(API.server+'admin/public/multilingue/api/?task=getLangs', function(data) { 
            // $.getJSON('https://dev.pim.life/admin/public/multilingue/api/?task=getLangs', function(data) {  
                var langs = [];
                angular.forEach(data, function (value, key) {  
                    $translateProvider.translations(key, value); 
                    langs.push( {
                        "key": key,
                        "label": value.label
                    });
                }) 
                setTimeout(function () {
                    window.localStorage.setItem('langs', JSON.stringify(langs) ); 
                })
            });
        })  
    }); 
    if( window.localStorage.getItem('langCode') ){
        $translateProvider.preferredLanguage( window.localStorage.getItem('langCode') ); 
    }else{
        $translateProvider.preferredLanguage('fr'); 
        window.localStorage.setItem('langCode', 'fr')
    } 
})

 

.constant('$ionicLoadingConfig', {
   template: '<ion-spinner icon="android"></ion-spinner>'
})

.run(function($rootScope) { 
    $rootScope.Lname = function(text) {
        text += '';
        return text.toUpperCase();
    };
    $rootScope.Fname = function(text) {
        text += '';
        return text.replace(/\w\S*/g, function(txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
    };
})

.run(function($ionicPlatform,$sce, $ionicModal, $cordovaBadge,$storage, $rootScope, API, DATA, Alert, AuthService, User, $window, $interval,  Accounts, $state, $location, $translate, LockScreen, $filter, Go, Geo, $ionicHistory, User) {  

    $ionicPlatform.ready(function() {  
         
        $rootScope.checkForUpdate = function () {

            if(window.cordova){
                cordova.getAppVersion.getVersionNumber().then(function (AppVersion) {

                    DATA.version = AppVersion;
                    
                    Geo.getPosition().then(function(position) {
                        Go.post({ 
                            task:"getParamAppli", 
                            "NoLoader": true
                        }).then(function(data) {
                            if( data.success == 1 ){

                                DATA.logo = data.logo;
                                if( parseFloat(data.MinAmountTrans) > 0 ){
                                    API.minAmount = data.MinAmountTrans; 
                                } 

                                if( ionic.Platform.isIOS() ){
                                    if( data.iosversion != AppVersion ){
                                        swal({
                                            title: $filter('translate')('global_fields.update_app'),
                                            text: $filter('translate')('global_fields.update_app_texte'),
                                            type: "info",
                                            showCancelButton: false,
                                            confirmButtonColor: "#254e7b",
                                            confirmButtonText: $filter('translate')('global_fields.update_app'), 
                                            showLoaderOnConfirm: true,  
                                            allowOutsideClick: false
                                        }).then(function (confirm) {
                                            if( confirm ){
                                               window.open("itms-apps://itunes.apple.com/app/"+data.iosappid, '_system')
                                            }
                                        }, function () {})
                                    }else{
                                        cordova.plugins.diagnostic.isLocationAvailable(function(available){
                                            if( !available ){
                                                swal({
                                                    title: $filter('translate')('global_fields.gps'),
                                                    text: $filter('translate')('global_fields.you_need_to_activate_your_gps'),
                                                    type: "info",
                                                    showCancelButton: false,
                                                    confirmButtonColor: "#254e7b",
                                                    confirmButtonText: $filter('translate')('global_fields.goto_settings'),
                                                    showLoaderOnConfirm: true,  
                                                    allowOutsideClick: false
                                                }).then(function (confirm) {
                                                    if( confirm ){
                                                       window.cordova.plugins.settings.open(["locations", true], function() {}, function() {});
                                                    }
                                                }, function () {})
                                            }
                                            
                                        }, function(error){
                                            console.error("The following error occurred: "+error);
                                        });
                                    }
                                }else{
                                    if( data.andriodversion != AppVersion ){
                                        swal({
                                            title: $filter('translate')('global_fields.update_app'),
                                            text: $filter('translate')('global_fields.update_app_texte'),
                                            type: "info",
                                            showCancelButton: false,
                                            confirmButtonColor: "#254e7b",
                                            confirmButtonText: $filter('translate')('global_fields.update_app'), 
                                            showLoaderOnConfirm: true,  
                                            allowOutsideClick: false
                                        }).then(function (confirm) {
                                            if( confirm ){
                                               window.open("https://play.google.com/store/apps/details?id="+data.andriodappid, '_system')
                                            }
                                        }, function () {})
                                    }else{
                                        cordova.plugins.diagnostic.isLocationAvailable(function(available){
                                            if( !available ){
                                                swal({
                                                    title: $filter('translate')('global_fields.gps'),
                                                    text: $filter('translate')('global_fields.you_need_to_activate_your_gps'),
                                                    type: "info",
                                                    showCancelButton: false,
                                                    confirmButtonColor: "#254e7b",
                                                    confirmButtonText: $filter('translate')('global_fields.goto_settings'), 
                                                    showLoaderOnConfirm: true,  
                                                    allowOutsideClick: false
                                                }).then(function (confirm) {
                                                    if( confirm ){
                                                       cordova.plugins.diagnostic.switchToLocationSettings();
                                                    }
                                                }, function () {})
                                            }
                                            
                                        }, function(error){
                                            console.error("The following error occurred: "+error);
                                        });
                                    }
                                }
                            }
                                
                        })
                    }, function (callback) {
                        console.log("GPS false")

                        cordova.plugins.diagnostic.isLocationAvailable(function(available){
                            if( !available ){
                                swal({
                                    title: "GPS",
                                    text: $filter('translate')('global_fields.you_need_to_activate_your_gps'),
                                    type: "info",
                                    showCancelButton: false,
                                    confirmButtonColor: "#254e7b",
                                    confirmButtonText: "Aller au paramètres", 
                                    showLoaderOnConfirm: true,  
                                    allowOutsideClick: false
                                }).then(function (confirm) {
                                    if( confirm ){
                                       window.cordova.plugins.settings.open(["locations", true], function() {}, function() {});
                                    }
                                }, function () {})
                            }
                            
                        }, function(error){
                            console.error("The following error occurred: "+error);
                        });
                    }) 

                }); 
            }
        }

        $rootScope.checkForUpdate();




        // ionic.Platform.fullScreen();
        filepicker.setKey("A64bEDfCSVGcSUdWW8P4yz"); //  APP key FilePicker - filestrack
        Globalwindow = $window;  
        if( !ionic.Platform.isIOS() ){
            $('body').addClass('platformAndroid');
        }
        if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(false);
            cordova.plugins.Keyboard.disableScroll(true);
        }
        if (window.StatusBar) { 
            if(ionic.Platform.isIOS()){ 
                StatusBar.styleDefault(); 
                // StatusBar.backgroundColorByHexString("#C0C0C0");
            }

        }   
        
        window.localStorage.setItem('locked', 1)
        // *****************/////// Lock Screen /////////******************************** 
        if( parseInt(window.localStorage.getItem('loged')) == 1 ){ 
            window.localStorage.setItem('locked', 1)
            if(window.cordova){
                LockScreen.show();
            }
        }    

        $ionicPlatform.on("resume", function () { 

            $rootScope.checkForUpdate();

            $rootScope.ionicPlatformResume = true;

            var UserDetails = User.GetDetails();

            if(  UserDetails ){ 
                LockScreen.show(); 
                window.localStorage.getItem('locked', 1);
                window.localStorage.getItem('loged', 1);
            }else{
                window.localStorage.getItem('locked', 0);
                window.localStorage.getItem('loged', 0);
                $state.go('signin')
            }
            setTimeout(function () {
                $rootScope.ionicPlatformResume = false;
            },6000)

        }, false);

        $ionicPlatform.on("pause", function () { 
            
            if( parseInt(window.localStorage.getItem('loged')) == 1 ){
                window.localStorage.setItem('locked', 1)
            }

        }, false);

        // *****************////////////////*******************************************




        document.addEventListener("backbutton", function () {
            angular.element("html").removeClass("keyboardOn")
            angular.element("html").removeClass(".mbsc-fr-lock")

            if( $location.path() == '/tab/home' ){
                navigator.app.exitApp();
                return false;
            }
        }, false);
         
        $rootScope.Btest = function() {
             

            $rootScope.$broadcast("PaymentRecivedByQrCode", 416 );
             
        }
        $rootScope.updateTouchIDList = function () {
 
            var UserDetails = User.GetDetails(); 
            var UserMail = UserDetails.user.mail;
             
            angular.forEach($rootScope.availableAccounts, function (value, index) {
                if( value.id == UserMail ){

                    // **********************************
                    if( $rootScope.isPro == 1 ){ 
                        $rootScope.availableAccounts[ index ] = {
                            id: UserDetails.user.mail,
                            name: UserDetails.user.shopname,
                            picto: UserDetails.user.logo,
                            initiales: UserDetails.user.initiales
                        }

                    }else{ 
                        $rootScope.availableAccounts[ index ] = {
                            id: UserDetails.user.mail,
                            name: UserDetails.user.fname+" "+UserDetails.user.lname,
                            picto: UserDetails.user.picto,
                            initiales: UserDetails.user.initiales
                        }
                    } 
                    // **********************************
                    window.localStorage.setItem('TokenTouchIds', JSON.stringify($rootScope.availableAccounts))  
                }
            }) 

        }

        $rootScope.updateConnectedUser = function () {
            
            console.log("updateConnectedUser")

            var connectedUsers = $storage.getArrayOfObjects("connectedUsers"); 

            var UserDetails = User.GetDetails();
            var userInfos = UserDetails.userInfos;

            angular.forEach(connectedUsers, function (object, index) {

                if( parseInt(userInfos.id) == parseInt(object.id) && parseInt(userInfos.isshop) == parseInt(object.isshop) ){  

                    connectedUsers[index].initiales = UserDetails.user.initiales

                    if( $rootScope.isPro == 1 ){ 
                        connectedUsers[index].name = UserDetails.user.brand;
                        connectedUsers[index].picto = UserDetails.user.logo_small;
                    }else{
                        connectedUsers[index].name = UserDetails.user.fname +" "+UserDetails.user.lname;
                        connectedUsers[index].picto = UserDetails.user.picto_small;
                    }
                    console.log("connectedUsers", connectedUsers)
                    $storage.setArrayOfObjects("connectedUsers", connectedUsers);
                }
            }) 

        }

        $rootScope.updateNotifConnectedUser = function ( notifObject ) { 
            var connectedUsers = $storage.getArrayOfObjects("connectedUsers");  
            
            angular.forEach(connectedUsers, function (object, index) {

                if( parseInt(notifObject.id) == parseInt(object.id) && parseInt(notifObject.isshop) == parseInt(object.isshop) ){   

                    connectedUsers[index].NbrNotifNonVu = notifObject.NbrNotifNonVu;
                    $storage.setArrayOfObjects("connectedUsers", connectedUsers); 
                }
            }) 

        }

        $rootScope.updateEmailFromTouchIDList = function ( oldemail, currentemail ) {

            
            angular.forEach($rootScope.availableAccounts, function (value, index) {
                if( value.id == oldemail ){ 

                    // **********************************
                    $rootScope.availableAccounts[ index ].id =  currentemail;
                    window.localStorage.setItem('username_a0f55e81c44553384a9421', currentemail);
                    // **********************************

                    window.localStorage.setItem('TokenTouchIds', JSON.stringify($rootScope.availableAccounts))  
                }
            }) 

        }

        $rootScope.deleteUserFromTouchIdList = function ( userEmail ) {

            
            angular.forEach($rootScope.availableAccounts, function (value, index) {
                if( value.id == userEmail ){ 

                    // **********************************
                    $rootScope.availableAccounts.splice(index, 1);
                    // **********************************

                    window.localStorage.setItem('TokenTouchIds', JSON.stringify($rootScope.availableAccounts))  
                }
            }) 

        }

        $rootScope.deteleUserFromConnectedUserList = function (id, isshop) {
            var  connectedUsers =  $storage.getArrayOfObjects("connectedUsers");
            var array = []; 
            angular.forEach( connectedUsers, function (object, index) {
                if( object.id != id || object.isshop != isshop ){
                    array.push(object);
                }
            })
            setTimeout(function () { 
                $storage.setArrayOfObjects("connectedUsers", array);
            })
        }



        $rootScope.GetlistSettings = function() { 

            var OldUserDetails =  User.GetDetails(); 
            var postData = {
                "task": "checkDataUser",
                "NoLoader": true
            };
            Go.post(postData).then(function(data) { 
                if(data.success == 1){  
                    setTimeout(function () {
                        $rootScope.$emit("settingStartprogress", {});
                    })   
                } 
            }); 
        };
 

         


        
        // ************************************************ FIRE BASE ************************************************************

        $rootScope.connexionDATA = {}
        $rootScope.trustAsHtml = function(string) {
            return $sce.trustAsHtml(string);
        };

        $rootScope.cgv = "";
        $ionicModal.fromTemplateUrl('templates/Deconnect/cgv.html', {
            scope: $rootScope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $rootScope.cgvModal = modal;
        });

        $rootScope.acceptedCGV = function (data) { 
            // ******************************************************************************************************************************
                AuthService.storeUserCredentials(data.userToken);
                                         
                User.lat = data.position.lat;
                User.lng = data.position.lng;


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

                if( parseInt(data.UserDetails.user.blocedcode) == 1 ){
                    $location.path('/resetlockcode');
                }else{ 
                    $location.path('/tab/list-notifications');
                    window.localStorage.setItem('loged', '1');
                }

                $ionicHistory.clearHistory();
                $ionicHistory.clearCache();
            // ****************************************************************************************************************************** 
        }

        $rootScope.AcceptCGV = function () {
            var postData = {
                task: "setcgv"
            }
            Go.post(postData).then(function(data) {
                if (data.success == 1) {

                    $rootScope.acceptedCGV( $rootScope.connexionDATA )
                    $rootScope.cgvModal.hide(); 
                    
                } 
            })
        }

        $rootScope.RefuseCGV = function () { 
            $rootScope.cgvModal.hide()
        }
       

        if( window.FirebasePlugin ){ 

            window.FirebasePlugin.grantPermission(); 

            window.FirebasePlugin.getToken(function(token) {  
                DATA.token = token;   
            }, function(error) {
                console.error("FirebasePlugin ",error);
            });

            window.FirebasePlugin.onNotificationOpen(function(notification) { 

                console.log("notification : ", notification);

                var payload = JSON.parse(notification.data);

                $rootScope.updateNotifConnectedUser({
                    id: payload.notiftouserid,
                    isshop: payload.notiftoshop,
                    NbrNotifNonVu: payload.NbrNotifNonVu
                }); 
 

                    

                if( User.GetDetails() && payload.type != 'validatedsignupemail' ){
 
                    var postData = {
                        task: "ConnectedRecipientNotif",
                        notifid: payload.notifid
                    }
                    Go.post(postData).then(function(data) {
                        
                        console.log("ConnectedRecipientNotif",data)

                        if(data.success == 1 && data.connected == 0){

                            Alert.ask( data.message ).then(function() {

                                LockScreen.verif(data.code, function () {  

                                    $('body').removeClass('lockScreen')
                                    Alert.loader(true)  
                                    Geo.getPosition().then(function(position) {
                                        var postData = {
                                            "task": "ConnexionFromNotif",
                                            "notifid": payload.notifid, 
                                            "timeecart": new Date().getTimezoneOffset() / 60,
                                            "touchid": "",
                                            "lat": position.lat,
                                            "long": position.lng
                                        }
                                        if (DATA.token != '') {
                                            postData.tokendevice = DATA.token;
                                        }

                                        Go.post(postData).then(function(data) {

                                            Alert.loader(false) 
                                            if( data.success == 1){

                                                $storage.setObject('capitalSocial', {});
                                                // ******************************************************************************************************************************
                                                $rootScope.connexionDATA = data;
                                                $rootScope.connexionDATA.position = {
                                                        lat: position.lat,
                                                        lng: position.lng
                                                }

                                                if( parseInt( data.UserDetails.user.cgvvalid ) == 0 ){ 
                                                    $rootScope.cgv = data.UserDetails.cgv;
                                                    $rootScope.cgvModal.show();
                                                    
                                                }else{
                                                    $rootScope.acceptedCGV( $rootScope.connexionDATA )
                                                } 

                                                // ******************************************************************************************************************************


                                            }else{
                                                var array = [];
                                                var connectedUsers = $storage.getArrayOfObjects("connectedUsers"); 
                                                angular.forEach( connectedUsers, function (object, index) {
                                                    if( object.id != id || object.isshop != isshop ){
                                                        array.push(object);
                                                    }
                                                })
                                                setTimeout(function () { 
                                                    $storage.setArrayOfObjects("connectedUsers", array);
                                                })
                                            } 
                                        })
                                    }) 

                                })
                                    
                                    


                            })

                        }
                        else if( data.success == 1 && data.connected == 1 ){

                            if (payload.type != 'profil_blocked') { 

                                $cordovaBadge.set(payload.NbrNotifNonVu)
                                 
                                $rootScope.$apply(function() { 
                                    console.log("Here 1")
                                    $rootScope.$emit("NotifReloadList", {}); 
                                    DATA.badgeCount = payload.NbrNotifNonVu;
                                    DATA.Nbr_notif = payload.NbrAllNotif;
                                }); 

                                switch (payload.type) { 

                                    case "validatedemail":
                                        $rootScope.GetlistSettings()
                                        $rootScope.updateEmailFromTouchIDList(payload.oldemail, payload.currentemail);
                                        break;
                                    case "doc_address_confirmed":
                                        $rootScope.GetlistSettings()
                                        break;
                                    case "doc_identity_confirmed":
                                        $rootScope.GetlistSettings()
                                        break;
                                    case "doc_address_refused":
                                        $rootScope.GetlistSettings()
                                        break;
                                    case "doc_identity_refused":
                                        $rootScope.GetlistSettings()
                                        break;
                                    case "sendpaymenttofriend":
                                        $rootScope.$emit("HomeGetAllAccounts", {}); 
                                        break;
                                    case "refusepaymenttofriend":
                                        $rootScope.$emit("HomeGetAllAccounts", {});
                                        break;
                                    case "acceptpaymenttofriend":
                                        $rootScope.$emit("HomeGetAllAccounts", {});
                                        break;
                                    case "cancelledpaymenttofriend":
                                        $rootScope.$emit("HomeGetAllAccounts", {});
                                        break; 
                                    case "recievepaymentbyqrcode":
                                        if (typeof payload.idto !== "undefined" && typeof payload.soldeto !== "undefined") {
                                            // $rootScope.$apply(function(){
                                                // alert(1)
                                                var Details = User.GetDetails();
                                                var items = Details.accounts;
                                                IdOrObject = payload.idto;
                                                Solde = payload.soldeto;
                                                var oldObj = {};
                                                var index = -1 ;
                                                for (i = 0; i < items.length; i++) {
                                                    if (items[i].id == IdOrObject) {
                                                        oldObj = items[i];
                                                        index = i;
                                                        //console.log(('oldOBJ: ',oldObj)
                                                    }
                                                }

                                                if (index != -1) {
                                                    var newOBJ = oldObj;
                                                    //console.log(('old object + index =====>>>> ',oldObj,index)
                                                    if (Solde != '' && Solde != oldObj.solde) {
                                                        newOBJ.solde = Solde;
                                                        //console.log(('old object + index + solde =====>>>> ',oldObj,index,newOBJ.solde)
                                                    }
                                                    //console.log(('newOBJ',newOBJ)
                                                    items[index] = newOBJ;
                                                    User.UpdateAccount(index, newOBJ);
                                                }
                                            // });
                                              // Accounts.UpdateSolde(payload.idto, payload.soldeto);
                                         }
                                        // $rootScope.$broadcast("AccountsUpdateSolde", payload.idto, payload.soldeto);
                                        $rootScope.$emit("PaymentRecivedByQrCode", payload);
                                        break;

                                    case "refusepaymentbyqrcode":
                                        $state.go('tab.home'); 
                                        break;

                                    // Notif Admin for Perso
                                    case "updatepibyadmin":
                                        $rootScope.GetlistSettings()
                                        break;
                                    case "updatephotobyadmin":
                                        $rootScope.GetlistSettings()
                                        break;
                                    case "updateaddressbyadmin":
                                        $rootScope.GetlistSettings()
                                        break;

                                    // Notif Admin for Pro
                                    case "updatecibyadmin":
                                        console.log("updatecibyadminupdatecibyadminupdatecibyadmin")
                                        setTimeout(function () {
                                            $rootScope.GetlistSettings()
                                        },2000)
                                        break;
                                    case "updateshopphonebyadmin":
                                        $rootScope.GetlistSettings()
                                        break; 
                                    case "updateshophqphonebyadmin":
                                        $rootScope.GetlistSettings()
                                        break;
                                    case "updatelogobyadmin":
                                        $rootScope.GetlistSettings()
                                        break;
                                    case "updatecoverbyadmin":
                                        $rootScope.GetlistSettings()
                                        break;
                                    case "updatecontactmailbyadmin":
                                        $rootScope.GetlistSettings()
                                        break;
                                    case "updateshopaddressbyadmin":
                                        $rootScope.GetlistSettings()
                                        break;
                                    case "updateshophqaddressidbyadmin":
                                        $rootScope.GetlistSettings()
                                        break;
                                    case "updateshoptypebyadmin":
                                        $rootScope.GetlistSettings()
                                        break;
                                    case "updateshopvatbyadmin":
                                        $rootScope.GetlistSettings()
                                        break;
                                    case "updateshopscatbyadmin":
                                        $rootScope.GetlistSettings()
                                        break;
                                    case "doc_shopLetterauthorisation_refused":
                                        $rootScope.GetlistSettings()
                                        break; 
                                    case "doc_shopLetterauthorisation_confirmed":
                                        $rootScope.GetlistSettings()
                                        break;

                                    case "updatepimcommision":
                                        $rootScope.GetlistSettings()
                                        break;
                                    case "updateassoccommision":
                                        $rootScope.GetlistSettings()
                                        break;


                                    case "add_doc_pi":
                                        $rootScope.GetlistSettings()
                                        break;
                                    case "add_doc_persenal_address":
                                        $rootScope.GetlistSettings()
                                        break;
                                    case "add_doc_ci":
                                        $rootScope.GetlistSettings()
                                        break;
                                    case "add_doc_shop_address":
                                        $rootScope.GetlistSettings()
                                        break;
                                    case "add_doc_hq_address":
                                        $rootScope.GetlistSettings()
                                        break;
                                    case "add_doc_letterauthorisation":
                                        $rootScope.GetlistSettings()
                                        break;
                                    case "updatephonebyadmin":
                                        $rootScope.GetlistSettings()
                                        break;
                                    case "updateshopmobilebyadmin":
                                        $rootScope.GetlistSettings()
                                        break;
                                    case "annulupdatecontactmailbyadmin":
                                        $rootScope.GetlistSettings()
                                        break;
                                    case "annulupdatemailbyadmin":
                                        $rootScope.GetlistSettings()
                                        break;
                                    


                                    ///////////////////////////////////////////////////

                                    //Logout type Notif Admin for Perso  
                                    case "updateemailbyadmin":
                                        Alert.info( payload.msg );
                                        AuthService.Directlogout();
                                        break;
                                    case "updatepasswordbyadmin":
                                        Alert.info( payload.msg );
                                        AuthService.Directlogout();
                                        break;
                                    case "updatesecretquestionsbyadmin":
                                        Alert.info( payload.msg );
                                        AuthService.Directlogout();
                                        break;


                                    //Logout type Notif Admin for Pro
                                    case "updateshopmailbyadmin":
                                        Alert.info( payload.msg );
                                        AuthService.Directlogout();
                                        break;

                                    //Blocked profil from Admin
                                    

                                    

                                }  

                                ////////// email address changed 
                                console.log("email address changed ", payload.type)
                                if( (payload.type == 'validatedemail' || payload.type == 'validatedemaildcontact') && ( Go.is('ChangeCompanyEmail') || Go.is('ChangeContactEmail') || Go.is('changeyouremail') ) ){
                                    $rootScope.GotoSettings()
                                }

                                setTimeout(function () { 
                                    if( parseInt(window.localStorage.getItem('loged')) == 1 && $rootScope.ionicPlatformResume == true ){
                                        $state.go('tab.notif'); 
                                        if(payload.notifid && payload.type == "sendpaymenttofriend" ){
                                            $rootScope.gotoDetailPushNotif = payload.notifid;
                                        }else{
                                            $rootScope.gotoDetailPushNotif = null;
                                        }  
                                        console.log("here 2")
                                        $rootScope.$emit("NotifReloadList", {});  
                                    } 
                                },1000) 
                                

                            } else {
                                Alert.info( payload.msg );
                                AuthService.Directlogout();
                            } 
                        }

                    })  

                        
                }else{
                    
                    switch( payload.type ){
                        case "validatedsignupemail":
                            handleOpenURL(payload.url)
                            break;
                    }
                }

            }, function(error) {
                console.error(error);
            });
        }
            // ********************************************End FIRE BASE *********************************************************
        
  
    });
})
 

.run(function($rootScope, User, $ionicHistory, $timeout, $state, AuthService, AUTH_EVENTS, Navigate) {

        if( parseInt(window.localStorage.getItem('loged')) != 1 ){
            $rootScope.isLogin = false;
            $rootScope.isPro = false;
        }

        
        if (window.cordova) {
            $rootScope.isDev = false;
        } else {
            $rootScope.isDev = true;
        }
        //console.log(('$rootScope.isDev', $rootScope.isDev)
        $rootScope.logot_timer = null;
        $rootScope.feedback = {message:'text ...',
                               image:'http://s3.amazonaws.com/ionic-forum-static/forum-logo.png',
                               url:'http://lp_pim.e-i.ma'};
        $rootScope.validateData = {};
        $rootScope.GoLogout = function() {
            AuthService.logout();
        }
        $rootScope.isHer = function(){
            return true;
        }
        $rootScope.goNow = true;
        $rootScope.ShowNow = false;

        

        $rootScope.GoBack = function() {
            $ionicHistory.goBack();
        };
        $rootScope.testaccount = function() {
            $rootScope.$emit("HomeGetAllAccounts", {});
        }
        $rootScope.GotoHome = function() {
            // if(ionic.Platform.isIOS()){
            //     $state.go('tab.home');
            // }else if(ionic.Platform.isAndroid()){
            //     $state.go('tab.homeAndroid');
            // }
            $state.go('tab.home');
             
        }
        $rootScope.GotoCauses = function(){
            //console.log(('test static')
            $state.go('tab.causes');
        }
        $rootScope.GotoTrans = function() {
            $state.go('tab.trans');
        }
        $rootScope.GotoNotif = function() {
            $state.go('tab.notif');
        }
        $rootScope.GotoSettings = function() {
             
            var UserDetails = User.GetDetails(); 
            if( UserDetails ){
                $rootScope.isPro = parseInt(UserDetails.isPro);   

                switch( $rootScope.isPro ){
                    case 0:
                        $state.go('tab.settings', {}, {reload: true});
                        break;

                    case 1:
                        $state.go('tab.settingsPro', {}, {reload: true});
                        break;

                    case 2:
                        $state.go('tab.settingsAssociation', {}, {reload: true});
                        break;
                }
            }else{
                $state.go('signin');
            }
            
        }
        $rootScope.GotoShopping = function() {
            $state.go('tab.shop', {}, {reload: true});
        }
        
        var a = 0;
        $rootScope.$on("LogoutTimer", function() {
             
            // if (AuthService.isAuthenticated() == true) {
            //     if ($rootScope.logot_timer) {
            //         clearTimeout($rootScope.logot_timer);
            //         $rootScope.logot_timer = null;
            //     }
            //     $rootScope.logot_timer = setTimeout(function() {
            //         if ($rootScope.isDev == false) {
            //             AuthService.Directlogout();
            //         }
            //     }, 120000);
            // }
        });
        $rootScope.$on('$stateChangeStart', function(event, next, nextParams, fromState) {
            if ('data' in next && 'authorizedRoles' in next.data) {
                var authorizedRoles = next.data.authorizedRoles;
                if (!AuthService.isAuthorized(authorizedRoles)) {
                    event.preventDefault();
                    $state.go($state.current, {}, {
                        reload: true
                    });
                    $rootScope.$broadcast(AUTH_EVENTS.notAuthorized);
                }
            }
            if (!AuthService.isAuthenticated()) {
                if (
                    next.name !== 'signup-validate-email' && 
                    next.name !== 'signin' && 
                    next.name !== 'blocked' && 
                    next.controller !== 'BeforeSignUpCtrl' && 
                    next.controller !== 'SignInCtrl' && 
                    next.controller !== 'SignUpCtrl' && 
                    next.controller !== 'ForgotPasswordCtrl' && 
                    next.controller !== 'ProSignUpCtrl' && 
                    next.controller !== 'emailNotValidatedCtrl') {
                    //console.log(('stop event')
                    event.preventDefault();
                    $state.go('signin');
                }
            }

            if (
                next.name !== 'signup-validate-email' && 
                next.name !== 'signin' && 
                next.controller !== 'BeforeSignUpCtrl' && 
                next.controller !== 'SignInCtrl' && 
                next.controller !== 'SignUpCtrl' && 
                next.controller !== 'ForgotPasswordCtrl' && 
                next.controller !== 'ProSignUpCtrl' && next.controller !== 'emailNotValidatedCtrl') {
                $rootScope.$emit("LogoutTimer", {});
            }
        });
    });