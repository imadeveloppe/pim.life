angular.module('pim.services', ['ngCordova', 'ngMap', 'ngAria', 'ja.qr', 'ngAnimate', 'ngMdIcons', 'jrCrop', 'starter.sortable', 'mobiscroll-select','mobiscroll-range', 'ngCordova', 'ngMaterial', 'ngSanitize', 'ionic.rating','ionicLazyLoad', 'dbaq.ionNumericKeyboard'])

.config(function($httpProvider) {
    $httpProvider.interceptors.push('AuthInterceptor');
})

.factory('PaymentFriend', function() {
    trans = {};
    trans.date = new Date();
    trans.users = [];
    trans.reson = '';
    trans.amount = '';
    trans.selectedAccount = 0;
    trans.selectedAccountToRecive = 0;
    trans.requestid = -1;
    trans.QrCode = '';
    trans.TransactionId = -1;
    return trans;
})
.factory('GooglePlaces', function () {
    return {
        getInfoAddress : function (result) {  
                var addr = {
                    street_number : "",
                    route : "",
                    city : "",
                    state : "",
                    zipcode : "",
                    country : ""
                };  
 
                
                if (result) {
                    for (var ii = 0; ii < result.address_components.length; ii++){
                        var street_number = route = street = city = state = zipcode = country = formatted_address = '';
                        var types = result.address_components[ii].types.join(",");

                        if (types == "street_number"){
                            addr.street_number = result.address_components[ii].long_name;
                        }

                        if (types == "route" || types == "point_of_interest,establishment"){
                            addr.route = result.address_components[ii].long_name; 
                        }

                        if (types == "sublocality,political" || types == "locality,political" || types == "neighborhood,political" || types == "administrative_area_level_1,political" || types == "administrative_area_level_2,political" || types == "administrative_area_level_3,political") {
                            addr.city = (addr.city == '') ? result.address_components[ii].long_name : addr.city;
                        }

                        if (types == "administrative_area_level_1,political"){
                            addr.state = result.address_components[ii].short_name;
                        }

                        if (types == "postal_code" || types == "postal_code_prefix,postal_code"){
                            addr.zipcode = result.address_components[ii].long_name;
                        }

                        if (types == "country,political"){
                            addr.country = result.address_components[ii].long_name;
                            addr.codeCountry = result.address_components[ii].short_name;
                        } 

                        addr.lat = result.geometry.location.lat();
                        addr.lng = result.geometry.location.lng();
                    }
                    addr.success = true; 
                    return addr;
                } else {
                    return {success:false};
                } 
               
          
        }
    }
})
.factory('Camera', function($q,$cordovaImagePicker, $ionicPlatform, Alert) {
    return {
        getPicture: function(options) {
            var q = $q.defer();

            navigator.camera.getPicture(function(result) {
                q.resolve(result);
            }, function(err) {
                Alert.loader(false);
                q.reject(err);
            }, options);

            return q.promise;
        },

        getGallery: function(options) {
            var q = $q.defer();
            $ionicPlatform.ready(function() {
                Alert.loader(true);
    
                // Image picker will load images according to these settings
                
                
                $cordovaImagePicker.getPictures(options).then(function (results) {
                    // Loop through acquired images
                    for (var i = 0; i < results.length; i++) {
                        // $scope.collection.selectedImage = results[i];   // We loading only one image so we can use it like this
     
                        window.plugins.Base64.encodeFile(results[i], function(base64){  // Encode URI to Base64 needed for contacts plugin
                            q.resolve(base64);
                        });
                    }
                }, function(error) {
                    Alert.loader(false);
                    q.reject(JSON.stringify(error));
                    console.log('Error: ' + error);    // In case of error
                }).finally(function(){
                    Alert.loader(false);
                });
            });  
 


            return q.promise;
        },


        
        resizeImage: function(img_path) {
            var q = $q.defer();
            window.imageResizer.resizeImage(function(success_resp) {
                q.resolve(success_resp);
            }, function(fail_resp) {
                q.reject(fail_resp);
            }, img_path, 200, 0, {
                imageDataType: ImageResizer.IMAGE_DATA_TYPE_URL,
                resizeType: ImageResizer.RESIZE_TYPE_MIN_PIXEL,
                pixelDensity: true,
                storeImage: false,
                photoAlbum: false,
                format: 'jpg'
            });

            return q.promise;
        },
        toBase64Image: function(img_path) {
            var q = $q.defer();
            window.imageResizer.resizeImage(function(success_resp) {
                q.resolve(JSON.stringify(success_resp));
            }, function(fail_resp) {
                q.reject(JSON.stringify(fail_resp));
            }, img_path, 1, 1, {
                imageDataType: ImageResizer.IMAGE_DATA_TYPE_URL,
                resizeType: ImageResizer.RESIZE_TYPE_FACTOR,
                format: 'jpg'
            });

            return q.promise;
        }
    };
})

.factory('Phone', function() {
    return {
        watch: function(data) {
            if (data != null) {
                var value = data.toString();
            } else {
                var value = '';
            }
            var data = '';
            for (i = 0; i < value.length; i++) {
                if ($.isNumeric(value.substring(i, i + 1))) {
                    data += value.substring(i, i + 1);
                }

            }
            var first = data.substring(0, 1);
            if (first == 0) {
                data = data.substr(1);
            }
            

            return data.substr(0, 9);
        }
    };
})

.factory('Amount', function() {
    return {
        watch: function(data) {
            if (data != null) {
                var value = data.toString();
            } else {
                var value = '';
            }
            var data = '';
            for (i = 0; i < value.length; i++) {
                if ($.isNumeric(value.substring(i, i + 1)) || value.substring(i, i + 1) == ".") {
                    data += value.substring(i, i + 1);
                }
            }
            if (data.toString().indexOf('.') !== -1){
                var afterComma = data.substr(data.indexOf(".") + 1);
                var last2 = afterComma.substring(0, 2);
                str1 = data.split('.')[0];
                data = str1 + '.' + last2;
            }
            return data;
        }
    };
})

.factory('Chats', function() {
    // Might use a resource here that returns a JSON array

    // Some fake testing data
    var items = [{
        id: 0,
        name: 'Nexsus 7',
        lastText: 'Morocco, 12/07/2016',
        face: 'img/android-icon.png'
    }, {
        id: 1,
        name: 'Iphone 4',
        lastText: 'USA, 19/06/2016',
        face: 'img/apple-icon.png'
    }, {
        id: 2,
        name: 'Note 3',
        lastText: 'France, 12/07/2016',
        face: 'img/android-icon.png'
    }, {
        id: 3,
        name: 'Iphone 6',
        lastText: 'Morocco, 23/12/2015',
        face: 'img/apple-icon.png'
    }, {
        id: 4,
        name: 'Ipade mini',
        lastText: 'Morocco, 12/07/2016',
        face: 'img/apple-icon.png'
    }];

    return {
        all: function() {
            return items;
        },
        remove: function(chat) {
            items.splice(items.indexOf(chat), 1);
        },
        get: function(chatId) {
            for (var i = 0; i < items.length; i++) {
                if (items[i].id === parseInt(chatId)) {
                    return items[i];
                }
            }
            return null;
        }
    };
})

.factory('Accounts', function(Alert, $q, Go, User) {
    var Details = User.GetDetails();
    var items = Details.accounts;

    return {
        GetAllAccounts: function() {
            Go.post({
                "task": "getUserAccounts"
            }).then(function(data) {
                Details.accounts = data;
            }); 
        },
        destoryAll: function() {
            User.destroyAccount()
            items = {};
        },
        all: function() { 
 
                return User.GetDetails().accounts;  

        },
        remove: function(obj) {
            return $q(function(resolve, reject) {
                var Details = User.GetDetails();
                var items = Details.accounts;
                var index = -1;
                for (i = 0; i < items.length; i++) {
                    if (items[i].id == obj.id) {
                        index = i;
                    }
                }
                if (index != -1) {
                    // items.splice(index, 1);
                    User.DeleteAccount(index);
                    resolve();
                }
            });
        },
        getByIndex: function(index) {
            var Details = User.GetDetails();
            var items = Details.accounts;
            if (typeof items !== 'undefined') {
                if (typeof items[index] !== 'undefined') {
                    return items[index];
                }
            }
        },
        Update: function(oldObj, IconId, Name) {
            return $q(function(resolve, reject) {
                var Details = User.GetDetails();
                var items = Details.accounts;
                var index = -1;
                for (i = 0; i < items.length; i++) {
                    if (items[i].id == oldObj.id) {
                        index = i;
                    }
                }
                if (index != -1) {
                    var newOBJ = oldObj;
                    if (typeof Name !== 'undefined') {
                        if (Name != '' && Name != oldObj.name) {
                            newOBJ.name = Name;
                        }
                    }
                    if (angular.isNumber(IconId) && IconId != oldObj.iconId) {
                        newOBJ.iconId = IconId;
                    }
                    items[index] = newOBJ;
                    User.UpdateAccount(index, newOBJ);
                    resolve();
                } else {
                    Alert.error("Account does not exists");
                    reject();
                }
            });
        },
        UpdateSolde: function(IdOrObject, Solde) {
            return $q(function(resolve, reject) {
                var Details = User.GetDetails();
                var items = Details.accounts;
                var oldObj = {};
                var index = -1 ;
                if(typeof IdOrObject === 'object'){
                    ////console.log(('is Object Account')
                    for (i = 0; i < items.length; i++) {
                        if (items[i].id == IdOrObject.id) {
                            oldObj = items[i];
                            index = i;
                            ////console.log(('oldOBJ: ',oldObj)
                        }
                    }
                }else{
                    for (i = 0; i < items.length; i++) {
                        if (items[i].id == IdOrObject) {
                            oldObj = items[i];
                            index = i;
                            ////console.log(('oldOBJ: ',oldObj)
                        }
                    }
                } 
                

                ////console.log(('old object =====>>>> ',oldObj)

                if (index != -1) {

                    var newOBJ = oldObj;
                    ////console.log(('old object + index =====>>>> ',oldObj,index)
                    if (Solde != '' && Solde != oldObj.solde) {
                        newOBJ.solde = Solde;
                        ////console.log(('old object + index + solde =====>>>> ',oldObj,index,newOBJ.solde)
                    }
                    ////console.log(('newOBJ',newOBJ)
                    items[index] = newOBJ;
                    User.UpdateAccount(index, newOBJ);
                    resolve();
                } else {
                    // Alert.error("Account does not exists");
                    reject();
                }
            });
        },
        UpdateListAccounts: function(list) {

        },
        add: function(obj) {
            var Details = User.GetDetails();
            var items = Details.accounts;
            // http to add in server
            User.AddAccount(obj);
            // items.push(obj);
        },
        getIban: function () {  
            return new Promise(function (resolve) {

                var accounts = User.GetDetails().accounts; 
                
                angular.forEach( accounts, function (account, index) {
                    if( account.principal == '1' ){
                        resolve(account);
                    }
                })
            })
        }
    };
})

.factory('AuthInterceptor', function($rootScope, $q, AUTH_EVENTS) {
    return {
        responseError: function(response) {
            $rootScope.$broadcast({
                401: AUTH_EVENTS.notAuthenticated,
                403: AUTH_EVENTS.notAuthorized
            }[response.status], response);
            return $q.reject(response);
        }
    };
})

.directive('textarea', function() {
  return {
    restrict: 'E',
    link: function(scope, element, attr){
        var update = function(){
            element.css("height", "auto");
            var height = element[0].scrollHeight; 
            if( element[0].scrollHeight > 34 ){
                element.css("height", element[0].scrollHeight + "px");
            }else{
                element.css("height", "23px");
            }
        };
        scope.$watch(attr.ngModel, function(){
            update();
        });
    }
  };
})

.service('Badges', function(DATA, $rootScope, $cordovaBadge) {
    var UserMail = window.localStorage.getItem('username_a0f55e81c44553384a9421');
    var keybadge = '1550ca98761550c76bb2da133bb2988uueda133' + UserMail;
    return {
        clear: function() {
            if (window.cordova) {
                $cordovaBadge.clear();
            }
        },
        getBadges: function() {
            var data = window.localStorage.getItem(keybadge);
            // $rootScope.$apply(function() {
            DATA = data;
            // });
            return data;
        },
        set: function(all, nonVu) {
            // $rootScope.$apply(function() {
            //     DATA.badgeCount = nonVu;
            //     DATA.Nbr_notif = all;
            // });
            ////console.log((DATA.Nbr_notif,DATA.badgeCount);
            ////console.log((all, nonVu);

            DATA.Nbr_notif = all;
            if (nonVu != 0) {
                DATA.badgeCount = nonVu;
                if(window.cordova)$cordovaBadge.set(nonVu)
            }
        }
    }
})

