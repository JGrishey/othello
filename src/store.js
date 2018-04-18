// Yarn imports
import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";

// Local imports
import rootReducer from "./reducers/index";

// Array for creating the board
const arr = [0, 1, 2, 3, 4, 5, 6, 7];

// Create the board, which is just a 2-D array of objects.
let spots = arr.map(i => {
    return arr.map(j => {
        return {
            color: "empty",
            validWhite: false,
            validBlack: false,
            x: i,
            y: j
        };
    });
});

// Set the initial board colors in the center.
spots[3][3].color = "white";
spots[3][4].color = "black";
spots[4][3].color = "black";
spots[4][4].color = "white";

// Function to check if an empty spot is a valid move for a certain player.
const checkValid = (i, j, color) => {
    // Assume it will be invalid
    let valid = false;

    const otherColor = color === "white" ? "black" : "white";

    // Get the surrounding spots, check if any of them are possible to start a move.
    let possiblePaths = [
        { x: i - 1, y: j - 1, dir: [-1, -1] },
        { x: i - 1, y: j, dir: [-1, 0] },
        { x: i - 1, y: j + 1, dir: [-1, 1] },
        { x: i, y: j - 1, dir: [0, -1] },
        { x: i, y: j + 1, dir: [0, 1] },
        { x: i + 1, y: j - 1, dir: [1, -1] },
        { x: i + 1, y: j, dir: [1, 0] },
        { x: i + 1, y: j + 1, dir: [1, 1] }
    ].filter(
        coord =>
            coord.x >= 0 &&
            coord.x < 8 &&
            coord.y >= 0 &&
            coord.y < 8 &&
            spots[coord.x][coord.y].color === otherColor
    );

    // Follow the paths, see if it will be possible to make that move.
    // Has to end in your color and have the opposite color along the way.
    possiblePaths.forEach(path => {
        // Variable to end the search.
        let end = false;

        // Get the next spot to look at.
        let nextX = path.x + path.dir[0];
        let nextY = path.y + path.dir[1];

        while (!end) {
            // Make sure it is in the 8x8 grid.
            if (nextX >= 0 && nextX < 8 && nextY >= 0 && nextY < 8) {

                // Get the next spot's color.
                const nextColor = spots[nextX][nextY].color;

                // Check if we are still on the right track.
                if (nextColor === color) {
                    valid = true;
                    end = true;
                } else if (nextColor === "empty") {
                    end = true;
                } else {
                    nextX += path.dir[0];
                    nextY += path.dir[1];
                }
            } else {
                end = true;
            }
        }
    });

    return valid;
};

// Run the checkValid function on any empty spot. (We already know non-empty spots are invalid.)
spots.forEach((row, i) => {
    row.forEach((spot, j) => {
        spot.validBlack = spot.color !== "empty" ? false : checkValid(i, j, "black");
        spot.validWhite = spot.color !== "empty" ? false : checkValid(i, j, "white");
    })
})

// Create the board object for the store.
const board = {
    gameDone: false,
    turn: "black",
    spots
}

// Initial state.
const initialState = {
    board
};

// Create the store, Redux DevTools for debugging.
const store = createStore(
    rootReducer,
    initialState,
    compose(
        applyMiddleware(thunk),
        window.devToolsExtension ? window.devToolsExtension() : f => f
    )
);

export default store;
