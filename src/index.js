/**
 * Extracts item data from the Epost receipt HTML string.
 * @param {string} html - The HTML content of the receipt.
 * @returns {Array<Object>} List of extracted items.
 */
function parseEpostReceipt(html) {
    const items = [];
    
    // 1. Identify the block containing the items.
    // It starts after "수취인" and ends before "합계".
    const startMarker = "수취인<p class='bt_bd'></p>";
    const endMarker = "합계";
    
    const startIndex = html.indexOf(startMarker);
    const endIndex = html.indexOf(endMarker);
    
    if (startIndex === -1 || endIndex === -1) return items;
    
    const content = html.substring(startIndex + startMarker.length, endIndex);
    
    // 2. Regex to match each item block.
    // Group 1: Link, Group 2: Tracking No, Group 3: Fee, Group 4: Zip, Group 5: Recipient, Group 6: Description
    const itemRegex = /<a href=([^>]+)>([\d]+)<\/a>\s+([\d,]+)\s+([\d]+)\s+([^\n\r<]+)[\r\n]+([^\n\r<]+)/g;
    
    let match;
    while ((match = itemRegex.exec(content)) !== null) {
        items.push({
            "링크": match[1].trim(),
            "등기번호": match[2].trim(),
            "요금": match[3].trim(),
            "우편번호": match[4].trim(),
            "수취인": match[5].trim(),
            "내용": match[6].trim()
        });
    }
    
    return items;
}

/**
 * Extracts data from Epost receipt HTML as a flattened format.
 * Order: [Description, TrackingNo, Link, Recipient, Fee, Zip]
 * @param {string} html 
 * @returns {Array<{values: Array<string>}>}
 */
function parseEpostReceiptFlatten(html) {
    const items = parseEpostReceipt(html);
    return items.map(item => ({
        "values": [
            item["내용"],
            item["등기번호"],
            item["링크"],
            item["수취인"],
            item["요금"],
            item["우편번호"]
        ]
    }));
}

module.exports = {
    parseEpostReceipt,
    parseEpostReceiptFlatten
};