.service('AuthService', function($q, Badges, $window, $storage, Protocole, Alert, $cordovaBadge, $ionicHistory, DATA, $http, $state, USER_ROLES, API, User, Geo, $location, Navigate, $rootScope, $ionicLoading, $cordovaTouchID, $filter, $translate, $ionicScrollDelegate) {
    
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


    var isAuthenticated = false;
    var role = '';
    var authToken;
    var LOCAL_TOKEN_KEY = '0a8d74531550c76bb2da1337ba98';

    function loadUserCredentials() {
        var token = window.localStorage.getItem(LOCAL_TOKEN_KEY);
        if (token) {
            useCredentials(token);
        }
    }

    function GetUserCredentials() {
        var token = window.localStorage.getItem(LOCAL_TOKEN_KEY);
        return (token) ? token : "";
    }

    function storeUserCredentials(token) {
        window.localStorage.setItem(LOCAL_TOKEN_KEY, token);
        useCredentials(token);
    }

    function useCredentials(token) {
        isAuthenticated = true;
        authToken = token;
        role = USER_ROLES.public;
        // Set the token as header for your requests!
        $http.defaults.headers.common['Authorization'] = token; 
    }

    function destroyUserCredentials() {
        // User.destroyUserData();
        // Accounts.destoryAll();
        // authToken = undefined;
        // isAuthenticated = false;
        // $http.defaults.headers.common['Authorization'] = undefined; 
         window.localStorage.removeItem(LOCAL_TOKEN_KEY);
    }

    var login = function(name, pw, touchid) {
        return $q(function(resolve, reject) {
            Geo.getPosition().then(function(position) {
                var maintenant = new Date();
                var ecart = maintenant.getTimezoneOffset() / 60;
                var connexion = {
                    "task": "Connexion",
                    "email": name,
                    "password": pw,
                    "timeecart": ecart,
                    "touchid": touchid,
                    "lat": position.lat,
                    "long": position.lng
                }
                if (DATA.token != '') {
                    connexion.tokendevice = DATA.token;
                }

                var userInfos;

                var request = Protocole.post( connexion )
                request.then(function( data ) {  

                    if (data.success == 1) {  

                        

                        $storage.setObject('capitalSocial', {});
                        userInfos = data.userInfos;
                        ////////////////////////////////////////////////// add User connected ///////////////////////////////////////////////
                         
                        var connectedUsers = $storage.getArrayOfObjects("connectedUsers");
                        var finded = false; 
 
                        angular.forEach(connectedUsers, function (object, index) {
                            if( userInfos.id == object.id && userInfos.isshop == object.isshop ){
                                finded = true;
                                connectedUsers[index] = userInfos;
                                console.log("Foreach")
                            }
                        })
                        setTimeout(function () {
                            if( !finded ) {
                                connectedUsers.push( userInfos ); 
                            } 
                            $storage.setArrayOfObjects("connectedUsers", connectedUsers);
                        }) 

                        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


                        //storeUserCredentials(data.userToken);
                        Alert.loader(true)
                        // Geo.getPosition().then(function(position) {
                        User.lat = position.lat;
                        User.lng = position.lng;

                        ////console.log(('login', data);
                        $ionicLoading.hide();

                        
                        

                        $rootScope.isLogin = true;
                        
                        // Make a request and receive your auth token from your server
                        
                        isLogin = true;
                        // details user
                        // Badges.setBadges(5, data.NbrNotifNonVu);
                        // $rootScope.$apply(function() {
                            DATA.badgeCount = data.NbrNotifNonVu;
                            DATA.Nbr_notif = data.NbrAllNotif;
                        // });
                        // ////console.log((data.NbrAllNotif,data.NbrNotifNonVu);
                        // Badges.set(data.NbrAllNotif,data.NbrNotifNonVu);

                        if(window.cordova){
                            $cordovaBadge.clear();
                            $cordovaBadge.set(data.NbrNotifNonVu)
                        }
                        // DATA.badgeCount = data.NbrNotifNonVu;
                        // DATA.Nbr_notif = data.NbrAllNotif;


                        data.UserDetails.isPro = data.isshop ;
                        $rootScope.isPro = data.isshop ;
                        data.UserDetails.userInfos = data.userInfos;
                        User.SetDetails(data.UserDetails);
                        //$rootScope.$emit("settingStartprogress", {});

                        $translate.use( data.UserDetails.user.lang );
                        window.localStorage.setItem('langCode', data.UserDetails.user.lang)
                        window.localStorage.setItem('lockCode', data.UserDetails.user.code)
 

                        // if( parseInt(data.UserDetails.user.blocedcode) == 1 ){ 
                        //     $location.path('/resetlockcode'); 
                        //     console.log("asdasdsad asdasd ad resetlockcode")
                        // }else{ 
                        //     $location.path('/tab/home');
                        //     window.localStorage.setItem('loged', '1');
                        //     console.log("asdasdsad asdasd ad Home")
                        // } 


                        resolve( data.UserDetails );


                        if( ionic.Platform.isIOS() ){

                            $cordovaTouchID.checkSupport().then(function() {

                                var tookens = window.localStorage.getItem('TokenTouchIds')
                                if( tookens == "" ){
                                    swal({
                                        title: '',
                                        text: $filter('translate')('touch_id.register_device'),
                                        type: "info",
                                        showCancelButton: true,
                                        confirmButtonColor: "#254e7b",
                                        confirmButtonText: $filter('translate')('touch_id.yes'),
                                        cancelButtonText: $filter('translate')('touch_id.no'),
                                        customClass: "customSwal",
                                        showLoaderOnConfirm: true,
                                        preConfirm: function() {
                                            return new Promise(function (resolve) {
                                                var array = [];
                                                var userData = {
                                                    id:name,
                                                    name:userInfos.name,
                                                    picto:userInfos.picto,
                                                    initiales:userInfos.initiales, 
                                                    idUser: userInfos.id,
                                                    isshop: userInfos.isshop,
                                                    NbrNotifNonVu: 0
                                                }
                                                array.push( userData );
                                                window.localStorage.setItem('TokenTouchIds', JSON.stringify( array ) )
                                                $rootScope.availableAccounts = array;
                                                resolve();
                                            })

                                        },
                                        preCancel: function() {
                                            return new Promise(function (resolve) {
                                                resolve();
                                            })
                                        },
                                        allowOutsideClick: false
                                    })
                                }else{
                                    var array = JSON.parse( tookens )
                                    var findUser = false;
                                    angular.forEach(array, function (value, index) {
                                        if( value.id == name ){
                                            findUser = true;
                                        }
                                    })
                                    setTimeout(function () {
                                        if( !findUser ){
                                            swal({
                                                title: '',
                                                text: $filter('translate')('touch_id.register_device'),
                                                type: "info",
                                                showCancelButton: true,
                                                confirmButtonColor: "#254e7b",
                                                confirmButtonText: $filter('translate')('touch_id.yes'),
                                                cancelButtonText: $filter('translate')('touch_id.no'),
                                                customClass: "customSwal",
                                                showLoaderOnConfirm: true,
                                                preConfirm: function() {
                                                    return new Promise(function (resolve) {
                                                        var array = JSON.parse( tookens );
                                                        var userData = {
                                                            id:name,
                                                            name: userInfos.name,
                                                            picto: userInfos.picto,
                                                            initiales: userInfos.initiales,
                                                            idUser: userInfos.id,
                                                            isshop: userInfos.isshop,
                                                            NbrNotifNonVu: 0
                                                        }
                                                        array.push( userData );
                                                        window.localStorage.setItem('TokenTouchIds', JSON.stringify( array ) )
                                                        $rootScope.availableAccounts = array;
                                                        resolve();
                                                    })

                                                },
                                                preCancel: function() {
                                                    return new Promise(function (resolve) {
                                                        resolve();
                                                    })
                                                },
                                                allowOutsideClick: false
                                            })
                                        }else{
                                            var array = JSON.parse( tookens )
                                            angular.forEach(array, function (value, index) {
                                                if( value.id == name ){
                                                    array[index] = {
                                                        id:name,
                                                        name: userInfos.name,
                                                        picto: userInfos.picto,
                                                        initiales: userInfos.initiales,
                                                        idUser: userInfos.id,
                                                        isshop: userInfos.isshop,
                                                        NbrNotifNonVu: 0
                                                    }
                                                }
                                            })
                                            setTimeout(function () {
                                                window.localStorage.setItem('TokenTouchIds', JSON.stringify( array ) )
                                                $rootScope.availableAccounts = array;
                                            })
                                        }
                                    })

                                }
                            });
                        }else if(window.SamsungPass){

                            SamsungPass.checkForRegisteredFingers(function() {
                                var tookens = window.localStorage.getItem('TokenTouchIds')
                                if( tookens == "" ){
                                    swal({
                                        title: '',
                                        text: $filter('translate')('touch_id.register_device'),
                                        type: "info",
                                        showCancelButton: true,
                                        confirmButtonColor: "#254e7b",
                                        confirmButtonText: $filter('translate')('touch_id.yes'),
                                        cancelButtonText: $filter('translate')('touch_id.no'),
                                        customClass: "customSwal",
                                        showLoaderOnConfirm: true,
                                        preConfirm: function() {
                                            return new Promise(function (resolve) {
                                                var array = [];
                                                var userData = {
                                                    id:name,
                                                    name:userInfos.name,
                                                    picto:userInfos.picto,
                                                    initiales:userInfos.initiales,
                                                    idUser: userInfos.id,
                                                    isshop: userInfos.isshop,
                                                    NbrNotifNonVu: 0
                                                }
                                                array.push( userData );
                                                window.localStorage.setItem('TokenTouchIds', JSON.stringify( array ) )
                                                $rootScope.availableAccounts = array;
                                                resolve();
                                            })

                                        },
                                        preCancel: function() {
                                            return new Promise(function (resolve) {
                                                resolve();
                                            })
                                        },
                                        allowOutsideClick: false
                                    })
                                }else{
                                    var array = JSON.parse( tookens )
                                    var findUser = false;
                                    angular.forEach(array, function (value, index) {
                                        if( value.id == name ){
                                            findUser = true;
                                        }
                                    })
                                    setTimeout(function () {
                                        if( !findUser ){
                                            swal({
                                                title: '',
                                                text: $filter('translate')('touch_id.register_device'),
                                                type: "info",
                                                showCancelButton: true,
                                                confirmButtonColor: "#254e7b",
                                                confirmButtonText: $filter('translate')('touch_id.yes'),
                                                cancelButtonText: $filter('translate')('touch_id.no'),
                                                customClass: "customSwal",
                                                showLoaderOnConfirm: true,
                                                preConfirm: function() {
                                                    return new Promise(function (resolve) {
                                                        var array = JSON.parse( tookens );
                                                        var userData = {
                                                            id:name,
                                                            name: userInfos.name,
                                                            picto: userInfos.picto,
                                                            initiales: userInfos.initiales,
                                                            idUser: userInfos.id,
                                                            isshop: userInfos.isshop,
                                                            NbrNotifNonVu: 0
                                                        }
                                                        array.push( userData );
                                                        window.localStorage.setItem('TokenTouchIds', JSON.stringify( array ) )
                                                        $rootScope.availableAccounts = array;
                                                        resolve();
                                                    })

                                                },
                                                preCancel: function() {
                                                    return new Promise(function (resolve) {
                                                        resolve();
                                                    })
                                                },
                                                allowOutsideClick: false
                                            })
                                        }else{
                                            var array = JSON.parse( tookens )
                                            angular.forEach(array, function (value, index) {
                                                if( value.id == name ){
                                                    array[index] = {
                                                        id:name,
                                                        name: userInfos.name,
                                                        picto: userInfos.picto,
                                                        initiales: userInfos.initiales,
                                                        idUser: userInfos.id,
                                                        isshop: userInfos.isshop,
                                                        NbrNotifNonVu: 0
                                                    }
                                                }
                                            })
                                            setTimeout(function () {
                                                window.localStorage.setItem('TokenTouchIds', JSON.stringify( array ) )
                                                $rootScope.availableAccounts = array;
                                            })
                                        }
                                    })

                                }
                            }, function() {});
                        }

                        
                    }
                    else if(data.success == 0){
                        Alert.error( data.message )
                        
                        if (!Go.is('addprofile')) { 
                            Directlogout()
                        } 
                    }else if(data.success == 1022){  /// probleme de geolocalisation
                        Geo.activeGpsPopin();
                    }else if (data.success == -1) { // deja suspendu
                        $ionicLoading.hide();
                        //storeUserCredentials(data.userToken);
                        $location.path('/blocked');
                    }else if (data.success == -2) { // bloque par l'admin
                        // deleted by admin
                        //console.log('deleted by admin')
                        Alert.error( data.message ) 
                        reject($filter('translate')('sign_in.login_failed'));  

                        if (!Go.is('addprofile')) { 
                            Directlogout()
                        } 
                    }
                    else if (data.success == -3) { // email pas encore valide
                        ////console.log(data) 
                        //storeUserCredentials(data.userToken);
                        $ionicLoading.hide();
                        if( $location.path() == "/sign-in" ){
                            $state.go('emailNotValidated');
                        }else{
                            $state.go('tab.emailNotValidated');
                        }
                        
                    }
                    else if (data.success == -4) { // email pas encore valide
                        ////console.log(data)
                        Alert.error( data.message )
                        $rootScope.deleteUserFromTouchIdList( name )
                    }else if (data.success == -11) { // suspention suite a la geolocalisation
                        //storeUserCredentials(data.userToken);
                        Alert.loader(true);
                        swal({
                            title: "",
                            text: data.message,
                            type: 'error',
                            showConfirmButton: true
                        }).then(function(){
                            Alert.loader(false);
                        });
                        reject($filter('translate')('sign_in.login_failed'));
                        $location.path('/blocked');
                    }
                    else {
                        Alert.loader(true);
                        swal({
                            title: "",//$filter('translate')('global_fields.an_error_occured'),
                            text: data.message+"<br><br>",
                            type: 'error', 
                            showConfirmButton: true
                        }).then(function(){
                            Alert.loader(false);
                        });
                        reject($filter('translate')('sign_in.login_failed'));
                    }
                });
            }, function(err) {
                console.log("Geo.getPosition", err)
                $ionicLoading.hide();
            });
        });
    };
    var Directlogout = function() {
        var postData = {
             "task": "LogOut"
        }
        var request = Protocole.post( postData )
        request.then(function( data ) {  

            $storage.setArrayOfObjects("connectedUsers", []);  

            window.localStorage.setItem('loged', '0');  
            window.localStorage.setItem('locked', '0');  
            $location.path('/sign-in');

            Alert.loader(false);
            $rootScope.isLogin = false;
            User.destroyAccount(); 
            isLogout = true; 
            $('.wrapper.page').addClass('isLogout');
            $ionicHistory.clearHistory();
            $ionicHistory.clearCache(); 
        }) 
    };
    var logout = function() { 
        swal({
            title: $filter('translate')('log_out.title_page'),
            text: $filter('translate')('log_out.text'),
            type: "info",
            showCancelButton: true,
            confirmButtonColor: "#254e7b",
            confirmButtonText: $filter('translate')('log_out.yes'),
            cancelButtonText: $filter('translate')('log_out.no'),
            customClass: "customSwal",
            showLoaderOnConfirm: true,  
            allowOutsideClick: false
        }).then(function (confirm) {
            console.log("confirm ",confirm)
            if(confirm){
                Alert.loader(true);
                var postData = {
                     "task": "LogOut"
                }
                var request = Protocole.post( postData )
                request.then(function( data ) {  
                    $storage.setArrayOfObjects("connectedUsers", []); 

                    $location.path('/sign-in');
                    $('.wrapper.page').addClass('isLogout');
                    window.localStorage.setItem('loged', '0');  
                    window.localStorage.setItem('locked', '0');  
                    var userInfos = User.GetDetails().userInfos;
                    $rootScope.deteleUserFromConnectedUserList(userInfos.id, userInfos.isshop);  
                    $rootScope.isLogin = false;
                    User.destroyAccount(); 
                    isLogout = true;
                    $ionicHistory.clearHistory();
                    $ionicHistory.clearCache(); 

                    swal({
                        title: $filter('translate')('log_out.title_page'),
                        text: $filter('translate')('log_out.success_logout'),
                        type: 'success',
                        timer: 2500,
                        showConfirmButton: false
                    });
                }) 
            }     
             
        }, function () {
            $ionicScrollDelegate.scrollTop(true);
        })
    };

    var isAuthorized = function(authorizedRoles) {
        if (!angular.isArray(authorizedRoles)) {
            authorizedRoles = [authorizedRoles];
        }
        return (isAuthenticated && authorizedRoles.indexOf(role) !== -1);
    };

    loadUserCredentials();

    return {
        login: login,
        logout: logout,
        isAuthorized: isAuthorized,
        Directlogout: Directlogout,
        storeUserCredentials: storeUserCredentials,
        destroyUserCredentials: destroyUserCredentials,
        loadUserCredentials: loadUserCredentials,
        isAuthenticated: function() {
            return isAuthenticated;
        },
        role: function() {
            return role;
        }
    };
})

