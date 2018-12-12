import axios from 'axios';
import * as lodash from 'lodash';
import moment from 'moment';
import {Interval} from './SearchParams/StockSearchParams';


export class StocksService {

    private readonly BASE_URL = 'https://iss.moex.com/iss';

    async securities(query?: string): Promise<Security[]> {

        let config: any = {
            params: {
                market: Market.Shares,
                engine: Engine.Stock,
                is_trading: true,
                group_by: 'group',
                group_by_filter: 'stock_shares'
            }
        };

        if (query) {
            config.params.q = query;
        }

        const response: any = await axios.get(`${this.BASE_URL}/securities.json`, config);

        let securities: Security[] = response.data.securities.data.map(Security.fromJSON);
        return lodash.uniqBy(securities, 'code');
    }

    async candles(security: string, mode: Interval = 'daily'): Promise<any[]> {

        let params = null;

        // interval:
        // 10 - 10 минут
        // 60 - 60 минут
        // 24 - сутки
        // 31 - месяц

        switch (mode) {
            case 'hourly':
                params = {
                    from: moment().subtract(3, 'days').startOf('day'),
                    till: moment().endOf('day'),
                    interval: 60
                };
                break;
            case 'daily':
                params = {
                    from: moment().subtract(100, 'days').startOf('day'),
                    till: moment().endOf('day'),
                    interval: 24
                };
                break;
            case 'monthly': {
                params = {
                    from: moment().subtract(20, 'years').startOf('year'),
                    till: moment().endOf('day'),
                    // interval: 60 * 24 * 28
                    interval: 31
                };
                break;
            }
        }

        // "YYYY-MM-DD"

        // let config: any = {params: {from: '2018-12-01', till: '2018-12-07', interval: 60}};

        const config = {params: {
            from: params.from.format('YYYY[-]MM[-]DD'),
            till: params.till.format('YYYY[-]MM[-]DD'),
            interval: params.interval
        }};

        // /iss/engines/[engine]/markets/[market]/securities/[security]/candles
        const response: any = await axios.get(
            `${this.BASE_URL}/engines/${'stock'}/markets/${'shares'}/securities/${security}/candles.json`,
            // `${this.BASE_URL}/engines/${'stock'}/markets/${'shares'}/boards/${'TQBR'}/securities/${security.code}/candles.json`,
            config
        );

        return response.data.candles.data.map(Candle.fromJSON);
    }

    // Получить историю по всем бумагам на рынке за одну дату. Например:
    // https://iss.moex.com/iss/history/engines/stock/markets/index/securities.xml?date=2010-11-22
}

export enum Engine {
    Stock = 'stock',
    Currency = 'currency',
    Futures = 'futures'
}

export enum Market {
    Shares = 'shares',
    Index = 'index',
    Bonds = 'bonds'
}

export class Security {
    constructor(
        public readonly code: string,
        public readonly title: string
    ) {}

    static fromJSON(json: any): Security {
        return new Security(
            json[1],
            json[4]
        );
    }
}

export class Candle {
    constructor(
        public readonly open: number,
        public readonly close: number,
        public readonly low: number,
        public readonly high: number,
        public readonly value: number, // объём торгов
        public readonly volume: number, // количество акций
        public readonly from: string,
        public readonly till: string
    ) {}

    static fromJSON(json: any): Candle {
        return new Candle(
            json[0],
            json[1],
            json[3],
            json[2],
            json[4],
            json[5],
            json[6],
            json[7]
        );
    }
}