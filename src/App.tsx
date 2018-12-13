import React, {Component} from 'react';
import {Route} from 'react-router-dom';
import About from './About/About';
import {NavBar} from './NavBar/NavBar';
import classes from './App.module.scss';
import Stocks from './Stocks/Stocks';
import {Redirect, Switch} from 'react-router';
import {Market} from './Market/Market';

export class App extends Component<any> {

    render() {
        return (
            <>
                <NavBar className={classes.navbar}/>
                <div className={classes.content}>
                    <Switch>
                        <Route path="/about" component={About}/>
                        <Route path="/market" component={Market}/>
                        <Route path="/stocks" exact component={Stocks}/>
                        <Route path="/stocks/:id/:interval" component={Stocks}/>
                        <Redirect exact from="/" to="/about"/>
                    </Switch>
                </div>
            </>
        );
    }
}
