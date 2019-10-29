const Splitter = require('../splitter');

(async () => {
    const input = "ดอกฝ้าย สายเขียว 799/11 ถนนจักรแก้ว แขวงวังบูรพาภิรมย์ เขตพระนคร  กรุงเทพ 10200 เบอร์ 0911222333";
    const result = await Splitter.split(input);
    console.log('result :', { input, result });
})();