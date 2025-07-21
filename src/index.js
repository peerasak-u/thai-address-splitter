const subdistricts = require('./subdistricts.json');

class Constants {
    static TITLE_PREFIXES = /(เด็กชาย|เด็กหญิง|ด\.ช\.|ด\.ญ\.|นาย|นาง|นางสาว|น\.ส\.|ดร\.|คุณ)([ก-๙]+\s[ก-๙]+(\sณ\s[ก-๙]+)?)/;
    static PHONE_PATTERN = /(09|08|06)\d{1}(\d{7}|-\d{7}|-\d{3}-\d{4})/;
    static PREFIX_PATTERN = /(เขต|แขวง|จังหวัด|อำเภอ|ตำบล|อ\.|ต\.|จ\.|โทร\.?|เบอร์|ที่อยู่)/g;
    static THAI_WORD_PATTERN = /[ก-๙]{2,}/;
    static THAI_CHAR_PATTERN = /^[ก-๙]+$/;
    
    static ADDRESS_KEYWORDS = [
        'อาคาร', 'ชั้น', 'ห้อง', 'ตึก', 'หมู่', 'บ้าน', 'ซอย', 'ถนน',
        'ตลาด', 'คอนโด', 'คอนโดมิเนียม', 'อพาร์ทเม้นท์', 'หอพัก', 'โครงการ',
        'เลขที่', 'บ้านเลขที่', 'หมู่บ้าน', 'ซ.', 'ถ.'
    ];
    
    static PROVINCE_ABBREVIATIONS = {
        'กรุงเทพมหานคร': ['กรุงเทพ', 'กทม', 'กทม.'],
        'นครราชสีมา': ['โคราช']
    };
    
    static get ADDRESS_START_PATTERN() {
        return new RegExp(
            `(^|\\s)(${this.ADDRESS_KEYWORDS.join('|')}|\\d+/\\d+|\\d+\\s*หมู่\\s*\\d+|\\d+\\s+ถนน)`,
            'i'
        );
    }
}

class TextPreprocessor {
    static preprocessText(text) {
        let normalizedText = text.replace(/\s+/g, ' ');
        normalizedText = normalizedText.replace(Constants.PREFIX_PATTERN, '');
        return normalizedText;
    }
    
    static extractWordList(text) {
        const words = text.split(' ').filter(word => Constants.THAI_WORD_PATTERN.test(word));
        return [...new Set(words)];
    }
    
    static removeLastOccurrence(text, searchValue) {
        const lastIndex = text.lastIndexOf(searchValue);
        if (lastIndex === -1) return text;
        return text.slice(0, lastIndex) + text.slice(lastIndex + searchValue.length);
    }
    
    static removeProvinceAbbreviations(text, fullProvinceName) {
        let result = text;
        const abbreviations = Constants.PROVINCE_ABBREVIATIONS[fullProvinceName];
        if (!abbreviations) return result;
        
        for (const abbrev of abbreviations) {
            const regexPattern = new RegExp(`\\s${abbrev}(?=\\s|$)`, 'g');
            result = result.replace(regexPattern, '');
            
            if (result.startsWith(abbrev + ' ')) {
                result = result.slice(abbrev.length + 1);
            }
        }
        
        return result.trim();
    }
    
    static findAddressStart(text) {
        const match = text.match(Constants.ADDRESS_START_PATTERN);
        if (match) {
            return match.index + (match[0].startsWith(' ') ? 1 : 0);
        }
        return -1;
    }
}

class LocationMatcher {
    static findBestLocationMatch(wordList) {
        let matchedLocations = [];
        
        for (const word of wordList) {
            const filteredLocations = subdistricts.filter(item => {
                return item.name.includes(word);
            });
            matchedLocations = matchedLocations.concat(filteredLocations);
        }
        
        const bestMatch = this.calculateLocationScores(matchedLocations);
        const locationParts = bestMatch.name.split(', ');
        
        return {
            subdistrict: locationParts[0],
            district: TextPreprocessor.preprocessText(locationParts[1]),
            province: TextPreprocessor.preprocessText(locationParts[2]),
            zipcode: locationParts[3]
        };
    }
    
    static calculateLocationScores(filteredLocations) {
        const scoreMap = {};
        const results = [];
        
        filteredLocations.reduce((accumulator, location) => {
            if (!accumulator[location.name]) {
                accumulator[location.name] = {
                    count: 0,
                    name: location.name
                };
                results.push(accumulator[location.name]);
            }
            accumulator[location.name].count += 1;
            return accumulator;
        }, scoreMap);
        
        const sortedResults = results.sort((a, b) => {
            if (a.count > b.count) return -1;
            if (a.count < b.count) return 1;
            return 0;
        });
        
        const bestMatch = sortedResults[0];
        if (bestMatch.count === 1) {
            throw new Error('No Match Found');
        }
        
        return bestMatch;
    }
}

class EntityExtractor {
    static extractEntitiesFromText(text, locationData) {
        let remainingText = text;
        
        remainingText = this.removeLocationWords(remainingText, locationData);
        const phone = this.extractPhone(remainingText);
        remainingText = remainingText.replace(phone, '').trim();
        const name = this.extractName(remainingText);
        remainingText = remainingText.replace(name, '').trim();
        const address = this.cleanAddress(remainingText);
        
        return {
            name,
            phone: phone.replace(/-/g, ''),
            address,
            ...locationData
        };
    }
    
    static removeLocationWords(text, locationData) {
        let result = text;
        
        result = TextPreprocessor.removeLastOccurrence(result, locationData.zipcode).trim();
        result = TextPreprocessor.removeLastOccurrence(result, locationData.province).trim();
        result = TextPreprocessor.removeProvinceAbbreviations(result, locationData.province).trim();
        result = TextPreprocessor.removeLastOccurrence(result, locationData.district).trim();
        result = TextPreprocessor.removeLastOccurrence(result, locationData.subdistrict).trim();
        
        return result;
    }
    
    static extractPhone(text) {
        const phoneMatch = text.match(Constants.PHONE_PATTERN);
        return phoneMatch ? phoneMatch[0] : '';
    }
    
    static extractName(text) {
        const nameWithTitleMatch = text.match(Constants.TITLE_PREFIXES);
        if (nameWithTitleMatch) {
            return nameWithTitleMatch[0];
        }
        
        const addressStartIndex = TextPreprocessor.findAddressStart(text);
        if (addressStartIndex > 0) {
            const potentialName = text.substring(0, addressStartIndex).trim();
            const words = potentialName.split(/\s+/);
            
            if (words.length >= 1 && words.length <= 4 && 
                words.every(word => Constants.THAI_CHAR_PATTERN.test(word))) {
                return potentialName;
            }
        }
        
        return '';
    }
    
    static cleanAddress(text) {
        return text.replace('()', '').replace(/\s+/g, ' ').trim();
    }
}

class ThaiAddressSplitter {
    static split(text) {
        try {
            const cleanText = TextPreprocessor.preprocessText(text);
            const wordList = TextPreprocessor.extractWordList(cleanText);
            const locationData = LocationMatcher.findBestLocationMatch(wordList);
            const result = EntityExtractor.extractEntitiesFromText(cleanText, locationData);
            return result;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}

const split = (text) => {
    return ThaiAddressSplitter.split(text);
};

module.exports = {
    split
};