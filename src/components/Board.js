// Yarn imports
import React, { Component } from "react";
import { connect } from "react-redux";

// Local imports
import { fullMove } from "../actions/actionCreators";

class Board extends Component {
    constructor(props) {
        super(props);

        this.handleClick = this.handleClick.bind(this);
    }

    // Make sure the click is valid, then dispatch an action.
    handleClick(e) {
        const turn = e.target.getAttribute("data-turn");

        const i = e.target.getAttribute("data-i");
        const j = e.target.getAttribute("data-j");

        const vBlack = e.target.getAttribute("data-vblack");

        if (turn === "black" && vBlack === "true") {
            this.props.fullMove(i, j, turn);
        }
    }

    render() {
        const { spots, turn } = this.props.board;

        return (
            <div className="row justify-content-center text-center mb-2">
                <div className="col-12 col-lg-6">
                    {spots.map((row, i) => {
                        return (
                            <div className="row justify-content-center" key={i}>
                                {row.map((spot, j) => {
                                    return spot.color === "empty" ? (
                                        <button
                                            className="spot p-2"
                                            key={String(i) + String(j)}
                                            data-i={i}
                                            data-j={j}
                                            data-turn={turn}
                                            data-vwhite={spot.validWhite}
                                            data-vblack={spot.validBlack}
                                            onClick={this.handleClick}
                                        />
                                    ) : spot.color === "white" ? (
                                        <button
                                            className="spot p-2 white"
                                            key={String(i) + String(j)}
                                        >
                                            <svg height="1.5em" width="1.5em">
                                                <circle
                                                    cx="12.5"
                                                    cy="12.5"
                                                    r="0.5em"
                                                    fill="#eceff4"
                                                />
                                            </svg>
                                        </button>
                                    ) : (
                                        <button
                                            className="spot p-2 black"
                                            key={String(i) + String(j)}
                                        >
                                            <svg height="1.5em" width="1.5em">
                                                <circle
                                                    cx="12.5"
                                                    cy="12.5"
                                                    r="0.5em"
                                                    fill="#2e3440"
                                                />
                                            </svg>
                                        </button>
                                    );
                                })}
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {};
};

const mapDispatchToProps = dispatch => {
    return {
        fullMove: (i, j, turn) => dispatch(fullMove(i, j, turn))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Board);
