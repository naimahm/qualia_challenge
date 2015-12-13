FlowRouter.route('/', {
    action: function(params, queryParams) {
        BlazeLayout.render("mainLayout", {content: "main"});
    }
});
FlowRouter.route('/gameover', {
  triggersEnter: [function(context, redirect) {
    if(Session.get('hand') == "")
        redirect('/');
  }],   
    action: function(params, queryParams) {
        BlazeLayout.render("mainLayout", {content: "gameOver"});
    }
});
FlowRouter.route('/:playerId', {
  triggersEnter: [function(context, redirect) {
    if(context.params.playerId != "player1" && context.params.playerId != "player2" )
        redirect('/');
  }],   
    action: function(params, queryParams) {
        BlazeLayout.render("mainLayout", {content: "game"});
    }
});