angular.module('pim.constant', []) 

.value("DATA", {
    badgeCount: 0,
    Nbr_notif: 0,
    token: '',
    version: '',
    logo:''
})
///////////////////// PIM LOCAL //////////////////////////////////
// .constant('API', {
//     url: "http://dev.pim.com/api/index.php",
//     server: "http://dev.pim.com/",
//     devise: "€",
//     minAmount: 0.1
//
// })
// .constant('ALGOLIA', {
//     APPLICATION_ID: '5QS4R9I04P',
//     SEARCH_ONLY_API_KEY: 'b9c5aaa7ac32c5508c3e74802fbc45ff'
// })
// ////////////////////////////////////////////////////////////////

// ///////////////////// OVH DEV //////////////////////////////////
// .constant('API', {
//     url: "http://vps242401.ovh.net/api/index.php",
//     server: "http://vps242401.ovh.net/",
//     devise: "€",
//     minAmount: 0.1
// })
// .constant('ALGOLIA', {
//     APPLICATION_ID: '5QS4R9I04P',
//     SEARCH_ONLY_API_KEY: 'b9c5aaa7ac32c5508c3e74802fbc45ff'
// })
// ////////////////////////////////////////////////////////////////



// ///////////////////// OVH PROD //////////////////////////////////
.constant('API', {
    url: "https://dev.pim.life/api/index.php",
    server: "https://dev.pim.life/",
    devise: "€",
    minAmount: 0.1

})
.constant('ALGOLIA', {
    APPLICATION_ID: '5QS4R9I04P',
    SEARCH_ONLY_API_KEY: 'b9c5aaa7ac32c5508c3e74802fbc45ff'
})
// //////////////////////////////////////////////////////////////// 


// ///////////////////// AWS - Preprod ////////////////////////////
    // .constant('API', {
    //     url: "https://preprod.pim.life/api/index.php",
    //     server: "https://preprod.pim.life/",
    //     devise: "€",
    //     minAmount: 0.1

    // })
    // .constant('ALGOLIA', {
    //     APPLICATION_ID: '5QS4R9I04P',
    //     SEARCH_ONLY_API_KEY: 'b9c5aaa7ac32c5508c3e74802fbc45ff'
    // })
// ////////////////////////////////////////////////////////////////


// ///////////////////// AWS - Prod ////////////////////////////
    // .constant('API', {
    //     url: "http://prod.pim.life/api/index.php",
    //     server: "http://prod.pim.life/",
    //     devise: "€",
    //     minAmount: 0.1
    // })
    // .constant('ALGOLIA', {
    //     APPLICATION_ID: 'KCB10XUJYG',
    //     SEARCH_ONLY_API_KEY: 'cfd04cb2f5f50f8daf0c7881c338f25b'
    // })
// ////////////////////////////////////////////////////////////////
 
.constant('AUTH_EVENTS', {
    notAuthenticated: 'auth-not-authenticated',
    notAuthorized: 'auth-not-authorized'
}) 


.value('ResetePage', {
    go: 'home'
}) 

.constant('USER_ROLES', {
    admin: 'admin_role',
    public: 'public_role'
}) 
.constant('Icons', {
    Images_blanc: [{
        id: 1,
        src: 'img/BLANC/001.png'
    }, {
        id: 2,
        src: 'img/BLANC/002.png'
    }, {
        id: 3,
        src: 'img/BLANC/003.png'
    }, {
        id: 4,
        src: 'img/BLANC/004.png'
    }, {
        id: 5,
        src: 'img/BLANC/005.png'
    }, {
        id: 6,
        src: 'img/BLANC/006.png'
    }]
    ,

    Images_blue: [{
        id: 1,
        src: 'img/BLEU/001.png'
    }, {
        id: 2,
        src: 'img/BLEU/002.png'
    }, {
        id: 3,
        src: 'img/BLEU/003.png'
    }, {
        id: 4,
        src: 'img/BLEU/004.png'
    }, {
        id: 5,
        src: 'img/BLEU/005.png'
    }, {
        id: 6,
        src: 'img/BLEU/006.png'
    }],


})

