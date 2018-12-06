import React, {Component} from 'react';
import {Menu, MenuItem, Image} from 'semantic-ui-react';
import classes from './NavBar.module.scss';

export class NavBar extends Component<any> {

    state = {
        activeItem: 'home'
    };

    render() {

        const { activeItem } = this.state;

        return (
            <Menu inverted className={this.props.className}>
                <MenuItem name='About' href="/about" active={activeItem === 'home'}/>
                <MenuItem name='Stocks' href="/stocks" active={activeItem === 'messages'}/>
                <MenuItem href="https://github.com/rt-gavrilov/angular-demo" target="_blank" position="right">
                    <Image src="/assets/github.logo.png" circular size="mini" className={classes.github_logo}/>
                </MenuItem>
            </Menu>
        );
    }
}
