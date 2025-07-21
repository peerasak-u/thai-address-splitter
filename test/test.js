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

describe('แยกชื่อไม่ได้ถ้าไม่มีคำนำหน้า', () => {
    const input3 = 'ดราก้อน ตันเด้อ อาคารเอ ชั้น 10 ห้อง 3 เขตพญาไท กรุงเทพมหานคร แขวงสามเสนใน 10400 เบอร์ 081-234-5678';
    const result = Splitter.split(input3);

    describe('#name', () => {
        it('should extract name without title prefix', () => {
            assert.equal(result.name, 'ดราก้อน ตันเด้อ');
        });
    });
    describe('#phone', () => {
        it('should be "0812345678"', () => {
            assert.equal(result.phone, '0812345678');
        });
    });
    describe('#address', () => {
        it('should be "อาคารเอ ชั้น 10 ห้อง 3"', () => {
            assert.equal(result.address, 'อาคารเอ ชั้น 10 ห้อง 3');
        });
    });
    describe('#subdistrict', () => {
        it('should be "สามเสนใน"', () => {
            assert.equal(result.subdistrict, 'สามเสนใน');
        });
    });
    describe('#district', () => {
        it('should be "พญาไท"', () => {
            assert.equal(result.district, 'พญาไท');
        });
    });
    describe('#province', () => {
        it('should be "กรุงเทพมหานคร"', () => {
            assert.equal(result.province, 'กรุงเทพมหานคร');
        });
    });
    describe('#zipcode', () => {
        it('should be "10400"', () => {
            assert.equal(result.zipcode, '10400');
        });
    });
});

describe('ชื่อไม่มีคำนำหน้า - กรณีต่างๆ', () => {
    describe('Case 1: ชื่อ-นามสกุล + บ้านเลขที่', () => {
        const input = 'สมชาย ใจดี บ้านเลขที่ 123/45 หมู่ 5 ตลาดพลู ธนบุรี กรุงเทพมหานคร 10600';
        const result = Splitter.split(input);
        
        it('should extract name correctly', () => {
            assert.equal(result.name, 'สมชาย ใจดี');
        });
        it('should extract address correctly', () => {
            assert.equal(result.address, 'บ้านเลขที่ 123/45 หมู่ 5');
        });
    });

    describe('Case 2: ชื่อ 3 พยางค์ + คอนโด', () => {
        const input = 'วิชัย สุขสม คอนโดมิเนียม The Base ชั้น 25 พระโขนง คลองเตย กรุงเทพมหานคร 10110 092-345-6789';
        const result = Splitter.split(input);
        
        it('should extract name correctly', () => {
            assert.equal(result.name, 'วิชัย สุขสม');
        });
        it('should extract phone correctly', () => {
            assert.equal(result.phone, '0923456789');
        });
        it('should extract address correctly', () => {
            assert.equal(result.address, 'คอนโดมิเนียม The Base ชั้น 25');
        });
    });

    describe('Case 3: ชื่อยาว + ซอย', () => {
        const input = 'พรทิพย์ วงศ์สุวรรณ ซอยลาดพร้าว 15 จตุจักร กรุงเทพมหานคร 10900';
        const result = Splitter.split(input);
        
        it('should extract name correctly', () => {
            assert.equal(result.name, 'พรทิพย์ วงศ์สุวรรณ');
        });
        it('should extract address correctly', () => {
            assert.equal(result.address, 'ซอยลาดพร้าว 15');
        });
    });

    describe('Case 4: ชื่อเดียว + หมู่บ้าน', () => {
        const input = 'สมหญิง หมู่บ้านนันทวัน บ้าน 88 คลองตัน คลองเตย กรุงเทพมหานคร 10110';
        const result = Splitter.split(input);
        
        it('should extract name correctly', () => {
            assert.equal(result.name, 'สมหญิง');
        });
        it('should extract address correctly', () => {
            assert.equal(result.address, 'หมู่บ้านนันทวัน บ้าน 88');
        });
    });

    describe('Case 5: ชื่อ + หอพัก', () => {
        const input = 'จันทร์ ดาว หอพักสุขใจ ห้อง 205 บางกะปิ ห้วยขวาง กรุงเทพมหานคร 10310 061-234-5678';
        const result = Splitter.split(input);
        
        it('should extract name correctly', () => {
            assert.equal(result.name, 'จันทร์ ดาว');
        });
        it('should extract phone correctly', () => {
            assert.equal(result.phone, '0612345678');
        });
        it('should extract address correctly', () => {
            assert.equal(result.address, 'หอพักสุขใจ ห้อง 205');
        });
    });

    describe('Case 6: ชื่อ + ถนน', () => {
        const input = 'มานะ ตั้งใจ 99 ถนนสุขุมวิท คลองตัน คลองเตย กรุงเทพมหานคร 10110';
        const result = Splitter.split(input);
        
        it('should extract name correctly', () => {
            assert.equal(result.name, 'มานะ ตั้งใจ');
        });
        it('should extract address correctly', () => {
            assert.equal(result.address, '99 ถนนสุขุมวิท');
        });
    });

    describe('Case 7: ชื่อ + ตลาด', () => {
        const input = 'สมศรี พานิช ตลาดมีนบุรี แผง 12 แสนแสบ มีนบุรี กรุงเทพมหานคร 10510';
        const result = Splitter.split(input);
        
        it('should extract name correctly', () => {
            assert.equal(result.name, 'สมศรี พานิช');
        });
        it('should extract address correctly', () => {
            assert.equal(result.address, 'ตลาดมีนบุรี แผง 12');
        });
    });

    describe('Case 8: ชื่อ + โครงการ', () => {
        const input = 'อนันต์ สว่างแสง โครงการบ้านสวน เลขที่ 55 หัวหมาก บางกะปิ กรุงเทพมหานคร 10240 087-888-9999';
        const result = Splitter.split(input);
        
        it('should extract name correctly', () => {
            assert.equal(result.name, 'อนันต์ สว่างแสง');
        });
        it('should extract phone correctly', () => {
            assert.equal(result.phone, '0878889999');
        });
        it('should extract address correctly', () => {
            assert.equal(result.address, 'โครงการบ้านสวน เลขที่ 55');
        });
    });

    describe('Case 9: ชื่อ + ตึก', () => {
        const input = 'สายฝน ลมหนาว ตึก B ชั้น 3 ดินแดง ดินแดง กรุงเทพมหานคร 10400';
        const result = Splitter.split(input);
        
        it('should extract name correctly', () => {
            assert.equal(result.name, 'สายฝน ลมหนาว');
        });
        it('should extract address correctly', () => {
            assert.equal(result.address, 'ตึก B ชั้น 3');
        });
    });

    describe('Case 10: ชื่อ + อพาร์ทเม้นท์', () => {
        const input = 'ดวงใจ รักษา อพาร์ทเม้นท์สุขสันต์ ห้อง 512 สีกัน ดอนเมือง กรุงเทพมหานคร 10210';
        const result = Splitter.split(input);
        
        it('should extract name correctly', () => {
            assert.equal(result.name, 'ดวงใจ รักษา');
        });
        it('should extract address correctly', () => {
            assert.equal(result.address, 'อพาร์ทเม้นท์สุขสันต์ ห้อง 512');
        });
    });
});

