
import FileViewer from "react-native-file-viewer";

const previewLocalFile = (path) => {
  FileViewer.open(path, { showOpenWithDialog: true }) // absolute-path-to-my-local-file.
    .then(() => {

    })
    .catch((error) => {
      console.log(error, "Error opening gile")
    });
}

export default previewLocalFile