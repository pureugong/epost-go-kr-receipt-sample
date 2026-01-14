const fs = require('fs');
const path = require('path');
const { parseEpostReceipt } = require('./src/index');

function updateReadme() {
    const readmePath = 'README.md';
    const fixturesDir = path.join(__dirname, 'test', 'fixtures');
    let readmeContent = '';
    
    // Initialize README if not exists
    if (!fs.existsSync(readmePath)) {
        readmeContent = '# Epost Receipt Samples\n\nValidation results for receipt HTML samples.\n\n<!-- TEST_RESULTS_START -->\n<!-- TEST_RESULTS_END -->\n';
    } else {
        readmeContent = fs.readFileSync(readmePath, 'utf8');
    }

    const files = fs.readdirSync(fixturesDir).filter(f => f.startsWith('case_') && f.endsWith('.html')).sort();
    
    let table = '| 파일 | 상태 | 항목 수 | S3 링크 | 최근 확인일 |\n|---|---|---|---|---|\n';
    const now = new Date().toISOString().split('T')[0];
    let hasFailure = false;

    files.forEach(file => {
        let status = 'ERROR';
        let details = 'Exception';
        let icon = '❌';

        try {
            const html = fs.readFileSync(path.join(fixturesDir, file), 'utf8');
            const items = parseEpostReceipt(html);
            if (items.length > 0) {
                status = 'PASS';
                details = items.length;
                icon = '✅';
            } else {
                status = 'FAIL';
                details = '0 items';
                icon = '⚠️';
                hasFailure = true;
            }
        } catch (e) {
            details = e.message;
            hasFailure = true;
        }

        // Link needs to point to the fixture location relative to README
        const relativeLink = `test/fixtures/${file}`;
        const s3Link = `[Link](https://magicmealkits.s3.ap-northeast-1.amazonaws.com/epost-go-kr-receipt-sample/${file})`;
        table += `| [${file}](${relativeLink}) | ${icon} ${status} | ${details} | ${s3Link} | ${now} |\n`;
    });

    const startMarker = '<!-- TEST_RESULTS_START -->';
    const endMarker = '<!-- TEST_RESULTS_END -->';
    
    const startIdx = readmeContent.indexOf(startMarker);
    const endIdx = readmeContent.indexOf(endMarker);

    let newContent = readmeContent;

    if (startIdx !== -1 && endIdx !== -1) {
        // Replace existing block
        newContent = readmeContent.substring(0, startIdx + startMarker.length) + 
                     '\n\n' + table + '\n' + 
                     readmeContent.substring(endIdx);
    } else {
        // Append if markers missing
        newContent += `\n\n${startMarker}\n\n${table}\n${endMarker}`;
    }

    fs.writeFileSync(readmePath, newContent);
    console.log('README.md updated with validation results.');
    
    if (hasFailure) {
        console.error('Validation failed for some files.');
        process.exit(1);
    }
}

updateReadme();
