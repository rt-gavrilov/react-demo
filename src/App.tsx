import React, {Component} from 'react';
import {Route} from 'react-router-dom';
import About from './About/About';
import {NavBar} from './NavBar/NavBar';
import classes from './App.module.scss';

export class App extends Component<any> {

    render() {
        return (
            <>
                <NavBar className={classes.navbar}/>
                <div className={classes.content}>
                    <Route path="/about" component={About}/>
                </div>
            </>
        );
    }
}
