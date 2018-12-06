import React, {Component} from 'react';
import {Popup, Grid, GridRow, GridColumn, Container, Image} from 'semantic-ui-react';
import classes from './About.module.scss';

class About extends Component<any> {
    render() {

        const assets = [
            {name: 'React', src: '/assets/react.logo.png', href: 'https://reactjs.org/'},
            {name: 'Semantic UI', src: '/assets/semantic-ui-react.logo.png', href: 'https://react.semantic-ui.com'},
            {name: 'Echarts', src: '/assets/echarts.logo.png', href: 'http://www.echartsjs.com'},
            {name: 'MobX', src: '/assets/mobx.logo.png', href: 'http://www.echartsjs.com'},
            {name: 'Typescript', src: '/assets/typescript.logo.png', href: 'http://www.typescriptlang.org'},
            {name: 'SASS', src: '/assets/sass.logo.png', href: 'http://sass-lang.com/'},
            {name: 'NPM', src: '/assets/npm.logo.png', href: 'https://npmjs.org/'},
        ];

        const images = assets.map((asset, index) => {
            return (
                <Image as="a" src={asset.src} href={asset.href} target="_blank" size="tiny"
                       key={asset.name} className={classes["outer_circle_" + (index + 1)]}
                />
            );
        });

        return (
            <Grid columns='equal' className={classes.root}>
                <GridColumn stretched className={classes.icon_container} width={6}>
                    {images}
                </GridColumn>
                <GridColumn className={classes.text_container}>
                    <p>
                        This demo is built with the latest version of <a href="https://reactjs.org/" target="_blank">React</a> library
                        and written fully in <a href="http://www.typescriptlang.org" target="_blank">TypeScript</a>.
                    </p>
                    <p>
                        And it's meant to be something more special than just yet-another-todo-app.
                    </p>
                </GridColumn>
             </Grid>
        );
    }
}

export default About;