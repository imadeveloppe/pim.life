angular.module('pim.routes', [])

.config(function($stateProvider, $urlRouterProvider, $httpProvider) {
 
    $stateProvider

    // setup an abstract state for the tabs directive


        .state('signin', {
            url: '/sign-in',
            templateUrl: 'templates/sign-in.html',
            controller: 'SignInCtrl'
        }) 


        .state('signup-validate-email', {
            url: '/sign-up-validate-email/:isshop',
            templateUrl: 'templates/Deconnect/Sign-up/sign-up-validate-email.html',
            controller: 'BeforeSignUpCtrl'
        })

        .state('signup-validate-email-sent', {
            url: '/sign-up-validate-email-sent',
            templateUrl: 'templates/Deconnect/Sign-up/sign-up-validate-email-sent.html',
            controller: 'BeforeSignUpCtrl'
        })

        .state('resetQuestionSendEmail', {
            url: '/resetQuestionSendEmail',
            templateUrl: 'templates/Deconnect/Forgot-password/resetQuestionSendEmail.html',
            controller: 'resetQuestionSendEmail'
        })

        .state('resetQuestionMailSent', {
            url: '/resetQuestionMailSent',
            templateUrl: 'templates/Deconnect/Forgot-password/resetQuestionMailSent.html',
            controller: 'resetQuestionSendEmail'
        })

        .state('resetQuestionSendResponses', {
            url: '/resetQuestionSendResponses/:code/:usercode',
            templateUrl: 'templates/Deconnect/Forgot-password/questions.html',
            controller: 'resetQuestionSendResponses'
        })

        .state('customerService', {
            url: '/customer-service',
            cache: false,
            templateUrl: 'templates/Connect/customer-service.html',
            controller: 'customerServiceCtrl'
        }) 

        .state('resetLockCode', {
            url: '/resetlockcode',
            templateUrl: 'templates/Connect/Settings/resetLockcode.html',
            controller: 'resetLockCodeCtrl'
        }) 



        .state('signup', {
            url: '/sign-up/:code',
            templateUrl: 'templates/Deconnect/Sign-up/sign-up.html',
            controller: 'SignUpCtrl'
        }) 

        .state('signup-address', {
            url: '/signup-address',
            templateUrl: 'templates/Deconnect/Sign-up/localAddress.html',
            controller: 'SignUpCtrl'
        }) 

        .state('signuppro-address', {
            url: '/signuppro-address',
            templateUrl: 'templates/Deconnect/Sign-up/localAddress-pro.html',
            controller: 'ProSignUpCtrl'
        })  


        .state('signup-step2', {
            url: '/sign-up-step2',
            templateUrl: 'templates/Deconnect/Sign-up/enterphone.html',
            controller: 'SignUpCtrl'
        }) 
        .state('signup-step3', {
            url: '/sign-up-step3',
            cache: false,
            templateUrl: 'templates/Deconnect/Sign-up/questions.html',
            controller: 'SignUpCtrl'
        }) 
        .state('signuppro', {
            url: '/sign-up-pro/:code',
            templateUrl: 'templates/Deconnect/Sign-up/sign-up-pro.html',
            controller: 'ProSignUpCtrl'
        })
        .state('pro-signup-step2', {
            url: '/sign-up-pro-step2',
            templateUrl: 'templates/Deconnect/Sign-up/enterphone-pro.html',
            controller: 'ProSignUpCtrl'
        })
        .state('pro-signup-step3', {
            url: '/sign-up-pro-step3',
            cache: false,
            templateUrl: 'templates/Deconnect/Sign-up/questions-pro.html',
            controller: 'ProSignUpCtrl'
        })
        .state('congratulation', {
            url: '/congratulation',
            templateUrl: 'templates/validation/congratulation.html',
            controller: 'CongratulationCtrl'
        }) 
        .state('forgotpassword', {
            url: '/forgot-password',
            templateUrl: 'templates/Deconnect/Forgot-password/enterphone.html',
            controller: 'ForgotPasswordCtrl'
        }) 
        .state('forgotpassword-step2', {
            url: '/forgot-password-step2',
            templateUrl: 'templates/Deconnect/Forgot-password/code&answers.html',
            controller: 'ForgotPasswordCtrl'
        }) 
        .state('forgotpassword-step3', {
            url: '/forgot-password-step3',
            templateUrl: 'templates/Deconnect/Forgot-password/enternewpassword.html',
            controller: 'ForgotPasswordCtrl'
        })  
        .state('blocked', {
            url: '/blocked',
            templateUrl: 'templates/Deconnect/Blocked/blocked.html',
            controller: 'BlockedCtrl'
        })
        .state('unblock-bysms', {
            url: '/unblock-bysms',
            templateUrl: 'templates/Deconnect/Blocked/unblock-bysms.html',
            controller: 'BlockedCtrl'
        })
        .state('unblock-byanswers', {
            url: '/unblock-byanswers',
            templateUrl: 'templates/Deconnect/Blocked/unblock-byanswers.html',
            controller: 'BlockedCtrl'
        })
        .state('unblock-bysmsanswers', {
            url: '/unblock-bysmsanswers',
            templateUrl: 'templates/Deconnect/Blocked/unblock-bysmsanswers.html',
            controller: 'BlockedCtrl'
        })  
        .state('emailNotValidated', {
            url: '/email-not-validated',
            templateUrl: 'templates/validation/emailNotValidated.html',
            controller: 'emailNotValidatedCtrl' 
        })


        .state('tab.emailNotValidated', {
            url: '/email-not-validated',
            views: {
                'tab-settings': {
                    templateUrl: 'templates/validation/emailNotValidated.html',
                    controller: 'emailNotValidatedCtrl'
                }
            }
        }) 










        
        .state('tab', {
            url: '/tab',
            abstract: true,
            templateUrl: 'templates/tabs.html'
        }) 
        .state('tab.home', {
            url: '/home', 
            views: {
                'tab-home': {
                    templateUrl: 'templates/Connect/home.html',
                    controller: 'HomeCtrl'
                }
            }
        }) 

        

        .state('tab.documentsWaitingValidation', {
            url: '/documents-waiting-validation',
            views: {
                'tab-home': {
                    templateUrl: 'templates/Connect/home/documents-waiting-validation.html',
                    controller: 'documentsWaitingValidationCtrl'
                }
            }
        })


        .state('tab.paymentsWaitingValidation', {
            url: '/payments-waiting-validation',
            views: {
                'tab-home': {
                    templateUrl: 'templates/Connect/home/payments-waiting-validation.html',
                    controller: 'paymentsWaitingValidationCtrl'
                }
            }
        })

        .state('tab.detailWatingRequest', {
            url: '/detail-wating-request/:idReq',
            cache: false,
            views: {
                'tab-home': {
                    templateUrl: 'templates/Connect/trans/PayRecive-pendingPayment.html',
                    controller: 'NotifCtrl'
                }
            }
        })


        .state('tab.listAccounts', {
            url: '/list-account',
            views: {
                'tab-home': {
                    templateUrl: 'templates/Connect/list-account.html',
                    controller: 'HomeCtrl'
                }
            }
        })  
        .state('tab.create', {
            url: '/create',
            views: {
                'tab-home': {
                    templateUrl: 'templates/Connect/home/create.html',
                    controller: 'HomeCtrl'
                }
            }
        }) 
        .state('tab.update', {
            url: '/update-compte/:id',
            views: {
                'tab-home': {
                    templateUrl: 'templates/Connect/home/update.html',
                    controller: 'HomeCtrl'
                }
            }
        })
        .state('tab.info', {
            url: '/info-compte/:id',  
            views: {
                'tab-home': {
                    templateUrl: 'templates/Connect/home/infoCompte.html',
                    controller: 'HomeCtrl'
                }
            }
        }) 
        .state('tab.commisions', {
            url: '/commisions/:month/:year',  
            views: {
                'tab-home': {
                    templateUrl: 'templates/Connect/home/commisions.html',
                    controller: 'commisionsCtrl'
                }
            }
        }) 

        .state('tab.infoDetail', {
            url: '/info-detail/:idreq', 
            views: {
                'tab-home': {
                    templateUrl: 'templates/Connect/home/infoDetail.html', 
                    controller: 'HomeCtrl'
                }
            }
        })  
        .state('tab.trans', {
            url: '/trans',
            views: {
                'tab-home': {
                    templateUrl: 'templates/Connect/transaction.html',
                    controller: 'TransCtrl'
                }
            }
        }) 
        .state('tab.TransFriend', {
            url: '/Sendtofriend',
            cache: false,
            views: {
                'tab-home': {
                    templateUrl: 'templates/Connect/trans/SendToFriend.html',
                    controller: 'TransCtrl'
                }
            }
        }) 
        .state('tab.PayFriend', {
            url: '/Payfriend',
            views: {
                'tab-home': {
                    templateUrl: 'templates/Connect/trans/PayFriend.html',
                    controller: 'TransCtrl'
                }
            }
        }) 
        .state('tab.FeedBack', {
            url: '/FeedBack/:requestid/:scatid',
            cache:false,
            views: {
                'tab-home': {
                    templateUrl: 'templates/Connect/trans/feedback.html',
                    controller: 'FeedbackCtrl'
                }
            }
        }) 
        .state('tab.TransPayment', {
            url: '/TransPayment',
            cache: false,
            views: {
                'tab-home': {
                    templateUrl: 'templates/Connect/trans/SendToFriend.html',
                    controller: 'TransCtrl'
                }
            }
        })  
        .state('tab.AccountToAccount', {
            url: '/AccountToAccount',
            views: {
                'tab-home': {
                    templateUrl: 'templates/Connect/trans/accountToAccount.html',
                    controller: 'TransCtrl'
                }
            }
        }) 
        .state('tab.MarchandDemandPayment', {
            url: '/MarchandDemandPayment',
            cache: false,
            views: {
                'tab-home': {
                    templateUrl: 'templates/Connect/trans/MarchandDemandPayment.html',
                    controller: 'TransCtrl'
                }
            }
        }) 
        .state('tab.qrCodeViewer', {
            url: '/qrCodeViewer',
            cache: false,
            views: {
                'tab-home': {
                    templateUrl: 'templates/Connect/trans/qrCodeViewer.html',
                    controller: 'TransCtrl'
                }
            }
        }) 
        .state('tab.qrCodeSendPayment', {
            url: '/qrCodeSendPayment/:hash',
            views: {
                'tab-home': {
                    templateUrl: 'templates/Connect/trans/qrCodeSendPayment.html',
                    controller: 'TransCtrl'
                }
            }
        })
        .state('tab.PayRecive', {
            url: '/PayRecive/:id',
            cache: false,
            views: {
                'tab-notif': {
                    templateUrl: 'templates/Connect/trans/PayRecive.html',
                    controller: 'NotifCtrl'
                }
            }
        })
        .state('tab.FeedBackAccept', {
            url: '/FeedBackAccept/:requestid',
            views: {
                'tab-notif': {
                    templateUrl: 'templates/Connect/trans/feedback.html',
                    controller: 'FeedbackCtrl'
                }
            }
        }) 
        .state('tab.detailTransactionFromNotif', {
            url: '/detailTransactionFromNotif/:idreq', 
            views: {
                'tab-notif': {
                    templateUrl: 'templates/Connect/home/infoDetail.html', 
                    controller: 'HomeCtrl'
                }
            }
        })  


        .state('tab.ibanTransfer', {
            url: '/iban-transfer', 
            cache: false,
            views: {
                'tab-home': {
                    templateUrl: 'templates/Connect/iban/transfer/index.html', 
                    controller: 'ibanTransferCtrl'
                }
            }
        })









        .state('tab.causes', {
            url: '/causes',  
            cache: false,
            views: {
                'tab-causes': {
                    templateUrl: 'templates/Connect/causes/index.html',
                    controller: 'causesCtrl'
                }
            }
        })

        .state('tab.detailCause', {
            url: '/causes/detailCause/:idCause',  
            views: {
                'tab-causes': {
                    templateUrl: 'templates/Connect/causes/detail.html',
                    controller: 'DetailCauseCtrl'
                }
            }
        }) 






        .state('tab.statistics', {
            url: '/statistics', 
            cache: false,
            views: {
                'tab-home': {
                    templateUrl: 'templates/Connect/statistics.html',
                    controller: 'StatisticsCtrl'
                }
            }
        })

        .state('tab.faq', {
            url: '/faq',  
            views: {
                'tab-home': {
                    templateUrl: 'templates/Connect/faq.html',
                    controller: 'faqCtrl'
                }
            }
        }) 
          











        .state('tab.shop', {
            url: '/shop', 
            views: {
                'tab-shop': {
                    templateUrl: 'templates/Connect/shop/search.html',
                    controller: 'ShopCtrl',
                }
            }
        })
        .state('tab.profile-shop', {
            url: '/shop/profile-shop/:idShop',
            cache:false,
            views: {
                'tab-shop': {
                    templateUrl: 'templates/Connect/shop/profile-shop.html',
                    controller: 'ShopDetailCtrl'
                }
            }
        })



 

        .state('tab.notif', {
            url: '/list-notifications', 
            cache:false,
            views: {
                'tab-notif': {
                    templateUrl: 'templates/Connect/home/notifications.html',
                    controller: 'NotifCtrl'
                }
            }
        })
        
        .state('tab.infoNotif', {
            url: '/info-notifications/:id',
            views: {
                'tab-notif': {
                    templateUrl: 'templates/Connect/home/InfoNotif.html',
                    controller: 'NotifCtrl'
                }
            }
        }) 





 
         
        .state('tab.settings', {
            url: '/settings',
            cache: false,
            views: {
                'tab-settings': {
                    templateUrl: 'templates/Connect/settings.html',
                    controller: 'SettingsCtrl'
                }
            }
        })
        .state('tab.PhotoProfil', {
            url: '/settings/PhotoProfil',
            views: {
                'tab-settings': {
                    templateUrl: 'templates/Connect/Settings/PhotoProfile.html',
                    controller: 'PhotoProfileCtrl'
                }
            }
        })
        .state('tab.PesonnalInformation', {
            url: '/settings/PesonnalInformation',
            cache:false,
            views: {
                'tab-settings': {
                    templateUrl: 'templates/Connect/Settings/PesonnalInformation.html',
                    controller: 'PesonnalInformationCtrl'
                }
            }
        })





        .state('tab.ValidateDocument', {
            url: '/settings/validationAddress',
            views: {
                'tab-settings': {
                    templateUrl: 'templates/validation/documment.html',
                    controller: 'ValidationDocumentCtrl'
                }
            }
        })
        .state('tab.ChangePhone', {
            url: '/settings/changeyourphone',
            views: {
                'tab-settings': {
                    templateUrl: 'templates/Connect/Settings/ChangePhone.html',
                    controller: 'SettingsCtrl'
                }
            }
        })
        .state('tab.SmsCode', {
            url: '/settings/smscode',
            views: {
                'tab-settings': {
                    templateUrl: 'templates/Connect/Settings/SmsCode.html',
                    controller: 'SettingsCtrl'
                }
            }
        })
        .state('tab.ChangeEmail', {
            url: '/settings/changeyouremail',
            views: {
                'tab-settings': {
                    templateUrl: 'templates/Connect/Settings/ChangeEmail.html',
                    controller: 'SettingsCtrl'
                }
            }
        })
        .state('tab.address', {
            url: '/settings/address',
            views: {
                'tab-settings': {
                    templateUrl: 'templates/Connect/Settings/LocalAddress.html',
                    controller: 'AddressCtrl'
                }
            }
        })
        .state('tab.ChangePassword', {
            url: '/settings/changepassword',
            views: {
                'tab-settings': {
                    templateUrl: 'templates/Connect/Settings/ChangePassword.html',
                    controller: 'SettingsCtrl'
                }
            }
        })
        .state('tab.SmsCodePwd', {
            url: '/settings/smscodepwd',
            views: {
                'tab-settings': {
                    templateUrl: 'templates/Connect/Settings/SmsCodePwd.html',
                    controller: 'SettingsCtrl'
                }
            }
        })
        .state('tab.ChangeQuestions', {
            url: '/settings/changequestions', 
            views: {
                'tab-settings': {
                    templateUrl: 'templates/Connect/Settings/ChangeQuestions.html',
                    controller: 'SettingsCtrl'
                }
            }
        })

        .state('tab.DeleteProfil', {
            url: '/settings/deleteprofil',
            views: {
                'tab-settings': {
                    templateUrl: 'templates/Connect/Settings/DeleteProfil.html',
                    controller: 'SettingsCtrl'
                }
            }
        }) 

        
        
        .state('tab.facebook', {
            url: '/settings/facebook',
            views: {
                'tab-settings': {
                    templateUrl: 'templates/Connect/socials/facebook/compte.html',
                    controller: 'facebookCtrl'
                }
            }
        })
        .state('tab.facebookFeedBack', {
            url: '/facebookFeedBack',
            views: {
                'tab-home': {
                    templateUrl: 'templates/Connect/socials/facebook/compte.html',
                    controller: 'facebookCtrl'
                }
            }
        })
        .state('tab.twitter', {
            url: '/settings/twitter',
            views: {
                'tab-settings': {
                    templateUrl: 'templates/Connect/socials/twitter/compte.html',
                    controller: 'twitterCtrl'
                }
            }
        })
        .state('tab.twitterFeedBack', {
            url: '/twitterFeedBack',
            views: {
                'tab-home': {
                    templateUrl: 'templates/Connect/socials/twitter/compte.html',
                    controller: 'twitterCtrl'
                }
            }
        })  
        .state('tab.bankStatement', {
            url: '/bankStatement',
            views: {
                'tab-settings': {
                    templateUrl: 'templates/Connect/bankStatement/index.html',
                    controller: 'bankStatementCtrl'
                }
            }
        })

        .state('tab.bankStatementFromHome', {
            url: '/bankStatementFromHome',
            views: {
                'tab-home': {
                    templateUrl: 'templates/Connect/bankStatement/index.html',
                    controller: 'bankStatementCtrl'
                }
            }
        })

        .state('tab.cgv_perso', {
            url: '/cgv_perso/:isshop',
            views: {
                'tab-settings': {
                    templateUrl: 'templates/Connect/cgv/perso.html',
                    controller: 'cgvCtrl'
                }
            }
        })

        .state('tab.cgv_pro', {
            url: '/cgv_pro/:isshop',
            views: {
                'tab-settings': {
                    templateUrl: 'templates/Connect/cgv/pro.html',
                    controller: 'cgvCtrl'
                }
            }
        })

        .state('tab.cgv_assoc', {
            url: '/cgv_assoc/:isshop',
            views: {
                'tab-settings': {
                    templateUrl: 'templates/Connect/cgv/assoc.html',
                    controller: 'cgvCtrl'
                }
            }
        })


        .state('tab.language', {
            url: '/language',
            views: {
                'tab-settings': {
                    templateUrl: 'templates/Connect/language.html',
                    controller: 'languageCtrl'
                }
            }
        })  
        .state('tab.changeLockCode', {
            url: '/settings/changelockcode',
            views: {
                'tab-settings': {
                    templateUrl: 'templates/Connect/Settings/lockcode.html',
                    controller: 'changeLockCodeCtrl'
                }
            }
        }) 

        .state('tab.iban', {
            url: '/iban',
            views: {
                'tab-home': {
                    templateUrl: 'templates/Connect/iban/index.html',
                    controller: 'ibanCtrl'
                }
            }
        }) 
        
        
         
        
        
         





        .state('tab.DeleteProfilPro', {
            url: '/settingsPro/deleteprofil',
            views: {
                'tab-settings': {
                    templateUrl: 'templates/Connect/Settings/DeleteProfil.html',
                    controller: 'SettingsProCtrl'
                }
            }
        })
        
        .state('tab.settingsPro', {
            url: '/settingsPro',
            cache: true,
            views: {
                'tab-settings': {
                    templateUrl: 'templates/Connect/settingsPro.html',
                    controller: 'SettingsProCtrl'
                }
            }
        })

        .state('tab.settingsAssociation', {
            url: '/settingsAssociation',
            cache: true,
            views: {
                'tab-settings': {
                    templateUrl: 'templates/Connect/settingsAssociation.html',
                    controller: 'SettingsAssociationCtrl'
                }
            }
        })


         
        ////////////////////////////////////////////////////////////////// 

        .state('tab.updatecompanyinfo', {
            url: '/settingsPro/updatecompanyinfo',
            cache: false,
            views: {
                'tab-settings': {
                    templateUrl: 'templates/Connect/SettingPro/UpdateCompanyInfo.html',
                    controller: 'UpdateCompanyInfoCtrl'
                }
            }
        })

        .state('tab.updateAssociationinfo', {
            url: '/settingsAssociation/updateAssociationinfo',
            cache: false,
            views: {
                'tab-settings': {
                    templateUrl: 'templates/Connect/SettingAssociation/UpdateAsssociationInfo.html',
                    controller: 'UpdateAssociationInfoCtrl'
                }
            }
        })











        

        .state('tab.Logo', {
            url: '/settingsPro/Logo',
            views: {
                'tab-settings': {
                    templateUrl: 'templates/Connect/Settings/PhotoProfile.html',
                    controller: 'LogoCtrl'
                }
            }
        })
        .state('tab.Cover', {
            url: '/settingsPro/Cover',
            views: {
                'tab-settings': {
                    templateUrl: 'templates/Connect/Settings/PhotoProfile.html',
                    controller: 'CoverCtrl'
                }
            }
        }) 
        
        
        .state('tab.ChangeCompanyEmail', {
            url: '/settingsPro/ChangeCompanyEmail',
            cache: false,
            views: {
                'tab-settings': {
                    templateUrl: 'templates/Connect/SettingPro/ChangeEmail.html',
                    controller: 'ChangeCompanyEmailCtrl'
                }
            }
        })
        .state('tab.ChangePhonehq', {
            url: '/settingsPro/changephonehq',
            views: {
                'tab-settings': {
                    templateUrl: 'templates/Connect/SettingPro/ChangePhone.html',
                    controller: 'ChangePhonehqCtrl'
                }
            }
        })
        .state('tab.ChangePhoneshop', {
            url: '/settingsPro/changephoneshop',
            views: {
                'tab-settings': {
                    templateUrl: 'templates/Connect/SettingPro/ChangePhone.html',
                    controller: 'ChangePhoneshopCtrl'
                }
            }
        })
        .state('tab.ChangePhonemobile', {
            url: '/settingsPro/changephonemobile',
            views: {
                'tab-settings': {
                    templateUrl: 'templates/Connect/SettingPro/ChangePhone.html',
                    controller: 'ChangePhonemobileCtrl'
                }
            }
        })
        .state('tab.SmsCodePro', {
            url: '/settingsPro/smscode',
            views: {
                'tab-settings': {
                    templateUrl: 'templates/Connect/Settings/SmsCode.html',
                    controller: 'ChangePhonemobileCtrl'
                }
            }
        })
        .state('tab.hqaddress', {
                url: '/settingsPro/hqaddress',
                views: {
                    'tab-settings': {
                        templateUrl: 'templates/Connect/Settings/LocalAddress.html',
                        controller: 'HqAddressCtrl'
                    }
                }
        })  
        .state('tab.shopaddress', {
                url: '/settingsPro/shopaddress',
                views: {
                    'tab-settings': {
                        templateUrl: 'templates/Connect/Settings/LocalAddress.html',
                        controller: 'ShopAddressCtrl'
                    }
                }
        })
        .state('tab.ChangeContactEmail', {
            url: '/settingsPro/ChangeContactEmail',
            cache: false,
            views: {
                'tab-settings': {
                    templateUrl: 'templates/Connect/SettingPro/ChangeEmail.html',
                    controller: 'ChangeContactEmailCtrl'
                }
            }
        }) 
        .state('tab.ChangePasswordPro', {
            url: '/settingsPro/changepassword',
            views: {
                'tab-settings': {
                    templateUrl: 'templates/Connect/Settings/ChangePassword.html',
                    controller: 'SettingsProCtrl'
                }
            }
        })
        .state('tab.SmsCodePwdPro', {
            url: '/settingsPro/smscodepwd',
            views: {
                'tab-settings': {
                    templateUrl: 'templates/Connect/Settings/SmsCodePwd.html',
                    controller: 'SettingsProCtrl'
                }
            }
        })
        .state('tab.ChangeQuestionsPro', {
            url: '/settingsPro/changequestions',
            cache:false,
            views: {
                'tab-settings': {
                    templateUrl: 'templates/Connect/Settings/ChangeQuestions.html',
                    controller: 'SettingsProCtrl'
                }
            }
        }) 
         
        .state('tab.Businessaddress', {
                url: '/settingsPro/Businessaddress',
                views: {
                    'tab-settings': {
                        templateUrl: 'templates/Connect/Settings/LocalAddress.html',
                        controller: 'BusinessaddressAddressCtrl'
                    }
                }
        })  
        .state('tab.validatecomptepro', {
            url: '/validatecomptepro',
            views: {
                'tab-settings': {
                    templateUrl: 'templates/Connect/SettingPro/ValidateComptePro.html',
                    controller: 'ValidateCompteProCtrl'
                }
            }
        }) 

        .state('tab.verifyshopaddress', {
            url: '/verifyshopaddress',
            views: {
                'tab-settings': {
                    templateUrl: 'templates/Connect/SettingPro/VerifyShopAddress.html',
                    controller: 'VerifyShopAddressCtrl'
                }
            }
        }).state('tab.verifyheadquarteraddress', {
            url: '/verifyheadquarteraddress',
            views: {
                'tab-settings': {
                    templateUrl: 'templates/Connect/SettingPro/VerifyHeadquarterAddress.html',
                    controller: 'VerifyHeadquarterAddressCtrl'
                }
            }
        })
        .state('tab.validateAddressHQ', {
            url: '/validateAddressHQ',
            views: {
                'tab-settings': {
                    templateUrl: 'templates/Connect/SettingPro/validateAddressHQ.html',
                    controller: 'validateAddressHQCtrl'
                }
            }
        })
        .state('tab.validateshopaddress', {
            url: '/validateshopaddress',
            views: {
                'tab-settings': {
                    templateUrl: 'templates/Connect/SettingPro/ValidateShopAddress.html',
                    controller: 'ValidateShopAddressCtrl'
                }
            }
        
        }) 
        .state('tab.letterofauthorisation', {
            url: '/letterofauthorisation',
            cache: false,
            views: {
                'tab-settings': {
                    templateUrl: 'templates/Connect/SettingPro/LetterOfAuthorisation.html',
                    controller: 'LetterOfAuthorisationCtrl'
                }
            }
        
        })

        .state('tab.letterofauthorisationAssoc', {
            url: '/letterofauthorisationAssoc',
            views: {
                'tab-settings': {
                    templateUrl: 'templates/Connect/SettingAssociation/letterofauthorisation.html',
                    controller: 'LetterOfAuthorisationCtrl'
                }
            } 
        })

        .state('tab.AddUserForshopPersonalInfos', {
            url: '/AddUserForshopPersonalInfos', 
            views: {
                'tab-settings': {
                    templateUrl: 'templates/Connect/SettingPro/capital-social/sign-up.html',
                    controller: 'AddUserForshopPersonalInfos'
                }
            }
        
        })

        .state('tab.AddUserForshopLocaladdress', {
            url: '/AddUserForshopLocaladdress',  
            views: {
                'tab-settings': {
                    templateUrl: 'templates/Connect/SettingPro/capital-social/localAddress.html',
                    controller: 'AddUserForshopLocaladdress'
                }
            }
        
        })

        .state('tab.AddUserForshopPhoneNumber', {
            url: '/AddUserForshopPhoneNumber', 
            views: {
                'tab-settings': {
                    templateUrl: 'templates/Connect/SettingPro/capital-social/enterphone.html',
                    controller: 'AddUserForshopPhoneNumber'
                }
            }
        
        })

        .state('tab.AddUserForshopValidationDocuments', {
            url: '/AddUserForshopValidationDocuments', 
            cache: false,
            views: {
                'tab-settings': {
                    templateUrl: 'templates/Connect/SettingPro/capital-social/documents.html',
                    controller: 'AddUserForshopValidationDocuments'
                }
            } 
        })

        
        .state('tab.businessinformations-type', {
            url: '/businessinformations-type',
            views: {
                'tab-settings': {
                    templateUrl: 'templates/Connect/SettingPro/BusinessInformations-type.html',
                    controller: 'businessinformations-typeCtrl'
                }
            } 
        })
        .state('tab.businessinformations-typeAssociation', {
            url: '/businessinformations-typeAssociation',
            views: {
                'tab-settings': {
                    templateUrl: 'templates/Connect/SettingAssociation/BusinessInformations-typeAssociation.html',
                    controller: 'businessinformations-typeCtrl'
                }
            }
        
        })
        .state('tab.businessinformations-vat', {
            url: '/businessinformations-vat',
            views: {
                'tab-settings': {
                    templateUrl: 'templates/Connect/SettingPro/BusinessInformations-vat.html',
                    controller: 'businessinformations-vatCtrl'
                }
            }
        
        })
        
        .state('tab.businessinformations-cat', {
            url: '/businessinformations-cat',
            views: {
                'tab-settings': {
                    templateUrl: 'templates/Connect/SettingPro/BusinessInformations-cat.html',
                    controller: 'businessinformations-catCtrl'
                }
            }
        
        })

        .state('tab.businessinformations-catAssociation', {
            url: '/businessinformations-catAssociation',
            views: {
                'tab-settings': {
                    templateUrl: 'templates/Connect/SettingAssociation/BusinessInformations-catAssociation.html',
                    controller: 'businessinformations-catAssociationCtrl'
                }
            }
        
        })

        .state('tab.ape_naf', {
            url: '/ape_naf',
            views: {
                'tab-settings': {
                    templateUrl: 'templates/Connect/SettingPro/ape_naf.html',
                    controller: 'ape_nafCtrl'
                }
            }
        
        }) 

        .state('tab.managebusinesspimaccount', {
            url: '/managebusinesspimaccount',
            views: {
                'tab-settings': {
                    templateUrl: 'templates/Connect/SettingPro/ManageBusinessPimAccount.html',
                    controller: 'ManageBusinessPimAccountCtrl'
                }
            }
        
        })  

        .state('tab.addprofile', {
            url: '/addprofile',
            views: {
                'tab-settings': {
                    templateUrl: 'templates/Connect/addprofile.html',
                    controller: 'SignInCtrl'
                }
            }
        
        }) 

        .state('tab.treezor', {
            url: '/treezor',
            views: {
                'tab-home': {
                    templateUrl: 'templates/Connect/treezor/index.html',
                    controller: 'treezorCtrl'
                }
            }
        
        }) 



        //////// Capital social
        .state('tab.capital-social', {
            url: '/capital-social',
            cache: false,
            views: {
                'tab-settings': {
                    templateUrl: 'templates/Connect/SettingPro/capital-social/index.html',
                    controller: 'capitalSocialCtrl'
                }
            }
        
        })

        .state('tab.capital-social-update-personal-infos', {
            url: '/capital-social-update-personal-infos/:type/:index',
            views: {
                'tab-settings': {
                    templateUrl: 'templates/Connect/SettingPro/capital-social/PesonnalInformation.html',
                    controller: 'capitalSocialUpdateInfosCtrl'
                }
            }
        
        })

        .state('tab.capital-social-update-address', {
            url: '/capital-social-update-address/:type/:index',
            views: {
                'tab-settings': {
                    templateUrl: 'templates/Connect/Settings/LocalAddress.html',
                    controller: 'capitalSocialUpdateAddressCtrl'
                }
            }
        
        })

        .state('tab.capital-social-update-mail', {
            url: '/capital-social-update-mail/:type/:index',
            views: {
                'tab-settings': {
                    templateUrl: 'templates/Connect/Settings/ChangeEmail.html',
                    controller: 'capitalSocialUpdateMailCtrl'
                }
            }
        
        })

        .state('tab.capital-social-update-phone', {
            url: '/capital-social-update-phone/:type/:index',
            views: {
                'tab-settings': {
                    templateUrl: 'templates/Connect/SettingPro/capital-social/enterphone.html',
                    controller: 'capitalSocialUpdatePhoneCtrl'
                }
            }
        
        })



 










 
    if( parseInt( window.localStorage.getItem('loged') )  == 1 ){
        $urlRouterProvider.otherwise('/tab/home');   
    }else{
        $urlRouterProvider.otherwise('/sign-in');  
    }
});