.constant('Lists', {
    Indicatifs: [{
        id: "+49",
        view: "Allemagne (+49)"
    },{
        id: "+43",
        view: "Autriche (+43)"
    },{
        id: "+32",
        view: "Belgique (+32)"
    },{
        id: "+357",
        view: "Chypre (+357)"
    },{
        id: "+34",
        view: "Espagne (+34)"
    },{
        id: "+372",
        view: "Estonie (+372)"
    },{
        id: "+358",
        view: "Finlande (+358)"
    },{
        id: "+33",
        view: "France (+33)"
    },{
        id: "+30",
        view: "Grèce (+30)"
    },{
        id: "+353",
        view: "Irlande (+353)"
    },{
        id: "+39",
        view: "Italie (+39)"
    },{
        id: "+371",
        view: "Lettonie (+371)"
    },{
        id: "+370",
        view: "Lituanie (+370)"
    },{
        id: "+352",
        view: "Luxembourg (+352)"
    },{
        id: "+356",
        view: "Malte (+356)"
    },{
        id: "+31",
        view: "Pays-Bas (+31)"
    },{
        id: "+351",
        view: "Portugal (+351)"
    },{
        id: "+421",
        view: "Slovaquie (+421)"
    },{
        id: "+386",
        view: "Slovénie (+386)"
    },{
        id: "+376",
        view: "Andorre (+376)"
    },{
        id: "+383",
        view: "Kosovo (+383)"
    },{
        id: "+377",
        view: "Monaco (+377)"
    },{
        id: "+382",
        view: "Monténégro (+382)"
    },{
        id: "+378",
        view: "Saint-Marin (+378)"
    },{
        id: "+379",
        view: "Vatican (+379)"
    },{
        id: "+212",
        view: "Maroc (+212)"
    }],
    Countries: {
        fr: [
        {
          id:"fr",
          view:"Fran\u00e7aise"
        },
        {
          id:"ch",
          view:"Suisse"
        },
        {
          id:"be",
          view:"Belge"
        },
        {
          id:"de",
          view:"Allemande"
        },
        {
          id:"it",
          view:"Italienne"
        },
        {
          id:"af",
          view:"Afghane"
        },
        {
          id:"al",
          view:"Albanaise"
        },
        {
          id:"dz",
          view:"Algerienne"
        },
        {
          id:"us",
          view:"Americaine"
        },
        {
          id:"ad",
          view:"Andorrane"
        },
        {
          id:"ao",
          view:"Angolaise"
        },
        {
          id:"ag",
          view:"Antiguaise et barbudienne"
        },
        {
          id:"ar",
          view:"Argentine"
        },
        {
          id:"am",
          view:"Armenienne"
        },
        {
          id:"au",
          view:"Australienne"
        },
        {
          id:"at",
          view:"Autrichienne"
        },
        {
          id:"az",
          view:"Azerba\u00efdjanaise"
        },
        {
          id:"bs",
          view:"Bahamienne"
        },
        {
          id:"bh",
          view:"Bahreinienne"
        },
        {
          id:"bd",
          view:"Bangladaise"
        },
        {
          id:"bb",
          view:"Barbadienne"
        },
        {
          id:"bz",
          view:"Belizienne"
        },
        {
          id:"bj",
          view:"Beninoise"
        },
        {
          id:"bt",
          view:"Bhoutanaise"
        },
        {
          id:"by",
          view:"Bielorusse"
        },
        {
          id:"mm",
          view:"Birmane"
        },
        {
          id:"gw",
          view:"Bissau-Guin\u00e9enne"
        },
        {
          id:"bo",
          view:"Bolivienne"
        },
        {
          id:"ba",
          view:"Bosnienne"
        },
        {
          id:"bw",
          view:"Botswanaise"
        },
        {
          id:"br",
          view:"Bresilienne"
        },
        {
          id:"uk",
          view:"Britannique"
        },
        {
          id:"bn",
          view:"Bruneienne"
        },
        {
          id:"bg",
          view:"Bulgare"
        },
        {
          id:"bf",
          view:"Burkinabe"
        },
        {
          id:"bi",
          view:"Burundaise"
        },
        {
          id:"kh",
          view:"Cambodgienne"
        },
        {
          id:"cm",
          view:"Camerounaise"
        },
        {
          id:"ca",
          view:"Canadienne"
        },
        {
          id:"cv",
          view:"Cap-verdienne"
        },
        {
          id:"cf",
          view:"Centrafricaine"
        },
        {
          id:"cl",
          view:"Chilienne"
        },
        {
          id:"cn",
          view:"Chinoise"
        },
        {
          id:"cy",
          view:"Chypriote"
        },
        {
          id:"co",
          view:"Colombienne"
        },
        {
          id:"km",
          view:"Comorienne"
        },
        {
          id:"cg",
          view:"Congolaise"
        },
        {
          id:"cr",
          view:"Costaricaine"
        },
        {
          id:"hr",
          view:"Croate"
        },
        {
          id:"cu",
          view:"Cubaine"
        },
        {
          id:"dk",
          view:"Danoise"
        },
        {
          id:"dj",
          view:"Djiboutienne"
        },
        {
          id:"do",
          view:"Dominicaine"
        },
        {
          id:"dm",
          view:"Dominiquaise"
        },
        {
          id:"eg",
          view:"Egyptienne"
        },
        {
          id:"ae",
          view:"Emirienne"
        },
        {
          id:"gq",
          view:"Equato-guineenne"
        },
        {
          id:"ec",
          view:"Equatorienne"
        },
        {
          id:"er",
          view:"Erythreenne"
        },
        {
          id:"es",
          view:"Espagnole"
        },
        {
          id:"tl",
          view:"Est-timoraise"
        },
        {
          id:"ee",
          view:"Estonienne"
        },
        {
          id:"et",
          view:"Ethiopienne"
        },
        {
          id:"fj",
          view:"Fidjienne"
        },
        {
          id:"fi",
          view:"Finlandaise"
        },
        {
          id:"ga",
          view:"Gabonaise"
        },
        {
          id:"gm",
          view:"Gambienne"
        },
        {
          id:"ge",
          view:"Georgienne"
        },
        {
          id:"gh",
          view:"Ghaneenne"
        },
        {
          id:"gd",
          view:"Grenadienne"
        },
        {
          id:"gt",
          view:"Guatemalteque"
        },
        {
          id:"gn",
          view:"Guineenne"
        },
        {
          id:"gf",
          view:"Guyanienne"
        },
        {
          id:"ht",
          view:"Ha\u00eftienne"
        },
        {
          id:"gr",
          view:"Hellenique"
        },
        {
          id:"hn",
          view:"Hondurienne"
        },
        {
          id:"hu",
          view:"Hongroise"
        },
        {
          id:"in",
          view:"Indienne"
        },
        {
          id:"id",
          view:"Indonesienne"
        },
        {
          id:"iq",
          view:"Irakienne"
        },
        {
          id:"ie",
          view:"Irlandaise"
        },
        {
          id:"is",
          view:"Islandaise"
        },
        {
          id:"il",
          view:"Isra\u00e9lienne"
        },
        {
          id:"ci",
          view:"Ivoirienne"
        },
        {
          id:"jm",
          view:"Jama\u00efcaine"
        },
        {
          id:"jp",
          view:"Japonaise"
        },
        {
          id:"jo",
          view:"Jordanienne"
        },
        {
          id:"kz",
          view:"Kazakhstanaise"
        },
        {
          id:"ke",
          view:"Kenyane"
        },
        {
          id:"kg",
          view:"Kirghize"
        },
        {
          id:"ki",
          view:"Kiribatienne"
        },
        {
          id:"kn",
          view:"Kittitienne-et-nevicienne"
        },
        {
          id:"xk\u200b",
          view:"Kossovienne"
        },
        {
          id:"kw",
          view:"Koweitienne"
        },
        {
          id:"la",
          view:"Laotienne"
        },
        {
          id:"ls",
          view:"Lesothane"
        },
        {
          id:"lv",
          view:"Lettone"
        },
        {
          id:"lb",
          view:"Libanaise"
        },
        {
          id:"lr",
          view:"Liberienne"
        },
        {
          id:"ly",
          view:"Libyenne"
        },
        {
          id:"li",
          view:"Liechtensteinoise"
        },
        {
          id:"lt",
          view:"Lituanienne"
        },
        {
          id:"lu",
          view:"Luxembourgeoise"
        },
        {
          id:"mk",
          view:"Macedonienne"
        },
        {
          id:"my",
          view:"Malaisienne"
        },
        {
          id:"mw",
          view:"Malawienne"
        },
        {
          id:"mv",
          view:"Maldivienne"
        },
        {
          id:"mg",
          view:"Malgache"
        },
        {
          id:"ml",
          view:"Malienne"
        },
        {
          id:"mt",
          view:"Maltaise"
        },
        {
          id:"ma",
          view:"Marocaine"
        },
        {
          id:"mh",
          view:"Marshallaise"
        },
        {
          id:"mu",
          view:"Mauricienne"
        },
        {
          id:"mr",
          view:"Mauritanienne"
        },
        {
          id:"mx",
          view:"Mexicaine"
        },
        {
          id:"fm",
          view:"Micronesienne"
        },
        {
          id:"md",
          view:"Moldave"
        },
        {
          id:"mc",
          view:"Monegasque"
        },
        {
          id:"mn",
          view:"Mongole"
        },
        {
          id:"me",
          view:"Montenegrine"
        },
        {
          id:"mz",
          view:"Mozambicaine"
        },
        {
          id:"na",
          view:"Namibienne"
        },
        {
          id:"nr",
          view:"Nauruane"
        },
        {
          id:"nl",
          view:"Neerlandaise"
        },
        {
          id:"nz",
          view:"Neo-zelandaise"
        },
        {
          id:"np",
          view:"Nepalaise"
        },
        {
          id:"ni",
          view:"Nicaraguayenne"
        },
        {
          id:"ng",
          view:"Nigeriane"
        },
        {
          id:"ne",
          view:"Nigerienne"
        },
        {
          id:"kp",
          view:"Nord-cor\u00e9enne"
        },
        {
          id:"no",
          view:"Norvegienne"
        },
        {
          id:"om",
          view:"Omanaise"
        },
        {
          id:"ug",
          view:"Ougandaise"
        },
        {
          id:"uz",
          view:"Ouzbeke"
        },
        {
          id:"pk",
          view:"Pakistanaise"
        },
        {
          id:"pw",
          view:"Palau"
        },
        {
          id:"ps",
          view:"Palestinienne"
        },
        {
          id:"pa",
          view:"Panameenne"
        },
        {
          id:"pg",
          view:"Papouane-neoguineenne"
        },
        {
          id:"py",
          view:"Paraguayenne"
        },
        {
          id:"pe",
          view:"Peruvienne"
        },
        {
          id:"ph",
          view:"Philippine"
        },
        {
          id:"pl",
          view:"Polonaise"
        },
        {
          id:"pr",
          view:"Portoricaine"
        },
        {
          id:"pt",
          view:"Portugaise"
        },
        {
          id:"qa",
          view:"Qatarienne"
        },
        {
          id:"ro",
          view:"Roumaine"
        },
        {
          id:"ru",
          view:"Russe"
        },
        {
          id:"rw",
          view:"Rwandaise"
        },
        {
          id:"lc",
          view:"Saint-Lucienne"
        },
        {
          id:"sm",
          view:"Saint-Marinaise"
        },
        {
          id:"vc",
          view:"Saint-Vincentaise-et-Grenadine"
        },
        {
          id:"sb",
          view:"Salomonaise"
        },
        {
          id:"sv",
          view:"Salvadorienne"
        },
        {
          id:"ws",
          view:"Samoane"
        },
        {
          id:"st",
          view:"Santomeenne"
        },
        {
          id:"sa",
          view:"Saoudienne"
        },
        {
          id:"sn",
          view:"Senegalaise"
        },
        {
          id:"rs",
          view:"Serbe"
        },
        {
          id:"sc",
          view:"Seychelloise"
        },
        {
          id:"sl",
          view:"Sierra-leonaise"
        },
        {
          id:"sg",
          view:"Singapourienne"
        },
        {
          id:"sk",
          view:"Slovaque"
        },
        {
          id:"si",
          view:"Slovene"
        },
        {
          id:"so",
          view:"Somalienne"
        },
        {
          id:"sd",
          view:"Soudanaise"
        },
        {
          id:"lk",
          view:"Sri-lankaise"
        },
        {
          id:"za",
          view:"Sud-africaine"
        },
        {
          id:"kr",
          view:"Sud-cor\u00e9enne"
        },
        {
          id:"se",
          view:"Suedoise"
        },
        {
          id:"sr",
          view:"Surinamaise"
        },
        {
          id:"ze",
          view:"Swazie"
        },
        {
          id:"sy",
          view:"Syrienne"
        },
        {
          id:"tj",
          view:"Tadjike"
        },
        {
          id:"tw",
          view:"Taiwanaise"
        },
        {
          id:"tz",
          view:"Tanzanienne"
        },
        {
          id:"td",
          view:"Tchadienne"
        },
        {
          id:"cz",
          view:"Tcheque"
        },
        {
          id:"th",
          view:"Tha\u00eflandaise"
        },
        {
          id:"tg",
          view:"Togolaise"
        },
        {
          id:"tg",
          view:"Tonguienne"
        },
        {
          id:"tt",
          view:"Trinidadienne"
        },
        {
          id:"tn",
          view:"Tunisienne"
        },
        {
          id:"tm",
          view:"Turkmene"
        },
        {
          id:"tr",
          view:"Turque"
        },
        {
          id:"tv",
          view:"Tuvaluane"
        },
        {
          id:"ua",
          view:"Ukrainienne"
        },
        {
          id:"uy",
          view:"Uruguayenne"
        },
        {
          id:"vu",
          view:"Vanuatuane"
        },
        {
          id:"ve",
          view:"Venezuelienne"
        },
        {
          id:"vn",
          view:"Vietnamienne"
        },
        {
          id:"ye",
          view:"Yemenite"
        },
        {
          id:"zm",
          view:"Zambienne"
        },
        {
          id:"zw",
          view:"Zimbabweenne"
        }]
    }
})