.service('User', function($http, API, $rootScope) {
    var LOCAL_TOKEN_KEY = '12fb0UJZ88d9afSDad0sfRF55e8d1c4Zg4ff553SDf384gZ94DdwH92';
    var Details = {};
    var that = this;
    UserEmail = '';



    var loadUserData = function() {
        // ll = JSON.parse($window.localStorage['12eb088d9afa0f55e81c44553384a9492aa']);
        var data = window.localStorage.getItem(LOCAL_TOKEN_KEY);
        data = JSON.parse(data);
        ////console.log(("load-User: ", data);
        if (data) {
            Details = data;
            return true;
        }
        return false;
    }

    var storeUserData = function(data) {
        destroyUserData();
        ////console.log(("store-User: ", data);
        window.localStorage.setItem(LOCAL_TOKEN_KEY, JSON.stringify(data));
        // $window.localStorage['12eb088d9afa0f55e81c44553384a9492aa'] = JSON.stringify(Lists.Indicatifs);
    }


    var destroyUserData = function() {
        window.localStorage.removeItem(LOCAL_TOKEN_KEY);
        window.localStorage.setItem(LOCAL_TOKEN_KEY, JSON.stringify([]));

        ////console.log(('destroyUserData =====================')
        loadUserData();
    } 

    var SetDetails = function(data) {
        ////console.log(('go to stor')
        storeUserData(data);
        Details = data;
    };

    var GetDetails = function() {
        if (loadUserData()) {
            return Details;
        }
        return false;
    };

    var UpdateSettings = function(index, values) {
        if (typeof(values.valid) === 'undefined') {
            values.valid = false;
        }
        if (typeof(values.label) === 'undefined') {
            values.label = '';
        }
        if (typeof(values.text) === 'undefined') {
            values.text = '';
        }
        if (typeof(values.is) === 'undefined') {
            values.is = 'Updated';
        }
        if (typeof(values.date) === 'undefined') {
            var mnt = new Date();
            var month = mnt.getMonth() + 1;
            var day = mnt.getDate();
            var output = (month < 10 ? '0' : '') + month + '/' + (day < 10 ? '0' : '') + day;
            values.date = output;
        }
        if (typeof(values.url) === 'undefined') {
            values.url = '';
        }
        if (typeof(values.log) === 'undefined') {
            values.log = Details.listSettings[index].log;
        }
        Details[index] = values;
        this.Details.listSettings[index] = Details[index];
    };
    var UpdatePhoto = function(data) { 
       
            Details.user.picto = data.picto; 
            Details.user.picto_small = data.picto_small;
            Details.user.picto_medium = data.picto_medium;
            Details.user.picto_large = data.picto_large; 
            ////console.log(('is nw uri 1 : ',data)
            this.SetDetails(Details);
     
    };
    var RemovePhoto = function() { 
       
            Details.user.picto = ""; 
            Details.user.picto_small = "";
            Details.user.picto_medium = "";
            Details.user.picto_large = ""; 
            ////console.log(('is nw uri 1 : ',data)
            this.SetDetails(Details);
     
    };
    var UpdateCover = function(URI) { 
       
            Details.user.cover = URI;
            Details.user.cover_small = URI;
            Details.user.cover_medium = URI;
            Details.user.cover_large = URI;
            ////console.log(('is nw uri 2 : ',URI)
            this.SetDetails(Details);
     
    };
    var UpdateLogo= function(URI) { 
       
            Details.user.logo = URI;
            Details.user.logo_small = URI;
            Details.user.logo_medium = URI;
            Details.user.logo_large = URI;
            ////console.log(('is nw uri 3 : ',URI)
            this.SetDetails(Details);
     
    };
    var UpdatePhotoMulti = function(Object) { 
        if (Details.user.picto != Object.picto) {
            Details.user.picto = Object.picto;
            Details.user.picto_small = Object.picto_small;
            Details.user.picto_medium = Object.picto_medium;
            Details.user.picto_large = Object.picto_large;
            ////console.log(('is nw uri 4: ',Object.picto)
            this.SetDetails(Details);
        }
    };


    var UpdateDataPro = function(scopeData, type) {
        var test = false;
        if (type == 'addressHQ') {
            if (Details.user.hqline1 == '' || Details.user.line1 == null) {
                // scopeData.percentage += 10;
            }
            if (Details.user.hqline1 != scopeData.line1) {
                test = true;
            }
            if (Details.user.hqline2 != scopeData.line2) {
                test = true;
            }
            if (Details.user.hqcity != scopeData.city) {
                test = true;
            }
            if (Details.user.hqzip != scopeData.zip) {
                test = true;
            }
            if (Details.user.hqcountry != scopeData.country) {
                test = true;
            }
            $rootScope.$emit("settingStartprogress", {});
        }
        if (type == 'addressSHOP') {
            if (Details.user.shopline1 == '' || Details.user.line1 == null) {
                // scopeData.percentage += 10;
            }
            if (Details.user.shopline1 != scopeData.line1) {
                test = true;
            }
            if (Details.user.shopline2 != scopeData.line2) {
                test = true;
            }
            if (Details.user.shopcity != scopeData.city) {
                test = true;
            }
            if (Details.user.shopzip != scopeData.zip) {
                test = true;
            }
            if (Details.user.shopcountry != scopeData.country) {
                test = true;
            }
            $rootScope.$emit("settingStartprogress", {});
        }
        if (type == 'addressBusiness') {
            // if (Details.businessInfos.shopline1 == '' || Details.businessInfos.line1 == null) {
            //     scopeData.percentage += 17;
            // }
            if (Details.businessInfos.addressline1 != scopeData.line1) {
                test = true;
            }
            if (Details.businessInfos.addressline2 != scopeData.line2) {
                test = true;
            }
            if (Details.businessInfos.addresscity != scopeData.city) {
                test = true;
            }
            if (Details.businessInfos.addresszip != scopeData.zip) {
                test = true;
            }
            if (Details.businessInfos.addresscountry != scopeData.country) {
                test = true;
            }
            $rootScope.$emit("settingStartprogress", {});
        }
        if(type == "addressBusiness"){
            Details.businessInfos = scopeData;
        }else{
            Details.user = scopeData;
        }
        
        ////console.log(('scopeData',scopeData)
        if (type == 'CompanyInformation') {
            Details.user.shopname = Details.user.shopname.replace(/\w\S*/g, function(txt) {
                return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
            });
            Details.user.logconfirmed_name = -1;
        }

        if (type == 'phone') {
            if (Details.user.phone != '' && Details.user.Indicatif != '') {
                Details.listSettings.connexion[1].text = '(' + Details.user.mIndicatif + ') ' + Details.user.mobile;
            } else {
                Details.listSettings.connexion[1].text = 'Phone Number';
            }
            //Details.listSettings.PersonalInfos[2].valid = false;
        }
        if (type == 'phoneShop') {
            if (Details.user.phone != '' && Details.user.Indicatif != '') {
                Details.listSettings.shop[1].text = '(' + Details.user.shopIndicatif + ') ' + Details.user.shopphone;
            } else {
                Details.listSettings.shop[1].text = 'Shop landline phone';
            }
            Details.listSettings.shop[1].valid = false;
        }
        if (type == 'phoneHQ') {
            if (Details.user.phone != '' && Details.user.Indicatif != '') {
                ////console.log(('Details.user.hqIndicatif',Details.user.hqIndicatif,Details.user.hqphone)
                Details.listSettings.hq[0].text = '(' + Details.user.hqIndicatif + ') ' + Details.user.hqphone;
            } else {
                Details.listSettings.hq[0].text = 'Headquarter landline phone';
            }
            Details.listSettings.hq[0].valid = false;
        }
        if (type == 'mail') { // ok
            if (Details.user.mail != '') {
                // Details.listSettings.CompanyInfos[0].text = Details.user.mail;
            } else {
                Details.listSettings.connexion[0].text = 'Email Address';
            }
            Details.listSettings.connexion[0].valid = false;
        }
        if (type == 'mailcontact') { // ok
            if (Details.user.mail != '') {
                // Details.listSettings.shop[0].text = Details.user.contactmail;
            } else {
                Details.listSettings.shop[0].text = 'Email Contact';
            }
            Details.listSettings.shop[0].valid = false;
        }
        if (type == 'addressHQ') {
            if (Details.user.country != '' && Details.user.city != '') {

                Details.listSettings.hq[1].text = Details.user.country + ', ' + Details.user.city;
            } else if (Details.user.country != '') {
                Details.listSettings.hq[1].text = Details.user.country;
            } else {
                Details.listSettings.hq[1].text = 'HEADQUARTER ADDRESS';
            }
            if (Details.user.logconfirmed_hqaddress != 1 || test == true) {
                Details.listSettings.hq[1].valid = false;
                Details.user.logconfirmed_hqaddress = -1;
            }
        }
        if (type == 'addressSHOP') {
            if (Details.user.country != '' && Details.user.city != '') {

                Details.listSettings.shop[2].text = Details.user.country + ', ' + Details.user.city;
            } else if (Details.user.country != '') {
                Details.listSettings.shop[2].text = Details.user.country;
            } else {
                Details.listSettings.shop[2].text = 'SHOP ADDRESS';
            }
            if (Details.user.logconfirmed_shopaddress != 1 || test == true) {
                Details.listSettings.shop[2].valid = false;
                Details.user.logconfirmed_shopaddress = -1;
            }
        }
        this.SetDetails(Details);
    };
    var UpdateData = function(scopeData, type) {
        var test = false;
        if (type == 'address') {
            if (Details.user.line1 == '' || Details.user.line1 == null) {
                // scopeData.percentage += 17;
            }
            if (Details.user.line1 != scopeData.line1) {
                test = true;
            }
            if (Details.user.line2 != scopeData.line2) {
                test = true;
            }
            if (Details.user.city != scopeData.city) {
                test = true;
            }
            if (Details.user.zip != scopeData.zip) {
                test = true;
            }
            if (Details.user.country != scopeData.country) {
                test = true;
            }
            $rootScope.$emit("settingStartprogress", {});
        }
        if (type == 'PersonalInformation') {
            if (Details.user.fname != scopeData.fname) {
                test = true;
            }
            if (Details.user.fname != scopeData.fname) {
                test = true;
            }
            if (Details.user.birth != scopeData.birth) {
                test = true;
            }
            if (Details.user.sexe != scopeData.sexe) {
                test = true;
            }
        }

        Details.user = scopeData;
        if (type == 'PersonalInformation') {
            // var datebirth = new Date(Details.user.birth);
            // Details.listSettings.PersonalInfos[1].text = (datebirth.getMonth() + 1) + '/' + datebirth.getDate() + '/' + datebirth.getFullYear();
            Details.user.lname = Details.user.lname.toUpperCase();
            Details.user.fname = Details.user.fname.replace(/\w\S*/g, function(txt) {
                return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
            });
            Details.user.logconfirmed_name = -1;
        }

        if (type == 'phone') {
            if (Details.user.phone != '' && Details.user.Indicatif != '') {
                Details.listSettings.PersonalInfos[2].text = Details.user.Indicatif + ' ' + Details.user.phone;
            } else {
                Details.listSettings.PersonalInfos[2].text = 'Phone Number';
            }
            //Details.listSettings.PersonalInfos[2].valid = false;
        }
        if (type == 'mail') {
            if (Details.user.mail != '') {
                // Details.listSettings.PersonalInfos[3].text = Details.user.mail;
            } else {
                Details.listSettings.PersonalInfos[3].text = 'Email Address';
            }
            Details.listSettings.PersonalInfos[3].valid = false;
        }
        if (type == 'address') {
            if (Details.user.country != '' && Details.user.city != '') {

                Details.listSettings.PersonalInfos[4].text = Details.user.country + ', ' + Details.user.city;
            } else if (Details.user.country != '') {
                Details.listSettings.PersonalInfos[4].text = Details.user.country;
            } else {
                Details.listSettings.PersonalInfos[4].text = 'Locale Address';
            }
            if (Details.user.logconfirmed_address != 1 || test == true) {
                Details.listSettings.PersonalInfos[4].valid = false;
                Details.user.logconfirmed_address = -1;
            }
        }
        this.SetDetails(Details);
    };
    var UpdatePercentage = function(percentage){
        Details.user.percentage = percentage;
        this.SetDetails(Details);
        $rootScope.$emit("settingStartprogress", {});
    };
    var UpdateValidate = function(percentage) {
        if(Details.isPro){
            ////console.log(('$rootScope.validateData.id',$rootScope.validateData.id)
            switch ($rootScope.validateData.id) {
                case 0: // name company
                    Details.user.logconfirmed_name = 0;
                    break;
                case 1: // adress shop
                    Details.listSettings.shop[2].valid = false;
                    Details.user.logconfirmed_shopaddress = 0;
                    break;
                case 2: // address hq
                    Details.listSettings.hq[1].valid = false;
                    Details.user.logconfirmed_hqaddress = 0;
                    break;
            }
        }else{
            switch ($rootScope.validateData.id) {
                case 0: // name
                    Details.user.logconfirmed_name = 0;
                    break;
                case 1: //birth
                    Details.user.logconfirmed_birth = 0;
                    break;
                case 4: // address
                    Details.listSettings.PersonalInfos[4].valid = false;
                    Details.user.logconfirmed_address = 0;
                    break;
            }
        }
        ////console.log(('UpdateValidate percentage: ',percentage)
        Details.user.percentage = percentage;
        this.SetDetails(Details);
        $rootScope.$emit("settingStartprogress", {});
    };
    var AddAccount = function(obj) {
        Details.accounts.push(obj);
        this.SetDetails(Details);
    };
    var UpdateAccount = function(index, obj) {
        Details.accounts[index] = obj;
        this.SetDetails(Details);
    };
    var UpdateListAccounts = function(list) {
        Details.accounts = list;
        this.SetDetails(Details);
    };
    var DeleteAccount = function(index) {
        Details.accounts.splice(index, 1);
        this.SetDetails(Details);
    };
    var destroyAccount = function() {
        Details.accounts = {};
        this.SetDetails(Details);
    };
    return {
        UserEmail: UserEmail,
        Authenticated: false,
        lng: 0,
        lat: 0,
        Details: Details,
        Deconnect: false,
        IsNew: false,
        UpdateSettings: UpdateSettings,
        UpdateData: UpdateData,
        UpdateDataPro : UpdateDataPro,
        SetDetails: SetDetails,
        destroyUserData: destroyUserData,
        UpdateValidate: UpdateValidate,
        UpdatePercentage : UpdatePercentage,
        AddAccount: AddAccount,
        UpdateAccount: UpdateAccount,
        DeleteAccount: DeleteAccount,
        destroyAccount: destroyAccount,
        UpdateListAccounts: UpdateListAccounts,
        GetDetails: GetDetails,
        UpdatePhoto: UpdatePhoto, 
        UpdateCover:UpdateCover,
        UpdateLogo:UpdateLogo,
        UpdatePhotoMulti: UpdatePhotoMulti,
        RemovePhoto: RemovePhoto
    };
})

