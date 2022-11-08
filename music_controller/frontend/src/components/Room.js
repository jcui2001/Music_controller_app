import React, { Component } from "react";
import { Grid, Button, Typography, IconButton } from "@material-ui/core";
import { Link } from "react-router-dom";
import CreateRoomPage from "./CreateRoomPage";
import MusicPlayer from "./MusicPlayer";

export default class Room extends Component {
    constructor(props) {
        super(props);
        this.state = {
            votesToSkip: 2,
            guestCanPause: false,
            isHost: false,
            showSettings: false,
            spotifyAuthenticated: false,
            song: {}
        };
        // assigns a room code to the room
        this.roomCode = this.props.match.params.roomCode;
        this.leaveButtonPressed = this.LeaveButtonPressed.bind(this);
        this.updateShowSettings = this.updateShowSettings.bind(this);
        this.renderSettingsButton = this.renderSettingsButton.bind(this);
        this.renderSettings = this.renderSettings.bind(this);
        this.getRoomDetails = this.getRoomDetails.bind(this);
        this.authenticateSpotify = this.authenticateSpotify.bind(this);
        this.getCurrentSong = this.getCurrentSong.bind(this);
        this.getRoomDetails();
        this.getCurrentSong();
    }

    componentDidMount() {
        this.interval = setInterval(this.getCurrentSong, 1000)
    }

    // makes sure that component has mounted
    componentWillUnmount() {
        clearInterval(this.interval);
    }

    getRoomDetails() {
        return fetch('/api/get-room' + '?code=' + this.roomCode).then((response) => {
            if (!response.ok) {
                this.props.leaveRoomCallback();
                this.props.history.push('/');
            }
            return response.json();
        }).then((data) => {
            this.setState({
                votesToSkip: data.votes_to_skip,
                guestCanPause: data.guest_can_pause,
                isHost: data.is_host
            });
            if (this.state.isHost) {
                this.authenticateSpotify();
            }
        });
    }

    authenticateSpotify() {
        fetch('/spotify/is-authenticated').then((response) => response.json())
        .then((data) => {
            this.setState({ spotifyAuthenticated: data.status })
            if (!data.status) {
                fetch('/spotify/get-auth-url').then((response) => response.json())
                .then((data) => {
                    /* a way to redirect to the spotify authorization page */
                    window.location.replace(data.url)
                })
            }
        })
    }

    getCurrentSong() {
        fetch('/spotify/current-song').then((response) => {
            if (!response.ok) {
                return {};
            } else {
                return response.json();
            }
        })
        .then((data) => this.setState({song: data}))
    }

    leaveButtonPressed() {
        const requestOptions = {
            method: 'POST',
            headers: { "Content-Type" : "application/json" },
        };
        fetch("/api/leave-room", requestOptions).then((_response) => {
            this.props.history.push("/");
        });
    }

    updateShowSettings(value) {
        this.setState({
            showSettings: value,
        });
    }

    renderSettings() {
        return (
            <Grid container spacing={1}>
                <Grid item xs={12} align="center">
                    <CreateRoomPage update={true} 
                        // sets the default/given fields
                        votesToSkip={this.state.votesToSkip}
                        guestCanPause={this.state.guestCanPause}
                        roomCode={this.roomCode}
                        updateCallback={this.getRoomDetails}>
                    </CreateRoomPage>
                </Grid>
                <Grid item xs={12} align="center">
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => this.updateShowSettings(false)}>
                            Close
                    </Button>
                </Grid>
            </Grid>
        )
    }

    renderSettingsButton() {
        return (
            <Grid item xs={12} align="center">
                <Button variant="contained" color="primary" onClick={(true)}>
                    Settings
                </Button>
            </Grid>
        )
    }

    render() {
        if (this.state.showSettings) {
            return this.renderSettings();
        }
        return (
            <Grid container spacing={1}>
                <Grid item xs={12} align="center">
                    <Typography variant="h4" component="h4">
                        {this.roomCode}
                    </Typography>
                </Grid>
                <MusicPlayer {...this.state.song}/>
                {this.state.isHost ? this.renderSettingsButton() : null}
                <Grid item xs={12} align="center">
                    <Button variant="contained" color="secondary" to="/" component={Link}>
                        Leave Room
                    </Button>
                </Grid>
            </Grid>
        );
    }
}