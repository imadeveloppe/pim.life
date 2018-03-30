angular.module('pim.controllersShared', []) 

.controller('HomeCtrl', function($scope,API, $cordovaToast,$cordovaFileTransfer,$ionicActionSheet, $ionicModal, DATA, Catgs,$compile ,$filter, NgMap, ResetePage, Badges, $state, $rootScope, Accounts, $timeout, $ionicLoading, $q, User, Icons, $stateParams, Alert, SharedService, Go, $location, $translate, $ionicScrollDelegate) {
    var self = this; 
    $scope.new = {};
    $scope.isCause = false;
    $scope.loaded = false;

    $scope.ibanMask = function (iban) {
        return (iban != '') ? iban.match(/.{1,4}/g).join(" ") : '';
    }

    $scope.$on('$ionicView.beforeEnter', function() { 

        $scope.accounts = Accounts.all(); 

        $scope.page = 0;
        $scope.canMore = true; 
        $scope.categoryId = -1 ;
        isOk2 = false;
        $scope.isCause = false;
        $scope.devise = API.devise;
        
        $scope.GetDetails = User.GetDetails();

        $scope.isPro = $scope.GetDetails.isPro; 
        

        $scope.SelectedAssocID = $scope.GetDetails.user.associationid; 

        if(Go.is("/home")){

            $scope.NotifHome = User.GetDetails().NbrDocPaimentPending;
            if( $scope.NotifHome.type == 'paiement' ){
                Go.post({
                    task: "getWatingTransfers",

                }).then(function (data) {
                    if(data.success == 1){  
                        var userDetails = User.GetDetails();
                        userDetails.NbrDocPaimentPending.nbr = data.requests.nbr_requests.all; 
                        User.SetDetails(userDetails);   
                        
                        $scope.NotifHome  = userDetails.NbrDocPaimentPending;
                    }
                })  
            }else{
                Go.post({
                    task: "getNbrDocPaimentPending" 
                }).then(function (data) {
                    if(data.success == 1){  
                        var userDetails = User.GetDetails();
                        userDetails.NbrDocPaimentPending = data.NbrDocPaimentPending; 
                        User.SetDetails(userDetails);
                    }   
                })
            }
        }

        console.log("$scope.isPro", $scope.isPro)

        if(Go.is("/home") && ( parseInt($scope.SelectedAssocID) > 0 || parseInt($scope.isPro) == 2 ) ){ 
            
            $scope.isCause = true;
            Go.post({
                task: "getDetailsAssociation",
                id: ($scope.SelectedAssocID > 0) ? $scope.SelectedAssocID : $scope.GetDetails.userInfos.id

            }).then(function (data) { 
                if(data.success == 1){ 
                    $scope.loaded = true;
                    $scope.cause = data.association;
                } 
            })  

        }else if(Go.is("/home") &&  parseInt($scope.SelectedAssocID) == 0 ){
            $scope.loaded = true; 
            if( $scope.isPro != 2 ){
                // setTimeout(function () {
                //     var heightVide = $('#homePage ion-content').height() - $('#homePage ion-content > div').height(); 
                //     $('#homePage .noCauseSelected').css('height', $('#homePage .noCauseSelected').height()+heightVide);
                // })
            }   
        } 

    });

    $scope.charger_mon_compte = function () {
       Go.post({
            task: "Checkpaiementacces"
        }).then(function (data) {  

            if( data.success == 1){
                $state.go('tab.iban');
            }
 
        })
    }

    $scope.ibanTransfer = function () {
       Go.post({
            task: "Checkpaiementacces"
        }).then(function (data) {  

            if( data.success == 1){
                $state.go('tab.ibanTransfer');
            }
 
        })
    }

    $scope.categoryId = -1 ;

    $scope.$watch('new.name', function(newVal, oldVal) { 
        if(newVal){
            $scope.new.name = newVal.replace(/[^a-z0-9áàâäãåçéèêëíìîïñóòôöõúùûüýÿæœÁÀÂÄÃÅæÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ._' ]/gi,'');
        }
    })
    $scope.$watch('account.update', function(newVal, oldVal) { 
        if(newVal){
            $scope.account.update = newVal.replace(/[^a-z0-9áàâäãåçéèêëíìîïñóòôöõúùûüýÿæœÁÀÂÄÃÅæÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ._' ]/gi,'');
        }
    })
    //console.log('User.Details', User.Details)
    // Create account
    $scope.icons = Icons.Images_blanc;
    $scope.iconsBlue = Icons.Images_blue;
    $scope.SelectedIcon = $scope.icons[0];
    $scope.SelectedIconBlue = $scope.iconsBlue[3];
    $scope.SelectedIconId = 0;
    $scope.SelectedIndex = 0;
    $scope.rating = {};
    $scope.rating.max = 5;
    $scope.requests = [];
    $scope.page = 0;
    $scope.data = {};


    $scope.showReorder = false;
    $scope.toggleReorder = function () { $scope.showReorder = !$scope.showReorder; };


    
    $scope.onReorderAccounts = function (fromIndex, toIndex) {
        //console.log(fromIndex, toIndex)
        var moved = $scope.accounts.splice(fromIndex, 1);
        $scope.accounts.splice(toIndex, 0, moved[0]);
        ////console.log($scope.accounts)
        User.UpdateListAccounts($scope.accounts);
        var orderlist = [];
        $scope.accounts.forEach(function(element){
            orderlist.push(element.id); 
        });
        //console.log('orderlist',orderlist);
        setTimeout(function () {
            Go.post({
                "task": "AccountUpdateOrder",
                'accountsorder': orderlist
            },false);
        })
    };



    $scope.changeIcon = function(id) {
        $scope.SelectedIconId = id;
        $scope.SelectedIcon = $scope.icons[id];
        $scope.SelectedIconBlue = $scope.iconsBlue[id];
    };
    $scope.showdelete = false;
    var first = 0;
    $scope.loadDelete = function() {
        if (first > 0)
            $scope.showdelete = true;
        first++;
        $scope.$broadcast('scroll.infiniteScrollComplete');
    };

    $scope.setbackground = function(div) {
        angular.element(document.querySelector('.Colored')).removeClass('Colored');
        angular.element(document.querySelector('#' + div)).addClass('Colored');
    };

    

    // update-compte

    $rootScope.$on("HomeGetAllAccounts", function() {
        $scope.GetAllAccounts();
    });




    $scope.GetAllAccounts = function() {
        Go.post({
            "task": "getUserAccounts"
        }).then(function(data) {
            if(data.success == 1){ 
                User.UpdateListAccounts(data.accounts);
                $scope.$apply(function () {
                    $scope.accounts = data.accounts; 
                })
            }  

        }); 
    };
    $scope.GetAllAccounts();


    $scope.$on('$ionicView.enter', function() {
        $scope.accounts = Accounts.all();
        $scope.GetAccount();
        $scope.canMore = true; 
        
        setTimeout(function () { 
            if(Go.is("/home") && !ionic.Platform.isIOS()){
                $ionicScrollDelegate.scrollBottom(true);
            }
        },500)
        
        
    });

    $scope.gotoBottom = function () { 
         
        setTimeout(function () {
            if(Go.is("/home") && !ionic.Platform.isIOS()){
                $ionicScrollDelegate.scrollBottom(true);
            }
        },3000)
         
    }



    $scope.GetAccount = function() {
        if (typeof $stateParams.id !== 'undefined') {
            $scope.Account = false;
            var listc = $scope.accounts;
            angular.forEach(listc, function(element) {
                if (parseInt(element.id) == parseInt($stateParams.id)) {
                    $scope.Account = element;
                    $scope.SelectedIconBlue = $scope.iconsBlue[ element.iconId ];
                }
            }, this);
        }
    };


    




    ////////////////////////////////////////////////////////////////////////////////////
    $scope.dateDiff = function(date1, date2){
         
        if( $translate.use() == "en" ){
            var tabDate1 = date1.split("/");
            var tabDate2 = date2.split("/");

            date1 = new Date(tabDate1[2]+'-'+tabDate1[0]+'-'+tabDate1[1]);
            date2 = new Date(tabDate2[2]+'-'+tabDate2[0]+'-'+tabDate2[1]);
        }
        if( $translate.use() == "fr" ){
            var tabDate1 = date1.split("/");
            var tabDate2 = date2.split("/");

            date1 = new Date(tabDate1[2]+'-'+tabDate1[1]+'-'+tabDate1[0]);
            date2 = new Date(tabDate2[2]+'-'+tabDate2[1]+'-'+tabDate2[0]); 
        } 

        

        var diff = {}                           // Initialisation du retour
        var tmp =  date1 - date2;
     
        tmp = Math.floor(tmp/1000);             // Nombre de secondes entre les 2 dates
        diff.sec = tmp % 60;                    // Extraction du nombre de secondes
     
        tmp = Math.floor((tmp-diff.sec)/60);    // Nombre de minutes (partie entière)
        diff.min = tmp % 60;                    // Extraction du nombre de minutes
     
        tmp = Math.floor((tmp-diff.min)/60);    // Nombre d'heures (entières)
        diff.hour = tmp % 24;                   // Extraction du nombre d'heures
         
        tmp = Math.floor((tmp-diff.hour)/24);   // Nombre de jours restants
        diff.day = tmp;
         
        return diff;
    }
    ////////////////////////////////////////////////////////////////////////////////////

    $scope.isEmpty = function (obj) {
            for(var prop in obj) {
                if(obj.hasOwnProperty(prop))
                    return false;
            }
            return true;
    }  
    var orange_index = -1;
    var blue_index = -1;
    $scope.getcolorFromList = function(element){
        if( parseInt(element.isshop) == 0){
            blue_index++;
            if(blue_index > $rootScope.BlueColorList.length){
                blue_index = -1;
            }
            return $rootScope.BlueColorList[blue_index];
        }else{ 
            orange_index++;
            if(orange_index > $rootScope.OrangeColorList.length){
                orange_index = -1;
            }
            return $rootScope.OrangeColorList[orange_index];
        }
    }


    $scope.showCommisionsOnList = function () { 

        var prevDate = $scope.transObject.current_date; 
        isFirstTransaction = true;
        var list = [];

        if( $rootScope.commissions.requests.length > 0 ){

            $scope.transObject.data.forEach(function(element, key) {   
                    if( isFirstTransaction ){
                        list.push(element);
                        isFirstTransaction = false;
                        prevDate =   element.date;
                        return;
                    }

                    if( element.date.search('commission') >= 0 ){

                         $scope.transObject.data.splice(key, 1); 

                    }else{ 

                            var currentDate = element.date; 

                            var currentTransYear  = currentDate.split('/')[2];
                            var prevTransYear     = prevDate.split('/')[2];
                            var currentTransMonth = currentDate.split('/')[1];
                            var prevTransMonth    = prevDate.split('/')[1]; 

                            if( typeof $scope.transObject.data[key+1] !== 'undefined' ){ 

                                if( prevTransMonth !=  currentTransMonth ){    
                                    list.push({
                                        date: 'commission_'+prevTransMonth,
                                        data: {
                                            month: parseInt(prevTransMonth),
                                            year:prevTransYear,
                                            isCommision: true
                                        }
                                    }) 
                                }  
                                list.push(element);
                            }else{
                                list.push(element);
                                
                                list.push({
                                    date: 'commission_'+currentTransMonth,
                                    data: {
                                        month: parseInt(currentTransMonth),
                                        year:currentTransYear,
                                        isCommision: true
                                    }
                                }) 
                            } 
                        
                        prevDate =   element.date;
                    } 
                
                 
            })  
            $scope.transObject.data = list; 
            $scope.FullMonths = JSON.parse($filter('translate')('statistics.months') ); 
        } 
            
    } 
 


    $scope.notFirst =false;
    $scope.transObject = {};
    $scope.transObject.data = [];
    $scope.transObject.nbresulte = 0;
    $scope.canMore = true; 
    $scope.loadMore = function(isFirst) {  

        if(isFirst == true){
            $scope.accounts = Accounts.all();
            $scope.GetAccount();
            

            $scope.page = 0;
            
        }
        if($scope.page == 0){
            $scope.GetAccount();
        }
        if (typeof $stateParams.id !== 'undefined' && Go.is('info-compte')) {
            

            var postData = {
                "task": "getTransfersAccount", //getInfosAccount
                "page": $scope.page,
                "accountid": $stateParams.id,
                "NoLoader":true
            };
            if ($scope.page == 0){
                postData['listusers'] = 1;
            }  
            
            if( ($scope.nbresulte / 20) >= $scope.page ||  $scope.page == 0 ){
               $scope.page += 1; 
               Go.post(postData).then(function(data) {
                if (data.success == 1) {
                    $scope.nbresulte = data.count_requests;
                    
                    if (typeof data.users !== 'undefined' || isFirst || $scope.page == 0) {
                        $scope.listUsers = data.users;
                        $scope.requests = data.requests;

                        ////////////////////////////////////////////////////////////////////////////////
                            var newObject = []; 
                            var date_ = data.current_date;
                            
                            var isFirstTransaction = true;

                            data.requests.forEach(function(element, key) {  

                                element.color = $scope.getcolorFromList(element); 

                                if( element.date == date_ ){
                                    var find = -1;
                                    newObject.forEach(function (v,i) {
                                        if(v.date == date_ ){
                                            find = i;
                                        }
                                    })
                                    if(find >= 0 ){
                                        newObject[find].data.push(element);
                                    }else{
                                        newObject.push({
                                            date: date_,
                                            data: [element]
                                        });
                                        date_ = element.date;
                                    } 

                                }else{
                                    date_ = element.date;
                                    var find = -1;
                                    newObject.forEach(function (v,i) {
                                        if(v.date == date_ ){
                                            find = i;
                                        }
                                    })
                                    if(find >= 0 ){
                                        newObject[find].data.push(element);
                                    }else{
                                        newObject.push({
                                            date: date_,
                                            data: [element]
                                        });
                                        date_ = element.date;
                                    } 
                                }  
                            }); 
                            
                            $scope.transObject.data = newObject;   
                            $scope.transObject.commissions = data.commissions;   

                            $rootScope.commissions = {};
                            $rootScope.commissions.requests = data.commissions;
                            $rootScope.commissions.current_date = data.current_date;
                            
                            setTimeout(function () {
                                $scope.showCommisionsOnList();
                            })

                        ///////////////////////////////////////////////////////////////////////////////

                    }else{ 

                        ////////////////////////////////////////////////////////////////////////////////
                                var newObject = []; 
                                var date_ = data.current_date; 

                                data.requests.forEach(function(element) { 
                                    $scope.requests.push(element);
                                    if( element.date == date_ ){  
                                        var find = -1;
                                        newObject.forEach(function (v,i) {
                                            if(v.date == date_ ){
                                                find = i;
                                            }
                                        })
                                        if(find >= 0 ){
                                            newObject[find].data.push(element);
                                        }else{
                                            newObject.push({
                                                date: date_,
                                                data: [element]
                                            });
                                            date_ = element.date;
                                        } 

                                    }else{
                                        date_ = element.date;
                                        var find = -1;
                                        newObject.forEach(function (v,i) {
                                            if(v.date == date_ ){
                                                find = i;
                                            }
                                        })
                                        if(find >= 0 ){
                                            newObject[find].data.push(element);
                                        }else{
                                            newObject.push({
                                                date: date_,
                                                data: [element]
                                            });
                                            date_ = element.date;
                                        } 
                                    }
 
                                });
                                // $scope.transObject.data = [] 
                                var currentTrans = $scope.transObject.data;
                                
                                console.log("newObject", newObject, $scope.transObject.data)
                                angular.forEach(newObject, function(element, key) { 
                                    var findDate = -1;
                                    angular.forEach(currentTrans, function(transObject, k) { 
                                        if( transObject.date == element.date ){
                                            findDate = key; 
                                        }
                                    })
                                    if( findDate == -1 ){
                                        console.log("NOT FINDED")
                                        $scope.transObject.data.push({
                                            date: element.date,
                                            data: element.data
                                        });  
                                    }else{
                                        console.log("FINDED")
                                        angular.forEach(element.data, function (trans, index) {
                                            $scope.transObject.data[ key ].data.push(trans);
                                        })
                                    } 
                                })   
                                setTimeout(function () { 
                                    $scope.showCommisionsOnList();
                                })
                                
                        ///////////////////////////////////////////////////////////////////////////////
                    }
                    $scope.transObject.current_date = data.current_date;  

                     
                } else {
                    Alert.error(data.message);
                }
                if(isFirst || $scope.page == 0){
                    $scope.$broadcast('scroll.refreshComplete');
                }else{
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                } 
                
                setTimeout(function () {
                    $timeout(function(){
                        $scope.loader = Alert.loader(false);
                    },1000);
                    $scope.loader = Alert.loader(false);
                    $scope.notFirst = true;  
                })
                }); 
            }else{ 
                $scope.canMore = false;
            }
            
            
            
        }
    };

    $scope.$on('$stateChangeSuccess', function() { 
        Alert.loader(true);
        $scope.loadMore(true);
    });
    

    $scope.doRefresh2 = function(loader, page) {
        $scope.page = 0;
        if (typeof $stateParams.id !== 'undefined') {
            $scope.GetAccount();
            if (loader) Alert.loader(true);
            Go.post({
                "task": "getTransfersAccount",
                "page": $scope.page,
                "accountid": $stateParams.id,
                "hideLoader":true
            }).then(function(data) {
                if (data.success == 1) {
                    if (!$scope.$$phase) {
                        $scope.$apply(function() {
                            

                            $scope.listUsers = data.users;
                            $scope.requests = data.requests;
                            if (data.requests.length == 0) {
                                $scope.message = true;
                            }
                        });
                    } else {
                        $scope.listUsers = data.users;
                        $scope.requests = data.requests;
                        if (data.requests.length == 0) {
                            $scope.message = true;
                        }
                    }
                } else {
                    Alert.error(data.message);
                }
                $scope.canMore = true;

                setTimeout(function () {
                    $scope.$broadcast('scroll.refreshComplete');
                    //console.log($scope.notFirst,'$scope.notFirst$scope.notFirst$scope.notFirst$scope.notFirst')
                    $timeout(function(){
                        $scope.loader = Alert.loader(false);
                    },3000);
                    
                    //console.log('refreche')
                    // 
                })
            });
        }
    };


    $scope.doRefresh = function(loader, page) {
        if (typeof page === 'undefined') page = 0;
        if (typeof $stateParams.id !== 'undefined') {
            $scope.GetAccount();
            if (loader) Alert.loader(true);
            Go.post({
                "task": "getInfosAccount", //getInfosAccount
                "accountid": $stateParams.id
            }).then(function(data) {
                if (data.success == 1) {
                    if (!$scope.$$phase) {
                        $scope.$apply(function() {
                            //console.log('refrech: ', data)
                            $scope.listUsers = data.users;
                            $scope.requests = data.requests;
                            if (data.requests.length == 0) {
                                $scope.message = true;
                            }
                        });
                    } else {
                        $scope.listUsers = data.users;
                        $scope.requests = data.requests;
                        if (data.requests.length == 0) {
                            $scope.message = true;
                        }
                    }
                } else {
                    Alert.error(data.message);
                }
                setTimeout(function () {
                    $scope.$broadcast('scroll.refreshComplete');
                    //console.log($scope.notFirst,'$scope.notFirst$scope.notFirst$scope.notFirst$scope.notFirst')
                    $timeout(function(){
                        $scope.loader = Alert.loader(false);
                    },3000);
                    
                    //console.log('refreche')
                })
            });
        }
    };



    var isOk = false;
    var self = this;
     

    $scope.ListTypeTranslated = [
                        $filter('translate')('transaction_detail.credit'), 
                        $filter('translate')('transaction_detail.debit')
                    ];
    $scope.ListType = ["CREDIT", "DEBIT"];  


    $scope.categories = Catgs.getNestedCats();


    $scope.DetailRefresh = function(loader) {
        $scope.subCategory = {};

        $scope.ok = 5;
        if (loader) Alert.loader(true);
        $scope.dt = {};

        Go.post({
            "task": "TransgetDetailRequest",
            "requestid": $stateParams.idreq
        }).then(function(data) {
            
            if(data.success == 1){ 

                console.log("datadatadatadatadata", data.detailsrequest)

                $scope.dt = data.detailsrequest; 
                
                $scope.badge = true;

                $rootScope.transtype_detailTrans = $scope.dt.request.transtype.toUpperCase();
                $rootScope.stateParamsIdreq = $stateParams.idreq; 
                
                
                 
                $scope.selectedCategories = [];
                if ($scope.dt.user2.cat != "") {  
                    setTimeout(function () {
                        $scope.$apply(function () {
                            $scope.subCategory.name =  $scope.dt.user2.cat;  
                        })
                    })
                }   
                // pecto
                if ($scope.dt.user2.picto.indexOf('female') == -1 && $scope.dt.user2.picto.indexOf('male') == -1) {
                    $scope.badge = false;
                }
                 
                // Map
                // var bounds = new google.maps.LatLngBounds();
                // var nbMarker = 0;
                // if ($scope.dt.geo2.lat) {
                //     //console.log('geo 2 is ok',$scope.dt.geo2.lat, $scope.dt.geo2.lng)
                //     $scope.center = [$scope.dt.geo2.lat, $scope.dt.geo2.lng];
                //     $scope.latlng2 = [$scope.dt.geo2.lat, $scope.dt.geo2.lng]; 

                //     var latLng = new google.maps.LatLng($scope.dt.geo2.lat,$scope.dt.geo2.lng);
                //     bounds.extend(latLng);
                //     nbMarker++;
                // }
                // if ($scope.dt.geo1.lat) {
                //     //console.log('geo 1 is ok',$scope.dt.geo1.lat, $scope.dt.geo1.lng)
                //     $scope.center = [$scope.dt.geo1.lat, $scope.dt.geo1.lng];
                //     $scope.latlng1 = [$scope.dt.geo1.lat, $scope.dt.geo1.lng]; 

                //     var latLng = new google.maps.LatLng($scope.dt.geo1.lat,$scope.dt.geo1.lng);
                //     bounds.extend(latLng);
                //     nbMarker++;
                // } 
                 
                // NgMap.getMap().then(function(map) {
                //     map.fitBounds(bounds);
                //     if(nbMarker == 1){
                //         //console.log("setZoom")
                //         map.setZoom(13);
                //     }
                // }); 
                // setTimeout(function () {
                //     isOk = true;
                //     isOk2 = false;
                //     $scope.$broadcast('scroll.refreshComplete');
                // })
            } 
        });
    };
       
    var list = Catgs.get();
    isOk2 = false;
    if(!$scope.chipCatsDetailTrans){
        $scope.chipCatsDetailTrans = [];
    }

    $scope.data = {}
    //$scope.data.idsubcategories = -1;

    $scope.PaymentUpdateCat = function( catid) {  
        //console.log("$scope.dt.request", $rootScope.transtype_detailTrans)
        var updateType = 'to';
        if ($rootScope.transtype_detailTrans == 'DEBIT') {
            updateType = 'from';
        }
        if (catid != -1) {

            var exist_catg = false;
            
            list.forEach(function(element){
                var current_value = element.group + " - " + element.text;
                // console.log(element.value, catid)
                if(element.value == catid ){
                    exist_catg = true; 
                    $scope.chipCatsDetailTrans[0] = current_value; 
                    
                }
            });
             
            var postData = {
                "task": "PaymentUpdateCat",
                "requestid": $rootScope.stateParamsIdreq,
                "catid": catid,
                "type": updateType,
                "hideLoader": true
            };
             
            Go.post(postData).then(function(data) {
                if (data.success != 1) { 
                    setTimeout(function () {
                        $scope.PaymentUpdateCat( catid )
                    },2000)
                }
            });
        }

           
    };

    $rootScope.$on("PaymentUpdateCat", function(event, catid){ 
        $scope.PaymentUpdateCat( catid )
    }) 
 

    $scope.$on('$ionicView.beforeEnter', function() {
        page = 0;
        $scope.isvalidate = false;
        if (Go.is('info-compte')) {
            // $scope.doRefresh(true);
        }
        if (Go.is('update-compte')) {
            $scope.GetAccount();
            $scope.changeIcon($scope.Account.iconId);
        }
    }); 
    $scope.$on('$ionicView.enter', function(e) {
        $scope.DATA_badg = DATA; 
        if (Go.is('/info-detail/') || Go.is('/detailTransactionFromNotif/') ) { 
            $scope.DetailRefresh(true);
            ////////// Randem color category //////////////////////////////
            angular.forEach( $scope.categories, function (cat, key) {
                $scope.categories[key].color = getRandomColor(); 
                console.log(cat)
                angular.forEach( cat.listscats, function (subcat, k) {

                    $scope.categories[key].listscats[k].color = getRandomColor();
                } )
            } )
            ////////////////////////////////////////////////////////////
            
        }
    });

    $scope.badges = [{
        name: 'AF',
        color: '#15A9F5'
        }, {
            name: 'HA',
            color: '#A5C3D2'
        }, {
            name: 'NJ',
            color: '#65b789'
        }, {
            name: 'RT',
            color: '#06ACC0'
        }, {
            name: 'IK',
            color: '#67A8C9'
        }, {
            name: 'OP',
            color: '#8bbb49'
    }];

    $scope.addAccount = function() {
        var validationList = [{
            type: 'label',
            value: $scope.new.name
        },{
            type: 'acountname',
            value: $scope.new.name
        }];
        if (SharedService.Validation(validationList)) {
            Alert.loader(true);
            var postData = {
                "task": "AccountAdd",
                "label": $scope.new.name,
                "picto": $scope.SelectedIconId
            };
            Go.post(postData).then(function(data) {
                if (data.success == 1) { 
                    $scope.new.name = "";
                    Go.post({
                        "task": "getUserAccounts"
                    }).then(function(data) {
                        if(data.success == 1){ 
                            User.UpdateListAccounts(data.accounts);
                            $state.go('tab.listAccounts'); 
                        }  

                    }); 
                } else {
                    Alert.error(data.message);
                }
            })
        }
    };

    $scope.Delete = function(obj) {
        swal({
            title: $filter('translate')('update_account.confirmation'),
            text: $filter('translate')('update_account.msg_confirmation'),
            type: "info",
            showCancelButton: true,
            confirmButtonColor: "#254e7b",
            confirmButtonText: $filter('translate')('update_account.btn_confirm'),
            cancelButtonText: $filter('translate')('update_account.btn_cancel'),
            customClass: "customSwal",
            showLoaderOnConfirm: true,
            preConfirm: function() {
                return new Promise(function(resolve, reject) {
                    var postData = {
                        "task": "AccountDelete",
                        "id": obj.id
                    };
                    Go.post(postData).then(function(data) {
                        if (data.success == 1) {
                             
                            swal({
                                title: $filter('translate')('update_account.confirmation'),
                                text: $filter('translate')('update_account.deleted_success'),
                                type: 'success',
                                timer: 3000,
                                showConfirmButton: false
                            }); 

                            Go.post({
                                "task": "getUserAccounts"
                            }).then(function(data) {
                                if(data.success == 1){ 
                                    User.UpdateListAccounts(data.accounts);
                                    $state.go('tab.listAccounts');
                                }  

                            }); 
                             
                            $scope.accounts = Accounts.all();
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
    };

    $scope.Unsubscribe = function(obj) {
        var postData = {
            "task": "AccountUnsubscribe",
            "id": obj.id
        };
        Go.post(postData).then(function(data) {
            if (data.success == 1) {
                Accounts.remove(obj).then(function() {
                    swal({
                        title: "Confirmation",
                        text: 'You have successfully Unsubscribe from account.',
                        type: 'success',
                        timer: 3000,
                        showConfirmButton: false
                    });
                    $state.go('tab.listAccounts');
                });
                $scope.accounts = Accounts.all();
            }
        });
    };

    $scope.account = {};
    $scope.Update = function() {
        if (typeof $scope.account.update == 'undefined' || $scope.account.update == "") {
            $scope.account.update = $scope.Account.name;
        }
        var validationList = [{
            type: 'label',
            value: $scope.account.update
        },{
            type: 'acountname',
            value: $scope.account.update
        }];
        if (SharedService.Validation(validationList)) {
            var postData = {
                "task": "AccountUpdate",
                "id": $scope.Account.id,
                "label": $scope.account.update,
                "picto": $scope.SelectedIconId
            };
            Go.post(postData).then(function(data) {
                if (data.success == 1) {
                    Accounts.Update($scope.Account, $scope.SelectedIconId, $scope.account.update).then(function() {

                        $state.go('tab.listAccounts');
                        $scope.account = {};
                    });
                    $scope.accounts = Accounts.all();
                } else {
                    Alert.error(data.message);
                }
            });
        }
    };





    $scope.$on('$stateChangeSuccess', function() {
        // $scope.loadMore();
    });
 
    $scope.$on('$ionicView.enter', function(e) {
        $scope.accounts = Accounts.all();
    });


        /////////////// New detail Trans (imad) //////////////////
        
     
    /////////////// New detail Trans (imad) //////////////////

    /////////////// modal photo detsil trans //////////////////
    if (Go.is('/info-detail/') || Go.is('/detailTransactionFromNotif/') ) { 
        $ionicModal.fromTemplateUrl('image-modal.html', {
          scope: $scope,
          animation: 'slide-in-up'
        }).then(function(modal) {
          $scope.modal = modal;
        });
    } 

    $scope.openModal = function() {
      $scope.modal.show();
    };

    $scope.closeModal = function() {
      $scope.modal.hide();
    }; 

    $scope.showImage = function(srcImage) { 
        $scope.imageSrc  = srcImage;
      $scope.openModal();
    } 
    $scope.onHold = function () {
        angular.element(document.querySelector('body')).removeClass('platform-android');
        $ionicActionSheet.show({
             buttons: [
               { text: $filter('translate')('transaction_detail.save')} 
             ], 
             cancelText: $filter('translate')('transaction_detail.cancel'),
             cancel: function() {
              
        },
         buttonClicked: function(index) {
            switch(index) {
                case 0:
                    $scope.downloadPicture()
                    break; 
            } 
            return true;
         }
       })
    } 
    $scope.downloadPicture = function () {
            console.log($scope.imageSrc)
            if( ionic.Platform.isIOS() ){
                $scope.ExternalPath = cordova.file.documentsDirectory;
            }else{ 
                $scope.ExternalPath = cordova.file.externalDataDirectory; 
            }

            $scope.downloading = true;    
            var targetPath = $scope.ExternalPath+$scope.imageSrc.substring($scope.imageSrc.lastIndexOf('/')+1); 

            $cordovaToast.showShortCenter( $filter('translate')('transaction_detail.downloading') ); 
            $cordovaFileTransfer.download($scope.imageSrc, targetPath, {}, true)
            .then(function(result) {     

                $scope.targetPath = targetPath; 
                $scope.downloadFileToGallery();
                

            },function(err) {  

                 $cordovaToast.showShortCenter( $filter('translate')('transaction_detail.error_try_again') );
                
            },function(progress) { 
                 
            });
    }
    $scope.downloadFileToGallery = function () {    
        window.cordova.plugins.imagesaver.saveImageToGallery($scope.targetPath, onSaveImageSuccess, onSaveImageError); 
        function onSaveImageSuccess() {  
            $cordovaToast.showShortCenter( $filter('translate')('transaction_detail.picture_downloaded') );
        } 
        function onSaveImageError(error) { 
             $cordovaToast.showShortCenter( $filter('translate')('transaction_detail.no_permission_to_access_to_gallery') ); 
        }
    }
    /////////////// end modal photo detsil trans //////////////////


    $scope.pendingNotifHome = function (type) {

        switch(type){
            case 'document':
                $state.go('tab.documentsWaitingValidation');
                break;

            case 'paiement':
                $state.go('tab.paymentsWaitingValidation');
                break; 
        } 
    }





    if (Go.is('/info-detail/') || Go.is('/detailTransactionFromNotif/')){ 

        

        $scope.ResetCat = function () {
            angular.forEach($scope.categories, function (Cat, key) {
                angular.forEach(Cat.listscats, function (subCat, k) {
                    $scope.categories[key].listscats[k].selected = false;
                })
            })
             
            $scope.SubCatFilter.hide()

            var updateType = 'to';
            if ($scope.dt.request.transtype.toUpperCase() == 'DEBIT') {
                updateType = 'from';
            }

            var postData = {
                "task": "PaymentUpdateCat",
                "requestid": $stateParams.idreq,
                "catid": 0,
                "type": updateType
            };
            Go.post(postData).then(function(data) {
                if (data.success == 1) {
                    $scope.subCategory = {}; 
                }
            }); 
        }

        $scope.selectSubCat = function (key, subCat) { 

            $scope.Filter.hide()
            $scope.SubCatFilter.hide()

            $scope.PaymentUpdateCat(subCat.scatid); 
            $scope.categories[$scope.selectedCat].listscats[key].selected = !$scope.categories[$scope.selectedCat].listscats[key].selected;   

            angular.forEach($scope.categories, function (cat, i) {
                angular.forEach(cat.listscats, function (scat, j) {
                    if( subCat.scatid !=  scat.scatid ){ 
                        $scope.categories[i].listscats[j].selected = false;
                    }
                })
            }) 
            
            $scope.subCategory.name = $scope.categories[$scope.selectedCat].catlabel+" - "+subCat.scatlabel; 

            
            
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
    }

 
})
.controller('commisionsCtrl', function ($scope, $rootScope, $translate, $state, $stateParams,$filter) {
        
        if(!$rootScope.commissions) $state.go('tab.listAccounts');

        $scope.loader = true;

        $scope.FullMonths = JSON.parse($filter('translate')('statistics.months') );

        $scope.MonthCommission = $stateParams.month;
        $scope.YearCommission = $stateParams.year;


        $scope.twoDigitAfterCama = function (num) { 
            return parseFloat( num.toFixed(2) );
        }

        $scope.dateDiff = function(date1, date2){
         
            if( $translate.use() == "en" ){
                var tabDate1 = date1.split("/");
                var tabDate2 = date2.split("/");

                date1 = new Date(tabDate1[2]+'-'+tabDate1[0]+'-'+tabDate1[1]);
                date2 = new Date(tabDate2[2]+'-'+tabDate2[0]+'-'+tabDate2[1]);
            }
            if( $translate.use() == "fr" ){
                var tabDate1 = date1.split("/");
                var tabDate2 = date2.split("/");

                date1 = new Date(tabDate1[2]+'-'+tabDate1[1]+'-'+tabDate1[0]);
                date2 = new Date(tabDate2[2]+'-'+tabDate2[1]+'-'+tabDate2[0]); 
            } 

            

            var diff = {}                           // Initialisation du retour
            var tmp =  date1 - date2;
         
            tmp = Math.floor(tmp/1000);             // Nombre de secondes entre les 2 dates
            diff.sec = tmp % 60;                    // Extraction du nombre de secondes
         
            tmp = Math.floor((tmp-diff.sec)/60);    // Nombre de minutes (partie entière)
            diff.min = tmp % 60;                    // Extraction du nombre de minutes
         
            tmp = Math.floor((tmp-diff.min)/60);    // Nombre d'heures (entières)
            diff.hour = tmp % 24;                   // Extraction du nombre d'heures
             
            tmp = Math.floor((tmp-diff.hour)/24);   // Nombre de jours restants
            diff.day = tmp;
             
            return diff;
        }
        ////////////////////////////////////////////////////////////////////////////////
 
            var newObject = {}; 
            var date_ = $rootScope.commissions.current_date;
            $scope.totalCommission = 0;

            $rootScope.commissions.requests.forEach(function(element, key) { 

                if( element.date.search( $scope.MonthCommission ) > 0 ){
                    if( element.date == date_ ){

                        if( !newObject[ date_ ] ){
                            newObject[ date_ ] = [];
                        }

                        newObject[ date_ ].push(element);

                    }else{
                        date_ = element.date;
                        if( !newObject[ date_ ] ){
                            newObject[ date_ ] = [];
                        }
                        newObject[ date_ ].push(element);
                    } 
                    $scope.totalCommission += parseFloat(element.amount);
                }
                
            });
            $scope.commissionData = {};
            $scope.commissionData.data = newObject; 
            $scope.commissionData.current_date = $rootScope.commissions.current_date; 
 
        ///////////////////////////////////////////////////////////////////////////////

})
.controller('TransCtrl', function($scope, Amount, Icons, User,$ionicScrollDelegate, $cordovaBarcodeScanner,$timeout, $ionicPlatform, $filter, $cordovaAppAvailability, ResetePage, $cordovaSocialSharing, Catgs, $location, $ionicSlideBoxDelegate, Geo, $state, $stateParams, PaymentFriend, $rootScope, Accounts, $mdConstant, Phone, pickerView, Lists, Alert, $mdBottomSheet, Go, SharedService, crypt, API, ALGOLIA) {
    
    $scope.$watch('trans.recipient', function(newVal, oldVal) { 
        if(newVal){
            $scope.trans.recipient = newVal.replace(/[^a-z0-9áàâäãåçéèêëíìîïñóòôöõúùûüýÿæœÁÀÂÄÃÅæÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ._'@ ]/gi,'');
        }
    })


    $scope.ibanMask = function (iban) {
        return (iban != '') ? iban.match(/.{1,4}/g).join(" ") : '';
    }

    $scope.icons = Icons.Images_blanc;
    $scope.iconsBlue = Icons.Images_blue;

    $scope.UserDetails = User.GetDetails(); 
    $scope.currentUser = $scope.UserDetails.user;
    $scope.UserDetails.isPro = parseInt($scope.UserDetails.isPro)

    $scope.$on('$ionicView.beforeEnter', function() {
        $scope.UserDetails = User.GetDetails(); 
        $scope.currentUser = $scope.UserDetails.user;
        if($scope.UserDetails.isPro){
            $scope.currentFullName = $scope.currentUser.brand ;
        }else{
            $scope.currentFullName = $scope.currentUser.fname + ' ' + $scope.currentUser.lname;
        }  

        $scope.UserDetails.isPro = parseInt($scope.UserDetails.isPro);
    }); 
     
    

    $scope.trans = PaymentFriend;
    $scope.Option = {
        Resonswitch: true
    };
    $scope.minDate = new Date();
    $scope.maxDate = new Date(
        $scope.minDate.getFullYear() + 1,
        $scope.minDate.getMonth(),
        $scope.minDate.getDate());
    $scope.rating = {};
    $scope.rating.rate = 0;
    $scope.rating.max = 5;
    $scope.hideInputRecipient = false;
    $scope.Users = [];
    $scope.amount =  '';



    $rootScope.$on("ClearTrans", function() {
        $scope.trans.date = new Date();
        $scope.trans.users = [];
        $scope.trans.reson = '';
        $scope.trans.amount = 0;
        $scope.trans.requestid = -1;
        $scope.hideInputRecipient = false;
        $scope.trans.recipient = '';
        $scope.amount = '';
        $rootScope.IsBuyer = false;
    });

    $scope.changeValidationFinalState = function ( state ) {
        UserDetails = User.GetDetails();
        UserDetails.logsPhoto.treezorid.confirmed = state;
        if( state == 1 ){
            UserDetails.listSettings.profil[0].valid = true;
        }else{
            UserDetails.listSettings.profil[0].valid = false;
        }
        User.SetDetails( UserDetails );
    }

    $scope.MakeTransfer = function(){ 
        Go.post({
            task: "Checkpaiementacces"
        }).then(function (data) {  

            if( data.success == 1){
                $rootScope.$emit('ClearTrans');
                $state.go('tab.TransFriend');
            } 
        })  
    }
    $scope.ScanQrCode = function(){
        Go.post({
            task: "Checkpaiementacces"
        }).then(function (data) {
            if( data.success == 1){ 
                Alert.loader(true)
                setTimeout(function () {
                    Alert.loader(false)
                },2000)

                cordova.plugins.barcodeScanner.scan(
                  function (barcodeData) {
                    
                    if (barcodeData.cancelled == false) {  
                        var postData = {
                            "task": "PaymentGetDetailByQrCode",
                            "hash": barcodeData.text
                        };
                        Alert.loader(true) 
                        Go.post(postData).then(function(data) {
                            Alert.loader(false);
                            if( data.success == 1 ){
                                $state.go('tab.qrCodeSendPayment', {
                                    'hash': barcodeData.text
                                });
                            }else{ 
                                Alert.error(data.message);
                            }
                            
                        });
                    }   

                }, function(error) {
                    Alert.loader(false)
                    alert(error);
                },{
                  preferFrontCamera : false, // iOS and Android
                  showFlipCameraButton : true, // iOS and Android
                  showTorchButton : true, // iOS and Android
                  torchOn: false, // Android, launch with the torch switched on (if available) 
                  prompt : $filter('translate')('qr_code_scanner.text'), // Android  
                  orientation : "portrait", // Android only (portrait|landscape), default unset so it rotates with the device
                  disableAnimations : true, // iOS
                  disableSuccessBeep: false // iOS
                }); 
                setTimeout(function () {
                    window.localStorage.setItem('locked', 0)
                },3000) 

            }
        })    
    }
    $scope.BetweenAccounts = function(){
        Go.post({
            task: "Checkpaiementacces"
        }).then(function (data) {
            if( data.success == 1){
                $rootScope.$emit('ClearTrans');
                $state.go('tab.AccountToAccount');
            }
        }) 
        
    }
    $scope.DemandeTransfer = function(){
        Go.post({
            task: "Checkpaiementacces"
        }).then(function (data) {
            if( data.success == 1){
                $rootScope.$emit('ClearTrans');
                $state.go('tab.MarchandDemandPayment');
            }else if(data.success == 1 && parseInt(data.valid) != 1){
                Alert.error($filter('translate')('home.accountnotvalidatedyet'))
            } 

            $scope.changeValidationFinalState( parseInt(data.valid) );
        }) 
    }

    $scope.options = {
        leftControl: ',', // <=== CUSTOMIZE YOUR CONTROL KEY HERE
        rightControl: '<i class="icon ion-arrow-left-c"></i></button>',
        onKeyPress: function(value, source) {
          if (source === 'LEFT_CONTROL') {
            if ($scope.number.indexOf(',') === -1) {
              $scope.number += value;
            }
          }
          else if (source === 'RIGHT_CONTROL') {
            $scope.number = $scope.number.substr(0, $scope.number.length - 1);
          }
          else if (source === 'NUMERIC_KEY') {
            $scope.number += value;
          }
        }
    }

    $scope.keyboardOptions = {
        visible: false 
    }

    var canWrait = true;
    $scope.showKeyboard = function(model) {
        angular.element("html").addClass("keyboardOn");
        angular.element( ".numeric-keyboard-amount" ).parent("label").addClass("cursonInInput");

        // $("#amount").scrollTop();
        $ionicScrollDelegate.scrollBottom();
        $scope.keyboardOptions = {
          visible: true,
          leftControl: '.', // <=== CUSTOMIZE YOUR CONTROL KEY HERE
          hideOnOutsideClick: true, //hides the keyboard if the user clicks outside of the keyboard (except if the clicked element contains the class numeric-keyboard-source)
          onKeyPress: function(value, source) {
        if(canWrait){
            canWrait = false;
                //console.log(value,source)
                if (source === 'RIGHT_CONTROL') {
                  if (typeof $scope[model] !== 'undefined') {
                    $scope[model] = $scope[model].toString().substr(0, $scope[model].toString().length - 1);
                  }
                }
                if (source === 'LEFT_CONTROL') {
                    //console.log('is left')
                    if ($scope[model].toString().indexOf('.') === -1) {
                        
                      $scope[model] = $scope[model]+ '.'; 
                    } 
                  }
                else if (source === 'NUMERIC_KEY') {
                  if (typeof $scope[model] === 'undefined') {
                    $scope[model] = '';
                  } 
                  $scope[model] = $scope[model]+ value;
                }
                $scope.amount =  Amount.watch($scope[model]);
                $scope.trans.amount = $filter('number')($scope[model], 2);
                $scope.trans.amount = Number($scope.trans.amount.replace(/[^0-9\.-]+/g, ""));
            }
            $timeout(function(){
                canWrait = true;
            },50);

          }
        }
    }


    if (Go.is('Sendtofriend') || Go.is('Payfriend') || Go.is('MarchandDemandPayment') || Go.is('qrCodeSendPayment') || Go.is('AccountToAccount')) {
        $scope.searchIsDonne = false;
        var havelist = false;
        var UserDetails = User.GetDetails();
        $scope.userMail = UserDetails.user.mail; 

        var APPLICATION_ID = ALGOLIA.APPLICATION_ID;
        var SEARCH_ONLY_API_KEY = ALGOLIA.SEARCH_ONLY_API_KEY; 

        var INDEX_NAME = 'shops-geosearch';
        $scope.PARAMS = { hitsPerPage: 10 };

        $scope.getUsersList = function(q) {   
                // Client + Helper initialization
                if( q.length > 2 ){
                    var algolia = algoliasearch(APPLICATION_ID, SEARCH_ONLY_API_KEY); 

                    var algoliaHelper = algoliasearchHelper(algolia, INDEX_NAME, $scope.PARAMS);
                    algoliaHelper.setQueryParameter('query', q ); 
                    algoliaHelper.addNumericRefinement('deleted', '=', 0);
                    algoliaHelper.addNumericRefinement('treezorvaldation', '=', 1);
                    algoliaHelper.addNumericRefinement('suspended', '=', 0); 
                    algoliaHelper.addNumericRefinement('isshop', '<=', 2); 
                    algoliaHelper.addNumericRefinement('pimaccount', '=', 0); 

                    algoliaHelper.search(); 
                    $scope.searchProgress = true;
                    algoliaHelper.on('result', function(results, state) { 
                        $scope.searchProgress = false;
                        $scope.$apply(function () { 
                            $scope.Users = results.hits;
                            $scope.LoadingMoreShops = false;
                            setTimeout(function () {
                                $ionicScrollDelegate.resize();
                            })
                        })

                    });
                }else if( q.length == 0 ){
                    $scope.Users = []
                } 
                 
            
        }

        $scope.LoadingMoreShops = false;
        $scope.OnscrollingResult = function () { 
            setTimeout(function () {
                var scrollingValue = $ionicScrollDelegate.$getByHandle('result-recepient').getScrollPosition().top;
                var maxValue = $ionicScrollDelegate.$getByHandle('result-recepient').getScrollView().__maxScrollTop; 
                if( scrollingValue == maxValue && scrollingValue > 300 ){ 
                    $scope.LoadMoreShops()
                }
            })
        }  
        $scope.LoadMoreShops = function () { 
            $scope.PARAMS.hitsPerPage = $scope.PARAMS.hitsPerPage + 10;
            $scope.$apply(function () {
                $scope.LoadingMoreShops = true;
            }) 
            $scope.getUsersList();
        }
        $scope.ShowSearchForRecipient = function () {
            $( '#pageSendToFriend .overlay-result-recipient' ).slideDown();   
            setTimeout(function () { 
                angular.element('#inputSearchRecipient').trigger('focus');
            })
        }
        $scope.backToTransfer = function() {
            $( '#pageSendToFriend .overlay-result-recipient' ).fadeOut();
            $scope.Users = [];
            $scope.trans.users = [];
            $scope.hideInputRecipient = false;
            $scope.trans.recipient = '';
        }
        $scope.setUserTrans = function(user) {
            $( '#pageSendToFriend .overlay-result-recipient' ).fadeOut();
            $scope.Users = [];
            $scope.trans.users = [user];
            $scope.hideInputRecipient = true;
            $rootScope.transUserTo = user.brandname;
        }
        $scope.clearRecipient = function() {
            $scope.trans.users = [];
            $scope.hideInputRecipient = false;
            $scope.trans.recipient = '';
        }
        $scope.changeRecipient = function () {
           $scope.getUsersList($scope.trans.recipient);
        }
        $scope.$watch('trans.recipient', function() { 
            // var lenght = ('' + $scope.trans.recipient).length;
            // if (lenght >= 3) {
            //     if (havelist == false) {
            //         $scope.getUsersList($scope.trans.recipient);
            //     } else {
            //         $scope.filteredArray = $filter('filter')($scope.Users, $scope.trans.recipient);
            //         //console.log('$scope.filteredArray.length', $scope.filteredArray.length)
            //         if ($scope.filteredArray.length == 0) {
            //             $scope.getUsersList($scope.trans.recipient);
            //         }
            //     }
            // } else if (lenght < 3) {
            //     havelist = false;
            // }
            // if (lenght == 0) {
            //     $scope.Users = [];
            // }

        });
        $scope.$watchCollection('Users', function(array) {
            $scope.filteredArray = $filter('filter')(array, $scope.trans.recipient);
            //console.log($scope.filteredArray)
        });

        $scope.$on('$ionicView.beforeEnter', function() {
            $scope.trans.amount = $filter('number')($scope.trans.amount, 2);
            if(Go.is('Payfriend') && $scope.trans.amount == 0){
                $state.go('tab.home');
            } 
            var list = Accounts.all();
            // //console.log('list[$scope.trans.SelectedIndex]', list[$scope.trans.selectedAccount])
            if (typeof list[$scope.trans.selectedAccount] === "undefined") {
                //console.log('$scope.trans.SelectedIndex undefined }}}}}}}}}}}}}}}}},{{{{{{{{{{{{{{{')
                $scope.trans.selectedAccount = 0;
            } else {
                // //console.log('$scope.trans.SelectedIndex', $scope.trans.selectedAccount)
            }
            $scope.accounts = Accounts.all();
        });
        $scope.$on('$ionicView.afterEnter', function() {
            $ionicSlideBoxDelegate.update()
        });
    }

    $rootScope.$on('$ionicView.afterLeave', function(event) {
        if (Go.is('FeedBack')) {
            $scope.trans.date = new Date();
            $scope.trans.users = [];
            $scope.trans.reson = '';
            $scope.trans.amount = '';
        }
    });
 
    $scope.AddUserByEmail = function() {
        if (typeof $scope.Option.email !== 'undefined') {
            Alert.loader(true);
            var postData = {
                "task": "TransGetUserByEmail",
                "email": $scope.Option.email
            };
            Go.post(postData).then(function(data) {
                Alert.loader(false);
                if (data.success == 1) {
                    if ($scope.trans.users.indexOf($scope.Option.email) == -1) {
                        var obj = {
                            id: data.id,
                            name: data.name,
                            image: data.image,
                            param: $scope.Option.email
                        };
                        $scope.trans.users.push(obj);
                        $scope.Option.email = '';
                    }
                } else {
                    Alert.error(data.message);
                }
            });
        }
    };
    $scope.AddUserByPhone = function() {
        if (typeof $scope.Option.Phone !== 'undefined') {
            Alert.loader(true);
            var postData = {
                "task": "TransGetUserByPhone",
                "phone": $scope.Option.indicatif + $scope.Option.Phone
            };
            Go.post(postData).then(function(data) {
                Alert.loader(false);
                if (data.success == 1) {
                    if ($scope.trans.users.indexOf($scope.Option.indicatif + $scope.Option.Phone) == -1) {
                        var obj = {
                            id: data.id,
                            name: data.name,
                            image: data.image,
                            param: $scope.Option.indicatif + $scope.Option.Phone
                        };
                        $scope.trans.users.push(obj);
                        $scope.Option.Phone = '';
                    }
                } else {
                    Alert.error(data.message);
                }
            });
        }
    };
    $scope.$watch('Option', function() {
        if (typeof $scope.Option.Phone !== 'undefined') {
            $scope.Option.Phone = Phone.watch($scope.Option.Phone);
        }
    }, true);

    var objlist = [{
        values: [Lists.Indicatifs],
        defaultIndex: 7
    }];
    $scope.Option.indicatif = '+33';
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
                    $scope.Option.indicatif = output[0].id;
                }
            });
        }
    };

    $scope.alert = '';
    var gridTemplate = '<md-bottom-sheet class="md-grid bottomSheetdemoBasicUsage" layout="column" ng-cloak>\
        <div>\
            <md-list flex layout="row" layout-align="center center">\
            <md-list-item ng-repeat="item in items" >\
                <div ng-click="Req_payment(item)">\
                <md-button class="md-grid-item-content" ng-click="listItemClick($index)">\
                <md-icon md-svg-src="{{item.icon}}"></md-icon>\
                <div class="md-grid-text"> {{ item.name }} </div>\
                </md-button>\
                </div>\
            </md-list-item>\
            </md-list>\
        </div>\
        </md-bottom-sheet>';

    $scope.SendshowGridBottomSheet = function($event) {
        $scope.alert = '';
        $mdBottomSheet.show({
            template: gridTemplate,
            controller: 'SendGridBottomSheetCtrl',
            targetEvent: $event
        }).then(function(clickedItem) {
            $scope.alert = clickedItem.name + ' clicked!';
        });
    };
    $scope.ReciveshowGridBottomSheet = function($event) {
        $scope.alert = '';
        $mdBottomSheet.show({
            template: gridTemplate,
            controller: 'DemandPaymentGridBottomSheetCtrl',
            targetEvent: $event
        }).then(function(clickedItem) {
            $scope.alert = clickedItem.name + ' clicked!';
        });
    };
    $scope.Cancel = function() {  
        Alert.loader(true);
        var postData = {
            "task": "PaymentRefuseDemandeQrCode",
            "requestid": $scope.trans.requestid,
        };
        Go.post(postData).then(function(data) {
            if(data.success == 1){
                $state.go('tab.home');
            }
        })  
    };



    $scope.PayFriend = function(etat) { 

        if(Go.is('Sendtofriend')){
            $scope.trans.amount = $filter('number')($scope['amount'], 2);   
            $scope.trans.amount = Number($scope.trans.amount.replace(/[^0-9\.-]+/g, ""));
            total = $scope.trans.amount ;
        }
        if(Go.is('Payfriend')){
              total = Number($scope.trans.amount.replace(/[^0-9\.-]+/g, ""));
        }

        console.log("Acount ", $scope.accounts)
        console.log("Current Acount ", $scope.accounts[$scope.trans.selectedAccount])

        if (total >= API.minAmount) {
            if ($scope.trans.users.length > 0) {
                
                var solde = $scope.accounts[$scope.trans.selectedAccount].solde;
                var Mnumber = Number(solde);
                // total = Number(total.replace(/[^0-9\.-]+/g, ""));

                //console.log('sold',total)
                if (Mnumber >= total && total >= API.minAmount) {
                    if (etat) { // etape 1 ou etape 2
                        var new_sold = Mnumber - total;
                        new_sold = (new_sold).toFixed(2).replace(/./g, function(c, i, a) {
                            return i && c !== "." && ((a.length - i) % 3 === 0) ? ',' + c : c;
                        });
                        

                        var validationList = [{
                            type: 'reason',
                            value: $scope.trans.reson
                        }];
                        if (SharedService.Validation(validationList)) {

                            Alert.loader(true);
                            var postData = {
                                "task": "PaymentSendToFriend",
                                "recipient": $scope.trans.users[0].objectID.substr(2),
                                "requesttoshop": $scope.trans.users[0].isshop,
                                "amount": total,
                                "accountId": $scope.accounts[$scope.trans.selectedAccount].id,
                                "reason": $scope.trans.reson,
                                "sharedreason": 1
                            }; 
                            Go.SGeoPost(postData).then(function(data) {
                                if(data.success == 1){

                                    if( data.requestcommissionassoc > 0 ){
                                        Alert.payment_congratulation( $filter('translate')('qr_payment_requested.transaction_completed_successfully_with_commissions',{
                                            amount: data.requestcommissionassoc,
                                            devise: API.devise,
                                            association: data.association
                                        }) );
                                    }else{
                                        Alert.payment_congratulation( $filter('translate')('qr_payment_requested.transaction_completed_successfully') );
                                    }
                                    
                                    if( parseInt($scope.trans.users[0].isshop) > 0 ){
                                        $state.go('tab.FeedBack', {
                                            'requestid': data.requestid,
                                             'scatid': data.scatid
                                        });
                                    }else{
                                        $state.go('tab.home');
                                    }
                                     

                                    if (typeof data.idfrom !== "undefined" && typeof data.soldefrom !== "undefined") {
                                        Accounts.UpdateSolde(data.idfrom, data.soldefrom);
                                    }
                                     if (typeof data.idto !== "undefined" && typeof data.soldeto !== "undefined") {
                                        Accounts.UpdateSolde(data.idto, data.soldeto);
                                    }

                                    $rootScope.$emit("ClearTrans");
                                } 
                            });
                        }
                    } else {
                        var validationList = [{
                            type: 'reason',
                            value: $scope.trans.reson
                        }];
                        if (SharedService.Validation(validationList)) {
                            $state.go('tab.PayFriend');
                        }           

                    }
                } else {
                    if (total >= API.minAmount) {
                        Alert.error( $filter('translate')('make_a_transfer.insufficient_balance_in_this_account') + ' ' + total + API.devise);
                    } else {
                        Alert.error( $filter('translate')('make_a_transfer.you_cant_send_payment_under_001', {
                            minAmount: API.minAmount+API.devise
                        }));
                    }
                }
            } else {
                Alert.error( $filter('translate')('make_a_transfer.you_need_to_add_recipient') );
            }
        } else {
            Alert.error( $filter('translate')('make_a_transfer.you_cant_send_payment_under_001', {
                minAmount: API.minAmount+API.devise
            }));
        }
    };
 

    $scope.size = 500;
    $scope.correctionLevel = 'L';
    $scope.typeNumber = 0;
    $scope.inputMode = 'Auto';
    $scope.image = false;

 // $scope.trans.QrCode = '123';

    $rootScope.$on("PaymentRecivedByQrCode", function(event, payload) {
         
        Alert.payment_congratulation( $filter('translate')('qr_code_view.transaction_completed_successfully'));

        var isshopCurrentUser = User.GetDetails().isshop;
        if( parseInt(payload.isshop) > 0 && parseInt(isshopCurrentUser) > 0  ){
            $state.go('tab.FeedBackAccept', {
                'requestid': payload.requestid
            });
        }else{
            $state.go('tab.home')
        }
                 
    });

    $rootScope.$on("PaymentDemandePayByQrCode", function() {
        if ($rootScope.goNow == true) { 

            if ($scope.trans.amount >= API.minAmount ) {   
                var validationList = [{
                    type: 'reason',
                    value: $scope.trans.reson
                }];
                if (SharedService.Validation(validationList)) {
                    $rootScope.goNow = false;
                    Alert.loader(true);
                    var postData = {
                        "task": "PaymentDemandePayByQrCode",
                        "amount": $scope.trans.amount,
                        "accountId": $scope.accounts[$scope.trans.selectedAccount].id,
                        "reason": $scope.trans.reson
                    };
                    Go.GeoPost(postData).then(function(data) {
                        if(data.success == 1){
                            $rootScope.goNow = true; 
                            $scope.trans.QrCode = data.QrCode.toString();
                            $state.go('tab.qrCodeViewer');
                        } 
                    });
                }
            } else {
                Alert.error( $filter('translate')('make_a_transfer.you_cant_send_payment_under_001', {
                    minAmount: API.minAmount+API.devise
                }));
            }
        }
    }); 
    $scope.loadedPage = false;
    if (Go.is('qrCodeSendPayment')) {
        if (typeof $stateParams.hash !== 'undefined') {
            var hash = $stateParams.hash 
            Alert.loader(true); 
            var postData = {
                "task": "PaymentGetDetailByQrCode",
                "hash": hash
            };
            Go.post(postData).then(function(data) { 
                if( data.success == 1 ){
                    $scope.trans.requestid = data.requestid;
                    $scope.trans.amount = data.amount;
                    $scope.trans.reson = data.reason;
                    $scope.trans.users[0] = data.recipient_data; 
                    Alert.loader(true);
                    setTimeout(function () {
                       Alert.loader(false);
                    },1000)
                    $scope.loadedPage = true;
                }else{
                    $state.go("tab.home");
                    Alert.loader(false);
                    Alert.error(data.message);
                }
                
            });
        };
    };


    $scope.SendByQrCOde = function() {
        var total = $scope.trans.amount;
        var total2 = Number(total.replace(/[^0-9\.-]+/g, ""));
        var solde = $scope.accounts[$scope.trans.selectedAccount].solde;
        var Mnumber = Number(solde.replace(/[^0-9\.-]+/g, ""));
        if (Mnumber >= total2) {
            Alert.loader(true);
            var postData = {
                "task": "PaymentSendByQrCode",
                "requestid": $scope.trans.requestid,
                "accountId": $scope.accounts[$scope.trans.selectedAccount].id,
                "reason": $scope.trans.reson
            };
            Go.GeoPost(postData).then(function(data) {
 
                if(data.success == 1){
                    // alert(data.push);
                    if( data.requestcommissionassoc > 0 ){
                        Alert.payment_congratulation( $filter('translate')('qr_payment_requested.transaction_completed_successfully_with_commissions',{
                            amount: data.requestcommissionassoc,
                            devise: API.devise,
                            association: data.association
                        }) );
                    }else{
                        Alert.payment_congratulation( $filter('translate')('qr_payment_requested.transaction_completed_successfully') );
                    }
                     
                    var isshopCurrentUser = User.GetDetails().isshop;
                    if( parseInt( data.isshopto ) > 0 ){
                        $state.go('tab.FeedBack', {
                            'requestid': data.requestid,
                            'scatid': data.scatid
                        });
                    }else{
                        $state.go('tab.home')
                    }
                    
                    // var new_solde = $scope.accounts[$scope.trans.selectedAccount].solde - $scope.trans.amount;
                    if (typeof data.idfrom !== "undefined" && typeof data.soldefrom !== "undefined") {
                        //console.log('solde from is changed')
                        Accounts.UpdateSolde(data.idfrom, data.soldefrom);
                    }
                    if (typeof data.idto !== "undefined" && typeof data.soldeto !== "undefined") {
                        //console.log('solde to is changed')
                        Accounts.UpdateSolde(data.idto, data.soldeto);
                    } 
                     
                    $rootScope.$emit("ClearTrans");
                    $rootScope.IsBuyer = true;
                } 
            });
        } else {
            Alert.error($filter('translate')('make_a_transfer.insufficient_balance_in_this_account')+' '+ total + API.devise);
        }
    };

    $scope.AccountToAccount = function() {
        //console.log('selectedAccountToRecive', $scope.trans.selectedAccountToRecive)
        if ($scope.trans.selectedAccount != $scope.trans.selectedAccountToRecive) {
            var total = $scope.trans.amount;
            var solde = $scope.accounts[$scope.trans.selectedAccount].solde;
            var Mnumber = Number(solde.replace(/[^0-9\.-]+/g, ""));
            if ($scope.trans.amount >=  API.minAmount ) {
                if (Mnumber >= total) {

                    var validationList = [{
                        type: 'reason',
                        value: $scope.trans.reson
                    }];
                    if (SharedService.Validation(validationList)) {
                        Alert.loader(true);
                        var postData = {
                            "task": "PaymentAccountToAccount",
                            "reason": $scope.trans.reson,
                            "amount": $scope.trans.amount,
                            "accountIdFrom": $scope.accounts[$scope.trans.selectedAccount].id,
                            "accountIdTo": $scope.accounts[$scope.trans.selectedAccountToRecive].id,
                        };
                        Go.GeoPost(postData).then(function(data) {
                            if(data.success == 1){
                                // var new_solde = $scope.accounts[$scope.trans.selectedAccount].solde - $scope.trans.amount;
                                if (typeof data.idfrom !== "undefined" && typeof data.soldefrom !== "undefined") {
                                    Accounts.UpdateSolde(data.idfrom, data.soldefrom);
                                }
                                if (typeof data.idto !== "undefined" && typeof data.soldeto !== "undefined") {
                                    Accounts.UpdateSolde(data.idto, data.soldeto);
                                }
                                Alert.payment_congratulation( $filter('translate')('qr_payment_requested.transaction_completed_successfully') );
                                //console.log('data account to account ', data)
                                $state.go('tab.home');
                                $rootScope.$emit("ClearTrans");
                            } 
                        });
                    } 

                } else {
                    Alert.error($filter('translate')('make_a_transfer.insufficient_balance_in_this_account')+' '+ total + API.devise);
                }
            } else {
                Alert.error( $filter('translate')('make_a_transfer.you_cant_send_payment_under_001', {
                    minAmount: API.minAmount+API.devise
                }));
            }
        } else {
            Alert.error( $filter('translate')('acount_to_acount.you_need_to_select_two_different_accounts') );
        }
    }; 


    // temporair ============================================== 

    $scope.showQrCode = function(){
        $rootScope.$emit("PaymentDemandePayByQrCode");
    }








    


})

.controller('PickerViewCtrl', function($scope, Lists, pickerView, $filter) {
    var objlist = [{
        values: [Lists.Indicatifs],
        defaultIndex: 7
    }];

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
}) 


.controller('StatisticsCtrl', function($scope, $rootScope, $cordovaToast, Icons, Go,$state,$mdDialog,Alert,$ionicSlideBoxDelegate,Accounts,PaymentFriend, $filter, $stateParams, $translate) { 
    
    $scope.icons = Icons.Images_blanc;
    $scope.iconsBlue = Icons.Images_blue;

    $scope.Style = ['row-outgoing','row-incomes','row-savings'];

    $scope.trans = PaymentFriend;
    $scope.showSubCat = false;

    ///////////////////////////////////////////////////////////
    $scope.$on('$ionicView.beforeEnter', function() {

        $scope.period1 = [ new Date(yyyy,(mm-2),(dd)), new Date(yyyy,(mm-1),(dd-1))]; 
        $scope.period2 =  [ new Date(yyyy,(mm-1),(dd)), new Date(yyyy,mm,dd-1) ];

        var list = Accounts.all();
        $scope.trans.selectedAccount = 0;
        $scope.accounts = Accounts.all(); 
        $scope.CurrentAcountId = $scope.accounts[0].id;
    ///////////////////////////////////////////////////////////  
        $scope.loader = Alert.loader(true); 
        $ionicSlideBoxDelegate.update();

        $rootScope.currentLang = $translate.use();
  
        Highcharts.setOptions({
            lang : { 
                drillUpText: $filter('translate')('statistics.back_to_category'), 
                loading: $filter('translate')('statistics.loading'),
                months: JSON.parse($filter('translate')('statistics.months')),   
                shortMonths: JSON.parse($filter('translate')('statistics.shortmonths')),
                weekdays: JSON.parse($filter('translate')('statistics.days') )
            }
        });


    });

    $scope.$on('$ionicView.afterEnter', function() { 
        $scope.initial();
        setTimeout(function(){ 
            $scope.loader = Alert.loader(false);
        },1000);  

    });

    ////////////////////////******* rangePicker *******///////////////////////
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth(); 
    var yyyy = today.getFullYear();  

    $scope.settings = {
        theme: 'mobiscroll',
        display: 'bottom', 
        autoCorrect : true, 
        lang : $translate.use(),     
        closeOnOverlay : 0,
        swipeDirection : 'vertical'
        // maxDate: new Date(2014, 10, 17)
    };

    $scope.showRangePicker1 = function () {
        $scope.rangePickerDate1.show(); 
    }
    $scope.showRangePicker2 = function () {
        $scope.rangePickerDate2.show(); 
    }

    ////////////////////////////////////********** periodS + Graph **********////////////////////////////////

        // *********************************************** Graphe Line ************************************

        var graphPie1 = graphPie2 = graphArea1 =  graphArea2 = graphColumn1 = graphColumn2 = null;
        $scope.$on('$ionicView.enter', function() {
            var graphPie1 = graphPie2 = graphArea1 =  graphArea2 = graphColumn1 = graphColumn2 = null;
            
        });


    $scope.accountChange = function(){ 
        $scope.CurrentAcountId = $scope.accounts[$scope.trans.selectedAccount].id;
        $scope.initial(); 
    }


    $scope.initial = function(){ 

        var postData = {
            "task": "getStatSynthesis",
            "accountid": $scope.CurrentAcountId,
            "date1": $filter('date')($scope.period1[0], "yyyy-MM-dd"),
            "date2": $filter('date')($scope.period1[1], "yyyy-MM-dd"),
            "date3": $filter('date')($scope.period2[0], "yyyy-MM-dd"),
            "date4": $filter('date')($scope.period2[1], "yyyy-MM-dd")
        };
 

        Alert.loader(true) 
        Go.post(postData).then(function(data) { 
            if(data.success == 1){
                ///////////////////////////// Init Params ///////////////////////////////////// 
                var General_series = data.Synthesis;
                $scope.ResultReqData = data.StatCats;
                
                $scope.details = General_series.details;
                

                $scope.general_seriesP1 = General_series.P1;
                $scope.general_seriesP2 = General_series.P2; 

                angular.forEach($scope.general_seriesP1 , function (object, key) {
                     $scope.general_seriesP1[ key ].name = $filter('translate')('statistics.'+ object.slug );
                }) 
                angular.forEach($scope.general_seriesP2 , function (object, key) {
                     $scope.general_seriesP2[ key ].name = $filter('translate')('statistics.'+ object.slug );
                })  

                $scope.details2 = {};
                if($scope.showSubCat){
                    $scope.dataList.forEach(function(element){
                        element.toggle = false;
                    });
                }
                $scope.etap2 = false ;
                $scope.showSubCat = false;
                setTimeout(function() {
                    $scope.SynchroniseGraph();
                },0)  
                
            } 
        });   
        
    }

    $scope.Statistics_detail = function(detail){
        var notNull = parseFloat( detail.p1 ) + parseFloat( detail.p2 );
        if(detail.slug != 'saving' ){
            if( notNull > 0 ){
                $scope.etap2 = true; 
                $scope.details2 = detail;
                $scope.StatType = detail.type;
                
                ///////////////////////////// Init Params ///////////////////////////////////// 
                $scope.P2 = {}; 
                $scope.P1 = {};
                if( detail.type == "out" ){

                    $scope.dataList = $scope.ResultReqData.out.catgs; 
                    $scope.P2.series = $scope.ResultReqData.out.P2.series;
                    
                    $scope.P2.drilldown = $scope.ResultReqData.out.P2.drilldown; 
                    $scope.P1.series = $scope.ResultReqData.out.P1.series;
                    $scope.P1.drilldown = $scope.ResultReqData.out.P1.drilldown;

                }else if( detail.type == "in" ){

                    $scope.dataList = $scope.ResultReqData.in.catgs; 
                    $scope.P2.series = $scope.ResultReqData.in.P2.series;
                    $scope.P2.drilldown = $scope.ResultReqData.in.P2.drilldown; 
                    $scope.P1.series = $scope.ResultReqData.in.P1.series;
                    $scope.P1.drilldown = $scope.ResultReqData.in.P1.drilldown;

                }
                $scope.SynchroniseGraph()

            }else{
                $cordovaToast.showShortCenter( $filter('translate')('statistics.no_data') );
            }
            
            ///////////////////////////// end Init Params /////////////////////////////////////

            
        }
    }

    $scope.OpenClose = function(catg){

        ///////////////////////////////////////////////////////////////////////////////// 
        angular.forEach(catg.subs ,function (subcat) {
            // body...
        })
        if( parseFloat( catg.p1 ) == 0){
            $scope.NulledgraphPie_1 = true;
        }else{
            $scope.NulledgraphPie_1 = false;
        }

        if( parseFloat( catg.p2 ) == 0 ){
            $scope.NulledgraphPie_2 = true;
        }else{
            $scope.NulledgraphPie_2 = false;
        }
        /////////////////////////////////////////////////////////////////////////////////

        $scope.dataList.forEach(function(element){
            if(element != catg)element.toggle = false;
        });
        catg.toggle = !catg.toggle;

        var selectedCategoryId = catg.id;
 
        angular.forEach($scope.P1.drilldown,function(element){
            if(element.id == selectedCategoryId){
                var list = [];
                var totalSubs = 0;
                angular.forEach(element.data, function(d){
                    var object = {
                        name : d[0],
                        y : d[1]
                    };
                    list.push(object);
                    totalSubs += parseFloat( d[1] );
                })
                if(totalSubs == 0){
                    $scope.NulledgraphPie_1 = true;
                }else{
                    $scope.NulledgraphPie_1 = false;
                }
                $scope.P1datav2 = list;
            }
        }); 
        angular.forEach($scope.P2.drilldown,function(element){
            if(element.id == selectedCategoryId){
                var list = [];
                var totalSubs = 0;
                angular.forEach(element.data, function(d){
                    var object = {
                        name : d[0],
                        y : d[1]
                    };
                    list.push(object);
                    totalSubs += parseFloat( d[1] );
                })
                if(totalSubs == 0){
                    $scope.NulledgraphPie_2 = true;
                }else{
                    $scope.NulledgraphPie_2 = false;
                }
                $scope.P2datav2 = list;
            }
        });
        $scope.showSubCat = catg.toggle;
        if($scope.showSubCat){
            $scope.GraphSubCat(catg);
        }else{
             $scope.GraphColumn();
        } 

    }



    $scope.SynchroniseGraph = function () { 
        Alert.loader(false);
        if($scope.etap2 == false){ 
            /////////////////////////////////////////////////////////////////////////////////
            var AreaGraphe_1 = parseFloat( $scope.details[0].p1 ) + parseFloat( $scope.details[1].p1 )
            if( AreaGraphe_1 == 0){
                $scope.NulledAreaGraphe_1 = true;
            }else{
                $scope.NulledAreaGraphe_1 = false;
            }
            var AreaGraphe_2 = parseFloat( $scope.details[0].p2 ) + parseFloat( $scope.details[1].p2 )
            if( AreaGraphe_2 == 0){
                $scope.NulledAreaGraphe_2 = true;
            }else{
                $scope.NulledAreaGraphe_2 = false;
            }
            /////////////////////////////////////////////////////////////////////////////////
            $scope.graphArea();
            $scope.showSubCat = false;
        }else{
            if($scope.showSubCat){
                $scope.GraphSubCat();
            }else{
                /////////////////////////////////////////////////////////////////////////////////
                
                /////////////////////////////////////////////////////////////////////////////////
                $scope.GraphColumn();
            }
        }
    } 


    $scope.graphArea = function(){
        $scope.showSubCat = false;
        Alert.loader(false); 
        if(graphArea1){ 
            graphArea1.destroy();
            graphArea2.destroy();
        } 


        graphArea1 = Highcharts.chart('graphArea1', {
                    chart: {
                        type: 'spline',
                        width: $("#getwith").width()
                    },
                    title: {
                       text: $filter('translate')('statistics.title_graph_line', {
                            date1: $filter('date')($scope.period1[0], ($rootScope.currentLang =='en') ? "MM-dd-yyyy":"dd-MM-yyyy" ),
                            date2: $filter('date')($scope.period1[1], ($rootScope.currentLang =='en') ? "MM-dd-yyyy":"dd-MM-yyyy" )
                        }).replace(/\n/g,"<br>") 
                    }, 
                    xAxis: {
                        allowDecimals: false,
                        type: 'datetime',
                        labels: {
                            overflow: 'justify'
                        }
                    },
                    exporting: { 
                        enabled: false 
                    },
                    yAxis: {
                        title: {
                            text: $filter('translate')('make_a_transfer.amount')
                        },
                        labels: {
                            formatter: function () {
                                 // / 1000 + 'k'
                                return this.value;
                            }
                        }
                    },
                    tooltip: {
                        pointFormat: '{series.name}: <b>{point.y}</b>'
                    },
                    plotOptions: {
                        series: {
                            pointStart: Date.UTC($filter('date')($scope.period1[0], "yyyy"), $filter('date')($scope.period1[0], "MM")-1, $filter('date')($scope.period1[0], "dd")),
                            pointInterval: 24 * 3600 * 1000 // one day
                        },
                        spline: {
                            lineWidth: 4,
                            states: {
                                hover: {
                                    lineWidth: 5
                                }
                            },
                            marker: {
                                enabled: false
                            }
                        }
                    },
                    series: $scope.general_seriesP1
                }); 
            //console.log("$scope.general_seriesP1", $scope.general_seriesP1)

        graphArea2 = Highcharts.chart('graphArea2', {
                    chart: {
                        type: 'spline',
                        width: $("#getwith").width()
                    },
                    title: { 
                        text: $filter('translate')('statistics.title_graph_line', {
                            date1: $filter('date')($scope.period2[0], ($rootScope.currentLang =='en') ? "MM-dd-yyyy":"dd-MM-yyyy" ),
                            date2: $filter('date')($scope.period2[1], ($rootScope.currentLang =='en') ? "MM-dd-yyyy":"dd-MM-yyyy" )
                        }).replace(/\n/g,"<br>") 
                    }, 
                    xAxis: {
                        allowDecimals: false,
                        type: 'datetime'
                        // labels: {
                        //     formatter: function () {
                        //         return this.value; // clean, unformatted number for year
                        //     }
                        // }
                    },
                    exporting: { 
                        enabled: false 
                    },
                    yAxis: {
                        title: {
                            text: $filter('translate')('make_a_transfer.amount')
                        },
                        labels: {
                            formatter: function () {
                                 // / 1000 + 'k'
                                return this.value;
                            }
                        }
                    },
                    tooltip: {
                        pointFormat: '{series.name}: <b>{point.y}</b>'
                    },
                    plotOptions: {
                        series: {
                            pointStart: Date.UTC($filter('date')($scope.period2[0], "yyyy"), $filter('date')($scope.period2[0], "MM")-1, $filter('date')($scope.period2[0], "dd")),
                            pointInterval: 24 * 3600 * 1000 // one day
                        },
                        spline: {
                            lineWidth: 4,
                            states: {
                                hover: {
                                    lineWidth: 5
                                }
                            },
                            marker: {
                                enabled: false
                            }
                        }
                    },
                    series: $scope.general_seriesP2
                });
    }


    $scope.GraphColumn = function(){ 
        Alert.loader(false); 
        if(graphColumn1){  
            graphColumn1.destroy();
            graphColumn2.destroy();
        } 
        ///////////////////////////// Init Params ///////////////////////////////////// 
            $scope.P2 = {}; 
            $scope.P1 = {};
            if( $scope.StatType == "out" ){

                $scope.dataList = $scope.ResultReqData.out.catgs; 
                $scope.P2.series = $scope.ResultReqData.out.P2.series;
                
                $scope.P2.drilldown = $scope.ResultReqData.out.P2.drilldown; 
                $scope.P1.series = $scope.ResultReqData.out.P1.series;
                $scope.P1.drilldown = $scope.ResultReqData.out.P1.drilldown;

            }else if( $scope.StatType == "in" ){

                $scope.dataList = $scope.ResultReqData.in.catgs; 
                $scope.P2.series = $scope.ResultReqData.in.P2.series;
                $scope.P2.drilldown = $scope.ResultReqData.in.P2.drilldown; 
                $scope.P1.series = $scope.ResultReqData.in.P1.series;
                $scope.P1.drilldown = $scope.ResultReqData.in.P1.drilldown;

            } 
        ///////////////////////////// end Init Params /////////////////////////////////////
        //////////////////////////////////// FORMAT DES DONNES  ///////////////////////  
            $scope.P1.series = [ $scope.P1.series ];
            $scope.P2.series = [ $scope.P2.series ];

        /////////////////// FORMAT DES DONNES  pour chart colomn SERIES /////////////////////// 
            var dataSeries = [];
            angular.forEach($scope.P1.series[0].data, function (obj) {
                dataSeries.push( obj )
            })
            $scope.P1.series[0].data=dataSeries; 

            var dataSeries = [];
            angular.forEach($scope.P2.series[0].data, function (obj) {
                dataSeries.push( obj )
            })
            $scope.P2.series[0].data=dataSeries;  
        ////////////////////////////////////////////////////////////////////////////////  
        /////////////////// FORMAT DES DONNES  pour chart colomn DRILLDOWN ////////////
            var dataDrillDown = [];
            angular.forEach($scope.P1.drilldown, function (obj) {
                dataDrillDown.push( obj )
            })
            $scope.P1.drilldown=dataDrillDown; 

            var dataDrillDown = [];
            angular.forEach($scope.P2.drilldown, function (obj) {
                dataDrillDown.push( obj )
            })
            $scope.P2.drilldown=dataDrillDown;  
        ////////////////////////////////////////////////////////////////////////////////  
        var graphColumn1 = Highcharts.chart('graphColumn1', {
                                chart: {
                                    type: 'column',
                                    width: $("#getwith").width()
                                },
                                title: {
                                    text: $filter('translate')('statistics.'+$scope.details2.slug)+'<br>'
                                    +$filter('date')($scope.period1[0], ($rootScope.currentLang =='en') ? "MM-dd-yyyy":"dd-MM-yyyy" )
                                    +' => '
                                    +$filter('date')($scope.period1[1], ($rootScope.currentLang =='en') ? "MM-dd-yyyy":"dd-MM-yyyy" )
                                }, 
                                exporting: { 
                                    enabled: false 
                                },
                                xAxis: {
                                    type: 'category'
                                },
                                yAxis: {
                                    title: {
                                        text: $filter('translate')('make_a_transfer.amount')
                                    }

                                },
                                legend: {
                                    enabled: false
                                },
                                plotOptions: {
                                    series: {
                                        borderWidth: 0,
                                        dataLabels: {
                                            enabled: true,
                                            format: '{point.y:f}'
                                        },
                                        point: {
                                            events: {
                                                click: function (e) {
                                                    //console.log(e)
                                                }
                                            }
                                        }
                                    }
                                },

                                tooltip: {
                                    headerFormat: '<span style="font-size:11px"></span>',
                                    pointFormat: '<span style="color:{point.color}">{point.name}</span> : <b>{point.y:f}</b>'
                                },
                                series: $scope.P1.series,
                                drilldown: {
                                    series: $scope.P1.drilldown
                                }
                        });  
 

        var graphColumn2 = Highcharts.chart('graphColumn2', {
                                chart: {
                                    type: 'column',
                                    width: $("#getwith").width()
                                },
                                title: {
                                    text: $filter('translate')('statistics.'+$scope.details2.slug)+' <br>'
                                    +$filter('date')($scope.period2[0], ($rootScope.currentLang =='en') ? "MM-dd-yyyy":"dd-MM-yyyy" )
                                    +' => '
                                    +$filter('date')($scope.period2[1], ($rootScope.currentLang =='en') ? "MM-dd-yyyy":"dd-MM-yyyy" )
                                }, 
                                exporting: { 
                                    enabled: false 
                                },
                                xAxis: {
                                    type: 'category'
                                },
                                yAxis: {
                                    title: {
                                        text: $filter('translate')('make_a_transfer.amount')
                                    }

                                },
                                legend: {
                                    enabled: false
                                },
                                plotOptions: {
                                    series: {
                                        borderWidth: 0,
                                        dataLabels: {
                                            enabled: true,
                                            format: '{point.y:f}'
                                        }
                                    }
                                },

                                tooltip: {
                                    headerFormat: '<span style="font-size:11px"></span>',
                                    pointFormat: '<span style="color:{point.color}">{point.name}</span> : <b>{point.y:f}</b>'
                                },

                                series: $scope.P2.series,
                                drilldown: {
                                    series: $scope.P2.drilldown
                                }
                        });   
    }
    
    $scope.GraphSubCat = function (catg) {
        Alert.loader(false); 
        if(graphPie1){ 
            graphPie1.destroy();
            graphPie2.destroy();
        } 

        
        setTimeout(function() {
            graphPie1 = Highcharts.chart('graphPie1', {
                chart: { 
                    plotShadow: false,
                    type: 'pie',
                    width: document.getElementById("graphPie1").offsetWidth
                },
                title: {
                    text: catg.name+'<br>'
                    +$filter('date')($scope.period1[0], ($rootScope.currentLang =='en') ? "MM-dd-yyyy":"dd-MM-yyyy" )
                    +' => '
                    +$filter('date')($scope.period1[1], ($rootScope.currentLang =='en') ? "MM-dd-yyyy":"dd-MM-yyyy" )
                },
                tooltip: {
                    pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
                },
                exporting: { 
                    enabled: false 
                },
                plotOptions: {
                    pie: {
                        allowPointSelect: true,
                        cursor: 'pointer',
                        dataLabels: {
                            enabled: true,
                            format: '{point.percentage:.1f} %'
                        },
                        showInLegend: true
                    }
                },
                series: [{
                    name: $filter('translate')('statistics.percent'),
                    colorByPoint: true,
                    data: $scope.P1datav2
                    }]
            }); 
            graphPie2 = Highcharts.chart('graphPie2', {
                chart: {
                    // plotBackgroundColor: null,
                    // plotBorderWidth: null,
                    plotShadow: false,
                    type: 'pie',
                    width: document.getElementById("graphPie2").offsetWidth
                },
                title: {
                    text: catg.name+'<br>'
                    +$filter('date')($scope.period2[0], ($rootScope.currentLang =='en') ? "MM-dd-yyyy":"dd-MM-yyyy" )
                    +' => '
                    +$filter('date')($scope.period2[1], ($rootScope.currentLang =='en') ? "MM-dd-yyyy":"dd-MM-yyyy" )
                },
                tooltip: {
                    pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
                },
                exporting: { 
                    enabled: false 
                },
                plotOptions: {
                    pie: {
                        allowPointSelect: true,
                        cursor: 'pointer',
                        dataLabels: {
                            enabled: true,
                            format: '{point.percentage:.1f} %'
                        },
                        showInLegend: true
                    }
                },
                series: [{
                        name: $filter('translate')('statistics.percent'),
                        colorByPoint: true,
                        data: $scope.P2datav2
                    }]
            }); 
        },0)

    }
})


.controller('ShopCtrl', function($scope, $rootScope, $cordovaAppAvailability, $ionicActionSheet, $cordovaToast, User, Go, $rootScope, NgMap, $state, $stateParams, Geo, Alert, $ionicScrollDelegate, ALGOLIA, $translate, Catgs, $ionicModal, $ionicSlideBoxDelegate, $ionicScrollDelegate){

    $scope.$on('$ionicView.beforeEnter', function() {  
        Catgs.Sync();
        $scope.categories = Catgs.getNestedCats();  

        ////////// Randem color category //////////////////////////////
        angular.forEach( $scope.categories, function (cat, key) {
            $scope.categories[key].color = getRandomColor();  
            angular.forEach( cat.listscats, function (subcat, k) {

                $scope.categories[key].listscats[k].color = getRandomColor();
            } )
        } )
        ////////////////////////////////////////////////////////////

        $scope.results = {
            shops: []
        }; 

        $scope.SuggestionShop();  

    }) 

    $scope.chipCats = [];  
    $scope.IdsCats = [];  

    $scope.data = {
        searchInput : ''
    };  
      
    var APPLICATION_ID = ALGOLIA.APPLICATION_ID;
    var SEARCH_ONLY_API_KEY = ALGOLIA.SEARCH_ONLY_API_KEY; 

    var INDEX_NAME = 'shops-geosearch';
    $scope.PARAMS = { hitsPerPage: 10 };
    // Client + Helper initialization 
    var algolia = algoliasearch(APPLICATION_ID, SEARCH_ONLY_API_KEY); 
    var algoliaHelper = algoliasearchHelper(algolia, INDEX_NAME, $scope.PARAMS);
    $scope.SuggestionShop = function() {
        
        $scope.searchProgress = true;
        
        if(!$scope.results){
            $scope.results = {};
         }
        ////// 1er visite
        // Alert.loader(true);
        Geo.getPosition().then(function(data) {   
            //var data = {lat:31.589472300000003, lng:-7.991084500000001}
            $scope.center = [ data.lat, data.lng ]; 
              
            algoliaHelper.setQueryParameter('aroundLatLng', $scope.center[0]+', '+$scope.center[1]);
            algoliaHelper.setQueryParameter('query', ' '); 
            algoliaHelper.addNumericRefinement('isshop', '=', 1);
            algoliaHelper.addNumericRefinement('suspended', '=', 0);
            algoliaHelper.addNumericRefinement('treezorvaldation', '=', 1);
            algoliaHelper.addNumericRefinement('deleted', '=', 0);
            algoliaHelper.addNumericRefinement('pimaccount', '=', 0);
            algoliaHelper.addNumericRefinement('visibleinfrontshop', '=', 1);
            algoliaHelper.setQueryParameter('getRankingInfo', true);
            algoliaHelper.search(); 
            algoliaHelper.on('result', function(results, state) {  
                
                $scope.searchProgress = false;

                $scope.nbHits = results.nbHits; 
                $scope.LoadingMoreShops = false; 
                if(results.nbHits <= 10){
                    $scope.PARAMS.hitsPerPage = 10;
                }   
                $scope.searchProgress = false; 
                $scope.$apply(function () {
                    $scope.results.shops = $rootScope.listShop = results.hits;
                    $ionicScrollDelegate.resize();  
                })

 
            }); 
            
        });
    }; 
     
    $scope.$watch('data.searchInput', function(newVal, oldVal) { 
        if(newVal){
            $scope.data.searchInput = newVal.replace(/[^a-z0-9áàâäãåçéèêëíìîïñóòôöõúùûüýÿæœÁÀÂÄÃÅæÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ._@&'@ ]/gi,'');
        }
    })
    
    $scope.search = function(){ 
        $scope.message ="searchinng...";
        var algoliaHelper = algoliasearchHelper(algolia, INDEX_NAME, $scope.PARAMS);
        
        if( true ){  
            $scope.searchProgress = true;
            Geo.getPosition().then(function(data) { 
 
                if( $scope.data.searchInput.length > 0 ){
                    algoliaHelper.setQueryParameter('query', $scope.data.searchInput);
                }

                algoliaHelper.setQueryParameter('aroundLatLng', $scope.center[0]+', '+$scope.center[1]); 
                algoliaHelper.addNumericRefinement('isshop', '=', 1);
                algoliaHelper.addNumericRefinement('suspended', '=', 0);
                algoliaHelper.addNumericRefinement('treezorvaldation', '=', 1);
                algoliaHelper.addNumericRefinement('deleted', '=', 0);
                algoliaHelper.addNumericRefinement('pimaccount', '=', 0);
                algoliaHelper.addNumericRefinement('visibleinfrontshop', '=', 1);
                algoliaHelper.setQueryParameter('getRankingInfo', true);  

                if($scope.IdsCats.length > 0){
                    algoliaHelper.addNumericRefinement('scatid', '=', $scope.IdsCats);  
                }
                    
                algoliaHelper.search();  

                algoliaHelper.on('result', function(results, state) { 
                    $scope.searchProgress = false;

                        $scope.nbHits = results.nbHits; 
                        $scope.LoadingMoreShops = false; 
                        if(results.nbHits <= 10){
                            $scope.PARAMS.hitsPerPage = 10;
                        }   
                        $scope.searchProgress = false; 
                        $scope.$apply(function () {
                            $scope.results.shops = $rootScope.listShop = results.hits;
                            $ionicScrollDelegate.resize();  
                        }) 
  
                });
                
            }) 
        }
    }   

    $scope.twoDigitAfterCama = function (num) { 
        return parseInt( num );
    }
    $scope.LoadingMoreShops = false;
    $scope.OnscrollingResult = function () { 
        setTimeout(function () {
            if($ionicScrollDelegate.$getByHandle('result').getScrollPosition().top){
                angular.element('#searchInputShop').trigger('blur');
                var scrollingValue = $ionicScrollDelegate.$getByHandle('result').getScrollPosition().top;
                var maxValue = $ionicScrollDelegate.$getByHandle('result').getScrollView().__maxScrollTop;

                // console.log("ionicScrollDelegate", $ionicScrollDelegate.$getByHandle('result').getScrollPosition());
                // console.log("scrollingValue", scrollingValue);
                // console.log("maxValue", maxValue);
                
                if( scrollingValue == maxValue && scrollingValue > 250 ){ 
                    $scope.LoadMoreShops()
                }
            } 
        })
    }  
    $scope.LoadMoreShops = function () {
        $scope.PARAMS.hitsPerPage = $scope.PARAMS.hitsPerPage + 10;
        $scope.$apply(function () {
            $scope.LoadingMoreShops = true;
        }) 
        $scope.search();
    } 
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////
    $scope.widthContinnerCat = function () {
        setTimeout(function () {
            var width=0;
             $('.ion-scroll-Cat .chipsCat > div').each(function () { 
                width = width + parseInt($(this).css('width')) + 25;
             }) 
             $('.ion-scroll-Cat > .scroll').css('width',width);
        },500)
    }
    
    $scope.RemoveCategory = function( category ){ 
        

        var idSubCat = $scope.chipCats.indexOf( category );
         

        angular.forEach($scope.categories, function (subCats, key) {
            angular.forEach(subCats.listscats, function (subCat, k) {
 
                if( $scope.categories[key].listscats[k].scatid == $scope.IdsCats[idSubCat] ){
                    $scope.categories[key].listscats[k].selected = false;
                }
            })
        })

        $scope.chipCats.splice(idSubCat, 1); 
        $scope.IdsCats.splice(idSubCat, 1);
 
        $scope.search();
 
        if($scope.chipCats.length == 0){
            $('.result.ionic-scroll').removeClass('isSetCat')
        }else{
            $('.result.ionic-scroll').addClass('isSetCat')
        }
        $scope.widthContinnerCat()
 
        
    }

    $scope.showCategories = function(){ 
        console.log("showCategories") 
        $scope.Filter.show();
    }
    $scope.showSubCat = function (idCat, categorie) {
        
        $scope.subCategorie = categorie.listscats;
        $scope.selectedCat = idCat;
        setTimeout(function () {
            $ionicScrollDelegate.$getByHandle('subCat').resize(); 
        })

        $scope.SubCatFilter.show()
    }

    $scope.ResetCat = function () {
        $scope.IdsCats = [];
        $scope.chipCats = [];
        angular.forEach($scope.categories, function (subCats, key) {
            angular.forEach(subCats.listscats, function (subCat, k) {
                $scope.categories[key].listscats[k].selected = false;
            })
        })
        $scope.SubCatFilter.hide()
    }

    $scope.selectSubCat = function (key, subCat) {
        $scope.categories[$scope.selectedCat].listscats[key].selected = !$scope.categories[$scope.selectedCat].listscats[key].selected;
        
        if( $scope.chipCats.indexOf( subCat.scatlabel ) < 0 && subCat.scatlabel != "" && subCat.scatlabel !== undefined ){ 
            $scope.chipCats.push( subCat.scatlabel );
            $scope.IdsCats.push( subCat.scatid ); 
            angular.element(document.querySelector('.block-search')).addClass('hide-map');  
        }else{
            $scope.chipCats.splice($scope.chipCats.indexOf( subCat.scatlabel ))
        }
        if($scope.chipCats.length == 0){
            $('.result.ionic-scroll').removeClass('isSetCat')
        }else{
            $('.result.ionic-scroll').addClass('isSetCat')
        }
        $scope.widthContinnerCat()
        $scope.search();

        $scope.Filter.hide()
        $scope.SubCatFilter.hide()  
    }

    $scope.finishFilter = function () {
        $scope.Filter.hide()
        $scope.SubCatFilter.hide()
    }

    $scope.getRandomColor = function () {
        return getRandomColor();
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

.controller('ShopDetailCtrl', function($scope,$cordovaAppAvailability, $ionicActionSheet, $cordovaFileTransfer, $cordovaToast, $ionicModal, User, Go, $rootScope, NgMap, $state, $stateParams, Geo, Alert, $ionicScrollDelegate, $filter){
    
    if( !$rootScope.listShop || $rootScope.listShop.length == 0 ){
        $state.go('tab.shop');
    }

    $scope.showFullinfo = true; 
    $scope.twoDigitAfterCama = function (num) { 
        return parseFloat( num.toFixed(2) );
    }
    $scope.$on('$ionicView.beforeEnter', function() {  
        
        if( !$rootScope.listShop || $rootScope.listShop.length == 0 ){
            $state.go('tab.shop');
        }else{
            var findedShop = false; 

            angular.forEach($rootScope.listShop, function (item) {   

                if(item.objectID.replace( /^\D+/g, '') == $stateParams.idShop.replace( /^\D+/g, '')){
                    console.log("Query")
                    $scope.currentShop = item;
                     
                    var postData = {
                        "task": "DetailsShop",
                        "shopid": $stateParams.idShop.replace( /^\D+/g, '')
                    };  
                    $scope.showFullinfo = false; 
                    $scope.LoadingMoreInfo = true 
                    Go.post(postData).then(function(data) { 
                        if(data.success == 1){
                            $scope.data = data;
                            $scope.currentShop.logo = data.infos.logo_medium;
                            $scope.currentShop.cover = data.infos.cover;
                            $scope.LoadingMoreInfo = false;
                            if(data.comments.length == 0){
                                $scope.showFullinfo = true; 
                            }else{
                                setTimeout(function () {
                                    $('.profile-shop #shopCommentsZone').css("height", $(window).height() - 194);
                                    setTimeout(function () {
                                        $ionicScrollDelegate.resize();
                                    })
                                },1000)
                            }

                            hasWWW = $scope.data.infos.siteweb.toLowerCase().search('www.');
                            hashttp = $scope.data.infos.siteweb.toLowerCase().search('http://');

                            if( hasWWW < 0 ){
                                $scope.data.infos.siteweb = "www."+$scope.data.infos.siteweb.toLowerCase();
                            }
                            if( hashttp < 0 ){
                                $scope.data.infos.siteweb = "http://"+$scope.data.infos.siteweb;
                            } 
                        } 
                    })

                    findedShop = true;
                }
                    
            })
            setTimeout(function () {
                if(!findedShop) $state.go('tab.shop');
            })
        } 
    })  
    $scope.showMoreInfo = function (showFullinfo) {
        $scope.showFullinfo = !showFullinfo; 
        $ionicScrollDelegate.resize();
        setTimeout(function () { 
            if($scope.showFullinfo){
                $ionicScrollDelegate.$getByHandle('mainScroll').scrollBottom(true);
            } 
        })
    }
    var InBottom = false;
    $scope.scrolingOnPage = function () {
        var scrollTop = $ionicScrollDelegate.getScrollPosition().top;  
        if( scrollTop >= 340 ){
            if(!$scope.showFullinfo && !InBottom){  
                $ionicScrollDelegate.$getByHandle('mainScroll').scrollBottom(true);
                InBottom = true;
            }
        }else{
            InBottom = false;
        }
    }
     
    $scope.choseMapsService = function ( parram1,  parram2,  parram3 ) { 
        angular.element(document.querySelector('body')).removeClass('platform-android');
        
        if( ionic.Platform.isIOS() ){
            var actionButton = [
               { text: 'Apple Maps' },
               { text: 'Google Maps' },
               { text: 'Waze' }
            ]
        }else{
            var actionButton = [ 
               { text: 'Google Maps' },
               { text: 'Waze' }
            ]
        }

        

        $ionicActionSheet.show({
         buttons: actionButton, 
         cancelText: 'Cancel',
         cancel: function() {
              
        },
         buttonClicked: function(index) {
            index = (!ionic.Platform.isIOS()) ? index + 1 : index;
            switch(index) { 
                case 0:
                    cordova.InAppBrowser.open('maps://?q='+ parram3+'&ll='+parram1+','+parram2, '_system'); 
                    break;
                case 1: 
                    var appSchema = ( ionic.Platform.isIOS() ) ? "comgooglemaps://" : "com.google.android.apps.maps";
                    var urlApp = ( ionic.Platform.isIOS() ) ? "https://itunes.apple.com/fr/app/google-maps-gps-transports-publics/id585027354?mt=8" : "https://play.google.com/store/apps/details?id=com.google.android.apps.maps";
                    
                    appAvailability.check( appSchema, // URI Scheme 
                    function() {  // Success callback 

                      cordova.InAppBrowser.open('comgooglemaps://?q=' + parram1+","+ parram2+"("+ parram3+")", '_system');

                    },function() {  // Error callback  

                        cordova.InAppBrowser.open( urlApp , '_system');

                    }); 
                    break; 
                case 2:   
                    var appSchema = ( ionic.Platform.isIOS() ) ? "waze://" : "com.waze";
                    var urlApp = ( ionic.Platform.isIOS() ) ? "http://itunes.apple.com/us/app/id323229106" : "https://play.google.com/store/apps/details?id=com.waze";
                    
                    appAvailability.check( appSchema, // URI Scheme 
                        function() {  // Success callback 

                            cordova.InAppBrowser.open('waze://?ll=' + parram1+","+ parram2+"&navigate=yes", '_system');

                        },
                        function() {  // Error callback  

                            cordova.InAppBrowser.open( urlApp , '_system');

                        }
                    );
                    break; 
                default:
                     cordova.InAppBrowser.open('maps://?q='+ parram3+'&ll='+parram1+','+parram2, '_system');
                    break; 
            } 
            return true;
         }
       })
    }
    $scope.actionBtn = function (action, parram1,  parram2,  parram3) {  
        // console.log(parram1)
        // console.log(parram2)
        // console.log(parram3)
        if(action=="http"){
            if( parram1.search('http') == -1 ){
                window.open('http://'+parram1.replace(/\s/g,''), '_system');
            }else{
                window.open(parram1.replace(/\s/g,''), '_system');
            }
            
        }
        else if(action=="geo"){

            var specialChars = "!@#$^&%*+[]\/{}|:<>";
            for (var i = 0; i < specialChars.length; i++) {
                parram3 = parram3.replace(new RegExp("\\" + specialChars[i], 'gi'), '');
            }

            if( ionic.Platform.isIOS() ){ 
                $scope.choseMapsService( parram1,  parram2,  parram3 );
            }else{ 
                window.open('geo:?q=' + parram1+","+ parram2+" ("+ parram3+")", '_system');
            } 
        }
        else{
            window.open(action+':' + parram1.replace(/\s/g,''), '_system');
        }
        
    }

    $ionicModal.fromTemplateUrl('image-modal-comment-shop.html', {
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

    $scope.showImage = function(srcImage) { 
        $scope.imageSrc  = srcImage;
      $scope.openModal();
    } 

    $scope.onHold = function () {
        angular.element(document.querySelector('body')).removeClass('platform-android');
        $ionicActionSheet.show({
             buttons: [
               { text: 'Save'} 
             ], 
             cancelText: 'Cancel',
             cancel: function() {
              
        },
         buttonClicked: function(index) {
            switch(index) {
                case 0:
                    $scope.downloadPicture()
                    break; 
            } 
            return true;
         }
       })
    } 
    $scope.downloadPicture = function () {
            console.log($scope.imageSrc)
            if( ionic.Platform.isIOS() ){
                $scope.ExternalPath = cordova.file.documentsDirectory;
            }else{ 
                $scope.ExternalPath = cordova.file.externalDataDirectory; 
            }

            $scope.downloading = true;    
            var targetPath = $scope.ExternalPath+$scope.imageSrc.substring($scope.imageSrc.lastIndexOf('/')+1); 

            $cordovaToast.showShortCenter( $filter('translate')('transaction_detail.downloading') ); 
            $cordovaFileTransfer.download($scope.imageSrc, targetPath, {}, true)
            .then(function(result) {     

                $scope.targetPath = targetPath; 
                $scope.downloadFileToGallery();
                

            },function(err) {  

                 $cordovaToast.showShortCenter( $filter('translate')('transaction_detail.error_try_again') );
                
            },function(progress) { 
                 
            });
    }
    $scope.downloadFileToGallery = function () {    
        window.cordova.plugins.imagesaver.saveImageToGallery($scope.targetPath, onSaveImageSuccess, onSaveImageError); 
        function onSaveImageSuccess() {  
            $cordovaToast.showShortCenter( $filter('translate')('transaction_detail.picture_downloaded') );
        } 
        function onSaveImageError(error) { 
             $cordovaToast.showShortCenter( $filter('translate')('transaction_detail.no_permission_to_access_to_gallery') ); 
        }
    }
})

.controller('NotifCtrl', function($scope, API, Icons, Geo, User,$storage, $cordovaSocialSharing, ResetePage, $ionicHistory, Badges, $cordovaBadge, DATA, PaymentFriend, $rootScope, Notifs, $ionicSlideBoxDelegate, Accounts, Go, $state, $stateParams, Alert, $filter) {
    //console.log(User.UserEmail)
    $scope.notifsList = [];
    $scope.icons = Icons.Images_blanc;
    $scope.iconsBlue = Icons.Images_blue;
    $scope.devis = API.devise;

    $scope.trans = PaymentFriend;
    $scope.DATA_badg = DATA;
    $scope.$on('$ionicView.beforeEnter', function() {
        $scope.loaded = false;
    });

    var page = 0;
    
    $scope.RefreshNotifs = function(loader) {

        if(loader){
            Alert.loader(true);
        }

        Notifs.getAllNotifs().then(function(data) {
            Alert.loader(false); 
            // Update notifComteur From COnnected User
            var userInfos = User.GetDetails().userInfos;
            console.log("userInfosuserInfosuserInfos", userInfos) 
            userInfos.NbrNotifNonVu = 0;
            $rootScope.updateNotifConnectedUser( userInfos );  
            //////////////////////////////////////////////////////////

            setTimeout(function () {
               $scope.$apply(function () {
                    page = 0;
                    Alert.loader(false);
                    $scope.loaded = true;
                    // $scope.notifsList = data.requests;
                    $scope.notifsList = []; 
                    data.requests.forEach(function(element) {
                        element.color = $scope.getcolorFromList(element)
                        $scope.notifsList.push(element);
                    });
                    if ($scope.notifsList.length == 0) {
                        $scope.message = true;
                    }
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                    //console.log('data.count_requests ',data.count_requests ,$scope.notifsList.length,$scope.notifsList)
                    if (data.count_requests > $scope.notifsList.length) {
                        page += 1;
                        //console.log('pluuuus 1')
                        $scope.canMore = true;
                    } else {
                        $scope.canMore = false;
                        //console.log('stop scroll')
                    }
                        //console.log('page count;',page)
                    DATA.Nbr_notif = $scope.notifsList.length;
                    DATA.badgeCount = 0;
                    Badges.clear();
                    if( $rootScope.gotoDetailPushNotif ){
                        setTimeout(function () {
                            $scope.gotoDetailPushNotif( $rootScope.gotoDetailPushNotif );
                            $rootScope.gotoDetailPushNotif = null;
                        })  
                    }
               })
            }) 
               
        }).finally(function() { 
            $scope.$broadcast('scroll.refreshComplete'); 
        });
    };

    var NotifReloadListState = false
    $rootScope.$on("NotifReloadList", function() {  
        
        if (Go.is('list-notifications') && NotifReloadListState == false) { 
            NotifReloadListState = true;
             
            $scope.RefreshNotifs(true);  
            setTimeout(function () {
                NotifReloadListState = true;
            },3000) 

        }
    });
    
    var orange_index = -1;
    var blue_index = -1;
    $scope.getcolorFromList = function(element){
        if(parseInt(element.isshop) == 0){ 
            blue_index++;
            if(blue_index > $rootScope.BlueColorList.length){
                blue_index = -1;
            }
            return $rootScope.BlueColorList[blue_index];
        }else{
            orange_index++;
            if(orange_index > $rootScope.OrangeColorList.length){
                orange_index = -1;
            }
            return $rootScope.OrangeColorList[orange_index];
        }
    }
 
    $scope.$on('$ionicView.beforeEnter', function() { 
        if (Go.is('list-notifications')) { 
            page = 0;
            $scope.RefreshNotifs(false);
        }   
    });

    $scope.canLoadMore = function() {
        return $scope.canMore;
    }
    $scope.loadMore = function() {
        //console.log('=====================>is scroll: ', page)
        var postData = {
            "task": "getAllNotifs", //getInfosAccount
            "page": page
        }; 
        if(page > 0){
            
            Go.post(postData).then(function(data) {
                $scope.loaded = true;
                if (data.success == 1) {
                data.requests.forEach(function(element) {
                    element.color = $scope.getcolorFromList(element)
                    $scope.notifsList.push(element);
                });
                if (data.count_requests > $scope.notifsList.length) {
                    page += 1;
                } else {
                    $scope.canMore = false;
                    // //console.log('stop scroll')
                }
                // //console.log('lklklkl')
                $storage.setObject('NotifList', $scope.notifsList);
                } else {
                    Alert.error(data.message);
                }

                setTimeout(function () {
                    $storage.setObject('NotifList', $scope.notifsList);
                    // //console.log('count list ',$scope.notifsList.length)
                    // //console.log('obj list ',$scope.notifsList)
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                })
            });

        }


    };

 
 
    $scope.OpenNotif = function(notif) {
        
        ///////////////// Change Notif State ////////////////////
        Go.post({
            task: "setStatNotif",
            "NoLoader": true,
            notifid: notif.id
        }).then(function(data) {})
        ////////////////////////////////////////////////////////

        $scope.currentNotif = notif;
        Alert.loader(true);
        if (notif.type == 'sendpaymenttofriend') {

            $state.go("tab.PayRecive", {
                id: notif.id
            });

        }else if (notif.type == 'deselectassocbyblockassoc') {
            
            $state.go("tab.causes");
            
        }
        else if (
                    notif.type == 'deselectassocbyblockassoc' ||
                    notif.type == 'add_doc_pi_signatory' ||
                    notif.type == 'add_doc_persenal_address_signatory' ||
                    notif.type == 'add_doc_pi_rep' ||
                    notif.type == 'add_doc_persenal_address_rep' ||
                    notif.type == 'add_doc_pi_shareholder' ||
                    notif.type == 'add_doc_persenal_address_shareholder' ||
                    notif.type == 'profil_blocked_signatory' ||
                    notif.type == 'profil_blocked_rep' ||
                    notif.type == 'profil_blocked_shareholder' ||
                    notif.type == 'doc_identity_confirmed_signatory' ||
                    notif.type == 'doc_identity_refused_signatory' ||
                    notif.type == 'doc_identity_confirmed_rep' ||
                    notif.type == 'doc_identity_refused_rep' ||
                    notif.type == 'doc_identity_confirmed_shareholder' ||
                    notif.type == 'doc_identity_refused_shareholder' ||
                    notif.type == 'doc_address_confirmed_signatory' ||
                    notif.type == 'doc_address_refused_signatory' ||
                    notif.type == 'doc_address_confirmed_rep' ||
                    notif.type == 'doc_address_refused_rep' ||
                    notif.type == 'doc_address_confirmed_shareholder' ||
                    notif.type == 'doc_address_refused_shareholder' ||
                    notif.type == 'updatepibyadmin_signatory' ||
                    notif.type == 'updatepibyadmin_rep' ||
                    notif.type == 'updatepibyadmin_shareholder' ||
                    notif.type == 'updatephonebyadmin_signatory' ||
                    notif.type == 'updatephonebyadmin_rep' ||
                    notif.type == 'updatephonebyadmin_shareholder' ||
                    notif.type == 'updateemailbyadmin_signatory' ||
                    notif.type == 'updateemailbyadmin_rep' ||
                    notif.type == 'updateemailbyadmin_shareholder' ||
                    notif.type == 'updateaddressbyadmin_signatory' ||
                    notif.type == 'updateaddressbyadmin_rep' ||
                    notif.type == 'updateaddressbyadmin_shareholder' ||
                    notif.type == 'treezorvaldation_confirmed' ||
                    notif.type == 'treezorvaldation_confirmed_signatory' ||
                    notif.type == 'treezorvaldation_confirmed_rep' ||
                    notif.type == 'treezorvaldation_confirmed_shareholder' ||
                    notif.type == 'treezorvaldation_refused' ||
                    notif.type == 'treezorvaldation_refused_signatory' ||
                    notif.type == 'treezorvaldation_refused_rep' ||
                    notif.type == 'treezorvaldation_refused_shareholder'
        ) {
            $rootScope.$emit('GetShareCapitalData');
            $state.go('tab.settings');
            setTimeout(function() {
                $state.go('tab.capital-social') ;
            },500)
            
        }else if (
                    notif.type == 'doc_address_confirmed' || 
                    notif.type == 'doc_address_refused' ||
 
                    notif.type == 'doc_identity_confirmed' ||  
                    notif.type == 'doc_identity_refused' || 

                    notif.type == 'doc_shopname_confirmed'  || 
                    notif.type == 'doc_shopname_refused' || 

                    notif.type == 'doc_shopaddress_confirmed' || 
                    notif.type == 'doc_shopaddress_refused' || 

                    notif.type == 'doc_hqaddress_confirmed' || 
                    notif.type == 'doc_hqaddress_refused' || 

                    notif.type == 'validatedemail' ||   
                    notif.type == 'validatedemaildcontact' ||
                    notif.type == 'doc_shopphone_confirmed' || 
                    notif.type == 'doc_shopphone_refused' || 
                    notif.type == 'doc_shophqphone_confirmed' || 
                    notif.type == 'doc_shophqphone_refused' ||

                    notif.type == 'updatepibyadmin' || 
                    notif.type == 'updatephotobyadmin' || 
                    notif.type == 'updateaddressbyadmin' ||  

                    notif.type == 'updatephonebyadmin' || 
                    notif.type == 'updateemailbyadmin' || 
                    notif.type == 'updatepasswordbyadmin' || 
                    notif.type == 'updatesecretquestionsbyadmin' ||

                    notif.type == 'updatecibyadmin' || 
                    notif.type == 'updateshopphonebyadmin' || 
                    notif.type == 'updateshophqphonebyadmin' || 
                    notif.type == 'updatelogobyadmin'||
                    notif.type == 'updatecoverbyadmin' || 
                    notif.type == 'updatecontactmailbyadmin' || 
                    notif.type == 'updateshopaddressbyadmin' || 
                    notif.type == 'updateshophqaddressidbyadmin'||
                    notif.type == 'updateshoptypebyadmin' || 
                    notif.type == 'updateshopvatbyadmin' || 
                    notif.type == 'updateshopscatbyadmin' || 
                    notif.type == 'doc_shopLetterauthorisation_refused' ||
                    notif.type == 'doc_shopLetterauthorisation_confirmed' ||

                    notif.type == 'updateshopmobilebyadmin' || 
                    notif.type == 'updateshopmailbyadmin' ||
                    
                    notif.type == 'profil_deblocked' ||

                    notif.type == 'add_doc_pi' ||
                    notif.type == 'add_doc_persenal_address' ||
                    notif.type == 'add_doc_ci' ||
                    notif.type == 'add_doc_shop_address' ||
                    notif.type == 'add_doc_hq_address' ||
                    notif.type == 'add_doc_letterauthorisation' ||
                    notif.type == 'annulupdatecontactmailbyadmin' ||
                    notif.type == 'annulupdatemailbyadmin' ||
                    notif.type == 'updatepimcommision' ||
                    notif.type == 'updateassoccommision'


                    )
            {
                 
                var OldUserDetails =  User.GetDetails();
                var postData = {
                    "task": "getUserDetails",
                };
                Go.post(postData).then(function(data) { 
                    if(data.success == 1){
                         
                        UserDetails = data.UserDetails;  
                        UserDetails.isPro = data.isshop;
                        UserDetails.userInfos = OldUserDetails.userInfos;
                        $rootScope.isPro = data.isshop;
                        User.SetDetails(UserDetails);
                        
                        if( parseInt(data.isshop) == 0 ){ 
                            $state.go('tab.settings', {}, {reload: true});
                        }
                        if( parseInt(data.isshop) == 1 ){ 
                            $state.go('tab.settingsPro', {}, {reload: true});
                        }
                        if( parseInt(data.isshop) == 2 ){ 
                            $state.go('tab.settingsAssociation', {}, {reload: true});
                        } 
                    } 
                });

        }else if( notif.type == "acceptpaymenttofriend" || notif.type == "recievepaymentbyqrcode" || notif.type == "acceptedpayout" || notif.type == "acceptedpayin" ){
            
            $state.go("tab.detailTransactionFromNotif", 
                {idreq: notif.objectid}
            );
        }else if( notif.type == 'updateassociationbyadmin' ){
            $state.go('tab.home');
        }
        else if( notif.type == 'profil_blocked' ){
            Alert.info( $filter('translate')('api.1013') );
            $state.go('signin');
        }
        else { 
            $state.go("tab.infoNotif", 
                {id: notif.id}
            );
        }
    }; 

    $scope.$on('$ionicView.beforeEnter', function() { 

        if (Go.is('info-notifications')) {
            if (typeof $stateParams.id !== 'undefined') { 
                var pay_id = $stateParams.id;
                // Alert.loader(true);

                
                var ObjNotif = Notifs.getNotifById(pay_id, true); 
                // //console.log('ObjNotif',ObjNotif)
                $scope.ObjNotif = ObjNotif;
                $scope.NotifInList = ObjNotif;
                //console.log('NotifInList',$scope.NotifInList)
                $scope.type = ObjNotif.type ; 

                // ////console.log("ObjNotif.type",ObjNotif.type)
                // //console.log('ObjNotif',ObjNotif)
                if( ObjNotif != null){  
                    Notifs.getNotifById(pay_id).then(function(data) {
                    Alert.loader(false) 
                                //console.log('notif id :',data)
                                $scope.ObjNotif = data;
                                $scope.loaded = true;
                                //console.log('$scope.InfoNotif ok',$scope.InfoNotif)
                    

                            console.log("ObjNotif ", data)
                            switch (ObjNotif.type) {
                                case 'recievepaymentbyqrcode':
                                    $scope.text = " "+$filter('translate')('notification_detail.send_to_you_a_payment_by_qr_code');
                                    break;
                                case 'acceptpaymenttofriend':
                                    $scope.text = " "+$filter('translate')('notification_detail.has_accepted_your_payment');
                                    break;
                                case 'refusepaymenttofriend':
                                    $scope.text = " "+$filter('translate')('notification_detail.has_refused_your_payment');
                                    break;
                                case 'cancelledpayin':
                                    $scope.text = $filter('translate')('notification_detail.the_payment_you_sent_to_fname_fname_was_cancelled_amountdevis_was_credited_on_your_account', {
                                        fname: $scope.ObjNotif.fname,
                                        lname: $scope.ObjNotif.lname,
                                        amount: $scope.ObjNotif.amount,
                                        devis: $scope.devis
                                    });
                                    break;
                                case 'cancelledpayout':
                                    $scope.text = $filter('translate')('notification_detail.the_payment_you_sent_to_fname_fname_was_cancelled_amountdevis_was_credited_on_your_account', {
                                        fname: $scope.ObjNotif.fname,
                                        lname: $scope.ObjNotif.lname,
                                        amount: $scope.ObjNotif.amount,
                                        devis: $scope.devis
                                    });
                                    break;
                                case 'cancelledpaymenttofriend': // refuser
                                    console.log(ObjNotif)
                                    $scope.text = $filter('translate')('notification_detail.the_payment_you_sent_to_fname_fname_was_cancelled_amountdevis_was_credited_on_your_account', {
                                        fname: ObjNotif.fname,
                                        lname: ObjNotif.lname,
                                        amount: ObjNotif.amount,
                                        devis: $scope.devis
                                    });
                                    break;
                                case 'cancelledpaymenttofriend_toblockeduser':
                                    $scope.text = $filter('translate')('notification_detail.the_payment_you_sent_to_fname_fname_was_cancelled_amountdevis_was_credited_on_your_account', {
                                        fname: ObjNotif.fname,
                                        lname: ObjNotif.lname,
                                        amount: ObjNotif.amount,
                                        devis: $scope.devis
                                    });
                                    break;
                                case 'cancelledreceivedpayment_fromblockeduser':
                                    $scope.text = $filter('translate')('notification_detail.the_payment_you_sent_to_fname_fname_was_cancelled_amountdevis_was_credited_on_your_account', {
                                        fname: ObjNotif.fname,
                                        lname: ObjNotif.lname,
                                        amount: ObjNotif.amount,
                                        devis: $scope.devis
                                    });
                                    break;
                                case 'cancelledreceivedpayment': 
                                    $scope.text = $filter('translate')('notification_detail.the_payment_you_received_was_cancelled', {
                                        text: ObjNotif.text
                                    });
                                    break;
                                default: // aucun document
                                    $scope.text = "";
                            }

                    });
                }
            } 
        } 
    });
    if (Go.is('PayRecive')) { 

        $scope.$on('$ionicView.beforeEnter', function() {
            var list = Accounts.all();
            // //console.log('list[$scope.trans.SelectedIndex]', list[$scope.trans.selectedAccount])
            if (typeof list[$scope.trans.selectedAccount] === "undefined") {
                $scope.trans.selectedAccount = 0;
            }
            $scope.accounts = Accounts.all();
            if (typeof $stateParams.id !== 'undefined') {
                var pay_id = $stateParams.id;
                Alert.loader(true);
                Notifs.getNotifById(pay_id).then(function(data) {
                    $scope.InfoNotif = data;
                    $scope.loaded = true;
                });
                var ObjNotif = Notifs.getNotifById(pay_id, true);
                $scope.NotifInList = ObjNotif;
 
            }
        });

        $scope.$on('$ionicView.afterEnter', function() {
            $ionicSlideBoxDelegate.update();
        });
    }

    

        

    $scope.$on('$ionicView.beforeEnter', function() { 

        if (Go.is('/detail-wating-request/')) { 

            var list = Accounts.all();
            // //console.log('list[$scope.trans.SelectedIndex]', list[$scope.trans.selectedAccount])
            if (typeof list[$scope.trans.selectedAccount] === "undefined") {
                $scope.trans.selectedAccount = 0;
            }

            $scope.accounts = Accounts.all();
            Go.post({
                task: "getDetailWatingRequest",
                requestid: $stateParams.idReq
            }).then(function (data) {
                $scope.InfoNotif = data.detailsnotif;
                $scope.loaded = true;
            })

        }

    }); 
    $scope.$on('$ionicView.afterEnter', function() {
        $ionicSlideBoxDelegate.update() 
    });
    

    $scope.AcceptPayment = function() {
        console.log("$scope.InfoNotif", $scope.InfoNotif)
        Alert.loader(true);
        var accountInfo = Accounts.getByIndex(trans.selectedAccount);
        var postData = {
            "task": "TransAccepterTransfer",
            "requestid": $scope.InfoNotif.id,
            "accountid": accountInfo.id
        };
        Go.SGeoPost(postData).then(function(data) { 
            if(data.success == 1){
                console.log($scope.InfoNotif);
                $rootScope.paymentRecieveFrom = $scope.InfoNotif;
                $scope.trans.requestid = data.requestid;
                Accounts.UpdateSolde(data.idto, data.soldeto);
                if (typeof data.idfrom !== "undefined" && typeof data.soldefrom !== "undefined") {
                    Accounts.all().forEach(function(account) {
                        if (account.id == data.idfrom) {
                            Accounts.UpdateSolde(account.id, data.soldefrom);
                        }
                    }, this);
                }
                //console.log('data accept payment', data)
                Notifs.removeNotifObject($scope.InfoNotif);
                $rootScope.$apply(function() {
                    DATA.Nbr_notif = DATA.Nbr_notif - 1;
                });
                Alert.payment_congratulation( $filter('translate')('notification_detail.the_money_was_added_successfully') );

                if( parseInt($scope.InfoNotif.notiffromshop) > 0 && parseInt($scope.InfoNotif.notiftoshop) > 0 ){
                    $state.go('tab.FeedBackAccept', {
                        'requestid': data.requestid
                    });
                }else {
                    $state.go('tab.notif');
                } 
            }
        });
    };
    $scope.Refuse = function() {
        Alert.ask( $filter('translate')('pay_receive.confirm_refuse_payment') ).then(function() {
            Alert.loader(true);
            var accountInfo = Accounts.getByIndex(trans.selectedAccount);
            var postData = {
                "task": "TransRefuserTransfer",
                "requestid": $scope.InfoNotif.id
            };
            Go.SGeoPost(postData).then(function(data) {
                if(data.success == 1){
                    $rootScope.Nbr_notif -= 1;
                    // //console.log('Thank refuse: ', data);
                    if (typeof data.idfrom !== "undefined" && typeof data.soldefrom !== "undefined") {
                        var AccountsList = Accounts.all(); 
                    }
                    $rootScope.$apply(function() {
                        DATA.Nbr_notif = DATA.Nbr_notif - 1;
                    });
                    Notifs.removeNotifObject($scope.InfoNotif);
                    Alert.payment_congratulation( $filter('translate')('pay_receive.payment_refused') );
                    $state.go('tab.notif');
                } 
            });
        });
    };


    //////////////// new notification (imad)
          $scope.DeleteNotification = function(key) {
            // //console.log("ID Notification : ",$scope.notifsList)

            if ($scope.notifsList[key].type == "sendpaymenttofriend") {
              var postData = {
                "task": "TransRefuserTransfer",
                "lat": "",
                "long": "",
                "requestid": $scope.notifsList[key].objectid,
                "notifid": $scope.notifsList[key].id
              };
              Geo.getPosition().then(function(data) {  
                    postData.lat = data.lat;
                    postData.long = data.lng;
              });

              Alert.ask( $filter('translate')('notification_list.delete_payment') ).then(function() {
                Alert.loader(true);
                Go.post(postData).then(function(data) {
                  if (data.success == 1) {
                    $scope.notifsList.splice(key, 1);
                  }
                }); 
              });
            } else {
              var postData = {
                "task": "DeleteNotif",
                "notifid": $scope.notifsList[key].id
              };
              Alert.loader(true);
              Go.post(postData).then(function(data) {
                if (data.success == 1) {
                  $scope.notifsList.splice(key, 1);
                }
              }); 
            }

          } 

    $scope.gotoDetailPushNotif = function ( notifid ) {
         
        setTimeout(function () {  
            if( $scope.notifsList.length > 0 )  {
                angular.forEach( $scope.notifsList, function (notif) { 
                    if( notif.id == notifid ){
                        $scope.OpenNotif(notif) 
                    }
                })
            }else{
                setTimeout(function () {
                    $scope.gotoDetailPushNotif(notifid);
                })
            }
        })
             
    }

})

.controller('ValidationDocumentCtrl', function($scope,$ionicActionSheet, $rootScope, $location, Camera, Go, Alert, User, $ionicLoading, $ionicScrollDelegate, $filter, $translate, $state, $ionicHistory) {
  
    $scope.$on('$ionicView.beforeEnter', function(e){   
        angular.element(document.querySelector('body')).removeClass('platform-android');

        // $scope.imgURI = $rootScope.validateData.logsPhoto.doc;
        if( $rootScope.validateData.logsPhoto.imgs ){
            $scope.arrayImgURI = $rootScope.validateData.logsPhoto.imgs;
        }else{
            $scope.arrayImgURI = [];
        }
        

        $scope.comment = $rootScope.validateData.logsPhoto.comment; 
        $scope.confirmed = $rootScope.validateData.logsPhoto.confirmed;   
        $scope.showSaveBtn = false;

        if( parseInt($scope.confirmed) == 1 ){
            $state.go('tab.home');
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
    
 


    $scope.Title = $filter('translate')('validate_document.title_page');
    $scope.picture = '';
    $scope.imgURI = '';
    $scope.Req_imgURI = '';
    $scope.Message = $rootScope.validateData.Message;
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

            $scope.arrayImgURI.push({
                photoname:"data:image/jpeg;base64," + imageData,
                photolibelle: "",
                client : "camera"
            });

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
                $scope.arrayImgURI.push({
                    photoname: imageData,
                    photolibelle: "",
                    client : "gallery"
                });

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

                $scope.arrayImgURI.push({
                    photoname: "data:image/jpeg;base64," + imageData,
                    photolibelle: "",
                    client : "gallery"
                });

                setTimeout(function () {
                    var width = 0;
                    $(".multiphotoContinner:visible .container-addPhoto .item-photo").each(function () {
                        //console.log("test")
                        width += parseInt( $( this ).width()+10 );
                    }) 
                    $ionicScrollDelegate.scrollTo(width, 0, true)
                },500)

                scope.Req_imgURI = imageData;  
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

                $scope.arrayImgURI.push(data);
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
    $scope.other = function() { 
        $scope.choseAction();
    }; 
    $scope.send = function() {
        // ////console.log("$scope.imgURI",$scope.imgURI)
        Alert.loader(true);
        var UserDetails = User.GetDetails();

        var postData = {
            task : "SettingsValidateDocument",
            log : $rootScope.validateData.userlog,
            imgs : JSON.stringify($scope.arrayImgURI), 
        }  
         

        Go.post(postData).then(function(data) { 

            console.log( data );

            $ionicLoading.hide();
            if (data.success == 1) {  
                Alert.success( $filter('translate')('validate_document.success_send') );
                $state.go('tab.home'); 
                setTimeout(function () {  

                    var UserDetails = User.GetDetails();
                     
                    UserDetails[$rootScope.validateData.N1][$rootScope.validateData.N2].imgs = data.imgs;
                    UserDetails[$rootScope.validateData.N1][$rootScope.validateData.N2].comment = "";
                    UserDetails[$rootScope.validateData.N1][$rootScope.validateData.N2].confirmed = $scope.confirmed = 0;
                      
                    
                    User.SetDetails(UserDetails); 

                    $scope.arrayImgURI = data.imgs;
                    $scope.comment = '';
                    $scope.Req_imgURI = ''; 

                    User.UpdateValidate(data.percentage); 
                },1000)
                
            }
        }, function(err) {
            $ionicLoading.hide();
            // //console.log(err);
        });
    };

    $scope.previewFile = function ( filname ) { 
        window.open(filname, '_system'); 
    }

    $scope.DeletePhoto = function( index ){
        $scope.arrayImgURI.splice(index, 1);
        setTimeout(function () {
            $ionicScrollDelegate.resize(); 
        }) 
    } 
     
    $scope.$on('$ionicView.enter', function(e) {
        $ionicScrollDelegate.scrollTop();
    });
})

 
 

.controller('FeedbackCtrl', function($scope,Camera, $ionicHistory, $ionicScrollDelegate, pickerView, $cordovaSocialSharing, PaymentFriend, DATA, Catgs, ResetePage, Badges, $state, $rootScope, Accounts, $timeout, $ionicLoading, $q, User, Icons, $stateParams, Alert, SharedService, Go, $location, $ionicActionSheet, $filter, $ionicModal) {
    
    ///////////////////////////////////////////////////////
    if( !$rootScope.FeedBackData ){
        $rootScope.shareWithFaceBook = false;
        $rootScope.shareWithTwitter = false; 

        $scope.trans = PaymentFriend;
        $scope.rating = {};
        $scope.rating.max = 5;
        $scope.requests = [];
        $scope.rating.rate = 0;
        $scope.ImgURI = [];
    } 

    $scope.$on('$ionicView.beforeEnter', function() { 

        $scope.data = {};   
        Catgs.Sync();
        $scope.categories = Catgs.getNestedCats(); 

        ////////// Randem color category //////////////////////////////
        angular.forEach( $scope.categories, function (cat, key) {
            $scope.categories[key].color = getRandomColor(); 
            console.log(cat)
            angular.forEach( cat.listscats, function (subcat, k) {

                $scope.categories[key].listscats[k].color = getRandomColor();
            } )
        } )
        ////////////////////////////////////////////////////////////

        if( $stateParams.scatid >= 0){

            angular.forEach($scope.categories, function (cat, i) {
                angular.forEach(cat.listscats, function (scat, j) {
                    if( $stateParams.scatid ==  scat.scatid ){ 
                        
                        $scope.data.subCategoryId = scat.scatid; 
                        $scope.data.subCategoryName = scat.scatlabel;
                        
                        console.log(scat)
                    }
                })
            })  
        }else{ 
            $scope.data.subCategoryId = -1;
            $scope.data.subCategoryName = false; 
        }
            


  
        $scope.haveImage = false;
        $scope.Comment = ""; 

        $scope.UserDetails = User.GetDetails();

        $scope.registredFacebook = ($scope.UserDetails.socialNetworks.facebook.registred == 1) ? true:false;  
        $scope.registredTwitter = ($scope.UserDetails.socialNetworks.twitter.registred == 1) ? true:false;   
       

       if( !$rootScope.BackStateFacebook && !$rootScope.BackStateTwitter){
             
            if (typeof $stateParams.scatid !== 'undefined') {
                $scope.data.idsubcategories = $stateParams.scatid; 
                $rootScope.$emit("initialListCategory", $scope.data.idsubcategories ); 
            }else{
               $scope.data.categoryId = -1; 
            }
            $rootScope.$emit('getSelectedCat')
        }
 

        if( $rootScope.BackStateFacebook ){ 
                $rootScope.shareWithFaceBook = true;
                $rootScope.BackStateFacebook = false;     
        }

        if( $rootScope.BackStateTwitter ){ 
                $rootScope.shareWithTwitter = true;
                $rootScope.BackStateTwitter = false; 
        }  

        if( $rootScope.FeedBackData ){

            $scope.data.subCategoryId = $rootScope.FeedBackData.catid; 
            $scope.data.subCategoryName = $rootScope.FeedBackData.catName; 
            $scope.ImgURI = $rootScope.FeedBackData.ImgURI;
            $scope.Comment = $rootScope.FeedBackData.Comment;

            $scope.rating = {
                max: 5,
                rate: $rootScope.FeedBackData.rate
            }; 
            $rootScope.FeedBackData = {}  

        } 

               
    }) 

    $scope.Share = function( type ){ 
        switch(type) {
            case 'facebook': 
                if( $scope.registredFacebook ){ 
                    $rootScope.shareWithFaceBook = !$rootScope.shareWithFaceBook;
                }else{
                    $rootScope.FeedBackData = {
                        catid: $scope.data.subCategoryId,
                        catName: $scope.data.subCategoryName,
                        ImgURI: $scope.ImgURI,
                        Comment: $scope.Comment,
                        rate: $scope.rating.rate,
                    }

                    $state.go('tab.facebookFeedBack');
                }
                break;
            case 'twitter': 
                if( $scope.registredTwitter ){ 
                    $rootScope.shareWithTwitter = !$rootScope.shareWithTwitter;
                }else{
                    $rootScope.FeedBackData = {
                        catid: $scope.data.subCategoryId,
                        catName: $scope.data.subCategoryName,
                        ImgURI: $scope.ImgURI,
                        Comment: $scope.Comment,
                        rate: $scope.rating.rate,
                    }
                    $state.go('tab.twitterFeedBack');
                }
                break; 
        } 
    }
    ////////////////////////////////////////////////////////
    

    var self = this; 
    function transformChip(chip) {
        // If it is an object, it's already a known chip
        if (angular.isObject(chip)) {
            return chip;
        }
        // Otherwise, create a new one
        return {
            name: chip
        };
    }
    /**
     * Search for vegetables.
     */
    function querySearch(query) {
        var results = query ? self.Categories.filter(createFilterFor(query)) : [];
        return results;
    }
    /**
     * Create filter function for a query string
     */
    function createFilterFor(query) {
        var lowercaseQuery = angular.lowercase(query);
        return function filterFn(vegetable) {
            return (vegetable._lowername.indexOf(lowercaseQuery) === 0);
        };
    }


    //========================= saida

    //============================================
    function loadCategories() {
        var list = Catgs.get();

        return list.map(function(veg) {
            veg._lowername = veg.name.toLowerCase();
            return veg;
        });
    }
 

    $scope.$watch('Comment', function(newVal, oldVal) {
        if(typeof newVal !== "undefined"){
            if(newVal.length > 120) {       
                $scope.Comment = oldVal;
            }
        }

    });



    $scope.takePhoto = function() {  
            Alert.loader(true);
            return $q(function(resolve, reject) {

                if(ionic.Platform.isIOS()){
                    var options = { 
                        destinationType: navigator.camera.DestinationType.DATA_URL,
                        targetHeight: 400,
                        targetWidth: 400,
                        encodingType: navigator.camera.EncodingType.PNG,
                        correctOrientation: false
                    };
                }else{
                    var options = { 
                        quality: 100,
                        sourceType: navigator.camera.PictureSourceType.CAMERA,
                        destinationType: navigator.camera.DestinationType.DATA_URL,
                        targetWidth: 400,
                        targetHeight: 400,
                        // allowEdit: true,
                        correctOrientation: true,
                        // encodingType: 1,
                        saveToPhotoAlbum: false
                    };

                }
                Camera.getPicture(options).then(function(imageData) {
                    $scope.ImgURI.push( "data:image/jpeg;base64," + imageData );
                    setTimeout(function () {
                        
                        $ionicScrollDelegate.resize();
                        Alert.loader(false);
                        if( $scope.ImgURI.length > 1 ){
                            setTimeout(function () {
                                var width = 0;
                                $("#payfriendstatus .container-addPhoto .item-photo").each(function () {
                                    //console.log("test")
                                    width += parseInt( $( this ).width()+10 );
                                }) 
                                $ionicScrollDelegate.scrollTo(width, 0, true)
                            },500)
                        }
                    })
                    resolve();
                }, function(err) {
                    reject();
                });

                setTimeout(function () {
                    window.localStorage.setItem('locked', 0)
                },1500)
            }); 
    }; 
    
    
    $scope.choosePhoto = function(options) {
        if(ionic.Platform.isIOS()){
            var options = {
                maximumImagesCount: 1, // Max number of selected images, I'm using only one for this example
                width: 400,
                height: 400,
                quality: 100,            // Higher is better 
            };
            Camera.getGallery(options).then(function(imageData) { 
                if( $scope.ImgURI.indexOf( imageData ) < 0 ){
                    $scope.ImgURI.push( imageData );
                    setTimeout(function () {
                        
                        $ionicScrollDelegate.resize();
                        Alert.loader(false);
                        if( $scope.ImgURI.length > 1 ){
                            setTimeout(function () {
                                var width = 0;
                                $("#payfriendstatus .container-addPhoto .item-photo").each(function () {
                                    //console.log("test")
                                    width += parseInt( $( this ).width()+10 );
                                }) 
                                $ionicScrollDelegate.scrollTo(width, 0, true)
                            },500)
                        }
                    })
                }else{
                    Alert.error("Image already selected");
                }
                
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
                targetWidth: 400,
                targetHeight: 400,
                // allowEdit: true,
                correctOrientation: true,
                // encodingType: 1,
                saveToPhotoAlbum: false
            };
            Camera.getPicture(options).then(function(imageData) {
                imageData =  "data:image/jpeg;base64," + imageData;
                if( $scope.ImgURI.indexOf( imageData ) < 0 ){
                    $scope.ImgURI.push( imageData  );
                    setTimeout(function () {
                        $ionicScrollDelegate.resize();
                        Alert.loader(false);
                        if( $scope.ImgURI.length > 1 ){
                            setTimeout(function () {
                                var width = 0;
                                $("#payfriendstatus .container-addPhoto .item-photo").each(function () {
                                    //console.log("test")
                                    width += parseInt( $( this ).width()+10 );
                                }) 
                                $ionicScrollDelegate.scrollTo(width, 0, true)
                            },500)
                        }
                    })
                }else{
                    Alert.error("Image already selected");
                }  

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

    $scope.choseAction = function () {  

          
        angular.element(document.querySelector('body')).removeClass('platform-android');
        $ionicActionSheet.show({
         buttons: [
           { text: $filter('translate')('feedback.take_picture') },
           { text: $filter('translate')('feedback.open_gallery') }
         ], 
         cancelText: $filter('translate')('feedback.cancel'),
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
                default:
                     $scope.takePhoto();
                    break; 
            } 
            return true;
         }
       })
    }

    $scope.DeletePhoto = function( index ){
        $scope.ImgURI.splice(index, 1);
        setTimeout(function () {
            $ionicScrollDelegate.resize(); 
        }) 
    } 
 
    $scope.SendFeedBack = function() { 

        if( $ionicHistory.currentStateName() == "tab.FeedBackAccept" ){

            $scope.AcceptFeedBack();    
            return false;

        }else{ 

            if (typeof $stateParams.requestid !== 'undefined') {
                Alert.loader(true);  

                $rootScope.$emit('getSelectedCat')
         
                Go.post({
                    "task": "PaymentSetFeedback",
                    "requestid": $stateParams.requestid ,
                    "catid": $scope.data.subCategoryId,
                    'type': 'from',
                    "rate": $scope.rating.rate,
                    "comment": $scope.Comment,
                    "images": $scope.ImgURI
                }).then(function(data) {
                    if (data.success == 1) {
                        Alert.payment_congratulation( $filter('translate')('feedback.feedback_success') );
                        $state.go('tab.home');
                        //////////////////////////////Share Facebook///////////////////////////////
                        if( $rootScope.shareWithFaceBook ){
                            $scope.facebook = $scope.UserDetails.socialNetworks.facebook;   
                            var postData = { 
                                task:"shareToFacebook",
                                access_token : $scope.facebook.data.access_token,
                                id : $scope.facebook.data.uid, 
                                type:data.type,
                                photo:data.photo, 
                                sender: data.sender,
                                recipient: data.recipient,
                                rate: $scope.rating.rate,
                                comment: $scope.Comment
                            } 
                            Go.post(postData).then(function(data) { 

                            })
                        } 
                        ///////////////////////////////////////////////////////////////////////////

                        //////////////////////////////Share Twitter////////////////////////////////
                        if( $rootScope.shareWithTwitter ){
                            $scope.twitter = $scope.UserDetails.socialNetworks.twitter;  
                            var postData = { 
                                task:"shareToTwitter",
                                access_token: $scope.twitter.data.access_token,
                                access_token_secret: $scope.twitter.data.token_secret,
                                type:data.type,
                                photo:data.photo, 
                                sender: data.sender,
                                recipient: data.recipient,
                                rate: $scope.rating.rate,
                                comment: $scope.Comment
                            } 
                            Go.post(postData).then(function(data) { 

                            })
                        }
                        
                        ///////////////////////////////////////////////////////////////////////////
                    } else {
                        Alert.error(data.message);
                    }
                });
            }
        }

    };
     
    $scope.AcceptFeedBack = function() { 
        Alert.loader(true); 
        if (typeof $stateParams.requestid !== 'undefined') {
            
            $rootScope.$emit('getSelectedCat')

            Go.post({
                "task": "PaymentSetFeedback",  
                "requestid": $stateParams.requestid ,
                "catid": $scope.data.subCategoryId,
                'type': 'to',
                "rate": $scope.rating.rate,
                "comment": $scope.Comment,
                "images": $scope.ImgURI

            }).then(function(data) {
                if (data.success == 1) {
                    Alert.payment_congratulation( $filter('translate')('feedback.feedback_success') );
                    $state.go('tab.notif');
                    //////////////////////////////Share Facebook///////////////////////////////
                    if( $rootScope.shareWithFaceBook){ 
                        $scope.facebook = $scope.UserDetails.socialNetworks.facebook; 
                        var postData = { 
                            task:"shareToFacebook",
                            access_token : $scope.facebook.data.access_token,
                            id : $scope.facebook.data.uid, 
                            photo:data.photo, 
                            sender: data.sender,
                            recipient: data.recipient,
                            rate: $scope.rating.rate,
                            comment: $scope.Comment
                        } 
                        if(data.type=="persoToPerso"){
                            postData.type ="fromPersoToPerso";
                        }
                        if(data.type=="persoToPro"){
                            postData.type ="fromPersoToPro";
                        }
                        if(data.type=="proToPro"){
                            postData.type ="fromProToPro";
                        }
                        if(data.type=="proToPerso"){
                            postData.type ="fromProToPerso";
                        }
                        Go.post(postData).then(function(data) { 

                        })
                    } 
                    //////////////////////////////Share Twitter////////////////////////////////
                    if( $rootScope.shareWithTwitter ){
                        $scope.twitter = $scope.UserDetails.socialNetworks.twitter;  
                        var postData = { 
                            task:"shareToTwitter",
                            access_token: $scope.twitter.data.access_token,
                            access_token_secret: $scope.twitter.data.token_secret,  
                            photo:data.photo, 
                            sender: data.sender,
                            recipient: data.recipient,
                            rate: $scope.rating.rate,
                            comment: $scope.Comment
                        } 
                        if(data.type=="persoToPerso"){
                            postData.type ="fromPersoToPerso";
                        }
                        if(data.type=="persoToPro"){
                            postData.type ="fromPersoToPro";
                        }
                        if(data.type=="proToPro"){
                            postData.type ="fromProToPro";
                        }
                        if(data.type=="proToPerso"){
                            postData.type ="fromProToPerso";
                        }
                        Go.post(postData).then(function(data) { 

                        })
                    }
                    ///////////////////////////////////////////////////////////////////////////
                } else {
                    Alert.error(data.message);
                }
            });
        };
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

.controller('PickerViewCtrl', function($scope, Lists, pickerView, $filter) {
    var objlist = [{
        values: [Lists.Indicatifs],
        defaultIndex: 7
    }];

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
})

.controller('ForgotPasswordCtrl', function($rootScope, $scope, Phone, $state, pickerView, Lists, User, AuthService, Go, SharedService, crypt, $location, Alert, $filter) {
    $scope.data = {};

    $scope.enterphone = function() {
        Alert.loader(true);
        var validationList = [{
            type: 'email',
            value: $scope.data.email
        }];
        if (SharedService.Validation(validationList)) {
            // sauvgarder le num tel et envoyer le code            
            var postData = {
                "task": "ForgotPasswordSendSMS",
                "email": $scope.data.email, 
            };
            Go.post(postData).then(function(datas) {
                if (datas.success == 1) {
                    //AuthService.storeUserCredentials(datas.userToken);
                    User.SetDetails(datas.UserDetails);
                    $scope.data = datas.UserDetails.user;
                    $state.go('forgotpassword-step2');
                }
            });
        }
    };

    if ($location.path() == '/forgot-password-step2') {
        var Details = User.GetDetails();
        console.log(Details.user)
        $scope.data.question1 = Details.user.question1;
        $scope.data.question2 = Details.user.question2;
        $scope.data.question3 = Details.user.question3;
    }

    $scope.codequestions = function() {
        Alert.loader(true);
        var validationList = [{
            type: 'codesms',
            value: $scope.data.codeSMS
        }, {
            type: 'answer1',
            value: $scope.data.answer1
        }, {
            type: 'answer2',
            value: $scope.data.answer2
        }, {
            type: 'answer3',
            value: $scope.data.answer3
        }];
        if (SharedService.Validation(validationList)) {
            var postData = {
                "task": "ForgotPasswordCheckAnswers",
                "codesms": $scope.data.codeSMS,
                "answer1": $scope.data.answer1,
                "answer2": $scope.data.answer2,
                "answer3": $scope.data.answer3
            };
            Go.post(postData).then(function(data) {
                if (data.success == 1) {
                    $state.go('forgotpassword-step3');
                }
            });
        }
    };

    $scope.$on('$ionicView.beforeEnter', function(e) { 
        $scope.data.password = '';
        $scope.data.confirmpassword = '';
        $scope.data.codeSMS = '';
        $scope.data.answer1 = '';
        $scope.data.answer2 = '';
        $scope.data.answer3 = ''; 
        $scope.data.Indicatif = '+33';
    });

    $scope.enternewpassword = function() {
        Alert.loader(true);
        var validationList = [{
            type: 'password',
            value: $scope.data.password
        }, {
            type: 'confirmePassword',
            value: $scope.data.confirmpassword
        }];
        if (SharedService.Validation(validationList)) {
            var postData = {
                "task": "ForgotPasswordNewpassword",
                "password": crypt.sha256($scope.data.password),
                "confirmpassword": crypt.sha256($scope.data.confirmpassword)
            };
            Go.post(postData).then(function(data) {
                if (data.success == 1) {
                    
                    Alert.Congratulation('signin', $filter('translate')('success_sign_up.go_to_sign_in'), $filter('translate')('forgot_password_step_2.reset_success'));
                }
            }).finally(function(){
                $scope.loader = Alert.loader(false);
            });
        }else{
            $scope.loader = Alert.loader(false);
        }
    };
    $scope.$watch('data.mobileNumber', function() {
        $scope.data.mobileNumber = Phone.watch($scope.data.mobileNumber);
    });
})
 
.controller('ListCtrl', function($scope,Go, Catgs , $rootScope, $timeout, $translate, $filter,$state) {
    $scope.data = {}
    var current_value = 'CATEGORY'; 
    var list = Catgs.get();
    $rootScope.Cats = list; 

    $scope.data.idsubcategories = -1;
    var mobiscrollselectId = $(".mobiscrollselectSettingsPros").attr( "id" );
     
    $scope.$on('$ionicView.leave', function(e) {
        var current_value = 'CATEGORY';
        $scope.data.idsubcategories = -1;
    });
 

    $scope.ChangeCurrentValue = function(){  
        var mobiscrollselectId = $(".mobiscrollselectSettingsPros").attr( "id" );
        console.log(mobiscrollselectId)
        if($scope.data.idsubcategories == -1){
            current_value = 'CATEGORY';
            $( ".mobiscrollselect" ).each(function() {
                var mobiscrollselectId = $( this ).attr( "id" );
                $("#"+mobiscrollselectId+"_dummy").val( current_value);
            });
        }else{ 
            var exist_catg = false;
            list.forEach(function(element){
                var value = element.group + " - " + element.text;
                if(element.value == $scope.data.idsubcategories ){
                    current_value =  value ;
                    console.log(current_value)
                    $("#"+mobiscrollselectId+"_dummy").val(current_value).prev();

                    exist_catg = true; 
                    // $( ".mobiscrollselect" ).each(function() {
                    //     var mobiscrollselectId = $( this ).attr( "id" );
                    //     $("#"+mobiscrollselectId+"_dummy").val( current_value);
                    // });
                }
            });
            if(exist_catg == false){
                current_value = 'CATEGORY';
                $scope.data.idsubcategories = -1
                $( ".mobiscrollselect" ).each(function() {
                    var mobiscrollselectId = $( this ).attr( "id" );
                    $("#"+mobiscrollselectId+"_dummy").val( current_value);
                });
            }
        }
    }


    console.log(list)
    $scope.ListCategories = {
            theme: (ionic.Platform.isIOS()) ? 'ios' : 'pim-theme',
            lang: $translate.use(),
            display: 'bottom',
            group: true,
            maxWidth: [40, 260],
            width: [235, 235],
            buttons: [ 
                { 
                    text: $filter('translate')('global_fields.close'),
                    handler: 'cancel', 
                }, 
                { 
                    text: $filter('translate')('global_fields.ok'),
                    handler: 'set',  
                }
            ],
            data: list, 
            onBeforeShow: function (event, inst) {
                $scope.ChangeCurrentValue();
                $timeout(function(){
                    $scope.ChangeCurrentValue();
                },200);
            },
            onShow: function (event, inst) {
                $scope.ChangeCurrentValue();
                $timeout(function(){
                    $scope.ChangeCurrentValue();
                },200);
            },
            onClose: function (event, inst) {
                $scope.ChangeCurrentValue();
                $timeout(function(){
                    $scope.ChangeCurrentValue();
                },200); 
            },
            onInit: function (event, inst) {
                $scope.ChangeCurrentValue();
                $timeout(function(){
                    $scope.ChangeCurrentValue();
                },200); 
            },
            ///////////////// transition (imad)  ///////////
            onSet: function (event, inst) {   

                $rootScope.$emit('getSelectedCat')
                $scope.ChangeCurrentValue();
                $timeout(function(){
                    $scope.ChangeCurrentValue();
                    if(Go.is('shop')){ 
                        $rootScope.$emit("shopAppendCategory", $("#selectCategories_dummy").val().split(" - ")[1], $scope.data.idsubcategories); 
                    }

                    if($state.current.name == "tab.infoDetail"){

                        setTimeout(function () {
                            $scope.$apply(function () { 
                                $rootScope.$emit("PaymentUpdateCat", $scope.data.idsubcategories );
                            })
                        },50)
                    }

                },200);   
                
            }
            
    };



    $rootScope.$on("initialListCategory", function(event, subCatId) {
        //console.log('emit',subCatId)
        $scope.data.idsubcategories = subCatId;
        $scope.ChangeCurrentValue();
        $timeout(function(){
            $scope.ChangeCurrentValue();
        },100);
        $timeout(function(){
            $scope.ChangeCurrentValue();
        },200);
    });

    $rootScope.$on("getSelectedCat", function() {
        $scope.data.subCategoryId = $scope.data.idsubcategories;
    });
 
})
.controller('emailNotValidatedCtrl', function($scope, Go, Alert, $filter) {
    $scope.SendEmail = function () {
        var postData = {
            task: "SendEmailValidation"
        } 
        Alert.loader(true);
        Go.post(postData).then(function(data) { 
            Alert.loader(false);
            if(data.success == 1){
                Alert.success( $filter('translate')('email_not_validated.success_sent') )
            }
        });
    }
})
.controller('facebookCtrl', function($scope, $state, User, $rootScope, $cordovaOauth, Protocole, Go, Alert, $ionicHistory, $filter) {
    


    $scope.$on('$ionicView.beforeEnter', function() {
        /////////////////////////////////////////////////////// 
        $scope.UserDetails = User.GetDetails();
        $scope.facebook = $scope.UserDetails.socialNetworks.facebook; 
        $scope.hasFacebookData = ($scope.facebook.registred == 1)?true:false;
        //////////////////////////////////////////////////////
        if( $scope.hasFacebookData ){
            var postData = {
                params:{
                    access_token:$scope.facebook.data.access_token,
                    fields:"id,name",
                    format: "json" 
                }
            };

            Alert.loader(true)  

            Protocole.get_with_url("https://graph.facebook.com/v2.2/me", postData).then(function(data) { 
                //console.log("graph.facebook", data)
                $scope.facebookData = data;  
                Alert.loader(false)
            });
        } 
         
    });
    ////////////////////////////////////////////////////////////
    $scope.FBLogin = function () { 
        $cordovaOauth.facebook("247156789062662", ["publish_actions"]).then(function(result) { 
            $scope.access_token = result.access_token; 
            $scope.UserDetails.socialNetworks.facebook.data.access_token = result.access_token;
            var postData = {
                params:{
                    access_token:$scope.access_token,
                    fields:"id,name",
                    format: "json" 
                }
            };
            Alert.loader(true)  
            Protocole.get_with_url("https://graph.facebook.com/v2.2/me", postData).then(function( data ) { 

                $scope.facebookData = data;
                ////////////////////////////////// 
                $scope.UserDetails.socialNetworks.facebook.data.uid = data.id;
                $scope.UserDetails.socialNetworks.facebook.data.access_token = $scope.access_token; 

                var postData = {
                    task: "SetSocialnetwork",
                    type: "fb",
                    userid: data.id,
                    token: $scope.access_token
                }
                Alert.loader(true)
                Go.post(postData).then(function (data) {
                    if(data.success == 1){
                        $scope.UserDetails.socialNetworks.facebook.registred = 1;
                        User.SetDetails( $scope.UserDetails ); 
 

                        if($ionicHistory.viewHistory().backView.stateName == 'tab.FeedBack'){
                            
                            $rootScope.BackStateFacebook = true;
                            $state.go('tab.FeedBack', {
                                'requestid': $ionicHistory.backView().stateParams.requestid,
                                'scatid': $ionicHistory.backView().stateParams.scatid
                            });
                        }else{
                            Alert.success( $filter('translate')('facebook.success_added'))
                        }
                    } 
                })
                //////////////////////////////////  
                Alert.loader(false) 
            });
        }, function(error) {
            console.log(error);
        });
    }  
  
    $scope.FBShare = function () { 
        var postData = { 
            task:"shareToFacebook",
            access_token : $scope.access_token,
            id : $scope.facebookData.id
        }
        Alert.loader(true)
        Go.post(postData).then(function(data) { 
            console.log(data) 
             Alert.loader(false)
        })
    }


    $scope.FBlogOut = function () {  
        // var postData = {
        //     params:{
        //         method: "delete",
        //         access_token: $scope.UserDetails.socialNetworks.facebook.data.access_token,
        //         format: "json" 
        //     }
        // };
        // Alert.loader(true)
        // var URI_Delete = "https://graph.facebook.com/"+$scope.facebookData.id+"/permissions";
        // $http.get(URI_Delete, postData).then(function(result) {  
        //     if(result.data.success){
                var postData = {
                    task: "DeleteSocialnetwork",
                    type: "fb"
                }
                Go.post(postData).then(function (data) {
                    Alert.loader(false)
                    if(data.success == 1){
                        $scope.UserDetails.socialNetworks.facebook.registred = 0;
                        $scope.UserDetails.socialNetworks.facebook.data = {}
                        User.SetDetails( $scope.UserDetails );  
                    } 
                })
                
        //     }  
        // });
    } 
    
})
.controller('twitterCtrl', function($scope, Go, $state, User, Catgs, $rootScope, $http, $cordovaOauth, $timeout, Alert, $ionicHistory, $filter) {

    
    ///////////////////////
    $scope.$on('$ionicView.beforeEnter', function() { 

        $scope.UserDetails = User.GetDetails();
        $scope.twitter = $scope.UserDetails.socialNetworks.twitter; 
        $scope.hasTwitterData = ($scope.twitter.registred == 1)?true:false;

        if( $scope.hasTwitterData ){
            var postData = {
                task: "twitterGetInfoUser",
                access_token: $scope.twitter.data.access_token,
                access_token_secret: $scope.twitter.data.token_secret,
                screen_name: $scope.twitter.data.uid.split('|')[1] 
            };
            Alert.loader(true)
            Go.post(postData).then(function(result) { 
                console.log(result)
                $scope.twitterData = result.data;
                Alert.loader(false)
            });
        } 
        
        
    });
    ///////////////////////
    $scope.twitterLogin = function () { 

        $cordovaOauth.twitter("4jTW4ADm1aWPthQP1woR1C737", "ArKzodBWUhsxzrHYbSTkG3vN0pSTvoasYniuGFqdJfaQrMdlTl").then(function(result) { 
             
            $scope.UserDetails.socialNetworks.twitter.data.access_token = result.oauth_token;
            $scope.UserDetails.socialNetworks.twitter.data.token_secret =  result.oauth_token_secret;
            $scope.UserDetails.socialNetworks.twitter.data.uid =  result.user_id+"|"+result.screen_name;
            
            var postData = {
                task: "SetSocialnetwork",
                type: "twitter",
                token: result.oauth_token,
                stoken: result.oauth_token_secret,
                userid: result.user_id+"|"+result.screen_name
            }
            Alert.loader(true)
            Go.post(postData).then(function (data) {
                var postData = {
                    task: "twitterGetInfoUser",
                    access_token: result.oauth_token,
                    access_token_secret: result.oauth_token_secret,
                    screen_name: result.screen_name 
                }; 
                Alert.loader(true)
                Go.post(postData).then(function(result) { 
                    if(result.success == 1){
                        $scope.twitterData = result.data;
                        $scope.UserDetails.socialNetworks.twitter.registred = 1;
                        User.SetDetails( $scope.UserDetails );  

                        if($ionicHistory.viewHistory().backView.stateName == 'tab.FeedBack'){
                            
                            $rootScope.BackStateTwitter = true;
                            $state.go('tab.FeedBack', {
                                'requestid': $ionicHistory.backView().stateParams.requestid,
                                'scatid': $ionicHistory.backView().stateParams.scatid
                            }); 
                        }else{
                            Alert.success( $filter('translate')('twitter.success_added') ) 
                        }
                    }
                    Alert.loader(false)

                });
                
            })
        }, function(error) {
            console.log(error)
        }); 
    }

    $scope.TwitterShare = function () {
        $scope.UserDetails = User.GetDetails();
        $scope.twitter = $scope.UserDetails.socialNetworks.twitter; 

        var postData = { 
            task:"shareToTwitter",
            access_token: $scope.twitter.data.access_token,
            access_token_secret: $scope.twitter.data.token_secret
        }
        Alert.loader(true)
        Go.post(postData).then(function(data) { 
            //console.log(data) 
            Alert.loader(false)
        })
    }
    $scope.TwitterLogOut = function () {
        var postData = {
            task: "DeleteSocialnetwork",
            type: "twitter"
        }
        Alert.loader(true)
        Go.post(postData).then(function (data) {
            Alert.loader(false)
            if(data.success == 1){
                $scope.UserDetails = User.GetDetails();
                $scope.UserDetails.socialNetworks.twitter.registred = 0;
                $scope.UserDetails.socialNetworks.twitter.data = {}
                User.SetDetails( $scope.UserDetails );  
            } 
        })
    }  
     
})
.controller('bankStatementCtrl', function($scope, $rootScope, Go, $state, PaymentFriend, Alert, Accounts, Icons, $ionicSlideBoxDelegate, $sce, User, API, $cordovaFileOpener2, $cordovaFile, $ionicLoading, $ionicActionSheet, $filter, $translate, BASE64_LOGOS ) {
    $rootScope.GlobalTrans = [];
    $scope.commissions = [];
    $scope.devis = API.devise;

    $scope.ibanMask = function (iban) {
        return (iban != '') ? iban.match(/.{1,4}/g).join(" ") : '';
    }

    $scope.BASE64_LOGOS = BASE64_LOGOS;

    $scope.currentLang = $translate.use();

    $scope.getTransPerAccount = function () {
        $scope.commissions = 0;
        Alert.loader( true )
        Go.post({
            "task": "getTransfersAccount", 
            "accountid": $scope.CurrentAcountId,
            "page": -1,
            "forbacstatment": 1,
            "hideLoader":true
        }).then(function(data) {
            if(data.success == 1){
                Alert.loader( false )
                $rootScope.GlobalTrans = data.requests;
                $scope.commissions = data.commissions; 
                $scope.groupTranByMonth() 

            } 
        })
    }
    $scope.getAllAccounts = function () {
        Alert.loader( true )
        Go.post({
            "task": "getUserAccounts",
            "deleted": "all"
        }).then(function(data) {
            if(data.success == 1){ 

                setTimeout(function () {
                    $ionicSlideBoxDelegate.update();
                    Alert.loader( false ) 

                    $scope.$apply(function () {
                        $scope.accounts = data.accounts; 
                        $scope.trans.selectedAccount = 0; 
                        $scope.CurrentAcountId = $scope.accounts[0].id; 
                        $scope.getTransPerAccount();
                    })
                })
            } 
        });
    }

    Accounts.getIban().then(function (data) {
        $scope.principalAccount = data;
    })

    console.log("$scope.principalAccount", $scope.principalAccount)

    $scope.accountChange = function(){ 
        $scope.CurrentAcountId = $scope.accounts[$scope.trans.selectedAccount].id; 
        $scope.getTransPerAccount(); 
    }
    $scope.groupTranByMonth = function () {
  
        $scope.list = [];
        var date = $rootScope.GlobalTrans[0].date.split('/');
        var firstMonth; 

        angular.forEach($rootScope.GlobalTrans, function (trans, key) {

            var thisDate = trans.date.split('/'); 

            var timestampDate = new Date(thisDate[0]+'/01/'+thisDate[2]).getTime();
            var timestampCurrentDate = new Date(new Date().getMonth()+'/01/'+new Date().getFullYear()).getTime();

            // console.log(parseInt(timestampDate), timestampCurrentDate)

            if( timestampCurrentDate >= timestampDate ){  

                var thisMonth = thisDate[0]+"/"+thisDate[2];  
                if( firstMonth != thisMonth ){
                    $scope.list.push({
                        title: thisMonth,
                        month: thisDate[0],
                        year: thisDate[2]
                    });
                    firstMonth = thisMonth;
                }


            }
           
        })
 
    }
    ///////////////////////////////////////////////////////////
    $scope.icons = Icons.Images_blanc;
    $scope.iconsBlue = Icons.Images_blue;
    $scope.trans = PaymentFriend; 
    $scope.$on('$ionicView.beforeEnter', function() { 

        $scope.getAllAccounts();

    });
    ///////////////////////////////////////////////////////////  
    $scope.ShooseAction = function ( month, year ) {
         
        angular.element(document.querySelector('body')).removeClass('platform-android');
        $ionicActionSheet.show({
             buttons: [
               { text: $filter('translate')('bank_statement.view_pdf')} ,
               { text: $filter('translate')('bank_statement.export_pdf')} 
             ], 
             cancelText: $filter('translate')('bank_statement.cancel'),
             cancel: function() {
              
        },
         buttonClicked: function(index) {
            switch(index) {
                case 0:
                    $scope.viewPDF( month, year )
                    break; 
                case 1:
                    $scope.GeneratePDF( month, year )
                    break;
            } 
            return true;
         }
       })
    }
    $scope.viewPDF = function ( month, year ) {
        var DaysOfMounths = [31,28,31,30,31,30,31,31,30,31,30,31];
        $scope.EndDay = DaysOfMounths[ (parseInt(month) - 1) ];
        $scope.thisMonth = month;
        $scope.thisYear = year; 

        $scope.UserDetails = User.GetDetails(); 
        if( $scope.UserDetails.isPro == 0 ){ 

            $scope.user = $scope.UserDetails.user.fname+" "+$scope.UserDetails.user.lname;
            $scope.adress = $scope.UserDetails.user.line1;
            $scope.zipCode = $scope.UserDetails.user.zip;
            $scope.city = $scope.UserDetails.user.city;
            $scope.country = $scope.UserDetails.user.country;
        }else{
            $scope.user = $scope.UserDetails.user.brand;
            $scope.adress = $scope.UserDetails.user.shopline1;
            $scope.zipCode = $scope.UserDetails.user.shopzip;
            $scope.city = $scope.UserDetails.user.shopcity;
            $scope.country = $scope.UserDetails.user.shopcountry;
        } 

        $scope.Debit = 0;
        $scope.Credit = 0;
        $scope.SoldeEndPeriod = 0;
        $scope.SoldeDepartPeriod = 0;
        $scope.Transactions = [];
        angular.forEach($rootScope.GlobalTrans, function (trans, key) {
            var thisMonth = trans.date.split("/")[0];
            var thisDay = trans.date.split("/")[1];
            var thisYear = trans.date.split("/")[2]; 
            if(thisMonth == month && thisYear == year ){
                if( trans.transtype == "send" ){
                    $scope.Transactions.push({
                            "date": trans.date.split("/")[1]+"."+trans.date.split("/")[0]+"."+trans.date.split("/")[2], 
                            "ref": trans.ref,
                            "user": (trans.fname+" "+trans.lname).substr(0, 30),
                            "raison": trans.description.substr(0, 30) ,
                            "debit": trans.amount, 
                            "credit": ""
                    })
                    $scope.Debit = $scope.Debit + parseFloat(trans.amount);
                }
                if( trans.transtype == "recept" ){
                    $scope.Transactions.push({
                            "date": trans.date.split("/")[1]+"."+trans.date.split("/")[0]+"."+trans.date.split("/")[2], 
                            "ref": trans.ref,
                            "user": (trans.fname+" "+trans.lname).substr(0, 30),
                            "raison": trans.description.substr(0, 30) ,
                            "debit": "", 
                            "credit": trans.amount
                    })
                    $scope.Credit = $scope.Credit + parseFloat(trans.amount);
                }
            }

            //////////// get solde de depart
            if(parseInt(thisMonth) < parseInt(month)){
                if (trans.transtype == "send") {
                    $scope.SoldeDepartPeriod = $scope.SoldeDepartPeriod - parseFloat(trans.amount);
                }else{
                    $scope.SoldeDepartPeriod = $scope.SoldeDepartPeriod + parseFloat(trans.amount);
                }

            }else if( parseInt(thisYear) < parseInt(year) ){
                if (trans.transtype == "send") {
                    $scope.SoldeDepartPeriod = $scope.SoldeDepartPeriod - parseFloat(trans.amount);
                }else{
                    $scope.SoldeDepartPeriod = $scope.SoldeDepartPeriod + parseFloat(trans.amount);
                }
            }

            //////////// get solde de fin periode
            if(parseInt(thisMonth) <= parseInt(month)){
                if (trans.transtype == "send") {
                    $scope.SoldeEndPeriod = $scope.SoldeEndPeriod - parseFloat(trans.amount);
                }else{
                    $scope.SoldeEndPeriod = $scope.SoldeEndPeriod + parseFloat(trans.amount);
                }

            }else if( parseInt(thisYear) < parseInt(year) ){
                if (trans.transtype == "send") {
                    $scope.SoldeEndPeriod = $scope.SoldeEndPeriod - parseFloat(trans.amount);
                }else{
                    $scope.SoldeEndPeriod = $scope.SoldeEndPeriod + parseFloat(trans.amount);
                }
            }
        }) 
        $scope.Debit = $scope.Debit.toFixed(2);
        $scope.Credit = $scope.Credit.toFixed(2);
        $scope.SoldeEndPeriod = $scope.SoldeEndPeriod.toFixed(2);
        $scope.SoldeDepartPeriod = $scope.SoldeDepartPeriod.toFixed(2);
        
        setTimeout(function () {   
            var data = $("#pdfpagestatement").html();

            if( ionic.Platform.isIOS() ){   

                    $cordovaFile.writeFile( cordova.file.documentsDirectory,'bank-statement-'+month+"-"+year+'.html' , data, true)
                    .then(function (success) { 
                         
                        window.open( success.target.localURL, "_blank", 'EnableViewPortScale=yes,location=no')
                    }, function (error) {
                        alert('Fails');
                    });  
                }else{

                    $cordovaFile.writeFile( cordova.file.externalApplicationStorageDirectory,'bank-statement-'+month+"-"+year+'.html' , data, true)
                    .then(function (success) { 
                        window.open( cordova.file.externalApplicationStorageDirectory+'bank-statement-'+month+"-"+year+'.html', "_blank", 'EnableViewPortScale=yes,location=no')
                    }, function (error) {
                        alert('Fails');
                    });
                }
        },500)
    }
    
    $scope.GeneratePDF = function ( month, year ) {  

        var Transactions = [
            [   
                {text: $filter('translate')('bank_statement_pdf.date'), style: 'tableHeader'}, 
                {text: $filter('translate')('bank_statement_pdf.ref'), style: 'tableHeader'}, 
                {text: $filter('translate')('bank_statement_pdf.fromto'), style: 'tableHeader'}, 
                {text: $filter('translate')('bank_statement_pdf.reason'), style: 'tableHeader'}, 
                {text: $filter('translate')('bank_statement_pdf.debit')+' ('+API.devise+')', style: 'tableHeader', alignment: 'right'},
                {text: $filter('translate')('bank_statement_pdf.credit')+' ('+API.devise+')', style: 'tableHeader', alignment: 'right'}
            ]
        ]; 
        $scope.Debit = 0;
        $scope.Credit = 0;
        $scope.SoldeDepartPeriod = 0;
        $scope.SoldeEndPeriod = 0;

        angular.forEach($rootScope.GlobalTrans, function (trans, key) {
            var thisMonth = trans.date.split("/")[0];
            var thisDay = trans.date.split("/")[1];
            var thisYear = trans.date.split("/")[2]; 
            if(thisMonth == month && thisYear == year ){
                if( trans.transtype == "send" ){
                    Transactions.push([
                        {text: trans.date.split("/")[0]+"."+trans.date.split("/")[1], style: 'tableBody'}, 
                        {text: trans.ref}, 
                        {text: (trans.fname+" "+trans.lname).substr(0, 30), style: 'tableBody'}, 
                        {text: trans.description.substr(0, 30), style: 'tableBody'}, 
                        {text: trans.amount, style: 'tableBody', alignment: 'right'}, 
                        {text: "", style: 'tableBody'}
                    ])
                    $scope.Debit = $scope.Debit + parseFloat(trans.amount);
                }
                if( trans.transtype == "recept" ){
                    Transactions.push([
                        {text: trans.date.split("/")[0]+"."+trans.date.split("/")[1], style: 'tableBody'}, 
                        {text: trans.ref}, 
                        {text: (trans.fname+" "+trans.lname).substr(0, 30) , style: 'tableBody'}, 
                        {text: trans.description.substr(0, 30), style: 'tableBody'}, 
                        {text: "", style: 'tableBody'}, 
                        {text: trans.amount, style: 'tableBody', alignment: 'right'}
                    ])
                    $scope.Credit = $scope.Credit + parseFloat(trans.amount);
                }
            }

            //////////// get solde de depart
            if(parseInt(thisMonth) < parseInt(month)){
                if (trans.transtype == "send") {
                    $scope.SoldeDepartPeriod = $scope.SoldeDepartPeriod - parseFloat(trans.amount);
                }else{
                    $scope.SoldeDepartPeriod = $scope.SoldeDepartPeriod + parseFloat(trans.amount);
                }

            }else if( parseInt(thisYear) < parseInt(year) ){
                if (trans.transtype == "send") {
                    $scope.SoldeDepartPeriod = $scope.SoldeDepartPeriod - parseFloat(trans.amount);
                }else{
                    $scope.SoldeDepartPeriod = $scope.SoldeDepartPeriod + parseFloat(trans.amount);
                }
            }

            //////////// get solde de fin periode
            if(parseInt(thisMonth) <= parseInt(month)){
                if (trans.transtype == "send") {
                    $scope.SoldeEndPeriod = $scope.SoldeEndPeriod - parseFloat(trans.amount);
                }else{
                    $scope.SoldeEndPeriod = $scope.SoldeEndPeriod + parseFloat(trans.amount);
                }

            }else if( parseInt(thisYear) < parseInt(year) ){
                if (trans.transtype == "send") {
                    $scope.SoldeEndPeriod = $scope.SoldeEndPeriod - parseFloat(trans.amount);
                }else{
                    $scope.SoldeEndPeriod = $scope.SoldeEndPeriod + parseFloat(trans.amount);
                }
            }
        }) 
        
        $ionicLoading.show({
          template: $filter('translate')('bank_statement.please_wait')+'<br> <ion-spinner icon="ios-small"></ion-spinner>'
        })  
        setTimeout(function () {
            Transactions.push([
                {text: "", style: 'tableBody'}, 
                {text: "", style: 'tableBody'}, 
                {text: $filter('translate')('bank_statement_pdf.total'), style: 'tableHeader', alignment: 'right'}, 
                {text: $scope.Debit.toFixed(2), style: 'tableHeader', alignment: 'right'}, 
                {text: $scope.Credit.toFixed(2), style: 'tableHeader', alignment: 'right'}
            ]) 
            Transactions.push([
                {text: ""}, 
                {text: ""}, 
                {text: $filter('translate')('bank_statement_pdf.total_end_of_period'), style: 'tableHeader', alignment: 'right'}, 
                {text: $scope.SoldeEndPeriod.toFixed(2), style: 'tableHeader', alignment: 'right'}, 
                {text: ""}
            ])
            $scope.GoPdf( Transactions, month, year )
        },500)
    } 
    function base64toBlob(base64Data, contentType) {
          contentType = contentType || '';
          var sliceSize = 1024;
          var byteCharacters = atob(base64Data);
          var bytesLength = byteCharacters.length;
          var slicesCount = Math.ceil(bytesLength / sliceSize);
          var byteArrays = new Array(slicesCount);

        for (var sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
            var begin = sliceIndex * sliceSize;
            var end = Math.min(begin + sliceSize, bytesLength);

            var bytes = new Array(end - begin);
            for (var offset = begin, i = 0 ; offset < end; ++i, ++offset) {
                bytes[i] = byteCharacters[offset].charCodeAt(0);
            }
            byteArrays[sliceIndex] = new Uint8Array(bytes);
        }
        return new Blob(byteArrays, { type: contentType });
    }
    $scope.GoPdf = function ( Transactions, Month, Year ) { 
            var DaysOfMounths = [31,28,31,30,31,30,31,31,30,31,30,31];
            $scope.UserDetails = User.GetDetails(); 
            if( $scope.UserDetails.isPro == 0 ){
                var user = $scope.UserDetails.user.fname+" "+$scope.UserDetails.user.lname;
                var adress = $scope.UserDetails.user.line1;
                var zipCode = $scope.UserDetails.user.zip;
                var city = $scope.UserDetails.user.city;
                var country = $scope.UserDetails.user.country;
            }else{
                
                var user = $scope.UserDetails.user.brand;
                var adress = $scope.UserDetails.user.shopline1;
                var zipCode = $scope.UserDetails.user.shopzip;
                var city = $scope.UserDetails.user.shopcity;
                var country = $scope.UserDetails.user.shopcountry;
            } 
            
            if( $scope.currentLang == 'en' ){
                 var dateStartPeriod  = Month +".01."+Year;
                 var dateEndPeriod    = Month +"."+ DaysOfMounths[ parseInt(Month) - 1 ] +"."+Year;
            }
            if( $scope.currentLang == 'fr' ){
                 var dateStartPeriod  = "01."+Month+"."+Year;
                 var dateEndPeriod    = DaysOfMounths[ parseInt(Month) - 1 ] +"."+Month +"."+Year;
            }
            

            var docDefinition = { 
                pageSize: 'A4', 
                pageMargins: [ 20, 20, 20, 20 ],
                footer: {
                    text: $filter('translate')('bank_statement_pdf.footer_page'), 
                    style: ['quote', 'small'],
                    alignment: 'center'
                },
                content:[
                    { 
                        columns:[
                            {
                                image: BASE64_LOGOS.pim,
                                width: 100
                            },
                            {
                                text: "",
                                width: 330
                            },
                            {
                                text: $filter('translate')('bank_statement_pdf.info_pim'), 
                                style: 'bold',
                                fontSize: 9
                            }
                        ]
                    },
                    { 
                        text: $filter('translate')('bank_statement_pdf.your_bank_statement'), 
                        style: 'bold',
                        margin: [0,40,0,0]
                    },
                    { 
                        columns: [
                            {
                                text: $filter('translate')('bank_statement_pdf.account_n')+"\n"+$filter('translate')('bank_statement_pdf.period'),
                                width: 100,
                                fontSize: 10
                            },
                            {
                                text: $scope.accounts[$scope.trans.selectedAccount].number+" \n"+
                                            $filter('translate')('bank_statement_pdf.from_to',{
                                                dateStart: dateStartPeriod,
                                                dateEnd: dateEndPeriod
                                            }),
                                width: 330,
                                fontSize: 10
                            }, 
                            {
                                text: user+"\n"+adress+"\n"+zipCode+" "+city+" - "+country,
                                fontSize: 9
                            }
                        ]
                    },
                    {
                        text: $filter('translate')('bank_statement_pdf.descriptive_text'),
                        margin: [0,20,0,20],
                        fontSize: 9
                    },
                    {
                        text: $filter('translate')('bank_statement_pdf.beginning_balance')+" "+$scope.SoldeDepartPeriod.toFixed(2)+" "+$scope.devis,
                        fontSize: 12,
                        style: 'bold',
                        margin: [0,0,0,20]
                    },
                    /////////////////////////////////////////////////////////////////////////////////////////////////
                    {
                        style: 'tableExample',
                        table: {
                            widths: [50, 130, '*', 80, 80],
                            headerRows: 1,
                            body:  Transactions
                        },
                        layout: 'lightHorizontalLines'  
                    },
                    /////////////////////////////////////////////////////////////////////////////////////////////////
                ],
                styles: { 
                    quote: {
                        italics: true
                    },
                    small: {
                        fontSize: 6
                    },
                    bold: {
                        fontSize: 15,
                        bold: true
                    },
                    tableBody:{
                        fontSize: 9
                    },
                    tableHeader:{
                        fontSize: 11,
                        bold: true
                    }
                }
            };
            // pdfMake.createPdf(docDefinition).download();   
            // $ionicLoading.hide();
            const pdfDocGenerator = pdfMake.createPdf(docDefinition);  
            pdfDocGenerator.getBase64((data) => {  
                $ionicLoading.hide();
                if( ionic.Platform.isIOS() ){  
                    $cordovaFile.writeFile( cordova.file.documentsDirectory,'bank-statement-'+Month+"-"+Year+'.pdf' ,base64toBlob(data, "application/pdf"), true)
                    .then(function (success) { 
                        $cordovaFileOpener2.open( 
                            cordova.file.documentsDirectory+'bank-statement-'+Month+"-"+Year+'.pdf',
                            'application/pdf'
                        ).then(function() {
                              //console.log("file opened successfully")
                        }, function(err) { 
                              //console.log("An error occurred. Show a message to the user")
                        });
                    }, function (error) {
                        alert('Fails');
                    });  
                }else{
                     $cordovaFile.writeFile( cordova.file.externalApplicationStorageDirectory,'bank-statement-'+Month+"-"+Year+'.pdf' ,base64toBlob(data, "application/pdf"), true)
                    .then(function (success) { 
                        $cordovaFileOpener2.open( 
                            cordova.file.externalApplicationStorageDirectory+'bank-statement-'+Month+"-"+Year+'.pdf',
                            'application/pdf'
                        ).then(function() {
                              //console.log("file opened successfully")
                        }, function(err) { 
                              //console.log("An error occurred. Show a message to the user")
                        });
                    }, function (error) {
                        alert('Fails');
                    });
                }
                
            }); 
         
    }// end 
  
})


.controller('languageCtrl', function($scope, $rootScope, $translate, $ionicHistory, $state, Alert,Go, Catgs, User) { 


    $scope.$on('$ionicView.beforeEnter', function() { 
        $scope.selectedLang = $translate.use();
        $scope.UserDetails = User.GetDetails(); 
    })

    $scope.changeLanguage = function (key) { 

        var postData = {
            task: "setLang",
            lang: key
        }
        Alert.loader(true)
        Go.post(postData).then(function(data) {
            Alert.loader(false)
            if( data.success == 1 ){ 

                $scope.selectedLang = key ;
                $translate.use(key);
                window.localStorage.setItem('langCode', key );
                Catgs.Sync(true);

                /********************************************************/
                var userData = data.UserDetails;  
                userData.isPro = User.GetDetails().isPro;
                userData.userInfos = User.GetDetails().userInfos;

                User.SetDetails(userData);
                /********************************************************/

                $ionicHistory.clearHistory();
                $ionicHistory.clearCache();  


                $rootScope.GotoSettings();
                
            }
        }) 

        //$ionicHistory.clearCache(); 
         
    };
})

.controller('changeLockCodeCtrl', function($scope, $rootScope, $translate, Alert, crypt, Go, $filter, SharedService, crypt) { 

    $scope.$on('$ionicView.beforeEnter', function() { 
        $scope.data = {}
    })

    $scope.ChangeCode = function() {
        var validationList = [{
            type: 'currentLockCode',
            value: $scope.data.currentcode
        }, {
            type: 'lockCode',
            value: $scope.data.newcode
        }, {
            type: 'confirmLockCode',
            value: $scope.data.confirmcode
        }];
        if (SharedService.Validation(validationList)) {
            var postData = {
                "task": "SettingsChangecode",
                "actualcode": crypt.sha256($scope.data.currentcode),
                "code": crypt.sha256($scope.data.newcode),
                "confirmcode": crypt.sha256($scope.data.confirmcode)
            };
            Alert.loader(true);
            Go.post(postData).then(function(data) {
                if (data.success == 1) {
                    window.localStorage.setItem('lockCode', crypt.sha256($scope.data.newcode))
                    Alert.success( $filter('translate')('lock_code.success_update') )
                    $scope.data = {}
                }
            });
        }
    };
})

.controller('customerServiceCtrl', function($scope, $state, $location, $ionicHistory, LockScreen, $filter) {  

    $scope.backToCode = function () {
        LockScreen.show();   
    }

    $scope.autoLogOut = function () { 
        LockScreen.logout();  
    } 
})

.controller('resetLockCodeCtrl', function($scope, $state, $location, crypt, $filter,SharedService, Alert, Go,crypt) {  

    $scope.$on('$ionicView.beforeEnter', function() { 
        $scope.data = {}
    })

    $scope.ResetCode = function() {
        var validationList = [{
            type: 'lockCode',
            value: $scope.data.newcode
        }, {
            type: 'confirmLockCode',
            value: $scope.data.confirmcode
        }];
        if (SharedService.Validation(validationList)) {
            var postData = {
                "task": "DeblocChangecode", 
                "code": crypt.sha256($scope.data.newcode),
                "confirmcode": crypt.sha256($scope.data.confirmcode)
            };
            Alert.loader(true);
            Go.post(postData).then(function(data) {
                if (data.success == 1) {
                    window.localStorage.setItem('lockCode', crypt.sha256($scope.data.newcode))
                    window.localStorage.setItem('loged', '1');
                    Alert.success( $filter('translate')('lock_code.success_update') )
                    
                    setTimeout(function () {
                        $scope.data = {}
                        $location.path('/tab/home');
                    },500)
                }
            });
        }
    };
})

.controller('cgvCtrl', function($scope, $cordovaFileOpener2, API, $sce, $stateParams, Go) {  

    $scope.trustAsHtml = function(string) {
        return $sce.trustAsHtml(string);
    };
    $scope.content = "";

    $scope.$on('$ionicView.beforeEnter', function() { 
        
        $scope.canLoadMore = false;
        $scope.content = '';
        $scope.page = 0;

        $scope.loadContents();
    })


    $scope.loadContents = function () {
        
        Go.post({
            task: "getcgv",
            NoLoader: true,
            isshop  : $stateParams.isshop,
            page  : $scope.page
        }).then(function (data) {
            if(data.success == 1){
                $scope.page++;
                $scope.content += data.cgv;
                setTimeout(function () {
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                },1000)
                if(data.cgvend == 0){ 
                    $scope.canLoadMore = true; 
                } 
            }   
        })
    }
    
    $scope.download = function ( type ) {  

        if( ionic.Platform.isIOS() ){
            $cordovaFileOpener2.open( 
                cordova.file.applicationDirectory+'www/docs/cgv/'+type+'/TERMS-OF-SALES.pdf',
                'application/pdf'
            )
        }else{ 
            window.open(API.server+'docs/cgv/'+type+'/TERMS-OF-SALES.pdf', '_system');
        } 
            

    }

})


.controller('causesCtrl', function($scope, $rootScope, $state, $ionicModal, Catgs, ALGOLIA, Go, Geo, User, Alert) {  
    

    var userDetails;


    var APPLICATION_ID = ALGOLIA.APPLICATION_ID;
    var SEARCH_ONLY_API_KEY = ALGOLIA.SEARCH_ONLY_API_KEY; 

    var INDEX_NAME = 'shops-geosearch';
    $scope.PARAMS = { hitsPerPage: 10 };
    // Client + Helper initialization 
    var algolia = algoliasearch(APPLICATION_ID, SEARCH_ONLY_API_KEY); 
    var algoliaHelper = algoliasearchHelper(algolia, INDEX_NAME, $scope.PARAMS);

    $scope.searchInput = '';

    $scope.chipCats = [];

    $scope.shuffleArray =  function (o) {
        for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
        return o;
    };

    $scope.$on('$ionicView.beforeEnter', function() { 
        $scope.IdCat = '';
        $scope.searchProgress = true; 

        UserDetails = User.GetDetails(); 


        Geo.getPosition().then(function(data) {
            // var data = {lat:31.589472300000003, lng:-7.991084500000001}
                $scope.center = [ data.lat, data.lng ];  
                algoliaHelper.setQueryParameter('aroundLatLng', $scope.center[0]+', '+$scope.center[1]);
                algoliaHelper.setQueryParameter('query', ' '); 
                algoliaHelper.addNumericRefinement('isshop', '=', 2);
                algoliaHelper.addNumericRefinement('suspended', '=', 0);
                algoliaHelper.addNumericRefinement('treezorvaldation', '=', 1);
                algoliaHelper.addNumericRefinement('deleted', '=', 0);
                algoliaHelper.setQueryParameter('getRankingInfo', true);
                algoliaHelper.addNumericRefinement('pimaccount', '=', 0);

                if( parseInt( UserDetails.user.associationid ) > 0 ){
                    algoliaHelper.addNumericRefinement('id', '!=', UserDetails.user.associationid);
                }

                algoliaHelper.search(); 
                algoliaHelper.on('result', function(results, state) { 
                    $scope.$apply(function () { 
                        $scope.causes = $scope.shuffleArray(results.hits);
                        $scope.searchProgress = false; 
                    })
                });
        });
 

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

    })


    $scope.search = function(){ 
        var algoliaHelper = algoliasearchHelper(algolia, INDEX_NAME, $scope.PARAMS); 
        // if( $scope.searchInput.length > 2 || $scope.IdCat != '' ){ 
            $scope.searchProgress = true;
            Geo.getPosition().then(function(data) {  
                algoliaHelper.setQueryParameter('aroundLatLng', data.lat+', '+data.lng);
                
                algoliaHelper.setQueryParameter('query', $scope.searchInput);
                algoliaHelper.setQueryParameter('getRankingInfo', true);
                algoliaHelper.addNumericRefinement('isshop', '=', 2);
                algoliaHelper.addNumericRefinement('treezorvaldation', '=', 1);
                algoliaHelper.addNumericRefinement('suspended', '=', 0);
                algoliaHelper.addNumericRefinement('deleted', '=', 0);  
                algoliaHelper.addNumericRefinement('pimaccount', '=', 0);

                if( parseInt( UserDetails.user.associationid ) > 0 ){
                    algoliaHelper.addNumericRefinement('id', '!=', UserDetails.user.associationid);
                }
                
                if($scope.IdCat  != ''){
                    algoliaHelper.addNumericRefinement('catid', '=', $scope.IdCat); 
                }
                algoliaHelper.search(); 
                algoliaHelper.on('result', function(results, state) { 
                    $scope.$apply(function () { 
                        $scope.searchProgress = false;
                        $scope.causes = results.hits; 
                        Alert.loader(false)
                    })
                });
                
            }) 
        // }
    } 

    $scope.detailCause = function (cause) {
        $rootScope.cause = cause;
        $state.go('tab.detailCause', {idCause: cause.id})
    };
    $scope.twoDigitAfterCama = function (num) { 
        return parseInt( num );
    }

    $scope.showSubCat = function (index, selectedCat) {
        $scope.Filter.hide();
        $scope.IdCat = selectedCat.catid;
        $scope.chipCats[0] = selectedCat.catlabel;
        angular.forEach($scope.categories, function (cat, i) {
            if( cat.catid !=  selectedCat.catid ){ 
                $scope.categories[i].selected = false;
            }else{
                $scope.categories[i].selected = true; 
            }
        })  
        setTimeout(function () {
            $scope.search();
        })
    }

    $scope.RemoveCategory = function () {
        $scope.chipCats = []; 
        $scope.IdCat = ''; 
        angular.forEach($scope.categories, function (cat, i) {
            $scope.categories[i].selected = false;
        }) 
        setTimeout(function () {
            $scope.search();
        })
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

.controller('DetailCauseCtrl', function($scope, $state, $rootScope, User, Go, $ionicModal, $ionicActionSheet, $stateParams, API, $storage) {
  
    $scope.dontShowPopupCause = false;
    $scope.$on('$ionicView.enter', function() { 

        if( parseInt($storage.get('dontShowPopupCause')) != 1 ){
            $scope.ModalSelect.show()
        } 

    })

    $scope.$on('$ionicView.beforeEnter', function () {
        $scope.loadedInfos = false;
        Go.post({
            task: 'getDetailsAssociation',
            id: $stateParams.idCause
        }).then(function (data) {  
            if( data.success == 1 ){
                $scope.cause = data.association;
                $scope.loadedInfos = true;

                hasWWW = $scope.cause.siteweb.toLowerCase().search('www.');
                hashttp = $scope.cause.siteweb.toLowerCase().search('http://');

                if( hasWWW < 0 ){
                    $scope.cause.siteweb = "www."+$scope.cause.siteweb.toLowerCase();
                }
                if( hashttp < 0 ){
                    $scope.cause.siteweb = "http://"+$scope.cause.siteweb;
                }
            } 
        }) 

        $scope.devise = API.devise;
        var UserDetails = User.GetDetails(); 
        $scope.currentCause = $rootScope.cause;

        $scope.isCause = (parseInt(UserDetails.userInfos.isshop) == 2 ) ? true : false;

        $scope.selectedAssocID = UserDetails.user.associationid;

        $scope.isCurrentCause = (parseInt(UserDetails.userInfos.id) == parseInt($stateParams.idCause)) ? true : false;  
    })

    $scope.twoDigitAfterCama = function (num) { 
        return parseInt( num );
    }

    $scope.selectCause = function (idCause) {  
        Go.post({
            task: 'SetAssociation',
            id: idCause
        }).then(function (data) { 
            if( data.success == 1 ){
                $scope.ModalSelected.show()
                var UserDetails = User.GetDetails();

                if( parseInt(UserDetails.user.associationid) == 0 ){
                    UserDetails.NbrDocPaimentPending.nbr = parseInt( UserDetails.NbrDocPaimentPending.nbr ) - 1;
                } 
                
                UserDetails.user.associationid = idCause;
                User.SetDetails( UserDetails );

                setTimeout(function () {
                    $scope.selectedAssocID = UserDetails.user.associationid;
                },1000)
 
            } 
        })
    } 
    $scope.dontShow = function () {
        $storage.set('dontShowPopupCause', 1);
        $scope.dontShowPopupCause = !$scope.dontShowPopupCause; 
    }

    $scope.gotoHome = function () {
        $scope.ModalSelected.hide();
        setTimeout(function () {
            $state.go('tab.home')
        })
    }

    $scope.actionBtn = function (action, parram1,  parram2,  parram3) {  
         
        if(action=="http"){
            if( parram1.search('http') == -1 ){
                window.open('http://'+parram1.replace(/\s/g,''), '_system');
            }else{
                window.open(parram1.replace(/\s/g,''), '_system');
            }
        }
        else if(action=="geo"){

            var specialChars = "!@#$^&%*+[]\/{}|:<>";
            for (var i = 0; i < specialChars.length; i++) {
                parram3 = parram3.replace(new RegExp("\\" + specialChars[i], 'gi'), '');
            }

            if( ionic.Platform.isIOS() ){ 
                $scope.choseMapsService( parram1,  parram2,  parram3 );
            }else{ 
                cordova.InAppBrowser.open('geo:?q=' + parram1+","+ parram2+" ("+ parram3+")", '_system');
            } 
        }
        else{
            cordova.InAppBrowser.open(action+':' + parram1.replace(/\s/g,''), '_system');
        }
        
    }

    $scope.choseMapsService = function ( parram1,  parram2,  parram3 ) { 
        angular.element(document.querySelector('body')).removeClass('platform-android');
        
        if( ionic.Platform.isIOS() ){
            var actionButton = [
               { text: 'Apple Maps' },
               { text: 'Google Maps' },
               { text: 'Waze' }
            ]
        }else{
            var actionButton = [ 
               { text: 'Google Maps' },
               { text: 'Waze' }
            ]
        }

        

        $ionicActionSheet.show({
         buttons: actionButton, 
         cancelText: 'Cancel',
         cancel: function() {
              
        },
         buttonClicked: function(index) {
            index = (!ionic.Platform.isIOS()) ? index + 1 : index;
            switch(index) { 
                case 0:
                    cordova.InAppBrowser.open('maps://?q='+ parram3+'&ll='+parram1+','+parram2, '_system'); 
                    break;
                case 1: 
                    var appSchema = ( ionic.Platform.isIOS() ) ? "comgooglemaps://" : "com.google.android.apps.maps";
                    var urlApp = ( ionic.Platform.isIOS() ) ? "https://itunes.apple.com/fr/app/google-maps-gps-transports-publics/id585027354?mt=8" : "https://play.google.com/store/apps/details?id=com.google.android.apps.maps";
                    
                    appAvailability.check( appSchema, // URI Scheme 
                    function() {  // Success callback 

                      cordova.InAppBrowser.open('comgooglemaps://?q=' + parram1+","+ parram2+"("+ parram3+")", '_system');

                    },function() {  // Error callback  

                        cordova.InAppBrowser.open( urlApp , '_system');

                    }); 
                    break; 
                case 2:   
                    var appSchema = ( ionic.Platform.isIOS() ) ? "waze://" : "com.waze";
                    var urlApp = ( ionic.Platform.isIOS() ) ? "http://itunes.apple.com/us/app/id323229106" : "https://play.google.com/store/apps/details?id=com.waze";
                    
                    appAvailability.check( appSchema, // URI Scheme 
                        function() {  // Success callback 

                            cordova.InAppBrowser.open('waze://?ll=' + parram1+","+ parram2+"&navigate=yes", '_system');

                        },
                        function() {  // Error callback  

                            cordova.InAppBrowser.open( urlApp , '_system');

                        }
                    );
                    break; 
                default:
                     cordova.InAppBrowser.open('maps://?q='+ parram3+'&ll='+parram1+','+parram2, '_system');
                    break; 
            } 
            return true;
         }
       })
    }


    $ionicModal.fromTemplateUrl('templates/Connect/causes/modal-select.html', {
        scope: $scope,
        animation: 'slide-in-up',
        hideDelay:200,
    }).then(function(modal) {
        $scope.ModalSelect = modal;  
    });

    $ionicModal.fromTemplateUrl('templates/Connect/causes/modal-selected.html', {
        scope: $scope,
        animation: 'animated zoomIn',
        hideDelay:200,
    }).then(function(modal) {
        $scope.ModalSelected = modal;  
        // $scope.ModalSelected.show();
    });






}) 
.controller('ibanCtrl', function($scope, User, $filter, $ionicLoading, $cordovaFile, $cordovaFileOpener2, Accounts, $cordovaEmailComposer, BASE64_LOGOS) { 

    $scope.BASE64_LOGOS = BASE64_LOGOS; 
    
    $scope.ibanMask = function (iban) {
        return (iban != '') ? iban.match(/.{1,4}/g).join(" ") : '';
    }

    function base64toBlob(base64Data, contentType) {
          contentType = contentType || '';
          var sliceSize = 1024;
          var byteCharacters = atob(base64Data);
          var bytesLength = byteCharacters.length;
          var slicesCount = Math.ceil(bytesLength / sliceSize);
          var byteArrays = new Array(slicesCount);

        for (var sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
            var begin = sliceIndex * sliceSize;
            var end = Math.min(begin + sliceSize, bytesLength);

            var bytes = new Array(end - begin);
            for (var offset = begin, i = 0 ; offset < end; ++i, ++offset) {
                bytes[i] = byteCharacters[offset].charCodeAt(0);
            }
            byteArrays[sliceIndex] = new Uint8Array(bytes);
        }
        return new Blob(byteArrays, { type: contentType });
    }



    $scope.data = {}
    $scope.$on('$ionicView.beforeEnter', function() { 
        
        var data = User.GetDetails();
        if( data.isPro == 0 ){
            $scope.data.user = {
                name        : data.user.fname +" "+ data.user.lname,
                address     : data.user.line1,
                address2    : data.user.line2,
                zip         : data.user.zip,
                city        : data.user.city,
                country     : data.user.country
            }
        }else{
            $scope.data.user = {
                name        : data.user.shopname,
                address     : data.user.hqline1,
                address2    : data.user.hqline2,
                zip         : data.user.hqzip,
                city        : data.user.hqcity,
                country     : data.user.hqcountry
            }
        }
        $scope.data.domiciliation = {
            name: "Treezor",
            address: "94 rue de Villiers",
            zip: 92300,
            city: "Levallois-Perret",
            country: "FRANCE"
        }

        Accounts.getIban().then(function (data) {
            $scope.data.iban = data.number;
            $scope.data.bic = data.bic;
            $scope.data.ibanDetail =  [data.number.substr(4, 5), data.number.substr(9, 5), data.number.substr(15, 11), data.number.substr(25, 2)]
        }); 
        

    }) 
 






    $scope.send = function () { 

        var email = {
            to: '',
            subject: $filter('translate')('my_iban.title_page'),
            body: $('#contentMail').html(),
            isHtml: true
        };

        $cordovaEmailComposer.open(email).then(null, function () {
           
        });
    }

    $scope.download = function () {

        $ionicLoading.show({
          template: $filter('translate')('bank_statement.please_wait')+'<br> <ion-spinner icon="ios-small"></ion-spinner>'
        })

        var docDefinition = { 
                pageSize: 'A4', 
                pageMargins: [ 20, 20, 20, 50 ],
                footer: [ 
                        {
                            text: $filter('translate')('bank_statement_pdf.info_pim'), 
                            fontSize: 8,
                            alignment: 'center',
                            margin: [0,0,0,5],
                        },
                        {
                            columns:[
                                {
                                    text: '',
                                    width: 5
                                },
                                {
                                    text: '',
                                    width: 10
                                },
                                {
                                    image: BASE64_LOGOS.treezor,
                                    width: 30
                                }, 
                                {
                                    text: $filter('translate')('bank_statement_pdf.footer_page'), 
                                    style: ['quote', 'small'],
                                },
                                {
                                    text: '',
                                    width: 20
                                }
                            ]
                        }

                ],
                content:[
                    { 
                        columns:[
                            {
                                image: BASE64_LOGOS.pim,
                                width: 50
                            }
                        ]
                    },
                    { 
                        text: "IBAN", 
                        style: 'bold',
                        margin: [0,40,0,0],
                        fontSize: 20
                    }, 
                    {
                        text: $filter('translate')('my_iban.text'),
                        margin: [0,20,0,20],
                        fontSize: 9
                    },  
                    { 
                        text: $filter('translate')('my_iban.account_owner'), 
                        style: 'bold', 
                        fontSize: 12
                    },
                    { 
                        text: $scope.data.user.name,   
                        fontSize: 11
                    },
                    { 
                        text: $scope.data.user.address + ( $scope.data.user.address2 != '' ) ? $scope.data.user.address2+"\n" : '',   
                        fontSize: 11
                    },
                    { 
                        text: $scope.data.user.zip +" "+$scope.data.user.city,   
                        fontSize: 11
                    },
                    { 
                        text: $scope.data.user.country+"\n\n\n",   
                        fontSize: 11
                    },
                    { 
                        text: $filter('translate')('my_iban.iban'), 
                        style: 'bold', 
                        fontSize: 12
                    },
                    { 
                        text: $scope.data.iban+"\n\n",   
                        fontSize: 11
                    },
                    { 
                        text: $filter('translate')('my_iban.bic'), 
                        style: 'bold', 
                        fontSize: 12
                    },
                    { 
                        text: $scope.data.bic+"\n\n\n",   
                        fontSize: 11
                    },
                    /////////////////////////////////////////////////////////////////////////////////////////////////
                    {
                        style: 'tableExample',
                        table: {
                            // widths: [50, 130, '*', 80, 80],
                            headerRows: 1,
                            body:  [
                                [   
                                    {text: $filter('translate')('my_iban.bank_code'), style: 'tableHeader'},  
                                    {text: $filter('translate')('my_iban.wicket_code'), style: 'tableHeader'},  
                                    {text: $filter('translate')('my_iban.account_number'), style: 'tableHeader'},  
                                    {text: $filter('translate')('my_iban.rib_key'), style: 'tableHeader'}
                                ],
                                [   
                                    {text: $scope.data.ibanDetail[0]},  
                                    {text: $scope.data.ibanDetail[1]},  
                                    {text: $scope.data.ibanDetail[2]},  
                                    {text: $scope.data.ibanDetail[3]}
                                ]
                            ]
                        },
                        layout: 'lightHorizontalLines'  
                    },
                    /////////////////////////////////////////////////////////////////////////////////////////////////
                    { 
                        text: "\n\n"+$filter('translate')('my_iban.domiciliation_of_account'), 
                        style: 'bold', 
                        fontSize: 12
                    },
                    { 
                        text: $scope.data.domiciliation.name,   
                        fontSize: 11
                    },
                    { 
                        text: $scope.data.domiciliation.address,   
                        fontSize: 11
                    },
                    { 
                        text: $scope.data.domiciliation.zip +" "+$scope.data.domiciliation.city,   
                        fontSize: 11
                    },
                    { 
                        text: $scope.data.domiciliation.country,   
                        fontSize: 11
                    }
                ],
                styles: { 
                    quote: {
                        italics: true
                    },
                    small: {
                        fontSize: 6
                    },
                    bold: {
                        fontSize: 15,
                        bold: true
                    },
                    tableBody:{
                        fontSize: 9
                    },
                    tableHeader:{
                        fontSize: 11,
                        bold: true
                    }
                }
        };
        setTimeout(function () {
            const pdfDocGenerator = pdfMake.createPdf(docDefinition);   
            // pdfDocGenerator.open();
            // return ;

            pdfDocGenerator.getBase64((data) => {  
                
                if( ionic.Platform.isIOS() ){  
                    $cordovaFile.writeFile( cordova.file.documentsDirectory,'my-iban.pdf' ,base64toBlob(data, "application/pdf"), true)
                    .then(function (success) { 
                        $cordovaFileOpener2.open( 
                            cordova.file.documentsDirectory+'my-iban.pdf',
                            'application/pdf'
                        ).then(function() {
                             $ionicLoading.hide();
                        }, function(err) { 
                              //console.log("An error occurred. Show a message to the user")
                        });
                    }, function (error) {
                        alert('Fails');
                    });  
                }else{
                     $cordovaFile.writeFile( cordova.file.externalApplicationStorageDirectory,'my-iban.pdf' ,base64toBlob(data, "application/pdf"), true)
                    .then(function (success) { 
                        $cordovaFileOpener2.open( 
                            cordova.file.externalApplicationStorageDirectory+'my-iban.pdf',
                            'application/pdf'
                        ).then(function() {
                              //console.log("file opened successfully")
                        }, function(err) { 
                              //console.log("An error occurred. Show a message to the user")
                        });
                    }, function (error) {
                        alert('Fails');
                    });
                }
                
            }); 
        },1500)
            
    }

})

.controller('faqCtrl', function($scope, User, Go) {  
    $scope.$on('$ionicView.beforeEnter', function() { 
        $scope.rows = [];

        var postData = {
            task: "getFAQ",
        }
        Go.post(postData).then(function (data) {
            if( data.success == 1 ){
                $scope.rows = data.faq;
            }
        }) 
    }) 

    $scope.toggle = function ( key ) {
        angular.forEach($scope.rows, function (object, index) {
            if(key == index){
                $scope.rows[key].show = !$scope.rows[key].show;
            }else{
                $scope.rows[index].show = false;
            }
        }) 
    } 
})


.controller('ibanTransferCtrl', function($scope, $state, User,Geo, $timeout, Accounts, Icons, $ionicModal, SharedService, $ionicSlideBoxDelegate, $ionicActionSheet, $filter, Alert, $ionicScrollDelegate, Amount, API, Go) {  
    $scope.icons = Icons.Images_blanc;
    $scope.iconsBlue = Icons.Images_blue;

    $scope.ibanMask = function (iban) {
        return (iban != '') ? iban.match(/.{1,4}/g).join(" ") : '';
    }

    $scope.$on('$ionicView.beforeEnter', function() { 
        $scope.accounts = Accounts.all();  
        $scope.form = {}
        $scope.validate = false; 

        $scope.trans = {
            selectedAccount: 0,
            selectedRecipient: 0,
            amount: "", 
            reason: ""
        }
 
        $('.ibanFeild').mask('SS00 0000 0000 0000 0000 0000 000', {
            placeholder: 'IBAN'
        }); 
        $scope.realaccounts = User.GetDetails().realaccounts
    })   


    $scope.keyboardOptions = {
        visible: false 
    }
    $scope.validateForm = function () {
        
        var validationList = [{
            type: 'firstname',
            value: $scope.form.fname
        }, {
            type: 'lastname',
            value: $scope.form.lname
        },{
            type: 'adressLine1',
            value: $scope.form.address
        },/*{
            type: 'zip',
            value: parseInt($scope.form.city)
        },*/{
            type: 'city',
            value: $scope.form.city
        },{
            type: 'country',
            value: $scope.form.country
        },{
            type: 'iban',
            value: $scope.form.iban
        }];

        if (SharedService.Validation(validationList)) {   
            $scope.validate = true;
        }
    }


    $scope.confirmation = function () {
        
        Alert.loader(true)

        var postData = {
            task: "AddRealAccount",
            fname: $scope.form.fname,
            lname: $scope.form.lname,
            fulladdress: $scope.form.address,
            zip: $scope.form.zip,
            city: $scope.form.city,
            country: $scope.form.country,
            iban: $scope.form.iban,
            bic: $scope.form.bic
        }
        Go.post( postData ).then(function (data) {

            if( data.success == 1 ){
                $scope.realaccounts.push( data.realaccount )

                var UserDetails= User.GetDetails();
                UserDetails.realaccounts.push( data.realaccount )
                User.SetDetails(UserDetails);

                Alert.loader(false)
                $scope.closeModal(); 

                $ionicSlideBoxDelegate.update();
                setTimeout(function () { 
                    $scope.trans.selectedRecipient = $scope.realaccounts.length - 1; 
                })
            }
        })  
          
        
        
    }

    $scope.$watch('form', function(newVal, oldVal){
        $scope.validate = false;
    }, true);


    $scope.delete = function (index) {
        angular.element(document.querySelector('body')).removeClass('platform-android');
        $ionicActionSheet.show({
            destructiveText: 'Delete',
            destructiveButtonClicked: function() {
                Alert.loader(true)
                var postData = {
                    task: "DeleteRealAccount",
                    id: $scope.realaccounts[index].id
                }
                Go.post( postData ).then(function (data) {

                    if( data.success == 1 ){
                        $scope.realaccounts.splice(index, 1); 

                        var UserDetails= User.GetDetails();
                        UserDetails.realaccounts.splice(index, 1); 
                        User.SetDetails(UserDetails);

                        setTimeout(function () {
                            $ionicSlideBoxDelegate.update();
                            $scope.trans.selectedRecipient = 0;
                        })
                    }
                }) 
                

                return true;
            },
            cancelText: $filter('translate')('global_fields.cancel'),
            cancel: function() {}
        })
    } 


    var canWrait = true;
    $scope.showKeyboard = function(model) {
        angular.element("html").addClass("keyboardOn");
        angular.element( ".numeric-keyboard-amount" ).parent("label").addClass("cursonInInput");

        // $("#amount").scrollTop();
        $ionicScrollDelegate.scrollBottom();
        $scope.keyboardOptions = {
          visible: true,
          leftControl: '.', // <=== CUSTOMIZE YOUR CONTROL KEY HERE
          hideOnOutsideClick: true, //hides the keyboard if the user clicks outside of the keyboard (except if the clicked element contains the class numeric-keyboard-source)
          onKeyPress: function(value, source) {
        if(canWrait){
            canWrait = false;
                //console.log(value,source)
                if (source === 'RIGHT_CONTROL') {
                  if (typeof $scope[model] !== 'undefined') {
                    $scope[model] = $scope[model].toString().substr(0, $scope[model].toString().length - 1);
                  }
                }
                if (source === 'LEFT_CONTROL') {
                    //console.log('is left')
                    if ($scope[model].toString().indexOf('.') === -1) {
                        
                      $scope[model] = $scope[model]+ '.'; 
                    } 
                  }
                else if (source === 'NUMERIC_KEY') {
                  if (typeof $scope[model] === 'undefined') {
                    $scope[model] = '';
                  } 
                  $scope[model] = $scope[model]+ value;
                }
                $scope.amount =  Amount.watch($scope[model]);
                $scope.trans.amount = $filter('number')($scope[model], 2);
                $scope.trans.amount = Number($scope.trans.amount.replace(/[^0-9\.-]+/g, ""));
            }
            $timeout(function(){
                canWrait = true;
            },50);

          }
        }
    }


    $scope.sendPayment = function () {

        if( $scope.realaccounts.length == 0 ){

            Alert.error( $filter('translate')('make_a_transfer.you_need_to_add_recipient') );

        }
        else if( $scope.trans.amount != '' ){
            if( parseFloat($scope.trans.amount) < API.minAmount ){
             
                Alert.error( $filter('translate')('make_a_transfer.you_cant_send_payment_under_001', {
                    minAmount: API.minAmount+API.devise
                }));

            }
            else if( parseFloat( $scope.accounts[ $scope.trans.selectedAccount ].solde.split(' ').join('') ) < $scope.trans.amount ){

                console.log($scope.accounts[ $scope.trans.selectedAccount ].solde)
                
                Alert.error( $filter('translate')('make_a_transfer.insufficient_balance_in_this_account') + ' ' + $scope.trans.amount + API.devise);

            }else{
                var validationList = [{
                    type: 'reason',
                    value: $scope.trans.reason
                }];
                if (SharedService.Validation(validationList)) {
                    Alert.loader(true);
                    Geo.getPosition().then(function(position) {
                        
                        var postData = {
                            "task": "PaymentAddPayout",
                            "accountId": $scope.accounts[$scope.trans.selectedAccount].id,
                            "recipient": $scope.realaccounts[$scope.trans.selectedRecipient].id, 
                            "amount": $scope.trans.amount, 
                            "reason": $scope.trans.reason,
                            "lat": position.lat,
                            "long": position.lng
                        };   
     
                        Go.post(postData).then(function(data) {
                            if (data.success == 1) {  
                                Alert.success(  $filter('translate')('iban_transfer.success_sent')  ); 
                                $state.go('tab.home');
                                setTimeout(function () {
                                   $scope.trans = {
                                        selectedAccount: 0,
                                        selectedRecipient: 0,
                                        amount: "", 
                                        reason: ""
                                    }
                                },800) 

                                Go.post({
                                    "task": "getUserAccounts",
                                    "hideLoader": true

                                }).then(function(data) {
                                    if(data.success == 1){ 
                                        User.UpdateListAccounts(data.accounts); 
                                    }   
                                });     
                            } 
                        }) 
                    })
                }


            }
        }
        else if( $scope.trans.amount == '' ){
            Alert.error( $filter('translate')('make_a_transfer.you_cant_send_payment_under_001', {
                minAmount: API.minAmount+API.devise
            }));
        }
    } 





    $ionicModal.fromTemplateUrl('iban-transfer-adduser.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.modal = modal;  
    });

    $scope.closeModal = function() {
        $scope.form = {}
        $scope.modal.hide();
    };    
})
 


.controller('treezorCtrl', function($scope,Go) {   
    // $scope.$on('$ionicView.beforeEnter', function() { 
    //     $scope.state = -1;
    //     $scope.times = 1; 

    // })  
    // $scope.heartbeat = function () {
    //     $scope.state = 0;
    //     $scope.users = [];
    //     Go.post({
    //         task: "TREEZOR_heartbeats",
    //         NoLoader: true,
    //     }).then(function (data) {
    //         $scope.curl_getinfo = data.curl_getinfo
    //        if(data.success == 1){

    //             $scope.state = 1; 

    //        }else{
    //             $scope.state = 2; 
    //             $scope.fail = "API: "+data.message;
    //        }
    //     })  
    // }

    // $scope.getUsers = function () {
    //     $scope.state = 0;
    //     $scope.users = [];
        
    //     Go.post({
    //         task: "TREEZOR_users",
    //         NoLoader: true,
    //     }).then(function (data) {
            
    //        if(data.success == 1){ 
    //             $scope.state = -1; 
    //             $scope.users = data.users.users;

    //        }else{ 
    //             $scope.users = [];
    //             $scope.state = 2; 
    //             $scope.fail = "API: "+data.message;
    //        }
    //     })  
    // }

})

.controller('documentsWaitingValidationCtrl', function($scope, $state, User, $ionicScrollDelegate) { 
    $scope.$on('$ionicView.beforeEnter', function() {
        $scope.userDetails = User.GetDetails();
        $scope.isshop = ($scope.userDetails.isPro > 0) ? true : false;
        console.log($scope.userDetails.NbrDocPaimentPending.listDoc)

        $scope.docs = $scope.userDetails.NbrDocPaimentPending.listDoc;

        $scope.isPro = parseInt($scope.userDetails.isPro); 

        $scope.selectedAssocId = $scope.userDetails.user.associationid;

        setTimeout(function () { 
            $('.groupListwaitingElements .groupListwaitingElementsItem').each(function () {
                if( !$(this).find('i').attr('class') ){
                    $(this).hide();
                }else{
                    $(this).show();
                }
            })
        })
    });

    $scope.clickItem = function (type) {
        switch(type){

            ///////////// Perso /////////////
            case 'userlname':
                if($scope.docs.userlname != 0){
                    $state.go('tab.settings')
                    setTimeout(function() {
                        $state.go('tab.PesonnalInformation') 
                    },500)
                }
                break;

            case 'useraddressid':
                if($scope.docs.useraddressid != 0){
                    $state.go('tab.settings')
                    setTimeout(function() {
                        $state.go('tab.address') ;
                    },500)
                }
                break;

            case 'usermail':
                if($scope.docs.usermail == 0){
                    $state.go('tab.settings')
                    setTimeout(function() {
                        $state.go('tab.ChangeEmail') 
                    },500)
                }
                break; 

            case 'usermobile':
                if($scope.docs.usermobile == 0){
                    $state.go('tab.settings')
                    setTimeout(function() {
                        $state.go('tab.ChangePhone') ;
                    },500)
                }  
                break;  


            ///////////// Pro ///////////////

            case 'shopname':
                if($scope.docs.shopname != 0){
                    if( $scope.isPro == 1 ) $state.go('tab.settingsPro');
                    if( $scope.isPro == 2 ) $state.go('tab.settingsAssociation');
                    
                    setTimeout(function() { 
                        if( $scope.isPro == 1 ) $state.go('tab.updatecompanyinfo');
                        if( $scope.isPro == 2 ) $state.go('tab.updateAssociationinfo');
                    },500)
                }  
                break;

            case 'shophqphone':
                if($scope.docs.shophqphone != 0){
                    if( $scope.isPro == 1 ) $state.go('tab.settingsPro');
                    if( $scope.isPro == 2 ) $state.go('tab.settingsAssociation');
                    
                    setTimeout(function() {
                        $state.go('tab.ChangePhonehq') ;
                    },500)
                }  
                break;

            case 'shophqphone':
                if($scope.docs.shophqphone != 0){
                    if( $scope.isPro == 1 ) $state.go('tab.settingsPro');
                    if( $scope.isPro == 2 ) $state.go('tab.settingsAssociation');
                    
                    setTimeout(function() {
                        $state.go('tab.ChangePhonehq') ;
                    },500)
                }  
                break;

            case 'shophqaddressid':
                if($scope.docs.shophqaddressid != 0){
                    if( $scope.isPro == 1 ) $state.go('tab.settingsPro');
                    if( $scope.isPro == 2 ) $state.go('tab.settingsAssociation');
                    
                    setTimeout(function() {
                        $state.go('tab.hqaddress') ;
                    },500)
                }  
                break;

            case 'sharecapital':
                if($scope.docs.sharecapital == 0){
                    if( $scope.isPro == 1 ) $state.go('tab.settingsPro');
                    if( $scope.isPro == 2 ) $state.go('tab.settingsAssociation');
                    
                    setTimeout(function() {
                        $state.go('tab.capital-social') ;
                    },500)
                }  
                break;

            case 'shoptypeid':
                if($scope.docs.shoptypeid == 0){
                    if( $scope.isPro == 1 ) $state.go('tab.settingsPro');
                    if( $scope.isPro == 2 ) $state.go('tab.settingsAssociation');
                    
                    setTimeout(function() {
                        $state.go('tab.businessinformations-type') ;
                    },500)
                }  
                break;

            case 'brvta':
                if($scope.docs.brvta == 0){
                    if( $scope.isPro == 1 ) $state.go('tab.settingsPro');
                    if( $scope.isPro == 2 ) $state.go('tab.settingsAssociation');
                    
                    setTimeout(function() {
                        $state.go('tab.businessinformations-vat') ;
                    },500)
                }  
                break;

            case 'nafid':
                if($scope.docs.nafid == 0){
                    if( $scope.isPro == 1 ) $state.go('tab.settingsPro');
                    if( $scope.isPro == 2 ) $state.go('tab.settingsAssociation');
                    
                    setTimeout(function() {
                        $state.go('tab.ape_naf') ;
                    },500)
                }  
                break;

            case 'shopcontactmail':
                if($scope.docs.shopcontactmail == 0){
                    if( $scope.isPro == 1 ) $state.go('tab.settingsPro');
                    if( $scope.isPro == 2 ) $state.go('tab.settingsAssociation');
                    
                    setTimeout(function() {
                        $state.go('tab.ChangeContactEmail') ;
                    },500)
                }  
                break;

            case 'shopphone':
                if($scope.docs.shopphone == 0){
                    if( $scope.isPro == 1 ) $state.go('tab.settingsPro');
                    if( $scope.isPro == 2 ) $state.go('tab.settingsAssociation');
                    
                    setTimeout(function() {
                        $state.go('tab.ChangePhoneshop') ;
                    },500)
                }  
                break;

            case 'shopaddressid':
                if($scope.docs.shopaddressid != 0){
                    if( $scope.isPro == 1 ) $state.go('tab.settingsPro');
                    if( $scope.isPro == 2 ) $state.go('tab.settingsAssociation');
                    
                    setTimeout(function() {
                        $state.go('tab.shopaddress') ;
                    },500)
                }  
                break;

            case 'cat':
                if($scope.docs.cat == 0){
                    if( $scope.isPro == 1 ) $state.go('tab.settingsPro');
                    if( $scope.isPro == 2 ) $state.go('tab.settingsAssociation');
                    
                    setTimeout(function() {
                        $state.go('tab.businessinformations-cat') ;
                    },500)
                }  
                break;

            case 'shopmail':
                if($scope.docs.shopmail == 0){
                    if( $scope.isPro == 1 ) $state.go('tab.settingsPro');
                    if( $scope.isPro == 2 ) $state.go('tab.settingsAssociation');
                    
                    setTimeout(function() {
                        $state.go('tab.ChangeCompanyEmail') ;
                    },500)
                }  
                break;

            case 'shopmobile':
                if($scope.docs.shopmobile == 0){
                    if( $scope.isPro == 1 ) $state.go('tab.settingsPro');
                    if( $scope.isPro == 2 ) $state.go('tab.settingsAssociation');
                    
                    setTimeout(function() {
                        $state.go('tab.ChangePhonemobile') ;
                    },500)
                }  
                break;

            /// All profils

            case 'usertreezorid':
                if( $scope.isPro == 0 ) $state.go('tab.settings');
                if( $scope.isPro == 1 ) $state.go('tab.settingsPro');
                if( $scope.isPro == 2 ) $state.go('tab.settingsAssociation');
                
                break;

            case 'causes':
                $state.go('tab.causes');
                
                break;
        }
    }

})

.controller('paymentsWaitingValidationCtrl', function($scope, $state, Go, User) { 

      
    $scope.$on('$ionicView.beforeEnter', function() { 
        var userDetails = User.GetDetails();

        if( userDetails.NbrDocPaimentPending.activeTab ){
            $scope.activeTab = userDetails.NbrDocPaimentPending.activeTab; 
        }else{
            $scope.activeTab = 'in'; 
        }
        

        Go.post({
            task: "getWatingTransfers"
        }).then(function (data) {


            $scope.listeTransaction = data.requests.requests; 
            $scope.counts = data.requests.nbr_requests;
            $scope.accountsNames = data.requests.accounts
 
            userDetails.NbrDocPaimentPending.nbr = data.requests.nbr_requests.all; 
            User.SetDetails(userDetails);   
             
        })  
        
    }); 

    $scope.changeTab = function (selectedTab) {
        var userDetails = User.GetDetails();
        userDetails.NbrDocPaimentPending.activeTab = selectedTab;
        User.SetDetails(userDetails);

        $scope.activeTab = selectedTab;
    }

     

})
















