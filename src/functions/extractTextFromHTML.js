import { load } from 'cheerio';

export default extractTextFromHtml = (htmlContent) => {
  const $ = load(htmlContent);
  let text = $.text();
  // Replace multiple spaces with a single space
  text = text.replace(/[ \t]+/g, ' ');
  
  // Replace multiple line breaks with a single line break
  text = text.replace(/\n\s*\n/g, '\n').trim();

  return text;
};

