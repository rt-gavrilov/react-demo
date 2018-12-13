import React, {Component} from 'react';
import {Image, Menu} from 'semantic-ui-react';
import classes from './NavBar.module.scss';
import {NavLink} from 'react-router-dom';

export class NavBar extends Component<any> {
    render() {
        return (
            <Menu inverted className={this.props.className}>
                <Menu.Menu style={{marginLeft: '50%'}}>
                    <Menu.Item as={Nav} name='Stocks' to="/stocks"/>
                    <Menu.Item as={Nav} name='Market' to="/market"/>
                </Menu.Menu>
                <Menu.Menu position="right">
                    <Menu.Item as={Nav} name='About' to="/about"/>
                    <Menu.Item href="https://github.com/rt-gavrilov/angular-demo" target="_blank">
                        <Image src="/assets/github.logo.png" circular size="mini" className={classes.github_logo}/>
                    </Menu.Item>
                </Menu.Menu>
            </Menu>
        );
    }
}


const Nav = props => (
    <NavLink
        exact
        {...props}
        activeClassName="active"
    />
);