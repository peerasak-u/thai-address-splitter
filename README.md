# Thai Address Splitter

## Example

basic split
```js
const Splitter = require('../splitter');

(async () => {
    const input = 'คุณดอกฝ้าย สายเขียว 799/11 ถนนจักรแก้ว แขวงวังบูรพาภิรมย์ เขตพระนคร  กรุงเทพ 10200 เบอร์ 0911222333';
    const result = Splitter.split(input);
    console.log('result :', { input, result });
})();
```

## Tests
```
npm run test
```

## Know issues
- [ ] แยกชื่อไม่ได้ถ้าไม่มีคำนำหน้า
- [ ] ชื่อหรือนามสกุลที่คล้ายหรือเหมือนกับ ตำบล อำเภอ จังหวัด จะโดนตัดออก
- [ ] ถ้า input ใส่ชื่อ อำเภอ จังหวัด แบบย่อๆ เช่น "กรุงเทพ" แทนที่จะเป็น "กรุงเทพมหานคร" ชื่อพวกนั้นจะถูกส่งไปเก็บไว้ใน address ด้วย