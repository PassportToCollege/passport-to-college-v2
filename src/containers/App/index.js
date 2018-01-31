import './App.css';

import React, { Component } from 'react';

import Hamburger from "../Hamburger";
import Navigation from "../Navigation";

class App extends Component {
     render() {
        return (
            <div className="app">
                <Hamburger />
                <div className="app__main">
                    <Navigation />
                </div>
            </div>
        );
    }
}

export default App;
