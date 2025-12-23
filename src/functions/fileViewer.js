import FileViewer from 'react-native-file-viewer';

export const fileViewer = async filePath => {
  try {
    await FileViewer.open(filePath);
    console.log('File open');
  } catch (error) {
    console.log('File opening error', error);
  }
};
