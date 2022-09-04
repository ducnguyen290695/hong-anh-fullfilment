import { Upload } from 'antd';
import { FontAwesomeIcon, Icon } from 'assets/icons';
import React, { useState } from 'react';
import { notify } from 'utils/helperFuncs';
import './index.scss';

function UploadImage({ acceptTypes }) {
  const { Dragger } = Upload;
  const [imageList, setImageList] = useState([]);

  const props = {
    name: 'file',
    multiple: true,
    showUploadList: false,
    customRequest: ({ file, onSuccess }) => dummyRequest(file, onSuccess),
    action: null,
    async onChange(info) {
      const { status, type } = info.file;
      console.log({ info });
      if (status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (status === 'done') {
        if (acceptTypes && !acceptTypes.includes(type)) {
          notify.error({
            message: `Chỉ chấp nhận định dạng ${acceptTypes?.map(
              (item) => ` ${item.replace('image/', '*')}`
            )}`,
          });
          return;
        }
        const res = await getBase64(info.file.originFileObj);
        setImageList((prevState) => {
          setImageList([...prevState, res]);
        });
      } else if (status === 'error') {
        notify.error({
          message: `${info.file.name} file upload failed.`,
        });
      }
    },
    onDrop(e) {
      console.log('Dropped files', e.dataTransfer.files);
    },
  };

  function dummyRequest(file, onSuccess) {
    setTimeout(() => {
      onSuccess('ok');
    }, 0);
  }

  function getBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  }

  function removeImage(index) {
    setImageList((prevState) => {
      setImageList([...prevState.slice(0, index), ...prevState.slice(index + 1, prevState.length)]);
    });
  }

  return (
    <div className="upload-image">
      <Dragger {...props}>
        <p className="images-icon">
          <FontAwesomeIcon icon={Icon.faImages} />
        </p>
        <p className="ant-upload-text">Chọn ảnh hoặc kéo thả ảnh vào đây</p>
        {acceptTypes && (
          <p className="ant-upload-hint">
            {`Chấp nhận định dạng ${acceptTypes?.map((item) => ` ${item.replace('image/', '*')}`)}`}
          </p>
        )}
      </Dragger>

      {imageList?.length > 0 && (
        <div className="image-list">
          {imageList?.map((item, index) => (
            <div key={index} className="image-box" onClick={() => removeImage(index)}>
              <div className="img-mask">
                <FontAwesomeIcon className="remove-icon" icon={Icon.faTrash} />
              </div>
              <img src={item} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default UploadImage;
