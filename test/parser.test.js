const fs = require('fs');
const path = require('path');
const { parseEpostReceipt, parseEpostReceiptFlatten } = require('../src/index');

const fixturesDir = path.join(__dirname, 'fixtures');
const cases = ['case_multi_1.html', 'case_multi_2.html', 'case_multi_3.html'];

describe('Epost Receipt Parser', () => {
    cases.forEach(filename => {
        test(`should correctly parse ${filename}`, () => {
            const html = fs.readFileSync(path.join(fixturesDir, filename), 'utf8');
            
            // Basic validation that we get results
            const result = parseEpostReceipt(html);
            expect(Array.isArray(result)).toBe(true);
            expect(result.length).toBeGreaterThan(0);
            
            // Check structure of first item
            const firstItem = result[0];
            expect(firstItem).toHaveProperty('링크');
            expect(firstItem).toHaveProperty('등기번호');
            expect(firstItem).toHaveProperty('요금');
            expect(firstItem).toHaveProperty('우편번호');
            expect(firstItem).toHaveProperty('수취인');
            expect(firstItem).toHaveProperty('내용');
            
            // Flattened validation
            const flattened = parseEpostReceiptFlatten(html);
            expect(Array.isArray(flattened)).toBe(true);
            expect(flattened.length).toBe(result.length);
            expect(flattened[0]).toHaveProperty('values');
            expect(Array.isArray(flattened[0].values)).toBe(true);
            expect(flattened[0].values.length).toBe(6);
        });
    });

    test('should return empty array for invalid content', () => {
        const result = parseEpostReceipt('<html><body>No receipt here</body></html>');
        expect(result).toEqual([]);
    });
});
