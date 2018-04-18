// Yarn imports
import React, { Component } from "react";
import { connect } from "react-redux";

// Local imports
import Header from "./Header";
import Score from "./Score";
import Board from "./Board";

import { resetGame } from "../actions/actionCreators";

class App extends Component {
    render() {
        return (
            <div className="container-fluid">
                <Header />
                <Score {...this.props} />
                <Board {...this.props} />
            </div>
        );
    }
}

const mapStateToProps = state => {
    const { board } = state;

    return {
        board
    };
};

const mapDispatchToProps = dispatch => {
    return {
        resetGame: () => dispatch(resetGame())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
