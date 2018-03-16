'use strict';

/*
 * spa.js
 * Root namespace module
 */

/*jslint           browser : true,   continue : true,
 devel  : true,    indent : 2,       maxerr  : 50,
 newcap : true,     nomen : true,   plusplus : true,
 regexp : true,    sloppy : true,       vars : false,
 white  : true
 */
/*global $, spa */

var spa = function () {
    'use strict';

    var initModule = function initModule($container) {
        spa.template.initModule(window.spa_templates.templates);
        spa.shell.initModule($container);
        spa.router.initModule($container);
    };

    return { initModule: initModule };
}();
'use strict';

/*
 * spa.util.js
 * General JavaScript utilities
 *
 * Michael S. Mikowski - mmikowski at gmail dot com
 * These are routines I have created, compiled, and updated
 * since 1998, with inspiration from around the web.
 *
 * MIT License
 *
*/

/*jslint          browser : true,  continue : true,
  devel  : true,  indent  : 2,     maxerr   : 50,
  newcap : true,  nomen   : true,  plusplus : true,
  regexp : true,  sloppy  : true,  vars     : false,
  white  : true
*/
/*global $, spa */

spa.util = function () {
  var makeError, _fetchFromObject, setConfigMap;

  _fetchFromObject = function fetchFromObject(obj, prop) {

    if (typeof obj === 'undefined') {
      return false;
    }

    var _index = prop.indexOf('.');
    if (_index > -1) {
      return _fetchFromObject(obj[prop.substring(0, _index)], prop.substr(_index + 1));
    }

    return obj[prop];
  };

  // Begin Public constructor /makeError/
  // Purpose: a convenience wrapper to create an error object
  // Arguments:
  //   * name_text - the error name
  //   * msg_text  - long error message
  //   * data      - optional data attached to error object
  // Returns  : newly constructed error object
  // Throws   : none
  //
  makeError = function makeError(name_text, msg_text, data) {
    var error = new Error();
    error.name = name_text;
    error.message = msg_text;

    if (data) {
      error.data = data;
    }

    return error;
  };
  // End Public constructor /makeError/

  // Begin Public method /setConfigMap/
  // Purpose: Common code to set configs in feature modules
  // Arguments:
  //   * input_map    - map of key-values to set in config
  //   * settable_map - map of allowable keys to set
  //   * config_map   - map to apply settings to
  // Returns: true
  // Throws : Exception if input key not allowed
  //
  setConfigMap = function setConfigMap(arg_map) {
    var input_map = arg_map.input_map,
        settable_map = arg_map.settable_map,
        config_map = arg_map.config_map,
        key_name,
        error;

    for (key_name in input_map) {
      if (input_map.hasOwnProperty(key_name)) {
        if (settable_map.hasOwnProperty(key_name)) {
          config_map[key_name] = input_map[key_name];
        } else {
          error = makeError('Bad Input', 'Setting config key |' + key_name + '| is not supported');
          throw error;
        }
      }
    }
  };
  // End Public method /setConfigMap/

  return {
    makeError: makeError,
    setConfigMap: setConfigMap,
    fetchFromObject: _fetchFromObject
  };
}();
'use strict';

/**
 * spa.util_b.js
 * JavaScript browser utilities
 *
 * Compiled by Michael S. Mikowski
 * These are routines I have created and updated
 * since 1998, with inspiration from around the web.
 * MIT License
*/

/*jslint         browser : true, continue : true,
  devel  : true, indent  : 2,    maxerr   : 50,
  newcap : true, nomen   : true, plusplus : true,
  regexp : true, sloppy  : true, vars     : false,
  white  : true
*/
/*global $, spa, getComputedStyle */

