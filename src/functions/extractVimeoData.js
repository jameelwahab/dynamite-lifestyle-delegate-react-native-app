import { load } from 'cheerio';


const extractVimeoData = async (data) => {
  const $ = load(data);
  const scripts = $('script');
  let playerConfigScript = null;
  scripts.each((index, element) => {
    const scriptContent = $(element).html();
    if (scriptContent && scriptContent.includes('window.playerConfig')) {
      playerConfigScript = scriptContent;
      return false; // exit loop early if found
    }
  });
  if (!playerConfigScript) return null;
  const startIndex = playerConfigScript.indexOf("{");
  const lastIndex = playerConfigScript.lastIndexOf("}");
  const jsonStr = playerConfigScript.substring(startIndex, lastIndex+1);
  return JSON.parse(jsonStr)
}

export default extractVimeoData