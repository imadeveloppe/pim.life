angular.module('pim.utils', [])

.factory('$storage', ['$window', function($window) {
    return {
        set: function(key, value) {
            $window.localStorage[key] = value;
        },
        get: function(key, defaultValue) {
            return $window.localStorage[key] || defaultValue;
        },
        setObject: function(key, value) {
            $window.localStorage[key] = JSON.stringify(value);
        },
        getObject: function(key) {
            return JSON.parse($window.localStorage[key] || '{}');
        },
        setArrayOfObjects: function(key, value) { 
            $window.localStorage[key] = JSON.stringify(value);
        },
        getArrayOfObjects: function(key) {
            return JSON.parse($window.localStorage[key] || '[]');
        }

    }
}])

.filter('num', function() {
    return function(input) {
      return parseFloat(input);
    }
})

.factory('ValidationImage', ['$window', function($window) {
    return {
        set: function(key, value) {
            $window.localStorage[key] = value;
        },
        get: function(key) {
            data = $window.localStorage[key];
            if (data) {
                return data;
            }else{
                return '';
            }
        }
    }
}])

var getRandomColor = function(){
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

var RandomColor = function () { 
    var o = Math.round, r = Math.random, s = 255;
    return 'rgba(' + o(r()*s) + ',' + o(r()*s) + ',' + o(r()*s) + ',' + r().toFixed(1) + ')';
}

var isNumeric = function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

var number_format =  function(number, decimals, dec_point, thousands_sep) {
    // Strip all characters but numerical ones.
    number = (number + '').replace(/[^0-9+\-Ee.]/g, '');
    var n = !isFinite(+number) ? 0 : +number,
        prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
        sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
        dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
        s = '',
        toFixedFix = function (n, prec) {
            var k = Math.pow(10, prec);
            return '' + Math.round(n * k) / k;
        };
    // Fix for IE parseFloat(0.55).toFixed(0) = 0;
    s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
    if (s[0].length > 3) {
        s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
    }
    if ((s[1] || '').length < prec) {
        s[1] = s[1] || '';
        s[1] += new Array(prec - s[1].length + 1).join('0');
    }
    return s.join(dec);
} 

var str_replace = function (search, replace, subject, countObj) { // eslint-disable-line camelcase
  //  discuss at: http://locutus.io/php/str_replace/
  // original by: Kevin van Zonneveld (http://kvz.io)
  // improved by: Gabriel Paderni
  // improved by: Philip Peterson
  // improved by: Simon Willison (http://simonwillison.net)
  // improved by: Kevin van Zonneveld (http://kvz.io)
  // improved by: Onno Marsman (https://twitter.com/onnomarsman)
  // improved by: Brett Zamir (http://brett-zamir.me)
  //  revised by: Jonas Raoni Soares Silva (http://www.jsfromhell.com)
  // bugfixed by: Anton Ongson
  // bugfixed by: Kevin van Zonneveld (http://kvz.io)
  // bugfixed by: Oleg Eremeev
  // bugfixed by: Glen Arason (http://CanadianDomainRegistry.ca)
  // bugfixed by: Glen Arason (http://CanadianDomainRegistry.ca)
  //    input by: Onno Marsman (https://twitter.com/onnomarsman)
  //    input by: Brett Zamir (http://brett-zamir.me)
  //    input by: Oleg Eremeev
  //      note 1: The countObj parameter (optional) if used must be passed in as a
  //      note 1: object. The count will then be written by reference into it's `value` property
  //   example 1: str_replace(' ', '.', 'Kevin van Zonneveld')
  //   returns 1: 'Kevin.van.Zonneveld'
  //   example 2: str_replace(['{name}', 'l'], ['hello', 'm'], '{name}, lars')
  //   returns 2: 'hemmo, mars'
  //   example 3: str_replace(Array('S','F'),'x','ASDFASDF')
  //   returns 3: 'AxDxAxDx'
  //   example 4: var countObj = {}
  //   example 4: str_replace(['A','D'], ['x','y'] , 'ASDFASDF' , countObj)
  //   example 4: var $result = countObj.value
  //   returns 4: 4

  var i = 0
  var j = 0
  var temp = ''
  var repl = ''
  var sl = 0
  var fl = 0
  var f = [].concat(search)
  var r = [].concat(replace)
  var s = subject
  var ra = Object.prototype.toString.call(r) === '[object Array]'
  var sa = Object.prototype.toString.call(s) === '[object Array]'
  s = [].concat(s)

  var $global = (typeof window !== 'undefined' ? window : global)
  $global.$locutus = $global.$locutus || {}
  var $locutus = $global.$locutus
  $locutus.php = $locutus.php || {}

  if (typeof (search) === 'object' && typeof (replace) === 'string') {
    temp = replace
    replace = []
    for (i = 0; i < search.length; i += 1) {
      replace[i] = temp
    }
    temp = ''
    r = [].concat(replace)
    ra = Object.prototype.toString.call(r) === '[object Array]'
  }

  if (typeof countObj !== 'undefined') {
    countObj.value = 0
  }

  for (i = 0, sl = s.length; i < sl; i++) {
    if (s[i] === '') {
      continue
    }
    for (j = 0, fl = f.length; j < fl; j++) {
      temp = s[i] + ''
      repl = ra ? (r[j] !== undefined ? r[j] : '') : r[0]
      s[i] = (temp).split(f[j]).join(repl)
      if (typeof countObj !== 'undefined') {
        countObj.value += ((temp.split(f[j])).length - 1)
      }
    }
  }
  return sa ? s : s[0]
}

var generateLoremIpsum = function(len) {
    var words = ['lorem',
                                        'ipsum',
                                        'dolor',
                                        'sit',
                                        'amet',
                                        'consectetur',
                                        'adipiscing',
                                        'elit',
                                        'curabitur',
                                        'vel',
                                        'hendrerit',
                                        'libero',
                                        'eleifend',
                                        'blandit',
                                        'nunc',
                                        'ornare',
                                        'odio',
                                        'ut',
                                        'orci',
                                        'gravida',
                                        'imperdiet',
                                        'nullam',
                                        'purus',
                                        'lacinia',
                                        'a',
                                        'pretium',
                                        'quis',
                                        'congue',
                                        'praesent',
                                        'sagittis',
                                        'laoreet',
                                        'auctor',
                                        'mauris',
                                        'non',
                                        'velit',
                                        'eros',
                                        'dictum',
                                        'proin',
                                        'accumsan',
                                        'sapien',
                                        'nec',
                                        'massa',
                                        'volutpat',
                                        'venenatis',
                                        'sed',
                                        'eu',
                                        'molestie',
                                        'lacus',
                                        'quisque',
                                        'porttitor',
                                        'ligula',
                                        'dui',
                                        'mollis',
                                        'tempus',
                                        'at',
                                        'magna',
                                        'vestibulum',
                                        'turpis',
                                        'ac',
                                        'diam',
                                        'tincidunt',
                                        'id',
                                        'condimentum',
                                        'enim',
                                        'sodales',
                                        'in',
                                        'hac',
                                        'habitasse',
                                        'platea',
                                        'dictumst',
                                        'aenean',
                                        'neque',
                                        'fusce',
                                        'augue',
                                        'leo',
                                        'eget',
                                        'semper',
                                        'mattis',
                                        'tortor',
                                        'scelerisque',
                                        'nulla',
                                        'interdum',
                                        'tellus',
                                        'malesuada',
                                        'rhoncus',
                                        'porta',
                                        'sem',
                                        'aliquet',
                                        'et',
                                        'nam',
                                        'suspendisse',
                                        'potenti',
                                        'vivamus',
                                        'luctus',
                                        'fringilla',
                                        'erat',
                                        'donec',
                                        'justo',
                                        'vehicula',
                                        'ultricies',
                                        'varius',
                                        'ante',
                                        'primis',
                                        'faucibus',
                                        'ultrices',
                                        'posuere',
                                        'cubilia',
                                        'curae',
                                        'etiam',
                                        'cursus',
                                        'aliquam',
                                        'quam',
                                        'dapibus',
                                        'nisl',
                                        'feugiat',
                                        'egestas',
                                        'class',
                                        'aptent',
                                        'taciti',
                                        'sociosqu',
                                        'ad',
                                        'litora',
                                        'torquent',
                                        'per',
                                        'conubia',
                                        'nostra',
                                        'inceptos',
                                        'himenaeos',
                                        'phasellus',
                                        'nibh',
                                        'pulvinar',
                                        'vitae',
                                        'urna',
                                        'iaculis',
                                        'lobortis',
                                        'nisi',
                                        'viverra',
                                        'arcu',
                                        'morbi',
                                        'pellentesque',
                                        'metus',
                                        'commodo',
                                        'ut',
                                        'facilisis',
                                        'felis',
                                        'tristique',
                                        'ullamcorper',
                                        'placerat',
                                        'aenean',
                                        'convallis',
                                        'sollicitudin',
                                        'integer',
                                        'rutrum',
                                        'duis',
                                        'est',
                                        'etiam',
                                        'bibendum',
                                        'donec',
                                        'pharetra',
                                        'vulputate',
                                        'maecenas',
                                        'mi',
                                        'fermentum',
                                        'consequat',
                                        'suscipit',
                                        'aliquam',
                                        'habitant',
                                        'senectus',
                                        'netus',
                                        'fames',
                                        'quisque',
                                        'euismod',
                                        'curabitur',
                                        'lectus',
                                        'elementum',
                                        'tempor',
                                        'risus',
                                        'cras'
                                    ];
    var wordCount = (len > words.length) ? (words.length - 1) : len;
    var extracted = [];

    for (var i = 0; i < wordCount; i++) {

        var word = Math.floor(Math.random() * words.length);

        extracted[i] = words[word];


    }

    return extracted.join(' ');

};