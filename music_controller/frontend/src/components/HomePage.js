import React, { Component } from "react";
import JoinRoomPage from "./JoinRoomPage";
import CreateRoomPage from "./CreateRoomPage";
import { Grid, Button, ButtonGroup, Typography } from "@material-ui/core";
import { BrowserRouter as Router, Routes, Route, Link, Redirect } from "react-router-dom";

export default class HomePage extends Component {
    constructor(props) {
        super(props);
        this.setState = {
            roomCode: null,
        };
        this.clearRoomCode = this.clearRoomCode.bind(this);
    }

    // after the page is first rendered, this updates the room code with any existing one which
    // re-renders the page bc of set state
    // async allows the method to run asynchronously so we don't have to wait on this to finish
    // to do other things on the program
    async componentDidMount() {
        fetch("/api/user-in-room")
            .then((response) => response.json())
            .then((data) => {
                this.setState({
                    roomCode: data.code
                });
            });
    }

    // renders home page with buttons
    renderHomePage() {
        return (
            <Grid container spacing={3}>
                <Grid item xs={12} align="center">
                    <Typography variant="h3" compact="h3">
                        Tree House
                    </Typography>
                </Grid>
                <Grid item xs={12} align="center">
                    <ButtonGroup disableElevation variant="contained" color="primary">
                        <Button color="primary" to='/join' component={Link}>
                            Join a Room
                        </Button>
                        <Button color="secondary" to='/join' component={Link}>
                            Create a Room
                        </Button>
                    </ButtonGroup>
                </Grid>
            </Grid>
        )
    }

    clearRoomCode() {
        this.setState({
            roomCode: null,
        });
    }

    // calls the render functions to display
    render() {
        return (
            <Router>
                <Switch>
                    <Route path="/" render={() => {
                        return this.state.roomCode ? (
                        <Redirect to={`/room/${this.state.roomCode}`}></Redirect>
                        ) : (this.renderHomePage())
                    }}>
                        {this.renderHomePage()}
                    </Route>
                    <Route path="/join" component={JoinRoomPage}></Route>
                    <Route path="/create" component={CreateRoomPage}></Route>
                    <Route path="/room/:roomCode" 
                    render={(props) => {
                        return <Room {...props} leaveRoomCallback={this.clearRoomCode} />;
                    }} />
                </Switch>
            </Router>
        )
    } // These routes can connect this render to the path if we give what are in these Route paths to the urls.py
    // renders routes to the other rooms in our website
}