import { saveAs } from 'file-saver';

export default function useDownloadFiles() {
  const onChangeFile = (listUrl) => {
    listUrl.forEach((item) => {
      //saveAs(file,nameFile)
      saveAs(item, item.split('/').slice(-1));
    });
  };
  return {
    onChangeFile,
  };
}
