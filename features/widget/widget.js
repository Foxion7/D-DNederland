var myWidget = (function ($) {

    var init, configMap, _updateDOM, _setTimer,
        _openSlideMenu, _closeSlideMenu,
        notificationId, _toggle_on, _toggle_off, _getMessage, _setMessage, _resetNotification;

        configMap = {
        timer: 5000,
        url: 'http://api.openweathermap.org/data/2.5/weather?q=Baarn&APPID=8fcf26b16c912c56bdbb840b5276b6c4',
        messageStart: 'Hello world!',
        messageEvil: 'You pressed the evil button!',
        messageGood: 'You pressed the good button',
        fillerText: 'Lorem ipsum dolor sit amet, illum definitiones no quo, maluisset concludaturque et eum, altera fabulas ut quo. Atqui causae gloriatur ius te, id agam omnis evertitur eum. Affert laboramus repudiandae nec et. Inciderint efficiantur his ad. Eum no molestiae voluptatibus.'
    };

    // Opens responsive menu.
    _openSlideMenu = function () {
        document.getElementById('side-menu').style.width = '250px';
    };

    // Closes responsive menu.
    _closeSlideMenu = function () {
        document.getElementById('side-menu').style.width = '0';
    };

    // Changes interval of getting information.
    _setTimer = function (time) {
        configMap.timer = time;
        setInterval(_getMessage, configMap.timer);
    };

    // Set item and save to LocalStorage.
    _setMessage = function (message) {
        console.log("Setting message...");
        document.getElementById('notification-text').textContent = message;
    };

    // Resets notification to default.
    _resetNotification = function(){
        console.log("Reset message...");
        _setMessage(configMap.messageStart);
        document.getElementById('notification').style.backgroundColor = "lightblue";
    };

    // Toggle pop-up off
    _toggle_off = function () {
        console.log("toggle_off");
        if ($(notificationId).is(":visible")) {
            $(notificationId).hide();
        }
    };

    // Toggle pop-up on
    _toggle_on = function () {
        console.log("toggle_on");
        if (!$(notificationId).is(":visible")) {
            $(notificationId).fadeIn();
        }
    };

    // Updates DOM and logs message. Has a trigger thats curently offline.
    _updateDOM = function (data) {
        console.log(data);
        console.log('Updating DOM...');
    };

    // Calls to server if there is an url
    _getMessage = function () {
        $.get(configMap.url)
            .done(function(result){
                var counter = 0;
                _updateDOM(result);
            })
            .fail(function (error) {
                console.log(error);
        });
    };

    init = function (id, wrapperid) {
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
}(jQuery));

$(function () {
    setTimeout(function () {
        $('body').addClass('loaded');
        $('h1').css('color', '#222222');
        myWidget.init('#widget', '#notification');
    }, 3000);
});
