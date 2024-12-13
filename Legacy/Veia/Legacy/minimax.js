/*
 * Represents a state in the game
 * @param old [State]: old state to intialize the new state
 */
var State = function(old) {

    /*
     * public : the player who has the turn to player
     */
    this.turn = "";

    /*
     * public : the number of moves of the AI player
     */
    this.oMovesCount = 0;

    /*
     * public : the result of the game in this State
     */
    this.result = "still running";

    /*
     * public : the board configuration in this state
     */
    this.board = [];

    /* Begin Object Construction */
    if(typeof old !== "undefined") {
        // if the state is constructed using a copy of another state
        var len = old.board.length;
        this.board = new Array(len);
        for(var itr = 0 ; itr < len ; itr++) {
            this.board[itr] = old.board[itr];
        }

        this.oMovesCount = old.oMovesCount;
        this.result = old.result;
        this.turn = old.turn;
    }
    /* End Object Construction */

    /*
     * public : advances the turn in a the state
     */
    this.advanceTurn = function() {
        this.turn = this.turn === "X" ? "O" : "X";
    }

    /*
     * public function that enumerates the empty cells in state
     * @return [Array]: indices of all empty cells
     */
    this.emptyCells = function() {
        var indxs = [];
        for(var itr = 0; itr < 9 ; itr++) {
            if(this.board[itr] === "E") {
                indxs.push(itr);
            }
        }
        return indxs;
    }

    /*
     * public  function that checks if the state is a terminal state or not
     * the state result is updated to reflect the result of the game
     * @returns [Boolean]: true if it's terminal, false otherwise
     */
    this.isTerminal = function() {
        var B = this.board;

        //check rows
        for(var i = 0; i <= 6; i = i + 3) {
            if(B[i] !== "E" && B[i] === B[i + 1] && B[i + 1] == B[i + 2]) {
                this.result = B[i] + "-won"; //update the state result
                return true;
            }
        }

        //check columns
        for(var i = 0; i <= 2 ; i++) {
            if(B[i] !== "E" && B[i] === B[i + 3] && B[i + 3] === B[i + 6]) {
                this.result = B[i] + "-won"; //update the state result
                return true;
            }
        }

        //check diagonals
        for(var i = 0, j = 4; i <= 2 ; i = i + 2, j = j - 2) {
            if(B[i] !== "E" && B[i] == B[i + j] && B[i + j] === B[i + 2*j]) {
                this.result = B[i] + "-won"; //update the state result
                return true;
            }
        }

        var available = this.emptyCells();
        if(available.length == 0) {
            //the game is draw
            this.result = "draw"; //update the state result
            return true;
        }
        else {
            return false;
        }
    };

};

// ---------------------------------------------

/*
 * Constructs an AI player with a specific level of intelligence
 * @param level [String]: the desired level of intelligence
 */
var AI = function(level) {

    //private attribute: level of intelligence the player has
    var levelOfIntelligence = level;

    //private attribute: the game the player is playing
    var game = {};

    /*
     * private recursive function that computes the minimax value of a game state
     * @param state [State] : the state to calculate its minimax value
     * @returns [Number]: the minimax value of the state
     */
    function minimaxValue(state) { ... }

    /*
     * private function: make the ai player take a blind move
     * that is: choose the cell to place its symbol randomly
     * @param turn [String]: the player to play, either X or O
     */
    function takeABlindMove(turn) { ... }

    /*
     * private function: make the ai player take a novice move,
     * that is: mix between choosing the optimal and suboptimal minimax decisions
     * @param turn [String]: the player to play, either X or O
     */
    function takeANoviceMove(turn) { ... }

    /*
     * private function: make the ai player take a master move,
     * that is: choose the optimal minimax decision
     * @param turn [String]: the player to play, either X or O
     */
    function takeAMasterMove(turn) { ... }


    /*
     * public method to specify the game the ai player will play
     * @param _game [Game] : the game the ai will play
     */
    this.plays = function(_game){
        game = _game;
    };

    /*
     * public function: notify the ai player that it's its turn
     * @param turn [String]: the player to play, either X or O
     */
    this.notify = function(turn) {
        switch(levelOfIntelligence) {
            //invoke the desired behavior based on the level chosen
            case "blind": takeABlindMove(turn); break;
            case "novice": takeANoviceMove(turn); break;
            case "master": takeAMasterMove(turn); break;
        }
    };
};

// --------------------------------------------------------------------

/*
 * Constructs an action that the ai player could make
 * @param pos [Number]: the cell position the ai would make its action in
 * made that action
 */
