const fs = require('fs');
const { promisify } = require('util');
const readFile = promisify(fs.readFile);

const split = async (text) => {
    try {
        console.log('input text:', text);
        const cleanText = removePrefix(text);
        const wordlist = createWordlist(cleanText).filter(word => word.length > 3);
        const mainAddress = await findSubdistrict(wordlist);
        const result = finalResult(cleanText, mainAddress);
        console.log('address :', result)
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

const createWordlist = (string) => {
    const wordlist = string.split(' ');
    return wordlist;
};

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

    const matches = results.map(item => item.name);
    const bestMatched = findBestMatched(matches).name.split(', ');

    return {
        subdistrict: bestMatched[0],
        district: removePrefix(bestMatched[1]),
        province: removePrefix(bestMatched[2]),
        zipcode: bestMatched[3]
    };
};

const findBestMatched = (matches) => {
    let group = {};

    matches.forEach((i) => {
        group[i] = (group[i] || 0) + 1;
    });

    let results = Object.keys(group).map(key => {
        return {
            name: key,
            count: group[key]
        }
    });

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

const arguments = process.argv;
if (arguments.length > 2) {
    const input = arguments.slice(2)[0];
    split(input);
} else {
    console.log('no input');
}

