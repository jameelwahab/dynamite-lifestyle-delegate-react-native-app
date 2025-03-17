
const convertMarkdownIntoSimpleText = (markdownText = '') => {
    return markdownText.
        replace(/(\*\*|__)(.*?)\1/g, "$2") // Bold (*bold* or _bold_)
        .replace(/(\*|_)(.*?)\1/g, "$2") // Italic (italic or italic)
        .replace(/(#+\s*)(.*)/g, "$2") // Headers (#, ##, ###)
        .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // Links [text](url)
        .replace(/!\[([^\]]+)\]\([^)]+\)/g, "$1") // Images ![alt](url)
        .replace(/(`{1,3})(.*?)\1/g, "$2") // Inline & block code (`code` or code)
        .replace(/>-?/g, "") // Blockquotes (> Quote)
        .replace(/(\r\n|\r|\n)/g, " ") // New lines to space
        .replace(/\s+/g, " ") // Extra spaces
        .trim()
}

export default convertMarkdownIntoSimpleText