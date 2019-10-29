# Thai Address Splitter

## Example

basic split
```js
const Splitter = require('../splitter');

(async () => {
    const input = 'คุณดอกฝ้าย สายเขียว 799/11 ถนนจักรแก้ว แขวงวังบูรพาภิรมย์ เขตพระนคร  กรุงเทพ 10200 เบอร์ 0911222333';
    const result = await Splitter.split(input);
    console.log('result :', { input, result });
})();
```

multiple split
```js
const Splitter = require('../splitter');

(async () => {
    const inputs = [
        'คุณดอกฝ้าย สายเขียว 799/11 ถนนจักรแก้ว แขวงวังบูรพาภิรมย์ เขตพระนคร  กรุงเทพ 10200 เบอร์ 0911222333',
        'นายดราก้อน ตันเด้อ   อาคารเอ ชั้น  10    081-234-5678 ห้อง 3  เขตพญาไท กรุงเทพมหานคร แขวงสามเสนใน 10400'
    ];
    const result = await Splitter.splits(inputs);
    console.log('result :', { input, result });
})();
```

## Test
```
npm run test
```