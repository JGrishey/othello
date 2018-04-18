// Yarn imports
import React, { Component } from "react";

export default class Header extends Component {
    render() {
        return (
            <div className="p-2">
                <h1 className="text-center">Othello</h1>
                <div className="row justify-content-center">
                    <div className="col-12 col-lg-6">
                        <p>
                            This is the game of Othello. The game begins with 4
                            coins placed on the board in a checker-board
                            pattern. The goal is to have more coins than your
                            opponent. You play as black and the computer is
                            white.
                        </p>
                        <p>
                            A valid move consists of placing a coin on an empty
                            spot so that you start with a coin of your color and
                            end with a coin of your color, with the other color
                            coins filling inbetween. This line can be
                            horizontal, vertical, or diagonal. Then, the coins
                            of the other color that are inbetween are flipped.
                        </p>
                    </div>
                </div>
            </div>
        );
    }
}
