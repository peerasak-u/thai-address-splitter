const fs = require('fs');
const { promisify } = require('util');
const readFile = promisify(fs.readFile);

const split = async (text) => {
    try {
        console.log('input text:', text);
        const cleanText = removePrefix(text);
        const wordlist = cleanText.split(' ').filter(word => word.length >= 3);
        const mainAddress = await findSubdistrict(wordlist);
        const result = finalResult(cleanText, mainAddress);
        return result;
    } catch (error) {
        console.error(error);
    }
};

const removePrefix = (text) => {
    const prefixPattern = /(เขต|แขวง|จังหวัด|อำเภอ|ตำบล|อ\.|ต\.|จ\.)/g;
    let string = text.replace(/\s+/g, ' ');
    string = string.replace(prefixPattern, '');
    return string;
}


const finalResult = (text, mainAddress) => {
    const namePattern = /(เด็กชาย|เด็กหญิง|ด\.ช\.|ด\.ญ\.|นาย|นาง|นางสาว|น\.ส\.|ดร\.)([ก-๙]+\s[ก-๙]+)/;
    const phonePattern = /(08\d{1}-\d{3}-\d{4}|08\d{1}-\d{7}|08\d{8})/;

    let remainingTxt = text;

    const keyPattern = Object.values(mainAddress);
    keyPattern.forEach(key => {
        remainingTxt = remainingTxt.replace(key, '').trim();
    });

    const nameMatched = remainingTxt.match(namePattern);
    let name = '';
    if (nameMatched) {
        [name] = nameMatched
    }
    remainingTxt = remainingTxt.replace(name, '').trim();

    const phoneMatched = remainingTxt.match(phonePattern);
    let phone = '';
    if (phoneMatched) {
        [phone] = phoneMatched
    }
    remainingTxt = remainingTxt.replace(phone, '').trim();
    phone = phone.replace(/-/g, '');

    remainingTxt = remainingTxt.replace('()', '').trim();

    const address = remainingTxt.replace(/\s+/g, ' ').trim();

    return {
        name,
        phone,
        address,
        ...mainAddress
    }

}

const findSubdistrict = async (wordlist) => {
    const content = await readFile('subdistricts.json', 'utf-8');
    const subdistricts = JSON.parse(content);
    let results = [];

    for (let word of wordlist) {
        const filtered = subdistricts.filter(item => {
            return item.name.includes(word)
        });
        results = results.concat(filtered);
    }

    const bestMatched = findBestMatched(results).name.split(', ');

    return {
        subdistrict: bestMatched[0],
        district: removePrefix(bestMatched[1]),
        province: removePrefix(bestMatched[2]),
        zipcode: bestMatched[3]
    };
};

const findBestMatched = (filtered) => {
    let results = [];

    filtered.reduce((res, value) => {
        if (!res[value.name]) {
            res[value.name] = {
                count: 0,
                name: value.name
            };
            results.push(res[value.name])
        }
        res[value.name].count += 1
        return res;
    }, {});

    return results.sort((a, b) => {
        if (a.count > b.count) {
            return -1;
        }
        if (a.count > b.count) {
            return 1;
        }
        return 0;
    })[0];
}

(async () => {
    console.time('execution time');
    const arguments = process.argv;
    if (arguments.length > 2) {
        const input = arguments.slice(2)[0];
        const result = await split(input);
        console.log('result :', result);
        console.timeEnd('execution time')
    } else {
        console.log('no input');
    }
})();

