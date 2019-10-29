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
        'คุณสวยมาก พรหมสาแขน ณ หนองหาร 12 หมู่ 1 บ้านดงเต่า ตำบลเต่างอย อำเภอเต่างอย  สกลนคร เบอร์ 0819992220',
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

## Know issues
- [ ] แยกชื่อไม่ได้ถ้าไม่มีคำนำหน้า
- [ ] ชื่อหรือนามสกุลที่คล้ายหรือเหมือนกับ ตำบล อำเภอ จังหวัด จะโดนตัดออก
- [ ] ถ้า input ใส่ชื่อ อำเภอ จังหวัด แบบย่อๆ เช่น "กรุงเทพ" แทนที่จะเป็น "กรุงเทพมหานคร" ชื่อพวกนั้นจะถูกส่งไปเก็บไว้ใน address ด้วย