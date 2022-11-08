import React, { Component } from "react";
import { render } from "react-dom";
import HomePage from "./HomePage";
import JoinRoomPage from "./JoinRoomPage";
import CreateRoomPage from "./CreateRoomPage";
import zIndex from "@material_ui/core/styles/zIndex";

// This main Component will return something (line 11) and will be placed in a div
export default class App extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div classname="center">
                <HomePage></HomePage>
                <JoinRoomPage></JoinRoomPage>
                <CreateRoomPage></CreateRoomPage>
            </div>
        )
    }
}

const appDiv = document.getElementById("app");
render(<App />, appDiv); // A prop is an attribute that modifies the component

// This is a component
// React takes a bunch of components and renders other components
//
