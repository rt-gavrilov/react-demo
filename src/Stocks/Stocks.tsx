import React, {Component} from 'react';
import {Button, Menu, Sidebar, SidebarPushable, SidebarPusher} from 'semantic-ui-react';
import {Candle, StocksService} from './StocksService';
import ReactEcharts from 'echarts-for-react';
import StockSearchParams, {Interval} from './SearchParams/StockSearchParams';
import {RouteComponentProps, withRouter} from 'react-router';
import * as queryString from 'qs';


export class StocksState {
    candles: Candle[] = [];
    sidenavVisible: boolean = true;
    security: string = null;
    interval: Interval = 'daily';
}

class Stocks extends Component<RouteComponentProps, StocksState> {

    state = new StocksState();

    constructor(props) {
        super(props);

        this.reloadUsingQuery();
    }

    queryParsed(props = null) {
        if (! props) {
            props = this.props;
        }
        return queryString.parse(props.history.location.search, { ignoreQueryPrefix: true });
    }

    reloadUsingQuery() {
        const query = this.queryParsed();

        const {interval, security} = query;

        if (!interval || !security) {
            return;
        }

        this.loadCandles(interval, security);
    }

    generatePriceDataForChart(): any[] {
        return this.state.candles.map(candle => {
            return [
                candle.till,
                candle.close,
                candle.open,
                candle.low,
                candle.high
            ]
        });
    }

    generateValueDataForChart(): any[] {
        return this.state.candles.map(candle => (
            [candle.till, candle.volume, candle.value]
        ));
    }

    generateChartData() {
        return {
            series: [{
                id: 'price',
                type: 'candlestick',
                barWidth: '50%',
                data: this.generatePriceDataForChart(),
                yAxisIndex: 0,
                xAxisIndex: 0
            }],
            xAxis: [{
                name: 'Time',
                type: 'time',
                scale: true,
                boundaryGap: true,
            }],
            yAxis: [{
                name: 'Price',
                scale: true,
                // offset: 10,
                // min: 0,
                boundaryGap: true
            }]
        };
    }

    generateVolumeChartData() {
        return {
            series: [{
                itemStyle: {
                    normal: {
                        color: 'rgba(0,0,255, 0.5)'
                    }
                },
                type: 'bar',
                barWidth: '50%',
                data: this.generateValueDataForChart(),
                yAxisIndex: 1
            }],
            xAxis: [{
                name: 'Time',
                type: 'time',
                scale: true,
                boundaryGap: true,
            }],
            yAxis: [{
                name: 'Value',
                scale: true,
                min: 0,
                boundaryGap: [0.2, 0.2]
            }, {
                name: 'Volume',
                scale: true,
                min: 0,
                boundaryGap: [0.2, 0.2]
            }]
        };
    }

    toggleSidenav = () => this.setState({ sidenavVisible: ! this.state.sidenavVisible });

    async loadCandles(interval: Interval, securityCode: string) {
        const candles = await new StocksService().candles(securityCode, interval);

        this.setState({
            candles
        });
    }

    shouldComponentUpdate(props: RouteComponentProps, state: StocksState): boolean {
        const query = this.queryParsed(props);

        return this.state.security != query.security || this.state.interval != query.interval;
    }

    componentWillReceiveProps(props: RouteComponentProps, state: StocksState) {
        const query = this.queryParsed(props);

        if (this.state.security == query.security && this.state.interval == query.interval) {
            return;
        }

        this.reloadUsingQuery();
    }

    render() {

        const {sidenavVisible} = this.state;

        const {interval, security} = this.queryParsed();

        let pusherStyles: any = {
            width: sidenavVisible ? 'calc(100% - 260px)' : '100%'
        };

        return (
            <SidebarPushable style={{flex: '1 1 auto'}}>
                <Sidebar
                    as={Menu}
                    animation="push"
                    inverted
                    style={{padding: '8px'}}
                    vertical
                    visible={sidenavVisible}
                >
                    <StockSearchParams interval={interval} security={security}/>
                </Sidebar>

                <SidebarPusher style={pusherStyles}>
                    <Button icon="angle left" onClick={this.toggleSidenav}/>

                    <ReactEcharts
                        option={this.generateChartData()}
                        notMerge={true}
                        lazyUpdate={true}
                        style={{height: '300px'}}
                    />
                    <ReactEcharts
                        option={this.generateVolumeChartData()}
                        notMerge={true}
                        lazyUpdate={true}
                        style={{height: '300px'}}
                    />
                </SidebarPusher>
            </SidebarPushable>
        )
    }
}


export default withRouter(Stocks);
