// Yarn imports
import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";


// Local imports
import "./styles/index.css";
import App from "./components/App";
import registerServiceWorker from "./registerServiceWorker";
import store from "./store";

// What we are rendering
const rendering = (
    <Provider store={store}>
        <App />
    </Provider>
);

// Rendering
ReactDOM.render(rendering, document.getElementById("root"));
registerServiceWorker();
