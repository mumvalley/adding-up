'use strict';
const fs = require('fs');
const readline = require('readline');
const rs = fs.createReadStream('./popu-pref.csv');
const rl = readline.createInterface({ 'input': rs, 'output': {} });
const prefecureDataMap = new Map(); // key: 都道府県 val: 集計データのオブジェクト
rl.on('line', (lineString) => {
    const columns = lineString.split(',');
    const year = parseInt(columns[0]);
    const prefecture = columns[1];
    const popu = parseInt(columns[3]);
    if (year === 2010 || year === 2015) {
        let val = prefecureDataMap.get(prefecture);
        if (!val) {
            val = {
                popu10: 0,
                popu15: 0,
                change: null
            };
        }
        if (year === 2010) {
            val.popu10 = popu;
        }
        if (year === 2015) {
            val.popu15 = popu;
        }
        prefecureDataMap.set(prefecture, val);
    }   
});

rl.on('close', () => {
    for (let [key, val] of prefecureDataMap) {
        val.change = val.popu15 / val.popu10;
    }
    const rankingArray = Array.from(prefecureDataMap).sort((pair1, pair2) => {
        return pair2[1].change - pair1[1].change;
    });
    const rankingStrings = rankingArray.map(([key, val]) => {
        return key + ': ' + val.popu10 + '=>' + val.popu15 + ' 変化率:' + val.change;
    })
    console.log(rankingArray);
})