.factory('crypt', function() {
    return {
        sha256: function(value) {
            // var str = JSON.stringify(value);
            return CryptoJS.SHA256(value).toString();
        },
        sha1: function(value) {
            return CryptoJS.SHA256(value).toString();
        }
    };
})

.service('Catgs', function(Go, $q, $storage) {
    var List = [];
    var Sync = function(forlist) {
        return $q(function(resolve, reject) {
            var postData  = {
                task:"getAllCategories",
                forlist: 1
            };
            if(forlist)postData['forlist'] = 1;
            Go.post(postData).then(function(data) {
                if (data.success == 1) {

                    data.listcats.unshift({text:'',value:'-1',group:data.listcats[0].group});
                    $storage.setObject('categoriesList1', data.listcats);
                    ////console.log(('getAllCategories', $storage.getObject('categoriesList1'));

                    var i; var listview = [];
                    for(i = 0; i < data.listcats.length; i++){
                        data.listcats.name = data.listcats[i]['text'];
                        // if(data.listcats[i]['value'] != -1){
                        //     listview.push({view :data.listcats[i]['text'],id:data.listcats[i]['value']});
                        // }
                        delete data.listcats[i].view;
                        delete data.listcats[i].group;
                        delete data.listcats[i].text;

                    }

                    ////console.log(("listview",listview)
                    $storage.setObject('categoriesListView', listview);
                    $storage.setObject('categoriesList2', data.listcats);
                    ////console.log(('getAllCategories for name: ', $storage.getObject('categoriesList2'));
                    resolve(data.listcats);
                } else {
                    Alert.error(data.message);
                    reject();
                }
            });

            Go.post({
                "task": "getAllCategories",
                "forlist" : 2
            }).then(function(data) {
                if(data.success == 1){
                    $storage.setObject('nestedCategories', data.listcats);
                }
            })
        });
    };
    var getNestedCats = function () {
        return $storage.getObject('nestedCategories')
    }
    var get = function() {
        var data = $storage.getObject('categoriesList1'); 
        ////console.log(('store data', data)
        if (data == {}) {
            data = [{
                'id':0,
                'view': 'view'
            }];
        }
        //console.log("datadatadatadatadatadata", data)
        return data;
    };
    var getName = function() {
        var data = $storage.getObject('categoriesList2');
        ////console.log(('store data', data)
        if (data == {}) {
            data = [{
                'id':0,
                'name': 'name'
            }];
        }
        return data;
    };
    var getCatById = function(idcat) {
     
        var promise = new Promise(function(resolve, reject) { 
            angular.forEach( $storage.getObject('categoriesList1'), function (cat, index) {
                if( cat.value == idcat){
                    resolve( cat.group +" - "+ cat.text ) 
                } 
            })
        }); 

        return promise;
    };
    return {
        List: List,
        Sync: Sync,
        getNestedCats: getNestedCats,
        get: get,
        getName: getName,
        getCatById: getCatById
    }
})

.service('Notifs', function(Go, $q, Alert, $storage) {
    
    var Nlist = [];
    var loadedNotif = false;
    var getAllNotifs = function() { 
        
        if( !loadedNotif ){ 
            loadedNotif = true; 
            return $q(function(resolve, reject) { 

                Go.post({
                    "task": "getAllNotifs", //getInfosAccount
                    "NoLoader": true,
                    "page": 0
                }).then(function(data) {  
                    loadedNotif = false;
                    if (data.success == 1) {
                        Nlist = data.requests;
                        $storage.setObject('NotifList', Nlist); 
                        resolve(data);
                    } else {
                        Alert.error(data.message);
                        reject();
                    }

                    setTimeout(function () {
                        loadedNotif = false;
                    },3000)
                });
                
                    
            });
        }else{ 
            return $q(function(resolve, reject) { 
                reject();
            });
        }
    };
    var getNotifById = function(id, inlocal) {
        if (typeof inlocal === 'undefined') inlocal = false;
        if (inlocal) {
            Nlist = $storage.getObject('NotifList');
            var result = null;
            Nlist.forEach(function(element) {
                // ////console.log(('Notif element',element)
                if (element.id == id) {
                    result = element;
                    // return result;
                }
            }, this);
            return result;
        } else {
            return $q(function(resolve, reject) {
                Go.post({
                    "task": "getDetailNotif",
                    'notifid': id
                }).then(function(data) {
                    if (data.success == 1) {
                        // ////console.log(('Not: ', data.detailsnotif);
                        resolve(data.detailsnotif);

                    } else {
                        Alert.error(data.message);
                        reject();
                    }
                });
            });
        }
    };
    var removeNotifObject = function(obj) {
        Nlist = $storage.getObject('NotifList'); 
        if( Nlist ){
            Nlist.splice(Nlist.indexOf(obj), 1);
            $storage.setObject('NotifList', Nlist);
        }
        
    };
    return {
        getAllNotifs: getAllNotifs,
        getNotifById: getNotifById,
        removeNotifObject: removeNotifObject,
        Nlist: Nlist
    };
})

