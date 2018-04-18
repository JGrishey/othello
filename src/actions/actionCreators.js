// Called in fullMove(), returns a function to make sure we process the human move first.
export function clickSpot(i, j, turn) {
    return dispatch => {
        dispatch({
            type: "CLICK_SPOT",
            i,
            j,
            turn
        });
        return Promise.resolve();
    };
}

// Dispatch an action to make sure the computer knows to make its move. Called in fullMove()
export function computerMove() {
    return {
        type: "COMPUTER_MOVE"
    };
}

// Returns a function. Processes both clickSpot() and computerMove()
export function fullMove(i, j, turn) {
    return dispatch => {
        return dispatch(clickSpot(i, j, turn)).then(() => {
            dispatch(computerMove());
        });
    };
}

// Reset the game.
export function resetGame() {
    return {
        type: "RESET_GAME"
    };
}