var AIAction = function(pos) {

    // public : the position on the board that the action would put the letter on
    this.movePosition = pos;

    //public : the minimax value of the state that the action leads to when applied
    this.minimaxVal = 0;

    /*
     * public : applies the action to a state to get the next state
     * @param state [State]: the state to apply the action to
     * @return [State]: the next state
     */
    this.applyTo = function(state) {
        var next = new State(state);

        //put the letter on the board
        next.board[this.movePosition] = state.turn;

        if(state.turn === "O")
            next.oMovesCount++;

        next.advanceTurn();

        return next;
    }
};

// ---------------------------------------------------------------------

/*
 * public static method that defines a rule for sorting AIAction in ascending manner
 * @param firstAction [AIAction] : the first action in a pairwise sort
 * @param secondAction [AIAction]: the second action in a pairwise sort
 * @return [Number]: -1, 1, or 0
 */
AIAction.ASCENDING = function(firstAction, secondAction) {
    if(firstAction.minimaxVal < secondAction.minimaxVal)
        return -1; //indicates that firstAction goes before secondAction
    else if(firstAction.minimaxVal > secondAction.minimaxVal)
        return 1; //indicates that secondAction goes before firstAction
    else
        return 0; //indicates a tie
}

/*
 * public static method that defines a rule for sorting AIAction in descending manner
 * @param firstAction [AIAction] : the first action in a pairwise sort
 * @param secondAction [AIAction]: the second action in a pairwise sort
 * @return [Number]: -1, 1, or 0
 */
AIAction.DESCENDING = function(firstAction, secondAction) {
    if(firstAction.minimaxVal > secondAction.minimaxVal)
        return -1; //indicates that firstAction goes before secondAction
    else if(firstAction.minimaxVal < secondAction.minimaxVal)
        return 1; //indicates that secondAction goes before firstAction
    else
        return 0; //indicates a tie
}

// -----------------------------------------------------------------

/*
 * Constructs a game object to be played
 * @param autoPlayer [AIPlayer] : the AI player to be play the game with
 */
var Game = function(autoPlayer) {

    //public : initialize the ai player for this game
    this.ai = autoPlayer;

    // public : initialize the game current state to empty board configuration
    this.currentState = new State();

    //"E" stands for empty board cell
    this.currentState.board = ["E", "E", "E",
                               "E", "E", "E",
                               "E", "E", "E"];

    this.currentState.turn = "X"; //X plays first

    /*
     * initialize game status to beginning
     */
    this.status = "beginning";

    /*
     * public function that advances the game to a new state
     * @param _state [State]: the new state to advance the game to
     */
    this.advanceTo = function(_state) {
        this.currentState = _state;
        if(_state.isTerminal()) {
            this.status = "ended";

            if(_state.result === "X-won")
                //X won
                ui.switchViewTo("won");
            else if(_state.result === "O-won")
                //X lost
                ui.switchViewTo("lost");
            else
                //it's a draw
                ui.switchViewTo("draw");
        }
        else {
            //the game is still running

            if(this.currentState.turn === "X") {
                ui.switchViewTo("human");
            }
            else {
                ui.switchViewTo("robot");

                //notify the AI player its turn has come up
                this.ai.notify("O");
            }
        }
    };

    /*
     * starts the game
     */
    this.start = function() {
        if(this.status = "beginning") {
            //invoke advanceTo with the intial state
            this.advanceTo(this.currentState);
            this.status = "running";
        }
    }

};

// ----------------------------------------------------------------

/*
 * public static function that calculates the score of the x player in a terminal state
 * @param _state [State]: the state in which the score is calculated
 * @return [Number]: the score calculated for the human player
 */
Game.score = function(_state) {
    if(_state.result !== "still running") {
        if(_state.result === "X-won"){
            // the x player won
            return 10 - _state.oMovesCount;
        }
        else if(_state.result === "O-won") {
            //the x player lost
            return -10 + _state.oMovesCount;
        }
        else {
            //it's a draw
            return 0;
        }
    }
}

// -----------------------------------------------------------------

/*
 * private recursive function that computes the minimax value of a game state
 * @param state [State] : the state to calculate its minimax value
 * @returns [Number]: the minimax value of the state
 */
