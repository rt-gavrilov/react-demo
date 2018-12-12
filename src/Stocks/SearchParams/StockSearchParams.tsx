import React, {Component} from 'react';
import {Button, ButtonGroup, Label, Search, SearchProps, SearchResultData, SearchResultProps} from 'semantic-ui-react';
import {Security, StocksService} from '../StocksService';
import {Subject} from 'rxjs';
import {debounceTime} from 'rxjs/operators';
import {RouteComponentProps, withRouter} from 'react-router';
import {sleep} from '../../AsyncUtils';
import queryString from 'qs';
import * as lodash from 'lodash';

export type Interval = 'hourly' | 'daily' | 'monthly';

class StocksSearchParamsState {
    loading: boolean = false;
    query: string = '';
    selected: Security = null;
    results: Security[] = [];
    // interval: Interval = 'daily';
}

interface StockSearchParamsProps extends RouteComponentProps {
    security?: string,
    interval?: Interval
    // onChange: (security: Security, interval: Interval) => void;
}

class StockSearchParams extends Component<StockSearchParamsProps, StocksSearchParamsState> {

    state = new StocksSearchParamsState();

    private searchDebouncer: Subject<string> = new Subject<string>();

    constructor(props) {
        super(props);

        this.searchDebouncer
            .pipe(debounceTime(500))
            .subscribe(value => this.search(value));
    }

    async search(query: string) {
        this.setState({
            loading: true
         });

        const securities = await new StocksService().securities(query);

        this.setState({
            results: securities.slice(),
            loading: false
        });
    };

    onResultSelect = async (e: React.MouseEvent<HTMLElement>, data: SearchResultData) => {
        this.setState({
            selected: data.result,
            query: data.result.code
        });

        await sleep(10);

        this.updateQuery(data.result.code);
    };

    onIntervalChanged = async (value: Interval) => {
        this.updateQuery(null, value);
    };

    updateQuery(security: string = null, interval: Interval = null) {

        const currentQuery = queryString.parse(this.props.history.location.search, { ignoreQueryPrefix: true });

        const query = {
            security: security || currentQuery.security,
            interval: interval || currentQuery.interval
        };

        if (lodash.isMatch(currentQuery, lodash.pickBy(query, lodash.identity))) {
            return;
        }

        this.props.history.push({
            pathname: '/stocks',
            search: "?" + queryString.stringify(query)
        });
    }

    onSearchChange = (e: React.MouseEvent<HTMLElement>, props: SearchProps) => {
        this.setState({ query: props.value });

        if (this.state.loading) {
            return;
        }

        this.searchDebouncer.next(props.value);
    };

    render() {

        const query = this.state.query || this.props.security;

        const {loading, results} = this.state;
        const {interval} = this.props;

        const resultRenderer = (props: SearchResultProps) => (
            <div>
                <Label content={props.code} /><br/>
                {props.title}
            </div>
        );

        return (
            <>
                <Search fluid
                        placeholder="Search for security"
                        loading={loading}
                        onResultSelect={this.onResultSelect}
                        onSearchChange={this.onSearchChange}
                        results={results}
                        value={query}
                        input={{fluid: true}}
                        resultRenderer={resultRenderer}
                />
                <br/>
                <ButtonGroup vertical fluid>
                    <Button primary={interval == 'hourly'} onClick={() => this.onIntervalChanged('hourly')}>Hourly</Button>
                    <Button primary={interval == 'daily'}  onClick={() => this.onIntervalChanged('daily')}>Daily</Button>
                    <Button primary={interval == 'monthly'} onClick={() => this.onIntervalChanged('monthly')}>Monthly</Button>
                </ButtonGroup>
            </>
        );
    }

    componentWillUnmount() {
        this.searchDebouncer.unsubscribe();
    }
}


export default withRouter(StockSearchParams);