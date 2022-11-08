import React, { Component } from 'react';
import { 
    Grid, 
    Typography, 
    Card, 
    IconButton, 
    LinearProgress } from "core@material-ui/core";
import PlayArrowIcon from "@material-ui/PlayArrow";
import PauseIcon from "@material-ui/icons/Pause";
import SkipNextIcon from "@material-ui/icons/SkipNext";

export default class MusicPlayer extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        // the song's progress is out of 100
        const progress = (this.props.time / this.props.duration) * 100;

        <Card>
            <Grid container alignItems="center">
                <Grid item align="center" xs={4}>
                    <img src={this.props.image_url} height="100%" width="100%">
                    </img>
                </Grid>
                <Grid item align="center" xs={8}>
                    <Typography component="h5" variant="h5">
                        {this.props.title}
                    </Typography>
                    <Typography color="textSecondary" variant="subtitle1">
                        {this.props.artist}
                    </Typography>
                    <div>
                        <IconButton>
                            {this.props.is_playing ? <PauseIcon /> : <PlayArrowIcon />}
                        </IconButton>
                        <IconButton>
                            <SkipNextIcon/>
                        </IconButton>
                    </div>
                </Grid>
            </Grid>
            <LinearProgress variant="determinate" value={ }></LinearProgress>
        </Card>
    }
}