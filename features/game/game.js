// Site thinks spa.game is undefined. initModule wont work
spa.game = (function(){

    var configMap = {}, initModule, startGame, addPlayer;

    startGame = function(){
      superGame.startgame();
    };

    addPlayer = function(){
        superGame.addPlayer();
    };

    initModule = function(){
        console.log('init module game');

        return {
            initModule: initModule
        }
    }
})();

var superGame = {
    startgame : function(){
        console.log('Starting game...');
    },
    addPlayer : function(player){
        console.log('Adding player ', player);
    },
    explodeerApplicatie : function(){
        console.log('Oh no, i exploded!');
    }
};