.service('Alert', function($timeout, $q, $state, $ionicLoading, $filter) {
    var showMessage = true;
    var success = function(message, title) {
        if (typeof title === 'undefined')
            title = '';
        if (showMessage) { 
            var Tdelay = 4000;
            $timeout(function() {
                swal({
                    title: title,
                    html: message,
                    type: 'success',
                    TitleColor: '#254E7B',
                    timer: Tdelay
                }).then(function(){
                    loader(false);
                });
                showMessage = false;
                $timeout(function() {
                    showMessage = true;
                }, Tdelay);
            }, 800);
        }
    };
    var success2 = function(state, textButton, Message, title) {
        $state.go(state, {}, {
             reload: true
        });
        if (typeof title === 'undefined')
            title = $filter('translate')('global_fields.congratulation'); 
        swal({
            title: title,
            text: Message,
            type: "success",
            confirmButtonColor: "#254e7b",
            confirmButtonText: textButton,
            preConfirm: function() {
                return new Promise(function(resolve, reject) {
                    resolve(1);
                });
            },
            preCancel: function() {
                return new Promise(function(resolve, reject) {
                    resolve(0);
                });
            }
        }).then(function(){ 

        });
    };
    var error = function(message, title) { 
        if (typeof title === 'undefined')
            title = "";//$filter('translate')('global_fields.an_error_occured');
        if (showMessage) {
            var Tdelay = 5000;
            $timeout(function() {
                swal({
                    title: title,
                    text: message,
                    type: 'error',
                    // timer: Tdelay,
                    showConfirmButton: true
                }).then(function(){
                    loader(false);
                });
                showMessage = false;
                $timeout(function() {
                    showMessage = true;
                }, Tdelay);
            }, 800);
        }
    };
    var alert = function(message, title) {
        if (typeof title === 'undefined')
            title = "";//$filter('translate')('global_fields.an_error_occured');
        if (showMessage) {
            var Tdelay = 3000;
            $timeout(function() {
                swal({
                    title: title,
                    text: message,
                    type: 'warning', 
                    showCancelButton: true, 
                });
                showMessage = false;
                $timeout(function() {
                    showMessage = true;
                }, Tdelay);
            }, 800);
        }
    };
    var Congratulation = function(state, textButton, Message, title) {
        // alert('congratulation')
        if (typeof title === 'undefined')
            title = $filter('translate')('global_fields.congratulation');
        $state.go(state, {}, {
             reload: true
        }); 
        swal({
            title: title,
            text: Message,
            type: "success",
            confirmButtonColor: "#254e7b",
            confirmButtonText: textButton,
            preConfirm: function() {
                return new Promise(function(resolve, reject) {
                    resolve(1);
                });
            },
            preCancel: function() {
                return new Promise(function(resolve, reject) {
                    resolve(0);
                });
            },
            allowOutsideClick: false
        }).then(function(data) { 
            if (data == 1) {
                $timeout(function() {
                    // $state.go(state);
                }, 500);
            }
        });
    };
    var warning = function(state, textButton, Message, title) {
        // alert('congratulation')
        if (typeof title === 'undefined')
            title = $filter('translate')('global_fields.warning'); 
        swal({
            title: title,
            text: Message,
            type: "warning",
            confirmButtonColor: "#254e7b",
            confirmButtonText: textButton,
            preConfirm: function() {
                return new Promise(function(resolve, reject) {
                    resolve(1);
                });
            },
            preCancel: function() {
                return new Promise(function(resolve, reject) {
                    resolve(0);
                });
            },
            allowOutsideClick: false
        }).then(function(data) { 
            if (data == 1) {
                $timeout(function() {
                    $state.go(state);
                }, 500);
            }
        });
    };
    var payment_congratulation = function(message, title) {
        if (typeof title === 'undefined')
            title = $filter('translate')('global_fields.congratulation');
        swal({
            title: title,
            text: message,
            type: 'success',
            timer: 4000,
            showConfirmButton: false
        });
    };
    var ask = function(message, title) { 
        if (typeof title === 'undefined')  title = $filter('translate')('global_fields.confirmation');

        return $q(function(resolve1, reject1) {
            swal({
                title: title, 
                type: "info",
                html: message,
                showCancelButton: true,
                confirmButtonColor: "#254e7b",
                confirmButtonText: $filter('translate')('global_fields.yes'),
                cancelButtonText: $filter('translate')('global_fields.no'),
                customClass: "customSwal",
                showLoaderOnConfirm: true,
                preConfirm: function() {
                    return new Promise(function(resolve, reject) {
                        resolve(true);
                    });
                },
                preCancel: function() {
                    return new Promise(function(resolve, reject) {
                        reject();
                    });
                },
                allowOutsideClick: false
            }).then(function (state) { 
                if(state){
                    resolve1()
                }
            }, function (state) { 
                reject1()
            }) 

        });

    };
    var loader = function(etat) {
        // alert(etat)
        if (etat == true) {
            $ionicLoading.show({
                 // template: '<ion-spinner icon="android"></ion-spinner>',
                content: 'Loading',
                animation: 'fade-in',
                showBackdrop: true,
                maxWidth: 200,
                showDelay: 0
            }); 
        } else {
            $ionicLoading.hide();
        }
        return !etat;
    };
    var info = function (msg) {
        swal({
            title: $filter('translate')('global_fields.information'),
            text: msg,
            type: "info",
            showCancelButton: true,
            showConfirmButton: false,
            confirmButtonColor: "#254e7b", 
            cancelButtonText: $filter('translate')('global_fields.close'),
            showLoaderOnConfirm: true,
            allowOutsideClick: false
        })
    }
    return {
        success: success,
        warning: warning,
        ask: ask,
        alert: alert,
        error: error,
        success2: success2,
        Congratulation: Congratulation,
        payment_congratulation: payment_congratulation,
        loader: loader,
        info: info
    };
}) 

.factory('Go', function($http, User, $q, Alert, $state, Navigate, crypt, SharedService, $ionicLoading,$rootScope, AuthService, API, $location, Geo, $ionicHistory, Protocole, $filter) {

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
    
    var self = this;
    var is = function(partOf) {
        if ($location.path().indexOf(partOf) > -1) {
            return true;
        } else {
            return false;
        }
    };
    var SPost = function(postData, alert) {
        return new Promise(function(resolve1, reject1) {
            if (typeof alert === "undefined") {
                alert = true;
            }
            
            // swal({
            //     title: 'Your password',
            //     input: 'password',
            //     confirmButtonColor: '#254E7B',
            //     showCancelButton: true,
            //     confirmButtonText: 'Submit',
            //     showLoaderOnConfirm: true,
            //     preConfirm: function(password) {
            //         return new Promise(function(resolve, reject) {
            //             var validationList = [{
            //                 type: 'passwordr',
            //                 value: password
            //             }];
            //             var Result = SharedService.Validation(validationList, false);
            //             if (Result == true) {
            //                 postData["password"] = crypt.sha256(password);
            var hideLoader = false;
            if(typeof postData['hideLoader'] !== 'undefined'){
                if(postData['hideLoader'] == true){
                    hideLoader = true;
                }
            }
            post(postData).then(function(data, alert) {
                ////console.log(('Thank SPost : ', data);
                resolve1(data);
            });
            //             } else if (Result != false) {
            //                 reject(Result);
            //             }
            //         });
            //     },
            //     allowOutsideClick: false
            // }).then(function(data) {
            //     resolve1(data);
            // });
        });
    };
    var SGeoPost = function(postData, alert) {
        return new Promise(function(resolve1, reject1) {
            if (typeof alert === "undefined") {
                alert = true;
            }
            // swal({
            //     title: 'Your password',
            //     input: 'password',
            //     confirmButtonColor: '#254E7B',
            //     showCancelButton: true,
            //     confirmButtonText: 'Submit',
            //     showLoaderOnConfirm: true,
            //     preConfirm: function(password) {
            //         return new Promise(function(resolve, reject) {
            //             var validationList = [{
            //                 type: 'passwordr',
            //                 value: password
            //             }];
            //             var Result = SharedService.Validation(validationList, false);
            //             if (Result == true) {
            // postData["password"] = crypt.sha256(password);
            var hideLoader = false;
            if(typeof postData['hideLoader'] !== 'undefined'){
                if(postData['hideLoader'] == true){
                    hideLoader = true;
                }
            }
            GeoPost(postData).then(function(data, alert) {
                ////console.log(('Thank GeoPost : ', data);
                resolve1(data);
            });
            //             } else if (Result != false) {
            //                 reject(Result);
            //             }
            //         });
            //     },
            //     allowOutsideClick: false
            // }).then(function(data) {
            //     resolve1(data);
            // });
        });
    };
    var GeoPost = function(postData, alert) {
        return $q(function(resolve, reject) {
            if (typeof alert === "undefined") {
                alert = true;
            }
            Geo.getPosition().then(function(pos) {
                postData["lat"] = pos.lat;
                postData["long"] = pos.lng;
                post(postData, alert).then(function(data) {
                    if (data.success == 1) {
                        resolve(data);
                    } else {
                        reject(data.message);
                    }
                }, function(err) {
                    ////console.log(('err', err)
                });
            });
        });
    };
 
    var post = function(postData, alert) { //imadi
        if (typeof alert === "undefined") {
            alert = true;
        }

        var data = null;
        var deferred = $q.defer();
        var NoToken = false;
        if (postData.task == 'ForgotPasswordSendSMS' || postData.task == 'InscriptionInsertUser' || postData.task == 'SHOP_InscriptionCompanyInfos' || postData.task == 'InscriptionSendEmail') {
            NoToken = true;
        } else {
            if (AuthService.isAuthenticated == false) {
                Alert.error( $filter('translate')('global_fields.session_lost') );
                deferred.reject;
            } else {
                AuthService.loadUserCredentials();
            }
        }
        var hideLoader = false;
        if(typeof postData['hideLoader'] !== 'undefined'){
            if(postData['hideLoader'] == true){
                hideLoader = true;
            }
        }
        if( !postData.NoLoader || postData.hideLoader ){
            Alert.loader(true);
        } 


        /////////////////////////////////////////////
        if( User.GetDetails() ){
            var UserDetails = User.GetDetails();
            postData['countupdate'] = UserDetails.user.countupdate;  
        } 
        /////////////////////////////////////////////
        console.log("/////////////////////////////////////////////");
        console.log("Post DATA :", postData);
        console.log("/////////////////////////////////////////////");
        var request = Protocole.post( postData )
            request.then(function( data ) { 

                ////////////////////////////////////////////////////////////
                
                if( User.GetDetails() ){
                    if(data.success == 1 && data.NewUserDetails){
                        var UserDetails = User.GetDetails();
                        NewUserDetails = data.NewUserDetails; 
                        NewUserDetails.isPro = UserDetails.isPro;
                        NewUserDetails.isshop = UserDetails.isPro;
                        $rootScope.isPro = UserDetails.isPro;
                        NewUserDetails.userInfos = UserDetails.userInfos;   
                        User.SetDetails(NewUserDetails); 
                        console.log("new Data : ", NewUserDetails)
                        var UserDetails = User.GetDetails(); 
                        console.log("After update : ", UserDetails)
                        $rootScope.$emit("settingStartprogress", {}); 
                    }
                } 
                ////////////////////////////////////////////////////////////
                
                if (data.success == 1) {
                    if (NoToken) {
                        //AuthService.storeUserCredentials(data.userToken);
                    }
                    deferred.resolve(data);
                }   
                else if(data.success == 0){ 

                    Alert.error( data.message )
                    if (!is('addprofile')) { 
                        AuthService.Directlogout();
                    } 

                }else if (data.success == -1) { // deja suspendu 
                    $ionicLoading.hide();
                    //storeUserCredentials(data.userToken);
                    $location.path('/blocked');
                }else if (data.success == -2) { // bloque par l'admin
                    // deleted by admin
                    //console.log('deleted by admin')
                    Alert.error( data.message )
                    if (!is('addprofile')) { 
                        AuthService.Directlogout();
                    } 
                    reject($filter('translate')('sign_in.login_failed'));  
                }
                else if (data.success == -3) { // email pas encore valide
                    ////console.log(data)
                    //storeUserCredentials(data.userToken);
                    $location.path('/email-not-validated');
                    $ionicLoading.hide();
                }
                else if (data.success == -4) { // deleted profile
                    ////console.log(data)
                    Alert.error( data.message )
                    $rootScope.deleteUserFromTouchIdList( name )
                    if (!is('addprofile')) { 
                        AuthService.Directlogout();
                    } 
                }else if (data.success == -11) { // suspention suite a la geolocalisation
                    //storeUserCredentials(data.userToken);
                    Alert.loader(true);
                    swal({
                        title: "",
                        text: data.message,
                        type: 'error',
                        showConfirmButton: true
                    }).then(function(){
                        Alert.loader(false);
                    });
                    reject($filter('translate')('sign_in.login_failed'));
                    if (!is('addprofile')) { 
                        AuthService.Directlogout();
                    } 
                    setTimeout(function () {
                        $location.path('/blocked');
                    },1000)
                }else if(data.success == 1022){  /// probleme de geolocalisation
                    Geo.activeGpsPopin();
                }
                else {
                    Alert.loader(true);
                    swal({
                        title: "",//$filter('translate')('global_fields.an_error_occured'),
                        text: data.message+"<br><br>",
                        type: 'error', 
                        showConfirmButton: true
                    }).then(function(){
                        Alert.loader(false);
                    }); 
                }

                // if( data.success == 0 || data.success == -1 || data.success == 12 ){
                //     // *************************************************** LogOut user ********************************************************
                //     AuthService.destroyUserCredentials(); 
                //     window.localStorage.setItem('username_a0f55e81c44553384a9421', '');

                //     $rootScope.isLogin = false;  
                //     isLogout = true; 
                //     $('.wrapper.page').addClass('isLogout');
                //     $ionicHistory.clearHistory();
                //     $ionicHistory.clearCache();
                //     // ************************************************************************************************************************
                // }
                    

                Alert.loader(false);
            })
            // .error(function(error) { 
            //     Alert.error("Check your connection !!");
            //     deferred.reject;
            //     Alert.loader(false);
            // })
            // .finally(function() {
            //     Alert.loader(false);
            // });
        // return deferred.promise;
        return request;
    }; 
    return {
        is: is,
        SPost: SPost,
        SGeoPost: SGeoPost,
        GeoPost: GeoPost,
        post: post 
    };
})