function minimaxValue(state) {
    if(state.isTerminal()) {
        //a terminal game state is the base case
        return Game.score(state);
    }
    else {
        var stateScore; // this stores the minimax value we'll compute

        if(state.turn === "X")
        // X maximizs --> initialize to a value smaller than any possible score
            stateScore = -1000;
        else
        // O minimizes --> initialize to a value larger than any possible score
            stateScore = 1000;

        var availablePositions = state.emptyCells();

        //enumerate next available states using the info form available positions
        var availableNextStates = availablePositions.map(function(pos) {
            var action = new AIAction(pos);

            var nextState = action.applyTo(state);

            return nextState;
        });

        /* calculate the minimax value for all available next states
         * and evaluate the current state's value */
        availableNextStates.forEach(function(nextState) {

            var nextScore = minimaxValue(nextState); //recursive call

            if(state.turn === "X") {
                // X wants to maximize --> update stateScore iff nextScore is larger
                if(nextScore > stateScore)
                    stateScore = nextScore;
                }
            else {
                // O wants to minimize --> update stateScore iff nextScore is smaller
                if(nextScore < stateScore)
                    stateScore = nextScore;
            }
        });

        //backup the minimax value
        return stateScore;
    }
}

// --------------------------------------------------------------------------

/*
 * private function: make the ai player take a master move,
 * that is: choose the optimal minimax decision
 * @param turn [String]: the player to play, either X or O
 */
function takeAMasterMove(turn) {
    var available = game.currentState.emptyCells();

    //enumerate and calculate the score for each avaialable actions to the ai player
    var availableActions = available.map(function(pos) {
        var action =  new AIAction(pos); //create the action object

        //get next state by applying the action
        var next = action.applyTo(game.currentState);

        //calculate and set the action's minmax value
        action.minimaxVal = minimaxValue(next);

        return action;
    });

    //sort the enumerated actions list by score
    if(turn === "X")
        //X maximizes --> descend sort the actions to have the largest minimax at first
        availableActions.sort(AIAction.DESCENDING);
    else
        //O minimizes --> acend sort the actions to have the smallest minimax at first
        availableActions.sort(AIAction.ASCENDING);


    //take the first action as it's the optimal
    var chosenAction = availableActions[0];
    var next = chosenAction.applyTo(game.currentState);

    // this just adds an X or an O at the chosen position on the board in the UI
    ui.insertAt(chosenAction.movePosition, turn);

    // take the game to the next state
    game.advanceTo(next);
}

// ----------------------------------------------------------------

var P = 40; //some probability in percent form
if(Math.random()*100 <= P) {
    // carry out the probable task with probability P
}
else {
   // carry out the other probable task with probability 1 - P
}

// --------------------------------------------------------------------

/*
 * private function: make the ai player take a novice move,
 * that is: mix between choosing the optimal and suboptimal minimax decisions
 * @param turn [String]: the player to play, either X or O
 */
function takeANoviceMove(turn) {
    var available = game.currentState.emptyCells();

    //enumerate and calculate the score for each available actions to the ai player
    var availableActions = available.map(function(pos) {
        var action =  new AIAction(pos); //create the action object

        //get next state by applying the action
        var nextState = action.applyTo(game.currentState);

        //calculate and set the action's minimax value
        action.minimaxVal = minimaxValue(nextState);

        return action;
    });

    //sort the enumerated actions list by score
    if(turn === "X")
        //X maximizes --> decend sort the actions to have the maximum minimax at first
        availableActions.sort(AIAction.DESCENDING);
    else
        //O minimizes --> ascend sort the actions to have the minimum minimax at first
        availableActions.sort(AIAction.ASCENDING);


    /*
     * take the optimal action 40% of the time
     * take the 1st suboptimal action 60% of the time
     */
    var chosenAction;
    if(Math.random()*100 <= 40) {
        chosenAction = availableActions[0];
    }
    else {
        if(availableActions.length >= 2) {
            //if there is two or more available actions, choose the 1st suboptimal
            chosenAction = availableActions[1];
        }
        else {
            //choose the only available actions
            chosenAction = availableActions[0];
        }
    }
    var next = chosenAction.applyTo(game.currentState);

    ui.insertAt(chosenAction.movePosition, turn);

    game.advanceTo(next);
};

// ------------------------------------------------------------------

/*
 * private function: make the ai player take a blind move
 * that is: choose the cell to place its symbol randomly
 * @param turn [String]: the player to play, either X or O
 */
function takeABlindMove(turn) {
    var available = game.currentState.emptyCells();
    var randomCell = available[Math.floor(Math.random() * available.length)];
    var action = new AIAction(randomCell);

    var next = action.applyTo(game.currentState);

    ui.insertAt(randomCell, turn);

    game.advanceTo(next);
}