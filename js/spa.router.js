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
spa.router = (function () {
//---------------- BEGIN MODULE SCOPE VARIABLES --------------
    var
        configMap = {
            settable_map: {}
        },
        stateMap = {$container: null},
        jqueryMap = {},
        setJqueryMap,
        showLoginPage,
        showHomepage,
        showGamePage,
        configModule, initModule;
//----------------- END MODULE SCOPE VARIABLES ---------------


//------------------- BEGIN UTILITY METHODS ------------------
// example : getTrimmedString
//-------------------- END UTILITY METHODS -------------------


//--------------------- BEGIN DOM METHODS --------------------
// Begin DOM method /setJqueryMap/
    setJqueryMap = function () {
        var $container = stateMap.$container;
        jqueryMap = {
            $page_container: $container.find('.spa-shell-main-content')
        };
    };

    showLoginPage = function(){
        console.log('show login page...');
        var html = spa.template.parseTemplate('features.login.login', {});
        jqueryMap.$page_container.html(html);
        // console.log('verwachte exceptie:');
        // console.log("vendor.js:4266 Uncaught DOMException: Failed to execute 'pushState' on 'History': A history state object with URL...");

    };

    showHomepage = function () {
        console.log('homepage');
        var html = spa.template
            .parseTemplate('features.homepage.homepage', {});
        jqueryMap.$page_container.html(html);
    };

    showGamePage = function(){
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
    configModule = function (input_map) {
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
    initModule = function ($container) {
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
}());