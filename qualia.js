//Player = new Mongo.Collection("player");
Games = new Mongo.Collection("games");
 
if (Meteor.isClient) {
  // value starts empty
  Session.setDefault('hand', '');
                       
  Template.choice.helpers({
    hand: function () {
      Session.setDefault('currentGame', Games.findOne({completed: false})._id);
      return Session.get('hand');
    }
  });
  Template.gameOver.helpers({
    winner: function () {
      var currentGame = Session.get('currentGame');
      var game = Games.findOne({_id: currentGame}),
          currentHand = Session.get('hand'),
          opponent = Session.get('opponent'),
          currentPlayer = Session.get('currentPlayer');
      if(typeof(game[opponent]) == "string" && typeof(game[currentPlayer]) == "string" ){
        Games.update({_id: currentGame}, {$set: {completed: true}});
        var opponentHand = {player: opponent, hand: game[opponent]};
        var playerHand = {player: currentPlayer, hand: currentHand};
        Session.set('winner', determineWinner(playerHand, opponentHand));
      }
      return Session.get('winner');
    },
    player1_hand: function(){
      var currentGame = Session.get('currentGame');
      var game = Games.findOne({_id: currentGame}),
          currentHand = Session.get('hand'),
          opponent = Session.get('opponent'),
          currentPlayer = Session.get('currentPlayer');
      return (currentPlayer == "player1" ? game[currentPlayer] : game[opponent]);
    },
    player2_hand: function(){
      var currentGame = Session.get('currentGame');
      var game = Games.findOne({_id: currentGame}),
          currentHand = Session.get('hand'),
          opponent = Session.get('opponent'),
          currentPlayer = Session.get('currentPlayer');
      return (currentPlayer == "player2" ? game[currentPlayer] : game[opponent]);
    }
  });
  Template.waitingForOpponent.helpers({
    opponent: function() {
      return Session.get('opponent');
    }
  });

  Template.gameOver.events({
    'click #play_again': function () {
      // create new game
      var newGame = Games.insert({completed: false, player1: null, player2: null})
      Session.set('currentGame', newGame);
    }
  });
  Template.choice.events({
    'click #scissors': function () {
      // change player's selection
      Session.set('hand', 'scissors');
    },
    'click #paper': function () {
      // change player's selection
      Session.set('hand', 'paper');
    },
    'click #rock': function () {
      // change player's selection
      Session.set('hand', 'rock');
    },
    'click #yes': function () {
      var player = FlowRouter.getParam("playerId"),
          currentGame = Session.get("currentGame"),
          hand = Session.get("hand"),
          updateValues = {};
      updateValues[player] = hand;
      Session.set('currentPlayer', player)
      Session.set('opponent', player == 'player1' ? 'player2' : 'player1'); //opponent is opposite of current player
      Games.update({_id: currentGame}, {$set : updateValues});
      FlowRouter.go("/gameover");
    }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
      if(Games.find({}).count() == 0){
        Games.insert({completed: false, player1: null, player2: null})
      }else if(Games.find({completed: true}).count() > 0){
        Games.insert({completed: false, player1: null, player2: null})
      }
  });
}

function determineWinner(hand1, hand2){
    var winner;
    if(hand1.hand == "rock" && hand2.hand == "paper")
      winner = hand2.player;
    else if(hand1.hand == "paper" && hand2.hand == "scissors")
      winner = hand2.player;
    else if(hand1.hand == "scissors" && hand2.hand == "rock")
      winner = hand2.player;
    else if(hand1.hand == "paper" && hand2.hand == "rock")
      winner = hand1.player;
    else if(hand1.hand == "scissors" && hand2.hand == "paper")
      winner = hand1.player;
    else if(hand1.hand == "rock" && hand2.hand == "scissors")
      winner = hand1.player;
    else if(hand1.hand == hand2.hand)
      winner = "tie";
    return winner;
}
