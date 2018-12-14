import React, {Component} from 'react';
import {SecurityStats, StocksService} from '../Stocks/StocksService';
import {Chart} from 'react-google-charts';
import * as lodash from 'lodash';


class MarketState {
    loading: boolean = true;
    stats: SecurityStats[] = [];
}


export default class Market extends Component<any, MarketState> {

    state = new MarketState();

    constructor(props) {
        super(props);

        this.loadStats();
    }

    async loadStats() {
        let stats = await new StocksService().stats();

        stats = lodash.sortBy(stats, ['monthlyCap']).reverse();

        const minors = new SecurityStats('Other issuers', 0, 0, null);

        for (let i = 50; i < stats.length; i++) {
            minors.dailyCap += stats[i].dailyCap;
            minors.monthlyCap += stats[i].monthlyCap;
        }

        stats = stats.slice(0, 49);
        stats.push(minors);

        this.setState({
            stats,
            loading: false
        });
    }

    asPercent(value: number): string {
        if (isNaN(value)){
            console.log('NAN');
        }

        let sign = '';
        if (value > 0) sign = '+';
        return sign + (value * 100).toFixed(2) + '%';
    }

    generateDataForChart() {

        const descriptionRow = ['Code', 'Parent', 'Capitalization (size)', 'Market change (color)'];
        const rootRow = ['Global', null, 0, 0];

        const dataRows = this.state.stats.map(stat => {
            return [stat.code + ' ' + this.asPercent(stat.priceDelta), 'Global', stat.monthlyCap, stat.priceDelta];
        });

        return [
            descriptionRow,
            rootRow,
            ... dataRows
        ];
    }


    render() {
        return (
            <div style={{display: 'flex', flex: '1 1 auto', height: '100%', alignItems: 'stretch', justifyContent: 'stretch'}}>
                {!this.state.loading && <Chart
                    width={'100%'}
                    // height={'100%'}
                    style={{display: 'flex', flex: '1 1 auto'}}
                    chartType="TreeMap"
                    loader={<div>Loading Chart</div>}
                    data={this.generateDataForChart()}
                    options={{
                        minColor: '#f00',
                        midColor: '#ddd',
                        maxColor: '#0d0',
                        headerHeight: 15,
                        fontColor: 'black',
                        // showScale: true,
                        // useWeightedAverageForAggregation: true
                    }}
                    rootProps={{ 'data-testid': '1' }}
                />}
            </div>
        );
    }
}
