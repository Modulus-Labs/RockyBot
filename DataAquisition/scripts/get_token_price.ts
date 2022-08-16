import config from '../config';


import { createClient, gql } from 'urql';

export type TokenPriceSliceData = {
  id: String,
  price: number,
  time: Date,
  high: number,
  low: number,
  high24Hour?: number,
  low24Hour?: number,
}


const tokensQuery = gql`query poolHourDataUSDC($token_address: ID!, $starttime_unix: Int!, $endtime_unix: Int!) { 
  usdcFirst: poolHourDatas(where: {
  pool_: {token0: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
  token1: $token_address}
  periodStartUnix_gt: $starttime_unix
  periodStartUnix_lt: $endtime_unix}) {
    id
    pool {
      usdc: token0 {name}
      token: token1 {name}
    }
    usdcPrice: token0Price
    tokenPrice: token1Price
    periodStartUnix
    open
    high
    low
    close
  }
  usdcSecond: poolHourDatas(where: {
    pool_: {token1: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
    token0: $token_address}
    periodStartUnix_gt: $starttime_unix
  	periodStartUnix_lt: $endtime_unix}) {
      id
      pool {
        token: token0 {name}
        usdc: token1 {name}
      }
      tokenPrice: token0Price
      usdcPrice: token1Price
      periodStartUnix
      open
      high
      low
      close
    }
  }`
  
// var schema = {
//     properties: {
//       token_name: {
//         default: 'Wrapped Ether'
//       },
//       token_address: {
//         default: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'
//       },
//       date_start: {
//         default: '2022/07/23'
//       },
//       date_end: {
//         default: '2022/07/25'
//       }
//     }
// };
// prompt.start();

// prompt.get(schema, async function (err, result) {
//     var token_name = result.token_name as string;
//     var token_address = result.token_address as string;
//     var starttime = Date.parse(result.date_start as string);
//     var endtime = Date.parse(result.date_end as string);
//     var data = await getTokensQuery(token_name, token_address, new Date(starttime), new Date(endtime));
//     console.log(data);
// });

// getTokensQuery('eth', '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2', new Date(Date.parse('2022/01/01')), new Date(Date.parse('2022/07/27'))).then(async (eth_data) => {
//   var btc_data = await getTokensQuery('btc', '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599', new Date(Date.parse('2022/01/01')), new Date(Date.parse('2022/07/27')));
//   var output = "eth_time,eth_price,eth_high,eth_low,eth_24hourhigh,eth_24hourlow,btc_time,btc_price,btc_high,btc_low,btc_24hourhigh,btc_24hourlow\n";

//   console.log(`Eth Data Length: ${eth_data.length}; Btc Data Length: ${btc_data.length}`)
//   for (let iii = 0; iii < eth_data.length && iii < btc_data.length; iii++) {
//     output += `${eth_data[iii].time.toUTCString()},${eth_data[iii].price},${eth_data[iii].high},${eth_data[iii].low},${eth_data[iii].high24Hour},${eth_data[iii].low24Hour},${btc_data[iii].time.toUTCString()},${btc_data[iii].price},${btc_data[iii].high},${btc_data[iii].low},${btc_data[iii].high24Hour},${btc_data[iii].low24Hour}\n`
//   }

//   fs.writeFileSync('./resourcesNew/processedEthBtcPriceData_2.csv', output);
// });

//getTokensQuery('eth', '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2', new Date(Date.parse('2022/07/23')), new Date(Date.parse('2022/07/30'))).then((data) => console.log(data))

//getTokensQuery('btc', '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599', new Date(Date.parse('2022/06/01')), new Date(Date.parse('2022/07/30')));



async function getTokensQueryPerDay(token_address: String, starttime: number, endtime: number): Promise<any> {
  const client = createClient({
      url: config.API_URL,
  });

  var variables = {
    token_address: token_address,
    starttime_unix: Math.floor(starttime/1000),
    endtime_unix: Math.ceil(endtime/1000)
  }

  var data = await client.query(tokensQuery, {
    token_address: token_address,
    starttime_unix: Math.floor(starttime/1000),
    endtime_unix: Math.ceil(endtime/1000)
  }).toPromise();
  //console.log(data);
  return data;
}

