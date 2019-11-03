const Splitter = require('../src');

(() => {
    const input = 'นายดราก้อน ตันเด้อ   อาคารเอ ชั้น  10    (081-234-5678) ห้อง 3  เขตพญาไท กรุงเทพมหานคร แขวงสามเสนใน 10400';
    console.time('execution time')
    const result = Splitter.split(input);
    console.log('result :', { input, result });
    console.timeEnd('execution time')
})();