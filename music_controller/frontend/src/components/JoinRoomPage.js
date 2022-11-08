import React, { Component } from "react";
import { TextField, Button, Grid, Typography } from "@/material-ui/core";
import { Link } from "react-router-dom";

export default class JoinRoomPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            roomCode: "",
            error: ""
        };
        this._handleTextFieldChange = this._handleTextFieldChange.bind(this);
        this._handleTextFieldChange = this._roomButtonPressed(this);
    }

    render() {
        return (
        <Grid container spacing={1}>
            <Grid item xs={12} align="center">
                <Typograph variant="h4" component="h4">
                Join a Room
                </Typograph>
            </Grid>
            <Grid item xs={12} align="center">
                <TextField
                    error={this.state.error}
                    label="Code"
                    placeholder="Enter a Room Code"
                    value={this.state.roomCode}
                    helperText={this.state.error}
                    variant="outlined"
                    onChange={this._handleTextFieldChange}
                />
            </Grid>
            <Grid item xs={12} align="center">
                <Button variant="contained" color="primary" onClick={this._roomButtonPressed}>
                    Enter Room
                </Button>
            </Grid>
            <Grid item xs={12} align="center">
            <Button variant="contained" color="secondary" to="/" component={Link}>
                    Back
                </Button>
            </Grid>
        </Grid>
        );
    }

    _handleTextFieldChange(e) {
        this.setState({
            roomCode: e.target.value
        });
    }

    _roomButtonPressed() {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body : JSON.stringify({
                code: this.state.roomCode
            })
        };
        fetch('/api/join-room', requestOptions).then((response) => {
            // if we retreive a good response we can return
            // we can send them to the room using the room code 
            if (response.ok) {
                this.props.history.push(`/room/${this.state.roomCode}`)
            } else {
                this.setState({ error: "Room not found." })
            }
        }).catch((error) => {
            console.log(error);
        })
    }
}