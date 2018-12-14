import React, {Suspense, Component} from 'react';
import {Route} from 'react-router-dom';
import {NavBar} from './NavBar/NavBar';
import classes from './App.module.scss';
import {Switch} from 'react-router';


const About = React.lazy(() => import('./About/About'));
const Market = React.lazy(() => import('./Market/Market'));
const Stocks = React.lazy(() => import('./Stocks/Stocks'));
const Home = React.lazy(() => import('./Home/Home'));


export class App extends Component<any> {

    render() {
        return (
            <>
                <NavBar className={classes.navbar}/>
                <div className={classes.content}>
                    <Suspense fallback={<></>}>
                        <Switch>
                            <Route path="/" exact component={Home}/>
                            <Route path="/about" component={About}/>
                            <Route path="/market" component={Market}/>
                            <Route path="/stocks" exact component={Stocks}/>
                            <Route path="/stocks/:id/:interval" component={Stocks}/>
                        </Switch>
                    </Suspense>
                </div>
            </>
        );
    }
}
