import React, {Component} from 'react';
import {Candle, Engine, Market, StocksService} from '../Stocks/StocksService';
import ReactEcharts from 'echarts-for-react';
import {Segment, Grid, GridRow, GridColumn} from 'semantic-ui-react';

class HomeState {
    imoexCandles: Candle[] = [];
    rtsiCandles: Candle[] = [];
    usdCandles: Candle[] = [];
    eurCandles: Candle[] = [];
    goldCandles: Candle[] = [];
    silverCandles: Candle[] = [];
    platinumCandles: Candle[] = [];
    palladiumCandles: Candle[] = [];
    brentCandles: Candle[] = [];
}

class Home extends Component<any, HomeState> {

    state = new HomeState();

    constructor(props) {
        super(props);

        this.loadData();
    }

    async loadData() {

        const [imoexCandles, rtsiCandles, usdCandles, eurCandles] = await Promise.all([
            new StocksService().candles('IMOEX', 'monthly', Market.Index),
            new StocksService().candles('RTSI', 'monthly', Market.Index),
            new StocksService().candles('USD000UTSTOM', 'monthly', Market.Selt, Engine.Currency),
            new StocksService().candles('EUR_RUB__TOM', 'monthly', Market.Selt, Engine.Currency)
        ]);

        const [goldCandles, silverCandles, platinumCandles, palladiumCandles, brentCandles] = await Promise.all([
            new StocksService().candles('GDZ8', 'monthly', Market.Forts, Engine.Futures),
            new StocksService().candles('SVZ8', 'monthly', Market.Forts, Engine.Futures),
            new StocksService().candles('PTZ8', 'monthly', Market.Forts, Engine.Futures),
            new StocksService().candles('PDZ8', 'monthly', Market.Forts, Engine.Futures),
            new StocksService().candles('BRF9', 'monthly', Market.Forts, Engine.Futures)
        ]);

        this.setState({
            imoexCandles,
            rtsiCandles,
            usdCandles,
            eurCandles,
            goldCandles,
            silverCandles,
            platinumCandles,
            palladiumCandles,
            brentCandles
        });
    }

    generateIndicesChartData() {
        return {
            grid: {
                right: 50,
                top: 50,
                left: 50,
                bottom: 50
            },
            legend: {
                orient: 'vertical',
                left: 60,
                top: 60,
                // selectedMode: false,
                backgroundColor: 'rgba(255, 255, 255, 0.75)',
                padding: 8
            },
            series: [{
                name: 'IMOEX',
                type: 'line',
                data: this.state.imoexCandles.map(candle => [candle.till, candle.close]),
                yAxisIndex: 0,
            }, {
                name: 'RTSI',
                type: 'line',
                data: this.state.rtsiCandles.map(candle => [candle.till, candle.close]),
                yAxisIndex: 1,
            }],
            xAxis: [{
                type: 'time',
                scale: true,
                boundaryGap: true,
                splitNumber: 10
            }],
            yAxis: [{
                name: 'IMOEX, \u20BD',
                scale: true,
                boundaryGap: true
            }, {
                name: 'RTSI, $',
                scale: true,
                boundaryGap: true
            }]
        };
    }

    generateCurrenciesChartData() {
        return {
            grid: {
                right: 50,
                top: 50,
                left: 50,
                bottom: 50
            },
            legend: {
                orient: 'vertical',
                left: 60,
                top: 60,
                // selectedMode: false,
                backgroundColor: 'rgba(255, 255, 255, 0.75)',
                padding: 8
            },
            series: [{
                name: 'USD/RUB',
                type: 'line',
                data: this.state.usdCandles.map(candle => [candle.till, candle.close]),
                yAxisIndex: 0,
            }, {
                name: 'EUR/RUB',
                type: 'line',
                data: this.state.eurCandles.map(candle => [candle.till, candle.close]),
                yAxisIndex: 0,
            }],
            xAxis: [{
                type: 'time',
                scale: true,
                splitNumber: 10
            }],
            yAxis: [{
                name: '\u20BD',
                scale: true,
            }]
        };
    }

    generateCommoditiesChartData(name: string, candles: Candle[]) {
        return {
            grid: {
                right: 50,
                top: 50,
                left: 0,
                bottom: 50
            },
            legend: {
                orient: 'vertical',
                left: 60,
                top: 60,
                // selectedMode: false,
                backgroundColor: 'rgba(255, 255, 255, 0.75)',
                padding: 8
            },
            series: [{
                name: name,
                type: 'line',
                data: candles.map(candle => [candle.till, candle.close]),
                yAxisIndex: 0,
            }],
            xAxis: [{
                type: 'time',
                scale: true,
                // splitNumber: 10
            }],
            yAxis: [{
                name: '',
                scale: true,
                position: 'right'
            }]
        };
    }



    render() {

        const indicesChart = <ReactEcharts
            option={this.generateIndicesChartData()}
            notMerge={true}
            lazyUpdate={true}
            style={{height: '300px'}}
        />;

        const currenciesChart = <ReactEcharts
            option={this.generateCurrenciesChartData()}
            notMerge={true}
            lazyUpdate={true}
            style={{height: '300px'}}
        />;

        const commodities = [
            {name: 'Gold', candles: this.state.goldCandles},
            {name: 'Silver', candles: this.state.silverCandles},
            {name: 'Platinum', candles: this.state.platinumCandles},
            {name: 'Palladium', candles: this.state.palladiumCandles},
            {name: 'Brent', candles: this.state.brentCandles},
        ];

        const commodityCharts = commodities.map(value => (
            <GridColumn>
                <ReactEcharts
                    option={this.generateCommoditiesChartData(value.name, value.candles)}
                    notMerge={true}
                    lazyUpdate={true}
                    style={{height: '300px'}}
                />
            </GridColumn>
        ));

        return (
            <Grid style={{margin: '1rem'}}>
                <GridRow columns={2}>
                    <GridColumn>
                        <Segment>
                            <h1>Indices</h1>
                            {indicesChart}
                        </Segment>
                    </GridColumn>
                    <GridColumn>
                        <Segment>
                            <h1>Currencies</h1>
                            {currenciesChart}
                        </Segment>
                    </GridColumn>
                </GridRow>
                <GridRow>
                    <GridColumn>
                    <Segment style={{width: '100%'}}>
                        <h1>Commodities</h1>
                        <Grid columns={5}>
                            {commodityCharts}
                        </Grid>
                    </Segment>
                    </GridColumn>
                </GridRow>
            </Grid>
        );
    }
}

export default Home;