spa.util_b = function () {
  'use strict';
  //---------------- BEGIN MODULE SCOPE VARIABLES --------------

  var configMap = {
    regex_encode_html: /[&"'><]/g,
    regex_encode_noamp: /["'><]/g,
    html_encode_map: {
      '&': '&#38;',
      '"': '&#34;',
      "'": '&#39;',
      '>': '&#62;',
      '<': '&#60;'
    }
  },
      decodeHtml,
      encodeHtml,
      getEmSize,
      decodeArrayFromURIString;

  configMap.encode_noamp_map = $.extend({}, configMap.html_encode_map);
  delete configMap.encode_noamp_map['&'];
  //----------------- END MODULE SCOPE VARIABLES ---------------

  //------------------- BEGIN UTILITY METHODS ------------------
  // Begin decodeHtml
  // Decodes HTML entities in a browser-friendly way
  // See http://stackoverflow.com/questions/1912501/\
  //   unescape-html-entities-in-javascript
  //
  decodeHtml = function decodeHtml(str) {
    return $('<div/>').html(str || '').text();
  };
  // End decodeHtml


  // Begin encodeHtml
  // This is single pass encoder for html entities and handles
  // an arbitrary number of characters
  //
  encodeHtml = function encodeHtml(input_arg_str, exclude_amp) {
    var input_str = String(input_arg_str),
        regex,
        lookup_map;

    if (exclude_amp) {
      lookup_map = configMap.encode_noamp_map;
      regex = configMap.regex_encode_noamp;
    } else {
      lookup_map = configMap.html_encode_map;
      regex = configMap.regex_encode_html;
    }
    return input_str.replace(regex, function (match, name) {
      return lookup_map[match] || '';
    });
  };
  // End encodeHtml

  // Begin getEmSize
  // returns size of ems in pixels
  //
  getEmSize = function getEmSize(elem) {
    return Number(getComputedStyle(elem, '').fontSize.match(/\d*\.?\d*/)[0]);
  };
  // End getEmSize

  // Begin decodeArrayToURIComponent
  decodeArrayFromURIString = function decodeArrayFromURIString(uriString) {
    var result_array = [],
        parsed_uri_string,
        parsed_uri_string_keys;

    parsed_uri_string = JSON.parse('{"' + decodeURI(uriString).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"').replace(/\s/g, '') + '"}');
    parsed_uri_string_keys = Object.keys(parsed_uri_string); // ["cart[0][id]"]
    for (var i = 0; i < parsed_uri_string_keys.length; i++) {
      var _key, _index, _value;
      _index = parseInt(parsed_uri_string_keys[i].split('[')[1].slice(0, -1));
      _key = parsed_uri_string_keys[i].split('][')[1].slice(0, -1);
      _value = parsed_uri_string[parsed_uri_string_keys[i]];
      if (result_array.length === 0 || result_array.length <= _index) {
        result_array.push({});
      }

      result_array[_index][_key] = _value;
    }
    return result_array;
  };
  // End encodeArrayToURIComponent

  // export methods
  return {
    decodeHtml: decodeHtml,
    encodeHtml: encodeHtml,
    getEmSize: getEmSize,
    decodeArrayFromURIString: decodeArrayFromURIString
  };
  //------------------- END PUBLIC METHODS ---------------------
}();
'use strict';

/*
 * router.js
 * Router module for interfacing between spa and page.js library.
 *
 * Requires pagejs. Pagejs fires the related callback when a route has been activated.
 * If no callback has been provided the router takes the default callback.
 *
 *
 */
/*jslint browser : true, continue : true,
 devel : true, indent : 2, maxerr : 50,
 newcap : true, nomen : true, plusplus : true,
 regexp : true, sloppy : true, vars : false,
 white : true
 */
/*global $, spa, page */
spa.router = function () {
    //---------------- BEGIN MODULE SCOPE VARIABLES --------------
    var configMap = {
        settable_map: {}
    },
        stateMap = { $container: null },
        jqueryMap = {},
        setJqueryMap,
        showLoginPage,
        showHomepage,
        showGamePage,
        configModule,
        initModule;
    //----------------- END MODULE SCOPE VARIABLES ---------------


    //------------------- BEGIN UTILITY METHODS ------------------
    // example : getTrimmedString
    //-------------------- END UTILITY METHODS -------------------


    //--------------------- BEGIN DOM METHODS --------------------
    // Begin DOM method /setJqueryMap/
    setJqueryMap = function setJqueryMap() {
        var $container = stateMap.$container;
        jqueryMap = {
            $page_container: $container.find('.spa-shell-main-content')
        };
    };

    showLoginPage = function showLoginPage() {
        console.log('show login page...');
        var html = spa.template.parseTemplate('features.login.login', {});
        jqueryMap.$page_container.html(html);
        // console.log('verwachte exceptie:');
        // console.log("vendor.js:4266 Uncaught DOMException: Failed to execute 'pushState' on 'History': A history state object with URL...");
    };

    showHomepage = function showHomepage() {
        console.log('homepage');
        var html = spa.template.parseTemplate('features.homepage.homepage', {});
        jqueryMap.$page_container.html(html);
    };

    showGamePage = function showGamePage() {
        console.log('show game page...');
        var html = spa.template.parseTemplate('features.game.gamepage', {});
        jqueryMap.$page_container.html(html);
    };

    // End DOM method /setJqueryMap/
    //---------------------- END DOM METHODS ---------------------


    //------------------- BEGIN EVENT HANDLERS -------------------
    // example: onClickButton = ...
    //-------------------- END EVENT HANDLERS --------------------


    //------------------- BEGIN PUBLIC METHODS -------------------
    // Begin public method /configModule/
    // Purpose : Adjust configuration of allowed keys
    // Arguments : A map of settable keys and values
    // * color_name - color to use
    // Settings :
    // * configMap.settable_map declares allowed keys
    // Returns : true
    // Throws : none
    //
    configModule = function configModule(input_map) {
        spa.butil.setConfigMap({
            input_map: input_map,
            settable_map: configMap.settable_map,
            config_map: configMap
        });
        return true;
    };
    // End public method /configModule/
    // Begin public method /initModule/
    // Purpose : Initializes module
    // Arguments :
    // * $container the jquery element used by this feature
    // Returns : true
    // Throws : nonaccidental
    //
    initModule = function initModule($container) {
        stateMap.$container = $container;
        setJqueryMap();

        // the "notfound" implements a catch-all
        // with page('*', notfound). Here we have
        // no catch-all, so page.js will redirect
        // to the location of paths which do not
        // match any of the following routes
        // var baseUrl = 'file:///C:/Users/EB0095856/Documents/Projecten/client_upgrade/labs/Sinlge_Page_Application/dist/index.html';
        page.base('');
        page('/', showHomepage);
        page('/index', showHomepage);
        page('/login', showLoginPage);
        page('/game', showGamePage);
        page();

        showHomepage();
        return true;
    };

    // End public method /initModule/
    // return public methods
    return {
        configModule: configModule,
        initModule: initModule
    };
    //------------------- END PUBLIC METHODS ---------------------
}();
'use strict';

/*
 * spa.shell.js
 * Shell module for SPA
 * master controller for our SPA
 */

/*jslint         browser : true, continue : true,
 devel  : true, indent  : 2,    maxerr   : 50,
 newcap : true, nomen   : true, plusplus : true,
 regexp : true, sloppy  : true, vars     : false,
 white  : true
 */
/*global $, spa */

spa.shell = function () {
    'use strict';

    //---------------- BEGIN MODULE SCOPE VARIABLES --------------

    var configMap = {},
        stateMap = {
        $container: undefined
    },
        jqueryMap = {},
        setJqueryMap,
        initModule;
    //----------------- END MODULE SCOPE VARIABLES ---------------


    //------------------- BEGIN UTILITY METHODS ------------------
    //....
    //-------------------- END UTILITY METHODS -------------------


    //--------------------- BEGIN DOM METHODS --------------------
    setJqueryMap = function setJqueryMap() {
        var $container = stateMap.$container;
        jqueryMap = {
            $container: $container,
            $nav: $container.find('.spa-shell-main-nav')
        };
    };
    // End DOM method /setJqueryMap/


    //--------------------- END DOM METHODS ----------------------

    //------------------- BEGIN PUBLIC METHODS -------------------
    initModule = function initModule($container) {
        stateMap.$container = $container;
    };

    return {
        initModule: initModule
    };
    //------------------- END PUBLIC METHODS ---------------------
}();
"use strict";

/*
 * module_template.js
 * Template for browser feature modules
 */
/*jslint browser : true, continue : true,
 devel : true, indent : 2, maxerr : 50,
 newcap : true, nomen : true, plusplus : true,
 regexp : true, sloppy : true, vars : false,
 white : true
 */
/*global $, spa */
spa.template = function () {
    //---------------- BEGIN MODULE SCOPE VARIABLES --------------
    var configMap = {
        settable_map: { template_collection: true }
    },
        stateMap = { template_collection: null },
        getTemplate,
        parseTemplate,
        configModule,
        initModule;
    //----------------- END MODULE SCOPE VARIABLES ---------------

    //------------------- BEGIN PUBLIC METHODS -------------------

    // Arguments: A string divided by dots.
    getTemplate = function getTemplate(template_path) {
        return spa.util.fetchFromObject(stateMap.template_collection, template_path);
    };

    // Arguments: A string and Object
    //  * String, path divided by dots.
    //  * Object, data which will be parsed.
    // Returns: String with html.
    parseTemplate = function parseTemplate(template_path, data) {

        var template_func = spa.util.fetchFromObject(stateMap.template_collection, template_path);
        return template_func(data);
    };

    // Begin public method /configModule/
    configModule = function configModule(input_map) {
        spa.util_b.setConfigMap({
            input_map: input_map,
            settable_map: configMap.settable_map,
            config_map: configMap
        });
        return true;
    };
    // End public method /configModule/

    // Begin public method /initModule/
    //
    initModule = function initModule(template_collection) {
        stateMap.template_collection = template_collection;
        return true;
    };
    // End public method /initModule/
    // return public methods
    return {
        configModule: configModule,
        initModule: initModule,
        getTemplate: getTemplate,
        parseTemplate: parseTemplate
    };
    //------------------- END PUBLIC METHODS ---------------------
}();
'use strict';

// Site thinks spa.game is undefined. initModule wont work
spa.game = function () {

    var configMap = {},
        _initModule,
        startGame,
        addPlayer;

    startGame = function startGame() {
        superGame.startgame();
    };

    addPlayer = function addPlayer() {
        superGame.addPlayer();
    };

    _initModule = function initModule() {
        console.log('init module game');

        return {
            initModule: _initModule
        };
    };
}();

var superGame = {
    startgame: function startgame() {
        console.log('Starting game...');
    },
    addPlayer: function addPlayer(player) {
        console.log('Adding player ', player);
    },
    explodeerApplicatie: function explodeerApplicatie() {
        console.log('Oh no, i exploded!');
    }
};
'use strict';

var myWidget = function ($) {

    var init, configMap, _updateDOM, _setTimer, _openSlideMenu, _closeSlideMenu, notificationId, _toggle_on, _toggle_off, _getMessage, _setMessage, _resetNotification;

    configMap = {
        timer: 5000,
        url: 'http://api.openweathermap.org/data/2.5/weather?q=Baarn&APPID=8fcf26b16c912c56bdbb840b5276b6c4',
        messageStart: 'Hello world!',
        messageEvil: 'You pressed the evil button!',
        messageGood: 'You pressed the good button',
        fillerText: 'Lorem ipsum dolor sit amet, illum definitiones no quo, maluisset concludaturque et eum, altera fabulas ut quo. Atqui causae gloriatur ius te, id agam omnis evertitur eum. Affert laboramus repudiandae nec et. Inciderint efficiantur his ad. Eum no molestiae voluptatibus.'
    };

    // Opens responsive menu.
    _openSlideMenu = function _openSlideMenu() {
        document.getElementById('side-menu').style.width = '250px';
    };

    // Closes responsive menu.
    _closeSlideMenu = function _closeSlideMenu() {
        document.getElementById('side-menu').style.width = '0';
    };

    // Changes interval of getting information.
    _setTimer = function _setTimer(time) {
        configMap.timer = time;
        setInterval(_getMessage, configMap.timer);
    };

    // Set item and save to LocalStorage.
    _setMessage = function _setMessage(message) {
        console.log("Setting message...");
        document.getElementById('notification-text').textContent = message;
    };

    // Resets notification to default.
    _resetNotification = function _resetNotification() {
        console.log("Reset message...");
        _setMessage(configMap.messageStart);
        document.getElementById('notification').style.backgroundColor = "lightblue";
    };

    // Toggle pop-up off
    _toggle_off = function _toggle_off() {
        console.log("toggle_off");
        if ($(notificationId).is(":visible")) {
            $(notificationId).hide();
        }
    };

    // Toggle pop-up on
    _toggle_on = function _toggle_on() {
        console.log("toggle_on");
        if (!$(notificationId).is(":visible")) {
            $(notificationId).fadeIn();
        }
    };

    // Updates DOM and logs message. Has a trigger thats curently offline.
    _updateDOM = function _updateDOM(data) {
        console.log(data);
        console.log('Updating DOM...');
    };

    // Calls to server if there is an url
    _getMessage = function _getMessage() {
        $.get(configMap.url).done(function (result) {
            var counter = 0;
            _updateDOM(result);
        }).fail(function (error) {
            console.log(error);
        });
    };

    init = function init(id, wrapperid) {
        notificationId = wrapperid;
        $('#showButton').on('click', function (e) {
            e.stopPropagation();
            _toggle_on();
        });

        $('#notification-close').on('click', function (e) {
            e.stopPropagation();
            _resetNotification();
            _toggle_off();
        });

        // Change color & text of notification.
        $('#goodButton').on('click', function (e) {
            e.stopPropagation();
            _setMessage(configMap.messageGood);
            document.getElementById('notification').style.backgroundColor = "#00FF7F";
        });

        $('#badButton').on('click', function (e) {
            e.stopPropagation();
            _setMessage(configMap.messageEvil);
            document.getElementById('notification').style.backgroundColor = "#FA8072";
        });

        $('#open-slider').on('click', function (e) {
            e.stopPropagation();
            _openSlideMenu();
        });

        $('#side-menu').on('click', function (e) {
            e.stopPropagation();
            _closeSlideMenu();
        });

        /* Sets interval of weatherdata */
        setInterval(_getMessage, configMap.timer);
    };

    return {
        init: init,
        _setMessage: _setMessage
    };
}(jQuery);

$(function () {
    setTimeout(function () {
        $('body').addClass('loaded');
        $('h1').css('color', '#222222');
        myWidget.init('#widget', '#notification');
    }, 3000);
});