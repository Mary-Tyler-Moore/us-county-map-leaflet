import React, { Component } from 'react'
import {Switch, BrowserRouter as Router } from 'react-router-dom';
import County from "./County"
import States from "./State"
import Nroute from "./utilities/NormalRoute"

export default class App extends Component {
    render() {
        return (
            <Router>
                <Switch>
                    <Nroute exact path="/" component={States} />
                    <Nroute exact path="/county" component={County}/>
                </Switch>
            </Router>
        )
    }
}
