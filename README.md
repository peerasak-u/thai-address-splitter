# Thai Address Splitter

split long address string(in Thai) to 'name', 'phone number', 'subdistrict', 'district', 'province', 'zipcode'

## How It Works

```mermaid
flowchart TD
    A[Input: Thai Address String] --> B[removePrefix]
    B --> |Clean text| C[Extract Thai Words]
    
    C --> |Filter words ≥2 chars| D[Remove Duplicates]
    D --> |Unique word list| E[findSubdistrict]
    
    E --> F[Search Each Word in Database]
    F --> |Matching locations| G[findBestMatched]
    
    G --> H{Count > 1?}
    H -->|No| I[Throw: No Match Found]
    H -->|Yes| J[Select Most Frequent Match]
    
    J --> |Location data| K[finalResult]
    
    K --> L[Remove Location Words]
    L --> M[Extract Name with Title]
    M --> N[Extract Phone Number]
    N --> O[Clean Remaining Text]
    
    O --> P[Output: Structured Data]
    
    subgraph "Database"
        DB[(subdistricts.json)]
        F -.-> DB
    end
    
    subgraph "Regex Patterns"
        M -.-> R1[Title + Thai Name Pattern]
        N -.-> R2[Phone Pattern: 06/08/09]
    end
    
    subgraph "Output Structure"
        P --> P1[name]
        P --> P2[phone]
        P --> P3[address]
        P --> P4[subdistrict]
        P --> P5[district]
        P --> P6[province]
        P --> P7[zipcode]
    end
```

### Processing Steps

1. **Prefix Removal**: Removes administrative prefixes (เขต, แขวง, จังหวัด, อำเภอ, ตำบล, etc.)
2. **Word Extraction**: Splits text and filters Thai words with at least 2 characters
3. **Location Matching**: Searches each word against the subdistricts database
4. **Frequency Analysis**: Counts how many times each location appears in matches
5. **Entity Extraction**: 
   - Extracts names with title prefixes (นาย, นาง, คุณ, etc.)
   - Extracts phone numbers (starting with 06, 08, 09)
   - Remaining text becomes the address field

## Example

basic split
```js
const Splitter = require('../splitter');

(async () => {
    const input = 'คุณดอกฝ้าย สายเขียว 799/11 ถนนจักรแก้ว แขวงวังบูรพาภิรมย์ เขตพระนคร  กรุงเทพ 10200 เบอร์ 0911222333';
    const result = Splitter.split(input);
    console.log('result :', { input, result });
})();
```

## Tests
```
pnpm run test
```

## Know issues
- [ ] แยกชื่อไม่ได้ถ้าไม่มีคำนำหน้า
- [ ] ชื่อหรือนามสกุลที่คล้ายหรือเหมือนกับ ตำบล อำเภอ จังหวัด จะโดนตัดออก
- [ ] ถ้า input ใส่ชื่อ อำเภอ จังหวัด แบบย่อๆ เช่น "กรุงเทพ" แทนที่จะเป็น "กรุงเทพมหานคร" ชื่อพวกนั้นจะถูกส่งไปเก็บไว้ใน address ด้วย