.service('Navigate', function($location, $window) {
    var that = this;
    // var NavigationList = [];
    return {
        // NavigationList: [],
        BeforeLoad: function(newLocation) {
            $('body').scrollTop(0);
            isGoBack = false;
            for (var i = 0; i < NavigationList.length; i++) {
                if (NavigationList[i] == newLocation) {
                    isGoBack = true;
                    NavigationList = NavigationList.slice(0, i + 1);
                    break;
                }
            }
            if (isGoBack == false) {
                if (newLocation != NavigationList[NavigationList.length - 1]) {
                    NavigationList.push(newLocation);
                }
            }
            // if /home delete all others
            $('.wrapper.page').removeClass('gostep');
            $('.wrapper.page').removeClass('backstep');
            $('.wrapper.page').removeClass('isLogin');
            $('.wrapper.page').removeClass('isLogout');
            if (isLogin) {
                $('.wrapper.page').addClass('isLogin');
            } else if (isLogout) {
                $('.wrapper.page').addClass('isLogout');
            } else {
                if (isGoBack) {
                    $('.wrapper.page').addClass('backstep');
                } else {
                    $('.wrapper.page').addClass('gostep');
                }
            }
        },
        GoNext: function(link) {
            $location.path(link);
        },
        GoNext2: function(link) {
            var num = 0;
            var getTheLink = false;
            for (var i = NavigationList.length - 1; i >= 0; i--) {
                if (NavigationList[i] == link) {
                    getTheLink = true;
                    break;
                } else {
                    num--;
                }
            }
            if (getTheLink) {
                $window.history.go(num);
            } else {
                $location.path(link);
            }
        },
        GoBack: function() {
            $window.history.back();
        }
    };
})

.service('Geo', function($cordovaGeolocation, $q, $http, Alert, User, Protocole, $filter) {
    
    var thiservice = {
        getPosition: function() {
            Alert.loader(true);
            var promise = new Promise(function(resolve, reject) { 

                var self = this;
                var lat = 0;
                var long = 0;
                var deferred = $q.defer();
                var posOptions = {
                    timeout: 10000,
                    enableHighAccuracy: false
                };
                if(window.cordova){
                // if( 1){
                    $cordovaGeolocation
                    .getCurrentPosition(posOptions)
                    .then(function(position) {  
                        resolve({
                            lat: position.coords.latitude,
                            lng: position.coords.longitude
                        });
                        Alert.loader(false);
                    }, function(err) {
                        Alert.loader(false);
                        reject(false);  
                    });
                }else{
                    resolve({
                        lat: 31.638109,
                        lng: -8.014120
                    });
                }
                    
                 
            })
            return promise;
        },
        getAddress: function(lat, lng) {
            var deferred = $q.defer();
            var url = "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + lat + "," + lng + "&sensor=false&language=en";
            $.get(url).success(function(data) {
                var loc1 = data.results[0];
                var type, value, key;
                var arr_ret = new Array();
                $.each(loc1, function(k1, v1) {
                    if (k1 == "address_components") {
                        for (var i = 0; i < v1.length; i++) {
                            for (k2 in v1[i]) {
                                if (k2 == "types") {
                                    var types = v1[i][k2];
                                    type = types[0];
                                    value = v1[i].long_name;
                                    arr_ret[type] = value;
                                }
                            }
                        }
                    }
                });
                deferred.resolve(arr_ret);
                Alert.loader(false);
            }).error(function(error) {
                Alert.loader(false);
                deferred.reject;
            });
            return deferred.promise;
        },
        Geoloc: function(action) {
            if (typeof(action) === 'undefined')
                action = 'undefined';
            var self = this;
            var deferred = $q.defer();
            self.getPosition().then(function(position) {
                var postData = {
                    "task": "GeoLoc",
                    "lat": position.lat,
                    "long": position.lng,
                    "action": action
                };

                var request = Protocole.post( postData )
                request.then(function( data ) { 
                    if (data.success == 1) {
                        deferred.resolve(data);
                    } else {
                        deferred.reject;
                        Alert.error(data.message);
                    }
                }) 

                Go.post(postData).then(function(data) {
                    if (data.success == 1) {
                        deferred.resolve(data);
                    } else {
                        deferred.reject;
                        Alert.error(data.message);
                    }
                });
            });
            return deferred.promise;
        },
        isLocationAvailable: function () {
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
                            if( ionic.Platform.isIOS() ){
                                window.cordova.plugins.settings.open(["locations", true], function() {}, function() {});
                            }else{ 
                                cordova.plugins.diagnostic.switchToLocationSettings();
                            }
                        }
                    }, function () {})
                }
                
            }, function(error){
                console.error("The following error occurred: "+error);
            });
        },
        activeGpsPopin: function () {
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
                    if( ionic.Platform.isIOS() ){
                        window.cordova.plugins.settings.open(["locations", true], function() {}, function() {});
                    }else{ 
                        cordova.plugins.diagnostic.switchToLocationSettings();
                    }
                }
            }, function () {})
        }
    };

    return thiservice;
})