.constant('Lists2', {
    Indicatifs: [{
        id: "+213",
        view: "Algeria (+213)"
    }, {
        id: "+376",
        view: "Andorra (+376)"
    }, {
        id: "+244",
        view: "Angola (+244)"
    }, {
        id: "+1264",
        view: "Anguilla (+1264)"
    }, {
        id: "+1268",
        view: "Antigua & Barbuda (+1268)"
    }, {
        id: "+54",
        view: "Argentina (+54)"
    }, {
        id: "+374",
        view: "Armenia (+374)"
    }, {
        id: "+297",
        view: "Aruba (+297)"
    }, {
        id: "+61",
        view: "Australia (+61)"
    }, {
        id: "+43",
        view: "Austria (+43)"
    }, {
        id: "+994",
        view: "Azerbaijan (+994)"
    }, {
        id: "+1242",
        view: "Bahamas (+1242)"
    }, {
        id: "+973",
        view: "Bahrain (+973)"
    }, {
        id: "+880",
        view: "Bangladesh (+880)"
    }, {
        id: "+1246",
        view: "Barbados (+1246)"
    }, {
        id: "+375",
        view: "Belarus (+375)"
    }, {
        id: "+32",
        view: "Belgium (+32)"
    }, {
        id: "+501",
        view: "Belize (+501)"
    }, {
        id: "+229",
        view: "Benin (+229)"
    }, {
        id: "+1441",
        view: "Bermuda (+1441)"
    }, {
        id: "+975",
        view: "Bhutan (+975)"
    }, {
        id: "+591",
        view: "Bolivia (+591)"
    }, {
        id: "+387",
        view: "Bosnia Herzegovina (+387)"
    }, {
        id: "+267",
        view: "Botswana (+267)"
    }, {
        id: "+55",
        view: "Brazil (+55)"
    }, {
        id: "+673",
        view: "Brunei (+673)"
    }, {
        id: "+359",
        view: "Bulgaria (+359)"
    }, {
        id: "+226",
        view: "Burkina Faso (+226)"
    }, {
        id: "+257",
        view: "Burundi (+257)"
    }, {
        id: "+855",
        view: "Cambodia (+855)"
    }, {
        id: "+237",
        view: "Cameroon (+237)"
    }, {
        id: "+1",
        view: "Canada (+1)"
    }, {
        id: "+238",
        view: "Cape Verde Islands (+238)"
    }, {
        id: "+1345",
        view: "Cayman Islands (+1345)"
    }, {
        id: "+236",
        view: "Central African Republic (+236)"
    }, {
        id: "+56",
        view: "Chile (+56)"
    }, {
        id: "+86",
        view: "China (+86)"
    }, {
        id: "+57",
        view: "Colombia (+57)"
    }, {
        id: "+269",
        view: "Comoros (+269)"
    }, {
        id: "+242",
        view: "Congo (+242)"
    }, {
        id: "+682",
        view: "Cook Islands (+682)"
    }, {
        id: "+506",
        view: "Costa Rica (+506)"
    }, {
        id: "+385",
        view: "Croatia (+385)"
    }, {
        id: "+53",
        view: "Cuba (+53)"
    }, {
        id: "+90392",
        view: "Cyprus North (+90392)"
    }, {
        id: "+357",
        view: "Cyprus South (+357)"
    }, {
        id: "+42",
        view: "Czech Republic (+42)"
    }, {
        id: "+45",
        view: "Denmark (+45)"
    }, {
        id: "+253",
        view: "Djibouti (+253)"
    }, {
        id: "+1809",
        view: "Dominica (+1809)"
    }, {
        id: "+1809",
        view: "Dominican Republic (+1809)"
    }, {
        id: "+593",
        view: "Ecuador (+593)"
    }, {
        id: "+20",
        view: "Egypt (+20)"
    }, {
        id: "+503",
        view: "El Salvador (+503)"
    }, {
        id: "+240",
        view: "Equatorial Guinea (+240)"
    }, {
        id: "+291",
        view: "Eritrea (+291)"
    }, {
        id: "+372",
        view: "Estonia (+372)"
    }, {
        id: "+251",
        view: "Ethiopia (+251)"
    }, {
        id: "+500",
        view: "Falkland Islands (+500)"
    }, {
        id: "+298",
        view: "Faroe Islands (+298)"
    }, {
        id: "+679",
        view: "Fiji (+679)"
    }, {
        id: "+358",
        view: "Finland (+358)"
    }, {
        id: "+33",
        view: "France (+33)"
    }, {
        id: "+594",
        view: "French Guiana (+594)"
    }, {
        id: "+689",
        view: "French Polynesia (+689)"
    }, {
        id: "+241",
        view: "Gabon (+241)"
    }, {
        id: "+220",
        view: "Gambia (+220)"
    }, {
        id: "+7880",
        view: "Georgia (+7880)"
    }, {
        id: "+49",
        view: "Germany (+49)"
    }, {
        id: "+233",
        view: "Ghana (+233)"
    }, {
        id: "+350",
        view: "Gibraltar (+350)"
    }, {
        id: "+30",
        view: "Greece (+30)"
    }, {
        id: "+299",
        view: "Greenland (+299)"
    }, {
        id: "+1473",
        view: "Grenada (+1473)"
    }, {
        id: "+590",
        view: "Guadeloupe (+590)"
    }, {
        id: "+671",
        view: "Guam (+671)"
    }, {
        id: "+502",
        view: "Guatemala (+502)"
    }, {
        id: "+224",
        view: "Guinea (+224)"
    }, {
        id: "+245",
        view: "Guinea - Bissau (+245)"
    }, {
        id: "+592",
        view: "Guyana (+592)"
    }, {
        id: "+509",
        view: "Haiti (+509)"
    }, {
        id: "+504",
        view: "Honduras (+504)"
    }, {
        id: "+852",
        view: "Hong Kong (+852)"
    }, {
        id: "+36",
        view: "Hungary (+36)"
    }, {
        id: "+354",
        view: "Iceland (+354)"
    }, {
        id: "+91",
        view: "India (+91)"
    }, {
        id: "+62",
        view: "Indonesia (+62)"
    }, {
        id: "+98",
        view: "Iran (+98)"
    }, {
        id: "+964",
        view: "Iraq (+964)"
    }, {
        id: "+353",
        view: "Ireland (+353)"
    }, {
        id: "+972",
        view: "Israel (+972)"
    }, {
        id: "+39",
        view: "Italy (+39)"
    }, {
        id: "+1876",
        view: "Jamaica (+1876)"
    }, {
        id: "+81",
        view: "Japan (+81)"
    }, {
        id: "+962",
        view: "Jordan (+962)"
    }, {
        id: "+7",
        view: "Kazakhstan (+7)"
    }, {
        id: "+254",
        view: "Kenya (+254)"
    }, {
        id: "+686",
        view: "Kiribati (+686)"
    }, {
        id: "+850",
        view: "Korea North (+850)"
    }, {
        id: "+82",
        view: "Korea South (+82)"
    }, {
        id: "+965",
        view: "Kuwait (+965)"
    }, {
        id: "+996",
        view: "Kyrgyzstan (+996)"
    }, {
        id: "+856",
        view: "Laos (+856)"
    }, {
        id: "+371",
        view: "Latvia (+371)"
    }, {
        id: "+961",
        view: "Lebanon (+961)"
    }, {
        id: "+266",
        view: "Lesotho (+266)"
    }, {
        id: "+231",
        view: "Liberia (+231)"
    }, {
        id: "+218",
        view: "Libya (+218)"
    }, {
        id: "+417",
        view: "Liechtenstein (+417)"
    }, {
        id: "+370",
        view: "Lithuania (+370)"
    }, {
        id: "+352",
        view: "Luxembourg (+352)"
    }, {
        id: "+853",
        view: "Macao (+853)"
    }, {
        id: "+389",
        view: "Macedonia (+389)"
    }, {
        id: "+261",
        view: "Madagascar (+261)"
    }, {
        id: "+265",
        view: "Malawi (+265)"
    }, {
        id: "+60",
        view: "Malaysia (+60)"
    }, {
        id: "+960",
        view: "Maldives (+960)"
    }, {
        id: "+223",
        view: "Mali (+223)"
    }, {
        id: "+356",
        view: "Malta (+356)"
    }, {
        id: "+692",
        view: "Marshall Islands (+692)"
    }, {
        id: "+596",
        view: "Martinique (+596)"
    }, {
        id: "+222",
        view: "Mauritania (+222)"
    }, {
        id: "+269",
        view: "Mayotte (+269)"
    }, {
        id: "+52",
        view: "Mexico (+52)"
    }, {
        id: "+691",
        view: "Micronesia (+691)"
    }, {
        id: "+373",
        view: "Moldova (+373)"
    }, {
        id: "+377",
        view: "Monaco (+377)"
    }, {
        id: "+976",
        view: "Mongolia (+976)"
    }, {
        id: "+1664",
        view: "Montserrat (+1664)"
    }, {
        id: "+212",
        view: "Morocco (+212)"
    }, {
        id: "+258",
        view: "Mozambique (+258)"
    }, {
        id: "+95",
        view: "Myanmar (+95)"
    }, {
        id: "+264",
        view: "Namibia (+264)"
    }, {
        id: "+674",
        view: "Nauru (+674)"
    }, {
        id: "+977",
        view: "Nepal (+977)"
    }, {
        id: "+31",
        view: "Netherlands (+31)"
    }, {
        id: "+687",
        view: "New Caledonia (+687)"
    }, {
        id: "+64",
        view: "New Zealand (+64)"
    }, {
        id: "+505",
        view: "Nicaragua (+505)"
    }, {
        id: "+227",
        view: "Niger (+227)"
    }, {
        id: "+234",
        view: "Nigeria (+234)"
    }, {
        id: "+683",
        view: "Niue (+683)"
    }, {
        id: "+672",
        view: "Norfolk Islands (+672)"
    }, {
        id: "+670",
        view: "Northern Marianas (+670)"
    }, {
        id: "+47",
        view: "Norway (+47)"
    }, {
        id: "+968",
        view: "Oman (+968)"
    }, {
        id: "+680",
        view: "Palau (+680)"
    }, {
        id: "+507",
        view: "Panama (+507)"
    }, {
        id: "+675",
        view: "Papua New Guinea (+675)"
    }, {
        id: "+595",
        view: "Paraguay (+595)"
    }, {
        id: "+51",
        view: "Peru (+51)"
    }, {
        id: "+63",
        view: "Philippines (+63)"
    }, {
        id: "+48",
        view: "Poland (+48)"
    }, {
        id: "+351",
        view: "Portugal (+351)"
    }, {
        id: "+1787",
        view: "Puerto Rico (+1787)"
    }, {
        id: "+974",
        view: "Qatar (+974)"
    }, {
        id: "+262",
        view: "Reunion (+262)"
    }, {
        id: "+40",
        view: "Romania (+40)"
    }, {
        id: "+7",
        view: "Russia (+7)"
    }, {
        id: "+250",
        view: "Rwanda (+250)"
    }, {
        id: "+378",
        view: "San Marino (+378)"
    }, {
        id: "+239",
        view: "Sao Tome & Principe (+239)"
    }, {
        id: "+966",
        view: "Saudi Arabia (+966)"
    }, {
        id: "+221",
        view: "Senegal (+221)"
    }, {
        id: "+381",
        view: "Serbia (+381)"
    }, {
        id: "+248",
        view: "Seychelles (+248)"
    }, {
        id: "+232",
        view: "Sierra Leone (+232)"
    }, {
        id: "+65",
        view: "Singapore (+65)"
    }, {
        id: "+421",
        view: "Slovak Republic (+421)"
    }, {
        id: "+386",
        view: "Slovenia (+386)"
    }, {
        id: "+677",
        view: "Solomon Islands (+677)"
    }, {
        id: "+252",
        view: "Somalia (+252)"
    }, {
        id: "+27",
        view: "South Africa (+27)"
    }, {
        id: "+34",
        view: "Spain (+34)"
    }, {
        id: "+94",
        view: "Sri Lanka (+94)"
    }, {
        id: "+290",
        view: "St. Helena (+290)"
    }, {
        id: "+1869",
        view: "St. Kitts (+1869)"
    }, {
        id: "+1758",
        view: "St. Lucia (+1758)"
    }, {
        id: "+249",
        view: "Sudan (+249)"
    }, {
        id: "+597",
        view: "Suriname (+597)"
    }, {
        id: "+268",
        view: "Swaziland (+268)"
    }, {
        id: "+46",
        view: "Sweden (+46)"
    }, {
        id: "+41",
        view: "Switzerland (+41)"
    }, {
        id: "+963",
        view: "Syria (+963)"
    }, {
        id: "+886",
        view: "Taiwan (+886)"
    }, {
        id: "+7",
        view: "Tajikstan (+7)"
    }, {
        id: "+66",
        view: "Thailand (+66)"
    }, {
        id: "+228",
        view: "Togo (+228)"
    }, {
        id: "+676",
        view: "Tonga (+676)"
    }, {
        id: "+1868",
        view: "Trinidad & Tobago (+1868)"
    }, {
        id: "+216",
        view: "Tunisia (+216)"
    }, {
        id: "+90",
        view: "Turkey (+90)"
    }, {
        id: "+7",
        view: "Turkmenistan (+7)"
    }, {
        id: "+993",
        view: "Turkmenistan (+993)"
    }, {
        id: "+1649",
        view: "Turks & Caicos Islands (+1649)"
    }, {
        id: "+688",
        view: "Tuvalu (+688)"
    }, {
        id: "+256",
        view: "Uganda (+256)"
    }, {
        id: "+44",
        view: "UK (+44)"
    }, {
        id: "+380",
        view: "Ukraine (+380)"
    }, {
        id: "+971",
        view: "United Arab Emirates (+971)"
    }, {
        id: "+598",
        view: "Uruguay (+598)"
    }, {
        id: "+1",
        view: "USA (+1)"
    }, {
        id: "+7",
        view: "Uzbekistan (+7)"
    }, {
        id: "+678",
        view: "Vanuatu (+678)"
    }, {
        id: "+379",
        view: "Vatican City (+379)"
    }, {
        id: "+58",
        view: "Venezuela (+58)"
    }, {
        id: "+84",
        view: "Vietnam (+84)"
    }, {
        id: "+1284",
        view: "Virgin Islands - British (+1284)"
    }, {
        id: "+1340",
        view: "Virgin Islands - US (+1340)"
    }, {
        id: "+681",
        view: "Wallis & Futuna (+681)"
    }, {
        id: "+969",
        view: "Yemen (North)(+969)"
    }, {
        id: "+967",
        view: "Yemen (South)(+967)"
    }, {
        id: "+260",
        view: "Zambia (+260)"
    }, {
        id: "+263",
        view: "Zimbabwe (+263)"
    }]
})

.constant('BASE64_LOGOS', {
    pim: "data:image/png;base64,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",
    treezor: "data:image/png;base64,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"

})