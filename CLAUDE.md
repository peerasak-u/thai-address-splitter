# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Run tests**: `pnpm run test` (or `npm test`)
  - Uses Mocha test framework
  - Tests located in `test/test.js`
- **Run example**: `node example/index.js`
  - Demonstrates the Thai address splitting functionality with sample data

## Code Architecture

This is a Thai address parsing library that splits long Thai address strings into structured components (name, phone, address, subdistrict, district, province, zipcode).

### Core Components

- **Main module**: `src/index.js` - Entry point exposing the `split()` function
- **Address database**: `src/subdistricts.json` - Contains Thai administrative divisions data in format: `"subdistrict, district, province, zipcode"`

### Processing Pipeline

The `split()` function follows this pattern:
1. **Text preprocessing** (`removePrefix`) - Removes Thai administrative prefixes like เขต, แขวง, จังหวัด
2. **Location matching** (`findSubdistrict`) - Matches words against subdistricts database using frequency scoring
3. **Entity extraction** (`finalResult`) - Uses regex patterns to extract:
   - Names (with Thai title prefixes: นาย, นาง, คุณ, etc.)
   - Phone numbers (08x, 09x, 06x patterns)
   - Remaining text as address

### Key Features

- Handles Thai naming conventions including "ณ" (na) particles in surnames
- Supports various phone number formats (with/without hyphens)
- Uses best-match algorithm for ambiguous location names
- Throws "No Match Found" error when location confidence is low

### Known Limitations (from README)

- Cannot extract names without title prefixes
- Names similar to location names may be incorrectly filtered
- Abbreviated location names (e.g., "กรุงเทพ" vs "กรุงเทพมหานคร") are handled in address field