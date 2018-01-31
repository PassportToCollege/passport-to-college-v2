import './App.css';

import React, { Component } from 'react';

import Hamburger from "../Hamburger";
import Navigation from "../Navigation";

class App extends Component {
    constructor() {
        super();

        this.state = {
            hamburgerState: "closed"
        }
    }
     render() {
        return (
            <div className="app">
                <Hamburger updateHamburgerState={ newState => { this.setState({ hamburgerState: newState }) } }/>
                <div className="app__main" data-hamburger={this.state.hamburgerState}>
                    <Navigation updateHamburgerState={newState => { this.setState({ hamburgerState: newState }) }} />
                </div>
            </div>
        );
    }
}

export default App;
