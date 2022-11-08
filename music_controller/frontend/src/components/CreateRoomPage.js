import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import { Link } from "react-router-dom";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { Collapse } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";

/*
export default class CreateRoomPage extends Component {
    defaultVotes = 2;

    constructor(props) {
        super(props);
    }

    render() {
        return 
            <Grid container spacing={1}>
                <Grid item xs={12} align="center">
                    <Typography component="h4" variant="h4">
                        Create a Room
                    </Typography>
                </Grid>
            </Grid>
    }
}
*/

export default class CreateRoomPage extends Component {
    // sets default values for fields if none are given
    static defaultProps = {
        votesToSkip: 2,
        guestCanPause: true,
        update: false,
        roomCode: null,
        updateCallback: () => {},
    }

    constructor(props) {
        super(props);
        // state constructors refreshes the page anytime the code is edited
        this.state = {
            guestCanPause: this.props.guestCanPause,
            votesToSkip: this.props.votesToSkip,
            errorMsg: "",
            successMsg: ""
        };

        this.handleVotesChange = this.handleVotesChange(this);
        this.handleGuestPause = this.handleGuestPause(this);
        this.handleRoomButtonPressed = this.handleRoomButtonPressed.bind(this);
        this.handleUpdateButtonPressed = this.handleUpdateButtonPressed.bind(this);
    }

    // grabs the value of the textfield and changes votesToSkip
    handleVotesChange(e) {
        this.setState({
            votesToSkip: e.target.value,
        });
    }

    // make guestCanPause true if e.target.value is true
    handleGuestCanPause(e) {
        this.setState({
            guestCanPause: e.target.value === "true" ? true : false,
        });
    }

    handleRoomButtonPressed(e) {
        // defines what fields the post request contains
        const requestOptions = {
            method: 'POST',
            // tells us what type of content is coming in
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                // these must equal the same text as what the serializer retrieves in serializers.py
                votes_to_skip: this.state.votesToSkip,
                guest_can_pause: this.state.guestCanPause
            }),
        };
        // fetches the request sent to "/api/create-room"
        // it will contain requestOptions with the format described above
        // then we print the data out
        // this.props.history.push('/room' + data.code) grabs the room code from '/room'
        fetch("/api/create-room", requestOptions).then((response) => 
        response.json()).then((data) => this.props.history.push('/room' + data.code));
    }

    handleUpdateButtonsPressed() {
        // defines what fields the post request contains
        const requestOptions = {
            method: 'PATCH',
            // tells us what type of content is coming in
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                // these must equal the same text as what the serializer retrieves in serializers.py
                votes_to_skip: this.state.votesToSkip,
                guest_can_pause: this.state.guestCanPause,
                code: this.props.roomCode
            }),
        };
        // fetches the request sent to "/api/update-room"
        // it will contain requestOptions with the format described above
        // then we print the data out
        // this.props.history.push('/room' + data.code) grabs the room code from '/room'
        fetch("/api/update-room", requestOptions).then((response) => {
            if (response.ok) {
                this.setState({
                    successMsg : "Room updated successfully!"
                });
            } else {
                this.setState({
                    errorMsg : "Error updating room..."
                })
            }
        });
        this.props.updateCallback();
    }

    renderCreateButtons() {
        return 
            <Grid container spacing={1}>
                <Grid item xs={12} align="center">
                    <Button color="primary" variant="contained" onClick={this.handleRoomButtonPressed}>
                        Create A Room
                    </Button>
                </Grid>
                <Grid item xs={12} align="center">
                    <Button color="primary" variant="contained" to="/" component={Link}>
                        Back
                    </Button>
                </Grid>
            </Grid>
    }

    renderUpdateButtons() {
        return (
            <Grid item xs={12} align="center">
                <Button color="primary" variant="contained"
                    onClick={this.handleUpdateButtonPressed}>
                        Update Room
                </Button>
            </Grid>
        )
    }

    render() {
        /*
        return 
            (<Grid container spacing={1}>
                <Grid item xs={12} align="center">
                    <Typography component="h4" variant="h4">
                        Create a Room
                    </Typography>
                </Grid>
            </Grid>
        */
        const title = this.props.update ? "Update Room" : "Create a Room";
        
        return (
        // spacing tells you how much space between grids x8
            <Grid container spacing={1}>
                <Grid item xs={12} align="center">
                    <Collapse in={this.state.errorMsg != "" || this.state.successMsg != ""}>
                        {this.state.successMsg != "" ? (<Alert severity="success" onClose={() => {this.setState({successMsg: ""});
                    }}>
                        {this.state.successMsg}
                        </Alert>) : (
                        <Alert>{this.state.errorMsg}</Alert>)}
                     </Collapse>
                </Grid>    
                <Grid item xs={12} align="center">
                    <Typography component='h4' variant='h4'>
                        {title}
                    </Typography>  
                </Grid>  
                <Grid item xs={12} align="center">
                    <FormControl component="fieldset">
                        <FormHelperText>
                            <div align="center">
                                Guest Cntrol of Playback State
                            </div>
                        </FormHelperText>
                        <RadioGroup row defaultValue={this.props.guestCanPause.toString()} 
                        onChange={this.handleGuestCanPauseChange}>
                            <FormControlLabel 
                                value="true" 
                                control={<Radio color="primary" />}
                                label="Play/Pause"
                                labelPlacement="bottom"
                                />
                            <FormControlLabel
                                value="false"
                                control={<Radio color="secondary" />}
                                label="No Control"
                                labelPlacement="bottom"
                                />
                        </RadioGroup>
                    </FormControl>
                    <Grid item xs={12} align="center">
                        <FormControl>
                            <TextField 
                                required={true} 
                                type="number" 
                                onChange={this.handleVotesChange}
                                defaultValue={this.state.votesToSkip}
                                inputProps={{
                                    min: 1,
                                    style: { textAlign: "center" },
                                }}
                            />
                            <FormHelperText>
                                <div align="center">Votes Required to Skip Something
                                </div>
                            </FormHelperText>
                        </FormControl>
                    </Grid>
                    {this.props.update
                    ? this.renderUpdateButtons()
                    : this.renderCreateButtons()}
                </Grid>
            </Grid>          
        ); 
    }
     // item xs defines the size of the grid when shrinking or enlarging the screen
}