.service('SharedService', function(Alert, $location, $window, $timeout, $http, $cordovaGeolocation, $q, $filter) {
    var that = this;

    function getAgeFromDate(DatieObj) {  
        var Bday = DatieObj;
        var age = ((Date.now() - Bday) / (31557600000)); 
        return age;
    }

    return {
        GoNext: function(link) {
            var num = 0;
            var getTheLink = false;
            for (var i = NavigationList.length - 1; i >= 0; i--) {
                if (NavigationList[i] == link) {
                    getTheLink = true;
                    break;
                } else {
                    num--;
                }
            }
            if (getTheLink) {
                $window.history.go(num);
            } else {
                $location.path(link);
            }
        },
        Validation: function(list, alert) {
            Alert.loader(false);
            if (typeof alert === "undefined") {
                alert = true;
            }
            var message = '';
            for (var i = 0; i < list.length; i++) {
                var type = list[i].type;
                if (list[i].value != null) {
                    var value = list[i].value.toString();
                } else {
                    var value = '';
                }
 
                if (type == 'idbusinessType') {
                    if (value == -1) {
                        message = $filter('translate')("api.1523");//'Business Type is required';
                        break;
                    }
                } else if (type == 'idcategories') {
                    if (value == -1) {
                        message = $filter('translate')("api.1210");//'Category is required';
                        break;
                    }
                } else if (type == 'idsubcategories') {
                    if (value == -1) {
                        message = $filter('translate')("api.1524");//'Sub-category is required';
                        break;
                    }
                } else if (type == 'companyname') {
                    if (value.length == 0) {
                        message = $filter('translate')("api.1417");//'Company name is required';
                        break;
                    } else if (value.length < 3) {
                        message = $filter('translate')("api.1539");//'Invalid Company name';
                        break;
                    }
                }else if (type == 'website') {
                    if (value.length == 0) {
                            message = $filter('translate')("api.1424");//'Website Address is required';
                            break;
                    }else if (value.length > 0) {
                        // if(!/(((http|ftp|https):\/{2})+(([0-9a-z_-]+\.)+(aero|asia|biz|cat|com|coop|edu|gov|info|int|jobs|mil|mobi|museum|name|net|org|pro|tel|travel|ac|ad|ae|af|ag|ai|al|am|an|ao|aq|ar|as|at|au|aw|ax|az|ba|bb|bd|be|bf|bg|bh|bi|bj|bm|bn|bo|br|bs|bt|bv|bw|by|bz|ca|cc|cd|cf|cg|ch|ci|ck|cl|cm|cn|co|cr|cu|cv|cx|cy|cz|cz|de|dj|dk|dm|do|dz|ec|ee|eg|er|es|et|eu|fi|fj|fk|fm|fo|fr|ga|gb|gd|ge|gf|gg|gh|gi|gl|gm|gn|gp|gq|gr|gs|gt|gu|gw|gy|hk|hm|hn|hr|ht|hu|id|ie|il|im|in|io|iq|ir|is|it|je|jm|jo|jp|ke|kg|kh|ki|km|kn|kp|kr|kw|ky|kz|la|lb|lc|li|lk|lr|ls|lt|lu|lv|ly|ma|mc|md|me|mg|mh|mk|ml|mn|mn|mo|mp|mr|ms|mt|mu|mv|mw|mx|my|mz|na|nc|ne|nf|ng|ni|nl|no|np|nr|nu|nz|nom|pa|pe|pf|pg|ph|pk|pl|pm|pn|pr|ps|pt|pw|py|qa|re|ra|rs|ru|rw|sa|sb|sc|sd|se|sg|sh|si|sj|sj|sk|sl|sm|sn|so|sr|st|su|sv|sy|sz|tc|td|tf|tg|th|tj|tk|tl|tm|tn|to|tp|tr|tt|tv|tw|tz|ua|ug|uk|us|uy|uz|va|vc|ve|vg|vi|vn|vu|wf|ws|ye|yt|yu|za|zm|zw|arpa)(:[0-9]+)?((\/([~0-9a-zA-Z\#\+\%@\.\/_-]+))?(\?[0-9a-zA-Z\+\%@\/&\[\];=_-]+)?)?))/.test(value))
                        var regex = new RegExp('^((https?|ftp)://)?([a-z]+[.])?[a-z0-9-]+([.][a-z]{1,4}){1,2}(/.*[?].*)?$');
                        if(!regex.test(value.toLowerCase())) 
                        {
                            message = $filter('translate')("api.1540");//'Invalid Website Address';
                            break;
                        }
                    }
                } else if (type == 'website2') {
                    var regex = new RegExp('^((https?|ftp)://)?([a-z]+[.])?[a-z0-9-]+([.][a-z]{1,4}){1,2}(/.*[?].*)?$');
                    
                    if (value.length == 0) {
                        message = $filter('translate')("api.1424");//'Website Address is required';
                        break;
                    } else if (!regex.test(value.toLowerCase())){
                        message = $filter('translate')("api.1540");//'Invalid Website Address';
                        break;
                    }
                } else if (type == 'brandname') {
                    if (value.length == 0) {
                        message = $filter('translate')("api.1541");//'Brand name is required';
                        break;
                    } else if (value.length < 3) {
                        message = $filter('translate')("api.1542");//'Invalid Brand name';
                        break;
                    }
                } else if (type == 'Description') {
                    if (value.length == 0) {
                        message = $filter('translate')("api.1543");//'Description is required';
                        break;
                    }
                } else if (type == 'email') {
                    if (value.length == 0) {
                        message = $filter('translate')("api.1003");//'Email Address is required';
                        break;
                    } else if (!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(value)) {
                        message = $filter('translate')("api.1010");//'Invalid Email Address';
                        break;
                    }
                } else if (type == 'confirmemail') {
                    if (value.length == 0) {
                        message = $filter('translate')("api.1544");//'Confirmation Email is required';
                        break;
                    } else {
                        value2 = '';
                        for (var k = 0; k < list.length; k++) {
                            var type = list[k].type;
                            if (type == 'email') {
                                if (list[k].value != null) {
                                    var value2 = list[k].value.toString();
                                } else {
                                    var value2 = '';
                                }
                                // break;
                            }
                        }
                        // setTimeout(function () {
                        //     if (value != value2) {
                        //         message = $filter('translate')("api.1455");//'Confirm email Must be equal to email';
                        //         break;
                        //     }
                        // })
                        

                    }
                }else if (type == 'emailContact') {
                    if (value.length == 0) {
                        message = $filter('translate')("api.1423");//'Contact email is required';
                        break;
                    }else if (value.length > 0) {
                        if (!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(value)) {
                            message = $filter('translate')("api.1545");//'Invalid Contact email Address';
                            break;
                        }
                    }
                }else if (type == 'actualpassword') {
                    if (value.length == 0) {
                        message = $filter('translate')("api.1097");//'actual password is required';
                        break;
                    } //else if (!/(?=^.{8,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/.test(value)) {
                    //     message = 'Your actual password is invalid';
                    //     break;
                    // }
                } else if (type == 'passwordr') {
                    if (value.length == 0) {
                        message = $filter('translate')("api.1069");//'Password is required';
                        break;
                    }
                } else if (type == 'password') {
                    if (value.length == 0) {
                        message = $filter('translate')("api.1069");//'Password is required';
                        break;
                    } else if (!/(?=^.{8,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/.test(value)) {
                        message = $filter('translate')("api.1546");//'Your password must contain at least one uppercase letter one lower case letter one number and at least 8 characters';
                        break;
                    }
                } else if (type == 'confirmePassword') {
                    if (value.length == 0) {
                        message = $filter('translate')("api.1030");//'Confirmation password is required';
                        break;
                    } else {
                        value2 = '';
                        for (var k = 0; k < list.length; k++) {
                            var type = list[k].type;
                            if (type == 'password') {
                                if (list[k].value != null) {
                                    var value2 = list[k].value.toString();
                                } else {
                                    var value2 = '';
                                }
                                // break;
                            }
                        }
                        if (value != value2) {
                            message = $filter('translate')("api.1031");//'Confirm password Must be equal to password';
                            break;
                        }
                    }
                } else if (type == 'firstname') {
                    var pattern =/^[a-zA-ZáàâäãåçéèêëíìîïñóòôöõúùûüýÿæœÁÀÂÄÃÅæÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ ]{1,}$/; 
                    if (value.length == 0) {
                        message = $filter('translate')("api.1077");//'First name is required';
                        break;
                    } else if (!pattern.test(value)) {
                        message = $filter('translate')("api.1547");//'Invalid First name';
                        break;
                    }
                } else if (type == 'lastname') {
                    var pattern =/^[a-zA-ZáàâäãåçéèêëíìîïñóòôöõúùûüýÿæœÁÀÂÄÃÅæÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ ]{1,}$/; 
                    if (value.length == 0) {
                        message = $filter('translate')("api.1026");//'Last name is required';
                        break;
                    } else if (!pattern.test(value)) {
                        message = $filter('translate')("api.1548");//'Invalid Last name';
                        break;
                    }
                } else if (type == 'answer1') {
                    if (value.length == 0) {
                        message = $filter('translate')("api.1046");//'Answer 1 is required';
                        break;
                    }
                    if( value.length < 3 ){
                        message = $filter('translate')("secret_questions.response_length");// The answer must contain at least 3 characters.
                        break;
                    }
                } else if (type == 'answer2') {
                    if (value.length == 0) {
                        message = $filter('translate')("api.1047");//'Answer 2 is required';
                        break;
                    }
                    if( value.length < 3 ){
                        message = $filter('translate')("secret_questions.response_length");// The answer must contain at least 3 characters.
                        break;
                    }
                } else if (type == 'answer3') {
                    if (value.length == 0) {
                        message = $filter('translate')("api.1048");//'Answer 3 is required';
                        break;
                    }
                    if( value.length < 3 ){
                        message = $filter('translate')("secret_questions.response_length");// The answer must contain at least 3 characters.
                        break;
                    }
                } else if (type == 'question1') {
                    if (value.length == 0) {
                        message = $filter('translate')("api.1141");//'Please select Question 1';
                        break;
                    }
                } else if (type == 'question2') {
                    if (value.length == 0) {
                        message = $filter('translate')("api.1142");//'Please select Question 2';
                        break;
                    }
                } else if (type == 'question3') {
                    if (value.length == 0) {
                        message = $filter('translate')("api.1143");//'Please select Question 3';
                        break;
                    }
                } else if (type == 'country') {
                    if (value.length == 0) {
                        message = $filter('translate')("api.1476");//'Country is required';
                        break;
                    }
                } else if (type == 'city') {
                    if (value.length == 0) {
                        message = $filter('translate')("api.1483");//'City is required';
                        break;
                    }
                } else if (type == 'adress') {
                    if (value.length == 0) {
                        message = $filter('translate')("api.1472");//'Address is required';
                        break;
                    }
                }else if (type == 'fullAddress') {
                    if (value.length == 0) {
                        message = $filter('translate')("api.1472");//'Full address is required';
                        break;
                    }
                } else if (type == 'adressLine1') {
                    if (value.length == 0) {
                        message = $filter('translate')("api.1474");//'Line 1 is required';
                        break;
                    }
                } else if (type == 'zip') {
                    if (value.length == 0) {
                        message = $filter('translate')("api.1549");//'ZIP Code is required';
                        break;

                    } else {
                        var listZipREG = [
                            /^([0-9]{5})(?:[-\s]*([0-9]{4}))?$/,
                            /^([A-Z][0-9][A-Z])\s*([0-9][A-Z][0-9])$/,
                            /^\d{5}(?:[-\s]\d{4})?$/,
                            /^[A-Za-z]{1,2}[0-9Rr][0-9A-Za-z]? [0-9][ABD-HJLNP-UW-Zabd-hjlnp-uw-z]{2}$/,
                            /^\d{3}\s?\d{2}$/,
                            /^((0[1-9]|5[0-2])|[1-4][0-9])[0-9]{3}$/,
                            /^[0-9]{2}\-[0-9]{3}$/,
                            /^(L\s*(-|—|–))\s*?[\d]{4}$/,
                            /^\d{3}-\d{4}$/,
                            /^[0-9]{5}$/,
                            /^[0-9]{4}$/,
                            /^[1-9][0-9]{3}\s?[a-zA-Z]{2}$/,
                            /^[0-9]{3,4}$/,
                            /^[A-Za-z][0-9][A-Za-z] [0-9][A-Za-z][0-9]$/,
                            /^[0-9]{5}[\-]?[0-9]{3}$/,
                            /^(\d{5}([\-]\d{4})?)$/
                        ];
                        var isOK = false;
                        for (var i = 0; i < listZipREG.length; i++) {
                            var element = listZipREG[i];
                            if (element.test(value)) {
                                isOK = true;
                            }
                        }
                        if (isOK == false) {
                            message = $filter('translate')("api.1550");//'Invalid ZIP Code';
                            break;
                        }
                    }
                } else if (type == 'codesms') {
                    if (value.length == 0) {
                        message = $filter('translate')("api.1066");//'Code SMS is required';
                        break;
                    } else if (!/^[0-9]{6}$/.test(value)) {
                        message = $filter('translate')("api.1551");//'Invalid Code SMS';
                        break;
                    }
                } else if (type == 'phoneFixe') {
                    if (value.length == 0) {
                        message = $filter('translate')("api.1552");//'Headquarter landline phone number is required';
                        break;
                    } else if (value.length > 0) {
                        if (!/^[0-9]{9}$/.test(value)) {
                            message =  $filter('translate')("api.1553");//'Invalid Headquarter landline phone number';
                            break;
                        }
                    } 
                } else if (type == 'phoneFixeShop') {
                    if (value.length == 0) {
                        message = $filter('translate')("api.1421");//'Shop landline phone number is required';
                        break;
                    } else if (!/^[0-9]{9}$/.test(value)) {
                        message = $filter('translate')("api.1422");//'Invalid Shop landline phone number';
                        break;
                    }
                } else if (type == 'phone') { 
                    if (value.length == 0) {
                        message = $filter('translate')("api.1430");//'Phone number is required';
                        break;
                    } else if (!/^[0-9]{9}$/.test(value)) {
                        message = $filter('translate')("api.1431");//'Invalid mobile number';
                        break;
                    }
                } else if (type == 'confirmePhone') {
                    if (value.length == 0) {
                        message = $filter('translate')("api.1554");//'Confirm Phone is required';
                        break;
                    } else {
                        value2 = '';
                        for (var k = 0; k < list.length; k++) {
                            var type = list[k].type;
                            if (type == 'phone') {
                                if (list[k].value != null) {
                                    var value2 = list[k].value.toString();
                                } else {
                                    var value2 = '';
                                }
                            }
                        }
                        if (value != value2) {
                            message = $filter('translate')("api.1555");//'Confirm phone Must be equal to phone';
                            break;
                        }
                    }
                } else if (type == 'birthdate') {
                    if (value.length == 0) {
                        message = $filter('translate')("api.1027");//'Birth date is required';
                        break;
                    } 
                    else {
                        var tabDate = value.split('/')
                        switch(list[i].lang){
                            case 'en':
                                DateObject = new Date( tabDate[2]+"/"+tabDate[0]+"/"+tabDate[1] );
                            break; 

                            default:
                                DateObject = new Date( tabDate[2]+"/"+tabDate[1]+"/"+tabDate[0] );
                            break;
                        }
                        if( isNaN(DateObject) ){
                            message = $filter('translate')("api.1679");//"invalid Birth date
                            break;
                            
                        }else{
                            if( getAgeFromDate(DateObject) < 12 ){ 
                                message = $filter('translate')("api.1557");//"You must be more than 12 years old"
                                break;
                            }
                            else if( getAgeFromDate(DateObject) > 130 ){ 
                                message = $filter('translate')("api.1679");//"invalid Birth date
                                break;
                            }
                        }
                        
                    }

                }else if (type == 'placebirth') {
                    var pattern =/^[a-zA-Z0-9áàâäãåçéèêëíìîïñóòôöõúùûüýÿæœÁÀÂÄÃÅæÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ._\s-]{1,}$/; 
                    if (value.length == 0) {
                        message = $filter('translate')("api.1707");//'placebirth is required';
                        break;
                    }
                }else if (type == 'birthcountry') {
                    var pattern =/^[a-zA-Z0-9áàâäãåçéèêëíìîïñóòôöõúùûüýÿæœÁÀÂÄÃÅæÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ._\s-]{1,}$/; 
                    if (value.length == 0) {
                        message = $filter('translate')("api.1714");//'birthcountry is required';
                        break;
                    }
                }else if (type == 'nationality') {
                    var pattern =/^[a-zA-Z0-9áàâäãåçéèêëíìîïñóòôöõúùûüýÿæœÁÀÂÄÃÅæÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ._\s-]{1,}$/; 
                    if (value.length == 0) {
                        message = $filter('translate')("api.1713");//'nationality is required';
                        break;
                    }
                } else if (type == 'createdat') {
                    if (value.length == 0) {
                        message = $filter('translate')("api.1556");//'Creation date is required';
                        break;
                    }else {
                        var tabDate = value.split('/')
                        switch(list[i].lang){
                            case 'en':
                                DateObject = new Date( tabDate[2]+"/"+tabDate[0]+"/"+tabDate[1] );
                            break; 

                            default:
                                DateObject = new Date( tabDate[2]+"/"+tabDate[1]+"/"+tabDate[0] );
                            break;
                        }
                        if( isNaN(DateObject) ){
                            message = $filter('translate')("api.1558");//"Invalid Creation date"
                            break;
                            
                        }else if( getAgeFromDate(DateObject) < 0 ){ 
                            message = $filter('translate')("api.1558");//"Invalid Creation date"
                            break;
                        }
                        
                    }  

                } else if (type == 'label') {
                    if (value.length == 0) {
                        message = $filter('translate')("api.1171");//'Label is required';
                        break;
                    }
                }
                else if (type == 'acountname') {
                    var pattern =/^[a-zA-Z0-9áàâäãåçéèêëíìîïñóòôöõúùûüýÿæœÁÀÂÄÃÅæÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ._'\s-]{1,}$/; 
                    if (!pattern.test(value)) {
                        message = $filter('translate')("api.1560");//'Invalid Account Name';
                        break;
                    }
                    if(value.match(/^\d/)) {
                        message = $filter('translate')("api.1561");//'The name of the account must imperatively begin with a letter';
                    }
                }
                else if (type == 'lockCode') {
                    if (value.length == 0) {
                        message = $filter('translate')("api.1589");//'Code is required;
                        break;
                    }
                    else if( value.length < 4 ){ 
                        message = $filter('translate')("api.1590");//"Your code must contain 4 numbers"
                        break;
                    }
                } 
                else if (type == 'currentLockCode') {
                    if (value.length == 0) {
                        message = $filter('translate')("api.1597");//"Actual code is required"
                        break;
                    }
                    else if( value.length < 4 ){ 
                        message = $filter('translate')("api.1600");//"Your code must contain 4 numbers"
                        break;
                    }
                }  
                else if (type == 'confirmLockCode') {
                    if (value.length == 0) {
                        message = $filter('translate')("api.1593");//'Confirmation code is required;
                        break;
                    }
                    else{ 
                        value2 = '';
                        for (var k = 0; k < list.length; k++) {
                            var type = list[k].type;
                            if (type == 'lockCode') {
                                if (list[k].value != null) {
                                    var value2 = list[k].value.toString();
                                } else {
                                    var value2 = '';
                                }
                            }
                        }
                        if (value != value2) {
                            message = $filter('translate')("api.1594");//'Codes does not match';
                            break;
                        }
                    }
                }
                else if (type == 'iban') {
                    if (value.length == 0) {
                        message = $filter('translate')("api.1677");//'IBAN is required;
                        break;
                    }
                    else if( value.length < 27 ){
                        message = $filter('translate')("api.1678");//'Invalid IBAN;
                        break;
                    }
                }
                else if (type == 'sharecapital') {
                    if (value.length == 0) {
                        message = $filter('translate')("api.1718");//'Share capital is required;
                        break;
                    }
                } 
                else if (type == 'vat') {
                    if (value.length == 0) {
                        message = $filter('translate')("api.1529");//'VAT Number is required
                        break;
                    }
                }  
                else if (type == 'registrationnum') {
                    if (value.length == 0) {
                        message = $filter('translate')("api.2131");//'Registration Number is required
                        break;
                    }
                }  
                else if (type == 'beneficiare') {
                    if (value.length == 0) {
                        message = $filter('translate')("api.2227");//$filter('translate')("api.1677");//'Pourcentage is required
                        break;
                    }
                    if (!isNumeric(value)) {
                        message = $filter('translate')("api.2205");//$filter('translate')("api.2131");//'invalid pourcentage value
                        break;
                    }else if ( parseFloat(value) < 25 || parseFloat(value) > 100 ) {
                        message = $filter('translate')("api.2206");//$filter('translate')("api.2131");//Value must be between 25% and 100%
                        break;
                    }
                }
                else if (type == 'capitalesocial') {
                    if (value.length == 0) {
                        message = $filter('translate')("api.2227");//$filter('translate')("api.1677");//'IBAN is required;
                        break;
                    }
                    if (!isNumeric(value)) {
                        message = $filter('translate')("api.2205");//$filter('translate')("api.2131");//'invalid pourcentage value
                        break;
                    }else if ( parseFloat(value) < 10 || parseFloat(value) > 25 ) {
                        message = $filter('translate')("api.2207");//$filter('translate')("api.2131");//'Value must be between 25% and 100%
                        break;
                    }
                } 
                else if (type == 'reason') {
                    if (value.length == 0) {
                        message = $filter('translate')("api.2325");//'reason is required';
                        break;
                    }
                }
            }
            Alert.loader(false);
            if (message != '') {
                if (alert) {
                    Alert.error(message);
                    return false;
                } else {
                    return message;
                }
            } else {
                return true;
            } 
        },
        dateEngToJs: function(strDate) { //mm-dd-yyyy
            var month = strDate.substring(0, 2);
            var day = strDate.substring(3, 5);
            var year = strDate.substring(6, 10);
            var d = new Date();
            d.setDate(day);
            d.setMonth(month - 1);
            d.setFullYear(year);
            return d;
        },
        dateMysqlToEng: function(strDate) { //1993-03-30 00:00:00
            var month = strDate.substring(5, 7);
            var day = strDate.substring(8, 10);
            var year = strDate.substring(0, 4);
            var d = new Date();
            d.setDate(day);
            d.setMonth(month - 1);
            d.setFullYear(year);
            return d;
        }
    };
}) 
.factory('Protocole', function($window, API, $http, Alert, $filter) {

    this.ipv6 = function ( type ,url, postData ) {
        console.log("IPV6 IPV6 IPV6 IPV6 IPV6 IPV6 IPV6 IPV6 IPV6 IPV6 IPV6 IPV6 ")
        
        var promise = new Promise(function(resolve, reject) { 
            var headers = {
                "cache-control": "no-cache, private, no-store, must-revalidate",
                "Authorization": $http.defaults.headers.common['Authorization'],
                "Content-Type": "application/x-www-form-urlencoded; charset=utf-8",
            }
            if(window.localStorage.getItem("0a8d74531550c76bb2da1337ba98")){
                headers.X_AUTHENTICATION_TOKEN = window.localStorage.getItem("0a8d74531550c76bb2da1337ba98")
            }

            switch( type ){
                case 'post':

                    if( !postData.NoLoader ){
                        Alert.loader(true);
                    } 
                    $window.CordovaHttpPlugin.post( url, postData, headers, function( res ) { 
                        Alert.loader(false);
                        console.log("res", JSON.parse(res.data))
                        // resolve( res.data );
                        resolve( JSON.parse(res.data) );
                    }, function(err) {
                        // Alert.error( $filter('translate')('global_fields.check_your_connection') ); 
                        //console.log("err", err)
                        Alert.loader(false);
                    });
                    break;

                case 'get':
                    if( !postData.NoLoader ){
                        Alert.loader(true);
                    } 
                    $window.CordovaHttpPlugin.get( url, postData.params, headers, function( res ) { 
                        Alert.loader(false);
                        //console.log("res", JSON.parse(res.data))
                        resolve( JSON.parse(res.data) );
                    }, function(err) {
                        // Alert.error( $filter('translate')('global_fields.check_your_connection') ); 
                        //console.log("err", err)
                        Alert.loader(false);
                    });
                    break;
            }
            
        });

        return promise; 
    }
    this.ipv4 = function ( type ,url, postData ) { 
        console.log("IPV4 IPV4 IPV4 IPV4 IPV4 IPV4 IPV4 IPV4 IPV4 IPV4 IPV4 IPV4 IPV4 IPV4 IPV4 ")
        
        var promise = new Promise(function(resolve, reject) {

            switch( type ){
                case 'post':
                    if( !postData.NoLoader ){
                        Alert.loader(true);
                    } 
                    $http.post( url,
                    postData)
                    .success(function (data) { 
                        Alert.loader(false);
                        resolve( data );
                    })
                    .error(function(error) { 
                        // Alert.error( $filter('translate')('global_fields.check_your_connection') ); 
                        Alert.loader(false);
                    })
                    .finally(function() {
                        Alert.loader(false);
                    });
                    break;

                case 'get': 
                    if( !postData.NoLoader ){
                        Alert.loader(true);
                    } 
                    $http.get( url,
                    postData)
                    .success(function (data) { 
                        Alert.loader(false);
                        //console.log("res", data)
                        resolve( data );
                    })
                    .error(function(error) { 
                        // Alert.error( $filter('translate')('global_fields.check_your_connection') );
                        //console.log("error", error) 
                        Alert.loader(false);
                    })
                    .finally(function() {
                        Alert.loader(false);
                    });
                    break;
            }
            
        });
        return promise; 
    }
    this.post = function ( postData ) { 
        if( ionic.Platform.isIOS() && $window.CordovaHttpPlugin ){
            var req = $.when( this.ipv6( 'post', API.url, postData ) )
            var promise = new Promise(function(resolve, reject) {
                req.then(function (data) {
                    resolve( data )
                })
            })
            return promise;
        }else{ 
            var req = $.when( this.ipv4( 'post', API.url, postData ) )
            var promise = new Promise(function(resolve, reject) {
                req.then(function (data) {
                    resolve( data )
                })
            })
            return promise;
        } 
    }

    this.post_with_url = function ( url, postData ) { 

        if( ionic.Platform.isIOS() && $window.CordovaHttpPlugin ){
            var req = $.when( this.ipv6( 'post', url, postData ) )
            var promise = new Promise(function(resolve, reject) {
                req.then(function (data) {
                    resolve( data )
                })
            })
            return promise;
        }else{ 
            var req = $.when( this.ipv4( 'post', url, postData ) )
            var promise = new Promise(function(resolve, reject) {
                req.then(function (data) {
                    resolve( data )
                })
            })
            return promise;
        } 
    }

    this.get_with_url = function ( url, postData ) {  
        if( ionic.Platform.isIOS() && $window.CordovaHttpPlugin ){
            var req = $.when( this.ipv6( 'get', url, postData ) )
            var promise = new Promise(function(resolve, reject) {
                req.then(function (data) {
                    resolve( data )
                })
            })
            return promise;
        }else{ 
            var req = $.when( this.ipv4( 'get', url, postData ) )
            var promise = new Promise(function(resolve, reject) {
                req.then(function (data) {
                    resolve( data )
                })
            })
            return promise;
        } 
    }

    return this;
})

.service('LockScreen', function( $lockScreen, $cordovaTouchID, $filter, AuthService, Protocole, $location, Alert, $rootScope, $ionicHistory, User ) {
        
        var thiservice = this;
    
        thiservice.show = function () {
            // return; 
            $lockScreen.show({
                code: window.localStorage.getItem('lockCode'), 
                passcodeLabel:  $filter('translate')('passcode.enter_passcode'),
                textLink:  $filter('translate')('passcode.service_client'),
                touchId: true, 
                onCorrect: function () { 
                     window.localStorage.setItem('locked', 0)
                },
                onWrong: function (attemptNumber) {
                  navigator.vibrate(200)
                  setTimeout(function(){
                  navigator.vibrate(200)
                  },500)
                  console.log("attemptNumber", attemptNumber)
                  if( attemptNumber == 3 ){ 
                    Alert.error( $filter('translate')('passcode.faild_lockout') )
                    setTimeout(function () {
                        thiservice.logout() 
                    }, 1500)
                  }
                }
            });  
        }    


        thiservice.verif = function (code, callBackFunction, wrongCodeThreeTimes ) {
            
            $lockScreen.show({
                code: code, 
                passcodeLabel:  $filter('translate')('passcode.enter_passcode'),
                textLink:  $filter('translate')('passcode.service_client'),
                touchId: true,
                cancelBtn: $filter('translate')('global_fields.cancel'),
                onCorrect: function () { 
                    callBackFunction();
                },
                onWrong: function (attemptNumber) {
                    
                      navigator.vibrate(200)
                      setTimeout(function(){
                      navigator.vibrate(200)
                      },500)
                      if( attemptNumber >= 3 ){ 
                          wrongCodeThreeTimes()
                          $lockScreen.hide(); 
                          Alert.error( $filter('translate')('passcode.faild_lockout') )
                      }
                }
            });
        }

        thiservice.logout = function () {
            var postData = {
                 "task": "LogOut",
                 "blocedcode": 1
            }
            Alert.loader(true);
            var request = Protocole.post( postData )
            request.then(function( data ) {  
                var userInfos = User.GetDetails().userInfos;
                $rootScope.deteleUserFromConnectedUserList(userInfos.id, userInfos.isshop)

                Alert.loader(false);

                if(data.success == 1){
                    window.localStorage.setItem('loged', '0');  
                    $location.path('/sign-in'); 
                    
                    $rootScope.isLogin = false;
                    User.destroyAccount();
                    User.destroyUserData()
                    isLogout = true; 
                    $('.wrapper.page').addClass('isLogout');
                    $ionicHistory.clearHistory();
                    $ionicHistory.clearCache(); 

                    $('body').removeClass('lockScreen'); 
                    $lockScreen.hide();
                    $lockScreen.resetAttempt();
                }
                
            })
        }
    return thiservice;
})

.service('AppServices', function($filter) {
    return {
        updateApp: function (data) {
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
                    if( ionic.Platform.isIOS() ){
                        window.open("itms-apps://itunes.apple.com/app/"+data.iosappid, '_system')
                    }else{
                        window.open("https://play.google.com/store/apps/details?id="+data.andriodappid, '_system')
                    }
                }
            }, function () {})
        },
        linkify : function (inputText) {
            var replacedText, replacePattern1, replacePattern2, replacePattern3;

            //URLs starting with http://, https://, or ftp://
            replacePattern1 = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
            replacedText = inputText.replace(replacePattern1, '<a href="$1" target="_blank">$1</a>');

            //URLs starting with "www." (without // before it, or it'd re-link the ones done above).
            replacePattern2 = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
            replacedText = replacedText.replace(replacePattern2, '$1<a href="http://$2" target="_blank">$2</a>');

            //Change email addresses to mailto:: links.
            replacePattern3 = /(([a-zA-Z0-9\-\_\.])+@[a-zA-Z\_]+?(\.[a-zA-Z]{2,6})+)/gim;
            replacedText = replacedText.replace(replacePattern3, '<a href="mailto:$1">$1</a>');

            return replacedText;
        }
    }
})




