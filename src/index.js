let subdistricts = require('./subdistricts.json')

const split = (text) => {
    try {
        const cleanText = removePrefix(text);
        let wordlist = cleanText.split(' ').filter(word => /[ก-๙]{2,}/.test(word));
        wordlist = [...new Set(wordlist)];
        const mainAddress = findSubdistrict(wordlist);
        const result = finalResult(cleanText, mainAddress);
        return result;
    } catch (error) {
        console.error(error);
    }
};

const removePrefix = (text) => {
    const prefixPattern = /(เขต|แขวง|จังหวัด|อำเภอ|ตำบล|อ\.|ต\.|จ\.|โทร\.?|เบอร์|ที่อยู่)/g;
    let string = text.replace(/\s+/g, ' ');
    string = string.replace(prefixPattern, '');
    return string;
}


// Province abbreviations mapping
const provinceAbbreviations = {
    'กรุงเทพมหานคร': ['กรุงเทพ', 'กทม', 'กทม.'],
    'นครราชสีมา': ['โคราช']
};

const removeLastOccurrence = (text, searchValue) => {
    const lastIndex = text.lastIndexOf(searchValue);
    if (lastIndex === -1) return text;
    return text.slice(0, lastIndex) + text.slice(lastIndex + searchValue.length);
};

const removeProvinceAbbreviations = (text, fullProvinceName) => {
    let result = text;
    
    // Get abbreviations for the full province name
    const abbreviations = provinceAbbreviations[fullProvinceName];
    if (!abbreviations) return result;
    
    // Remove each abbreviation that appears as a standalone word (not part of a name)
    for (const abbrev of abbreviations) {
        // Use word boundaries to avoid removing abbreviations that are part of names
        // Look for abbreviation preceded by space and followed by space or end of string
        const regexPattern = new RegExp(`\\s${abbrev}(?=\\s|$)`, 'g');
        result = result.replace(regexPattern, '');
        
        // Also check if abbreviation starts the text
        if (result.startsWith(abbrev + ' ')) {
            result = result.slice(abbrev.length + 1);
        }
    }
    
    return result.trim();
};

const finalResult = (text, mainAddress) => {
    const namePattern = /(เด็กชาย|เด็กหญิง|ด\.ช\.|ด\.ญ\.|นาย|นาง|นางสาว|น\.ส\.|ดร\.|คุณ)([ก-๙]+\s[ก-๙]+(\sณ\s[ก-๙]+)?)/;
    const phonePattern = /(09|08|06)\d{1}(\d{7}|-\d{7}|-\d{3}-\d{4})/;

    let remainingTxt = text;

    // Remove location words in order: zipcode, province, district, subdistrict (from most specific to least specific)
    remainingTxt = removeLastOccurrence(remainingTxt, mainAddress.zipcode).trim();
    remainingTxt = removeLastOccurrence(remainingTxt, mainAddress.province).trim();
    // Also remove province abbreviations
    remainingTxt = removeProvinceAbbreviations(remainingTxt, mainAddress.province).trim();
    remainingTxt = removeLastOccurrence(remainingTxt, mainAddress.district).trim();
    remainingTxt = removeLastOccurrence(remainingTxt, mainAddress.subdistrict).trim();

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

const findSubdistrict = (wordlist) => {
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

    const firstMatch = results.sort((a, b) => {
        if (a.count > b.count) {
            return -1;
        }
        if (a.count > b.count) {
            return 1;
        }
        return 0;
    })[0];

    if (firstMatch.count === 1) {
        throw new Error('No Match Found');
    }

    return firstMatch;
}

module.exports = {
    split
}