const assert = require('assert');
const Splitter = require('../src');

describe('ปกติ', () => {
    const input1 = 'นายดราก้อน ตันเด้อ   อาคารเอ ชั้น  10    (081-234-5678) ห้อง 3  เขตพญาไท กรุงเทพมหานคร แขวงสามเสนใน 10400';
    const result = Splitter.split(input1);

    describe('#name', () => {
        it('should be "นายดราก้อน ตันเด้อ"', () => {
            assert.equal(result.name, 'นายดราก้อน ตันเด้อ');
        });
    });
    describe('#phone', () => {
        it('should be "0812345678"', () => {
            assert.equal(result.phone, '0812345678');
        });
    });
    describe('#address1', () => {
        it('should be "อาคารเอ ชั้น 10 ห้อง 3"', () => {
            assert.equal(result.address, 'อาคารเอ ชั้น 10 ห้อง 3');
        });
    });
    describe('#subdistrict', () => {
        it('should be สามเสนใน', () => {
            assert.equal(result.subdistrict, 'สามเสนใน');
        });
    });
    describe('#district', () => {
        it('should be พญาไท', () => {
            assert.equal(result.district, 'พญาไท');
        });
    });
    describe('#province', () => {
        it('should be กรุงเทพมหานคร', () => {
            assert.equal(result.province, 'กรุงเทพมหานคร');
        });
    });
    describe('#zipcode', () => {
        it('should be 10400', () => {
            assert.equal(result.zipcode, '10400');
        });
    });
});

describe('นามสกุล มี "ณ" และไม่ใส่ zipcode ', () => {
    const input2 = 'คุณสวยมาก พรหมสาแขน ณ หนองหาร 12 หมู่ 1 บ้านดงเต่า ตำบลเต่างอย อำเภอเต่างอย  สกลนคร เบอร์ 081-999-2220';
    const result = Splitter.split(input2);

    describe('#name', () => {
        it('should be "คุณสวยมาก พรหมสาแขน ณ หนองหาร"', () => {
            assert.equal(result.name, 'คุณสวยมาก พรหมสาแขน ณ หนองหาร');
        });
    });
    describe('#phone', () => {
        it('should be "0819992220"', () => {
            assert.equal(result.phone, '0819992220');
        });
    });
    describe('#address1', () => {
        it('should be "12 หมู่ 1 บ้านดงเต่า"', () => {
            assert.equal(result.address, '12 หมู่ 1 บ้านดงเต่า');
        });
    });
    describe('#subdistrict', () => {
        it('should be เต่างอย', () => {
            assert.equal(result.subdistrict, 'เต่างอย');
        });
    });
    describe('#district', () => {
        it('should be เต่างอย', () => {
            assert.equal(result.district, 'เต่างอย');
        });
    });
    describe('#province', () => {
        it('should be สกลนคร', () => {
            assert.equal(result.province, 'สกลนคร');
        });
    });
    describe('#zipcode', () => {
        it('should be 47260', () => {
            assert.equal(result.zipcode, '47260');
        });
    });
});

describe('Known Issue 1: แยกชื่อไม่ได้ถ้าไม่มีคำนำหน้า', () => {
    const input3 = 'ดราก้อน ตันเด้อ อาคารเอ ชั้น 10 ห้อง 3 เขตพญาไท กรุงเทพมหานคร แขวงสามเสนใน 10400 เบอร์ 081-234-5678';
    const result = Splitter.split(input3);

    describe('#name', () => {
        it('should extract name without title prefix (currently fails)', () => {
            // This test documents the known issue - it will fail
            assert.equal(result.name, 'ดราก้อน ตันเด้อ');
        });
    });
});

describe('Known Issue 2: ชื่อที่คล้ายหรือเหมือนกับ ตำบล อำเภอ จังหวัด จะโดนตัดออก', () => {
    const input4 = 'นายกรุงเทพ สามเสนใน 123/45 ถนนราชดำเนิน เขตพญาไท กรุงเทพมหานคร แขวงสามเสนใน 10400 เบอร์ 081-234-5678';
    const result = Splitter.split(input4);

    describe('#name', () => {
        it('should preserve names that match location names (currently fails)', () => {
            // This test documents the known issue - name "กรุงเทพ สามเสนใน" gets filtered out
            assert.equal(result.name, 'นายกรุงเทพ สามเสนใน');
        });
    });
});

describe('Known Issue 3: ชื่อย่อของจังหวัดจะถูกเก็บไว้ใน address', () => {
    const input5 = 'นายดราก้อน ตันเด้อ 123/45 ถนนราชดำเนิน พญาไท กรุงเทพ สามเสนใน 10400 เบอร์ 081-234-5678';
    const result = Splitter.split(input5);

    describe('#address', () => {
        it('should not include abbreviated province names in address (currently fails)', () => {
            // This test documents the known issue - "กรุงเทพ" gets included in address
            // Expected: address should be "123/45 ถนนราชดำเนิน"
            // Actual: address will include "กรุงเทพ"
            assert.equal(result.address, '123/45 ถนนราชดำเนิน');
        });
    });
    
    describe('#province', () => {
        it('should still correctly identify full province name', () => {
            assert.equal(result.province, 'กรุงเทพมหานคร');
        });
    });
});