const Splitter = require('../splitter');

(async () => {
    const input = "คุณเบญจมาภรณ์ แสนเมือง 87/216 ช9 หมู่บ้านพฤกษานารา เหมือง เมืองชลบุรี ชลบุรี 20130  = 0631963129";
    const result = Splitter.split(input);
    console.log('result :', { input, result });
})();