// board reducer. Handles end of game, spots state, and the turn.
// I set it up this way because the spots, end of game, and the turn all rely on each other and intertwine.
function board(state = {}, action) {
    // helper functions
    const getPossiblePaths = (i, j, color, spots) => {
        return [
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
                spots[coord.x][coord.y].color === color
        );
    };

    // Function to check if an empty spot is a valid move for a certain player.
    const checkValid = (i, j, color, spots) => {
        // Assume it will be invalid
        let valid = false;

        const otherColor = color === "white" ? "black" : "white";

        // Get the surrounding spots, check if any of them are possible to start a move.
        let possiblePaths = getPossiblePaths(i, j, otherColor, spots);

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

    switch (action.type) {
        // In the event of a move.
        case "CLICK_SPOT": {
            const { spots } = state;

            const otherColor = "white";

            // Storing variables in data-* makes them strings.
            let i = Number(action.i);
            let j = Number(action.j);

            // Same thing we do in the checkValid function. Get possible paths to see where we need to flip coins.
            let possiblePaths = getPossiblePaths(i, j, otherColor, spots);

            // Initialize an array to store where tiles need to be flipped.
            let changeTiles = [];

            possiblePaths.forEach(path => {
                // Set the counter for our steps so we can get all of the flipped coin locations. (back-tracking)
                let count = 1;

                // Variable to end the search.
                let end = false;

                // Get the next spot locations.
                let nextX = path.x + path.dir[0];
                let nextY = path.y + path.dir[1];

                while (!end) {
                    // Make sure we are still in the grid.
                    if (nextX >= 0 && nextX < 8 && nextY >= 0 && nextY < 8) {
                        const nextColor = spots[nextX][nextY].color;

                        if (nextColor === "black") {
                            // We know that we have a valid path here, so we need to
                            // back-track and push all of the locations we need to flip.
                            end = true;

                            let backX = nextX;
                            let backY = nextY;

                            for (let x = 0; x <= count; x++) {
                                backX = backX - path.dir[0];
                                backY = backY - path.dir[1];
                                changeTiles.push({ x: backX, y: backY });
                            }
                        } else if (nextColor === "empty") {
                            // Invalid, end search.
                            end = true;
                        } else {
                            // We can keep going, because we haven't hit an empty spot or the end.
                            count += 1;
                            nextX += path.dir[0];
                            nextY += path.dir[1];
                        }
                    } else {
                        end = true;
                    }
                }
            });

            // Here we are just creating a new spots 2-D array with flipped coins.
            let newSpots = spots.map((row, i) => {
                return row.map((spot, j) => {
                    if (
                        changeTiles.filter(tile => tile.x === i && tile.y === j)
                            .length > 0
                    ) {
                        spot.color = action.turn;
                        return spot;
                    } else {
                        return spot;
                    }
                });
            });

            // Apply checkValid to all empty spots.
            newSpots.forEach((row, i) => {
                row.forEach((spot, j) => {
                    spot.validBlack =
                        spot.color !== "empty"
                            ? false
                            : checkValid(i, j, "black", newSpots);
                    spot.validWhite =
                        spot.color !== "empty"
                            ? false
                            : checkValid(i, j, "white", newSpots);
                });
            });

            // Switch turns.
            let turn = action.turn === "white" ? "black" : "white";

            // We need to make sure the next turn can move.
            const currentCantMove =
                newSpots.filter(row => {
                    return (
                        row.filter(spot => {
                            if (turn === "white") {
                                return spot.validWhite;
                            } else {
                                return spot.validBlack;
                            }
                        }).length > 0
                    );
                }).length === 0;

            // Assume the other player can move.
            let otherCantMove = false;

            // If the player can't move, we need to check the other player.
            if (currentCantMove) {
                turn = turn === "white" ? "black" : "white";

                otherCantMove =
                    newSpots.filter(row => {
                        return (
                            row.filter(spot => {
                                if (turn === "white") {
                                    return spot.validWhite;
                                } else {
                                    return spot.validBlack;
                                }
                            }).length > 0
                        );
                    }).length === 0;
            }

            // If the other player can't move, then the game is over.

            // New state to return.
            return {
                spots: newSpots,
                turn,
                gameDone: otherCantMove
            };
        }
        case "COMPUTER_MOVE": {
            const { spots, gameDone } = state;

            if (!gameDone) {
                const validSpots = [].concat
                    .apply([], spots)
                    .filter(x => x.validWhite);

                if (validSpots.length > 0) {
                    const executed = validSpots.map(location => {
                        const i = location.x;
                        const j = location.y;

                        let possiblePaths = getPossiblePaths(
                            i,
                            j,
                            "black",
                            spots
                        );

                        // Initialize an array to store where tiles need to be flipped.
                        let numberCreated = 0;

                        possiblePaths.forEach(path => {
                            // Set the counter for our steps so we can get all of the flipped coin locations. (back-tracking)
                            let count = 1;

                            // Variable to end the search.
                            let end = false;

                            // Get the next spot locations.
                            let nextX = path.x + path.dir[0];
                            let nextY = path.y + path.dir[1];

                            while (!end) {
                                // Make sure we are still in the grid.
                                if (
                                    nextX >= 0 &&
                                    nextX < 8 &&
                                    nextY >= 0 &&
                                    nextY < 8
                                ) {
                                    const nextColor = spots[nextX][nextY].color;

                                    if (nextColor === "white") {
                                        // We know that we have a valid path here, so we need to
                                        // back-track and push all of the locations we need to flip.
                                        end = true;

                                        let backX = nextX;
                                        let backY = nextY;

                                        for (let x = 0; x <= count; x++) {
                                            backX = backX - path.dir[0];
                                            backY = backY - path.dir[1];
                                            numberCreated += 1;
                                        }
                                    } else if (nextColor === "empty") {
                                        // Invalid, end search.
                                        end = true;
                                    } else {
                                        // We can keep going, because we haven't hit an empty spot or the end.
                                        count += 1;
                                        nextX += path.dir[0];
                                        nextY += path.dir[1];
                                    }
                                } else {
                                    end = true;
                                }
                            }
                        });

                        return {
                            i,
                            j,
                            numberCreated
                        };
                    });

                    // Taken from https://stackoverflow.com/questions/11301438/return-index-of-greatest-value-in-an-array
                    const indexOfMax = arr => {
                        if (arr.length === 0) {
                            return -1;
                        }

                        var max = arr[0].numberCreated;
                        var maxIndex = 0;

                        for (var i = 1; i < arr.length; i++) {
                            if (arr[i].numberCreated > max) {
                                maxIndex = i;
                                max = arr[i];
                            }
                        }

                        return maxIndex;
                    };

                    const bestMove = executed[indexOfMax(executed)];

                    const { i, j } = bestMove;

                    let possiblePaths = getPossiblePaths(i, j, "black", spots);

                    // Initialize an array to store where tiles need to be flipped.
                    let changeTiles = [];

                    possiblePaths.forEach(path => {
                        // Set the counter for our steps so we can get all of the flipped coin locations. (back-tracking)
                        let count = 1;

                        // Variable to end the search.
                        let end = false;

                        // Get the next spot locations.
                        let nextX = path.x + path.dir[0];
                        let nextY = path.y + path.dir[1];

                        while (!end) {
                            // Make sure we are still in the grid.
                            if (
                                nextX >= 0 &&
                                nextX < 8 &&
                                nextY >= 0 &&
                                nextY < 8
                            ) {
                                const nextColor = spots[nextX][nextY].color;

                                if (nextColor === "white") {
                                    // We know that we have a valid path here, so we need to
                                    // back-track and push all of the locations we need to flip.
                                    end = true;

                                    let backX = nextX;
                                    let backY = nextY;

                                    for (let x = 0; x <= count; x++) {
                                        backX = backX - path.dir[0];
                                        backY = backY - path.dir[1];
                                        changeTiles.push({
                                            x: backX,
                                            y: backY
                                        });
                                    }
                                } else if (nextColor === "empty") {
                                    // Invalid, end search.
                                    end = true;
                                } else {
                                    // We can keep going, because we haven't hit an empty spot or the end.
                                    count += 1;
                                    nextX += path.dir[0];
                                    nextY += path.dir[1];
                                }
                            } else {
                                end = true;
                            }
                        }
                    });

                    // Here we are just creating a new spots 2-D array with flipped coins.
                    let newSpots = spots.map((row, i) => {
                        return row.map((spot, j) => {
                            if (
                                changeTiles.filter(
                                    tile => tile.x === i && tile.y === j
                                ).length > 0
                            ) {
                                spot.color = "white";
                                return spot;
                            } else {
                                return spot;
                            }
                        });
                    });

                    // Apply checkValid to all empty spots.
                    newSpots.forEach((row, i) => {
                        row.forEach((spot, j) => {
                            spot.validBlack =
                                spot.color !== "empty"
                                    ? false
                                    : checkValid(i, j, "black", newSpots);
                            spot.validWhite =
                                spot.color !== "empty"
                                    ? false
                                    : checkValid(i, j, "white", newSpots);
                        });
                    });

                    // Switch turns.
                    let turn = "black";

                    // We need to make sure the next turn can move.
                    const currentCantMove =
                        newSpots.filter(row => {
                            return (
                                row.filter(spot => {
                                    return spot.validBlack;
                                }).length > 0
                            );
                        }).length === 0;

                    // Assume the other player can move.
                    let otherCantMove = false;

                    // If the player can't move, we need to check the other player.
                    if (currentCantMove) {
                        otherCantMove =
                            newSpots.filter(row => {
                                return (
                                    row.filter(spot => {
                                        return spot.validWhite;
                                    }).length > 0
                                );
                            }).length === 0;
                    }

                    // If the other player can't move, then the game is over.

                    // New state to return.
                    return {
                        spots: newSpots,
                        turn,
                        gameDone: otherCantMove
                    };
                } else {
                    // Switch turns.
                    let turn = "black";

                    // We need to make sure the next turn can move.
                    const currentCantMove =
                        spots.filter(row => {
                            return (
                                row.filter(spot => {
                                    return spot.validBlack;
                                }).length > 0
                            );
                        }).length === 0;

                    if (currentCantMove) {
                        return {
                            ...state,
                            gameDone: true
                        };
                    } else {
                        return {
                            ...state,
                            spots,
                            turn
                        };
                    }
                }
            } else {
                return state;
            }
        }
        case "RESET_GAME": {
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

            // Run the checkValid function on any empty spot. (We already know non-empty spots are invalid.)
            spots.forEach((row, i) => {
                row.forEach((spot, j) => {
                    spot.validBlack =
                        spot.color !== "empty"
                            ? false
                            : checkValid(i, j, "black", spots);
                    spot.validWhite =
                        spot.color !== "empty"
                            ? false
                            : checkValid(i, j, "white", spots);
                });
            });

            // Create the board object for the store.
            const board = {
                gameDone: false,
                turn: "black",
                spots
            };

            return board;
        }
        default:
            return state;
    }
}

export default board;
