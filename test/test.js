const assert = require('assert');
const Splitter = require('../splitter');

const input1 = 'นายดราก้อน ตันเด้อ   อาคารเอ ชั้น  10    (081-234-5678) ห้อง 3  เขตพญาไท กรุงเทพมหานคร แขวงสามเสนใน 10400';
const input2 = 'คุณสวยมาก พรหมสาแขน ณ หนองหาร 12 หมู่ 1 บ้านดงเต่า ตำบลเต่างอย อำเภอเต่างอย  สกลนคร เบอร์ 081-999-2220';

describe('Basic', async () => {
    describe('#name', () => {
        it('should be "นายดราก้อน ตันเด้อ"', async () => {
            const result = await Splitter.split(input1);
            assert.equal(result.name, 'นายดราก้อน ตันเด้อ');
            result.should
        });
    });
    describe('#phone', () => {
        it('should be "0812345678"', async () => {
            const result = await Splitter.split(input1);
            assert.equal(result.phone, '0812345678');
        });
    });
    describe('#address1', () => {
        it('should be "อาคารเอ ชั้น 10 ห้อง 3"', async () => {
            const result = await Splitter.split(input1);
            assert.equal(result.address, 'อาคารเอ ชั้น 10 ห้อง 3');
        });
    });
    describe('#subdistrict', () => {
        it('should be สามเสนใน', async () => {
            const result = await Splitter.split(input1);
            assert.equal(result.subdistrict, 'สามเสนใน');
        });
    });
    describe('#district', () => {
        it('should be พญาไท', async () => {
            const result = await Splitter.split(input1);
            assert.equal(result.district, 'พญาไท');
        });
    });
    describe('#province', () => {
        it('should be กรุงเทพมหานคร', async () => {
            const result = await Splitter.split(input1);
            assert.equal(result.province, 'กรุงเทพมหานคร');
        });
    });
    describe('#zipcode', () => {
        it('should be 10400', async () => {
            const result = await Splitter.split(input1);
            assert.equal(result.zipcode, '10400');
        });
    });
});

describe('lastname with space / No Zipcode', async () => {
    describe('#name', () => {
        it('should be "คุณสวยมาก พรหมสาแขน ณ หนองหาร"', async () => {
            const result = await Splitter.split(input2);
            assert.equal(result.name, 'คุณสวยมาก พรหมสาแขน ณ หนองหาร');
            result.should
        });
    });
    describe('#phone', () => {
        it('should be "0819992220"', async () => {
            const result = await Splitter.split(input2);
            assert.equal(result.phone, '0819992220');
        });
    });
    describe('#address1', () => {
        it('should be "12 หมู่ 1 บ้านดงเต่า"', async () => {
            const result = await Splitter.split(input2);
            assert.equal(result.address, '12 หมู่ 1 บ้านดงเต่า');
        });
    });
    describe('#subdistrict', () => {
        it('should be เต่างอย', async () => {
            const result = await Splitter.split(input2);
            assert.equal(result.subdistrict, 'เต่างอย');
        });
    });
    describe('#district', () => {
        it('should be เต่างอย', async () => {
            const result = await Splitter.split(input2);
            assert.equal(result.district, 'เต่างอย');
        });
    });
    describe('#province', () => {
        it('should be สกลนคร', async () => {
            const result = await Splitter.split(input2);
            assert.equal(result.province, 'สกลนคร');
        });
    });
    describe('#zipcode', () => {
        it('should be 47260', async () => {
            const result = await Splitter.split(input2);
            assert.equal(result.zipcode, '47260');
        });
    });
});