export async function getTokensQuery(token_name: string, token_address: string, startdate: Date, enddate: Date): Promise<Array<TokenPriceSliceData>> {
  var usdcFirst = false;
  var raw: Array<any> = [];
  //get different days data in different queries to reduce strain on API
  for (let starttime = startdate; starttime <= enddate; starttime = new Date(starttime.getTime()+(24*60*60*1000))) {
    console.log(`Getting data for ${token_name} from ${starttime.toUTCString()}`);
    var naive_enddate = starttime.getTime() + (24*60*60*1000)
    var data = (await getTokensQueryPerDay(token_address, starttime.getTime()-10000, naive_enddate <= enddate.getTime() ? naive_enddate : enddate.getTime())).data;
    if(data == undefined) { console.log('retry 1'); var data = (await getTokensQueryPerDay(token_address, starttime.getTime()-10000, starttime.getTime() + (24*60*60*1000))).data;}
    if(data == undefined) { console.log('retry 2'); var data = (await getTokensQueryPerDay(token_address, starttime.getTime()-10000, starttime.getTime() + (24*60*60*1000))).data;}
    raw.push(data.usdcFirst);
    raw.push(data.usdcSecond);
    usdcFirst = data.usdcFirst.length != 0 ? true : data.usdcSecond.length != 0 ? false : usdcFirst;
  }
  console.log(usdcFirst);
  //console.log(data);
  //console.log(raw);
  raw = raw.flat();
  //parse output into friendly types
  var output: Array<TokenPriceSliceData> = raw.map((item: any): TokenPriceSliceData => {
    return {
      id: token_name,
      price: Number.parseFloat(item.usdcPrice),
      time: new Date(item.periodStartUnix*1000),
      high: usdcFirst ? Number.parseFloat(item.high) : (1/Number.parseFloat(item.high)),
      low: usdcFirst ? Number.parseFloat(item.low) : (1/Number.parseFloat(item.low)),
    }
  });
  //console.log(output);
  //group data from different pools based on their timestamp
  var outputGrouped: Map<String, Array<TokenPriceSliceData>> = output.reduce(function (running, current) {
    running.set(current.time.toUTCString(), running.get(current.time.toUTCString()) || new Array());
    running.get(current.time.toUTCString()).push(current);
    return running;
  }, new Map());
  //console.log(outputGrouped);
  //average price data across pools
  var outputAveraged: Array<TokenPriceSliceData> = [];
  outputGrouped.forEach((items) => {
    outputAveraged.push({
      id: items[0].id,
      time: items[0].time,
      price: (items.reduce((running, current) => {return running + current.price}, 0) / items.length),
      high: (items.reduce((running, current) => {return running + current.high}, 0) / items.length),
      low: (items.reduce((running, current) => {return running + current.low}, 0) / items.length)
    });
  });

  //sort array based on dates
  var outputSorted = outputAveraged.sort((a: TokenPriceSliceData, b: TokenPriceSliceData) => b.time.getTime() - a.time.getTime());

  //insert averaged price data whenever an hour is missing data
  for (var index = 0; index < outputSorted.length - 1; index++) {
    //console.log(`Interpolation index: ${index}; Array Length: ${outputSorted.length}`)
    if(index != outputSorted.length - 1) {
      //console.log(`TimeCurrent: ${outputSorted[index].time.toUTCString()}; TimeNext: ${outputSorted[index+1].time.toUTCString()}; TimeDiff: ${outputSorted[index].time.getTime() - outputSorted[index+1].time.getTime()}`)
      if((outputSorted[index].time.getTime() - outputSorted[index+1].time.getTime() > (60*60*1000))) {
        var insertion = {
          id: outputSorted[index].id,
          time: new Date(outputSorted[index].time.getTime() - (60*60*1000)),
          price: (outputSorted[index].price + outputSorted[index+1].price) / 2,
          high: (outputSorted[index].high + outputSorted[index+1].high) / 2,
          low: (outputSorted[index].low + outputSorted[index+1].low) / 2
        }
        console.log(`Inserted interpolated data at ${insertion.time.toUTCString()}`);
        outputSorted.splice(index+1, 0, insertion);
      }
    }
  }
  
  //add 24 hour high and low based on rolling window
  outputSorted.forEach((item, index, array) => {
    item.high24Hour = array.slice(index, (index + 23 >= 0 ? index + 23 : 0)).reduce((running, current) => {return running > current.high ? running : current.high;}, 0);
    item.low24Hour = array.slice(index, (index + 23 >= 0 ? index + 23 : 0)).reduce((running, current) => {return running < current.low ? running : current.low;}, Number.MAX_SAFE_INTEGER);
  })
  //console.log(outputSorted);
  return outputSorted;
}


