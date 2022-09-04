import React, { useState, useEffect } from 'react';
import { Button, Upload } from 'antd';
import { ACCEPT_FILE_TYPES, ACCEPT_IMG_TYPES } from 'config/constants';
import { dummyRequest, notify } from 'utils/helperFuncs';
import { useUploadDocument } from 'hooks/upload-document';
import Spinner from 'components/Spinner';
import { Icon } from 'assets/icons';
import { useTranslation } from 'react-i18next';
import './index.scss';

function UploadDocument({ onUploadSuccess, switchClear, multiple, accept, listType, ...rest }) {
  const { handleUpload, loading } = useUploadDocument();
  const [files, setFiles] = useState([]);
  const { t } = useTranslation();

  function validateFile(file) {
    const isLt5M = file.size / 1024 / 1024 <= 5;
    if (!isLt5M) {
      notify.error({
        message: t('uploadDocument.limitErrorMessage'),
        description: file?.name,
      });
    }
    return isLt5M;
  }

  function handleChange({ _, file }) {
    if (file.status === 'done') {
      if (validateFile(file)) {
        setFiles((prevState) => setFiles([...prevState, file]));
      }
    }
  }

  function handleRemoveFile(index) {
    setFiles([...files.slice(0, index), ...files.slice(index + 1, files.length)]);
  }

  async function hanldeUploadFiles() {
    try {
      const uploadUrls = await handleUpload({
        files: files?.map((item) => item?.originFileObj),
      });
      onUploadSuccess && onUploadSuccess(uploadUrls?.map((item) => item?.url));
    } catch (err) {
      notify.error({
        message: t('uploadDocument.uploadFail'),
      });
    }
  }

  function checkImage(file) {
    if (ACCEPT_IMG_TYPES?.includes(file.type)) {
      return true;
    }
    return false;
  }

  useEffect(() => {
    if (files.length) {
      hanldeUploadFiles();
    }
  }, [files]);

  useEffect(() => {
    setFiles([]);
  }, [switchClear]);

  return (
    <div className="upload-container">
      <Spinner loading={loading} />
      <Upload
        accept={accept || ACCEPT_FILE_TYPES.join(',')}
        multiple={multiple || true}
        onChange={handleChange}
        listType={listType || 'picture'}
        className="upload-list-inline"
        customRequest={({ file, onSuccess }) => dummyRequest(file, onSuccess)}
        {...rest}
      >
        <Button className="upload-button">+</Button>
      </Upload>

      <div className="upload-list">
        {files?.map((file, index) => (
          <div className="upload-item" key={index}>
            <div className="right-col">
              {checkImage(file) && <img className="file-thumbnail" src={file?.thumbUrl} />}
              {!checkImage(file) && <Icon.CustomIcon className="file-icon" icon={Icon.faFile} />}
              <span className="file-name">{file?.name}</span>
            </div>
            <Icon.CustomIcon
              onClick={() => handleRemoveFile(index)}
              className="remove-icon"
              icon={Icon.faTrash}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default React.memo(UploadDocument);
