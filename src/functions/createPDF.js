import moment from 'moment';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
export const makePdfFromHtml = async (htmlContent, name) => {
  try {
    let options = {
      html: htmlContent,
      fileName: name || `job_${moment().format('YYYYMMDD_HHmmss')}`,
      directory: 'Documents',
      base64: true,
    };
    let file = await RNHTMLtoPDF.convert(options);
    return file;
  } catch (error) {
    console.log('Error in makePdfFromHtml', error);
    return error;
  }
};
