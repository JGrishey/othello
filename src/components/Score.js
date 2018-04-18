// Yarn imports
import React, { Component } from "react";

export default class Score extends Component {
    render() {
        const { gameDone, spots } = this.props.board;

        // Flatten the 2-D array of spots to get the scores by filters.
        const flattenedSpots = [].concat.apply([], spots);

        const whiteScore = flattenedSpots.filter(x => x.color === "white")
            .length;
        const blackScore = flattenedSpots.filter(x => x.color === "black")
            .length;

        return (
            <div className="text-center">
                <div className="row justify-content-center">
                    <div className="col-6 col-lg-1 text-center">Black</div>
                    <div className="col-6 col-lg-1 text-center">White</div>
                </div>
                <div className="row justify-content-center mb-3">
                    <div className="col-6 col-lg-1 text-center">
                        {blackScore}
                    </div>
                    <div className="col-6 col-lg-1 text-center">
                        {whiteScore}
                    </div>
                </div>
                <div>
                    {gameDone ? (
                        <h3>
                            Game over!
                            {blackScore > whiteScore
                                ? " Black wins!"
                                : whiteScore > blackScore
                                    ? " White wins!"
                                    : " It's a tie!"}
                        </h3>
                    ) : (
                        <div />
                    )}
                </div>
                <div>
                    <button
                        className="btn btn-danger mb-2"
                        onClick={this.props.resetGame}
                    >
                        Reset game
                    </button>
                </div>
            </div>
        );
    }
}