describe('ชื่อที่คล้ายหรือเหมือนกับ ตำบล อำเภอ จังหวัด จะโดนตัดออก', () => {
    const input4 = 'นายกรุงเทพ สามเสนใน 123/45 ถนนราชดำเนิน เขตพญาไท กรุงเทพมหานคร แขวงสามเสนใน 10400 เบอร์ 081-234-5678';
    const result = Splitter.split(input4);

    describe('#name', () => {
        it('should preserve names that match location names', () => {
            // Fixed: algorithm now removes only last occurrence of location words
            assert.equal(result.name, 'นายกรุงเทพ สามเสนใน');
        });
    });
    describe('#address', () => {
        it('should be "123/45 ถนนราชดำเนิน"', () => {
            assert.equal(result.address, '123/45 ถนนราชดำเนิน');
        });
    });
    describe('#subdistrict', () => {
        it('should be "สามเสนใน"', () => {
            assert.equal(result.subdistrict, 'สามเสนใน');
        });
    });
    describe('#district', () => {
        it('should be "พญาไท"', () => {
            assert.equal(result.district, 'พญาไท');
        });
    });
    describe('#province', () => {
        it('should be "กรุงเทพมหานคร"', () => {
            assert.equal(result.province, 'กรุงเทพมหานคร');
        });
    });
    describe('#zipcode', () => {
        it('should be "10400"', () => {
            assert.equal(result.zipcode, '10400');
        });
    });
});

describe('ชื่อย่อของจังหวัดจะถูกเก็บไว้ใน address', () => {
    const input5 = 'นายดราก้อน ตันเด้อ 123/45 ถนนราชดำเนิน พญาไท กรุงเทพ สามเสนใน 10400 เบอร์ 081-234-5678';
    const result = Splitter.split(input5);

    describe('#address', () => {
        it('should not include abbreviated province names in address', () => {
            // Fixed: algorithm now removes province abbreviations like "กรุงเทพ"
            assert.equal(result.address, '123/45 ถนนราชดำเนิน');
        });
    });
    
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
    
    describe('#subdistrict', () => {
        it('should be "สามเสนใน"', () => {
            assert.equal(result.subdistrict, 'สามเสนใน');
        });
    });
    
    describe('#district', () => {
        it('should be "พญาไท"', () => {
            assert.equal(result.district, 'พญาไท');
        });
    });
    
    describe('#province', () => {
        it('should still correctly identify full province name', () => {
            assert.equal(result.province, 'กรุงเทพมหานคร');
        });
    });
    
    describe('#zipcode', () => {
        it('should be "10400"', () => {
            assert.equal(result.zipcode, '10400');
        });
    });
});