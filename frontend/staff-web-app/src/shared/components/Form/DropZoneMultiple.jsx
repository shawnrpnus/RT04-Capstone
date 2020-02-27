/* eslint-disable react/no-array-index-key */
import React, { PureComponent } from "react";
import Dropzone from "react-dropzone";
import PropTypes from "prop-types";

class DropZoneMultipleField extends PureComponent {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
    name: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.arrayOf(
        PropTypes.shape({
          name: PropTypes.string
        })
      )
    ]).isRequired,
    handleOnDrop: PropTypes.func.isRequired
  };

  constructor() {
    super();
    this.state = {
      fileList: []
    };
  }

  onDrop = (files, event) => {
    const { onChange, handleOnDrop, selectedColour } = this.props;

    onChange(
      files.map(fl =>
        Object.assign(fl, {
          preview: URL.createObjectURL(fl)
        })
      )
    );

    handleOnDrop(files, selectedColour);

    this.setState({ fileList: files });
    // console.log(files);
  };

  removeFile = (index, e) => {
    const { onChange, handleOnDrop, selectedColour } = this.props;
    const { fileList } = this.state;
    e.preventDefault();
    const list = fileList.filter((val, i) => i !== index);
    onChange(list);
    handleOnDrop(list, selectedColour);
    this.setState({ fileList: list });
  };

  render() {
    const { name, value } = this.props;
    const files = this.state.fileList;

    return (
      <div className="dropzone dropzone--multiple">
        <Dropzone
          className="dropzone__input"
          accept="image/jpeg, image/png"
          name={name}
          onDrop={(filesToUpload, rejectedFiles, event) => {
            console.log(filesToUpload);
            console.log(event);

            this.onDrop(
              value ? value.concat(filesToUpload) : filesToUpload,
              event
            );
          }}
        >
          {({ getRootProps, getInputProps }) => {
            return (
              <div {...getRootProps()} className="dropzone__input">
                {(!files || files.length === 0) && (
                  <div className="dropzone__drop-here">
                    <span className="lnr lnr-upload" /> Drop file here to upload
                  </div>
                )}
                <input {...getInputProps()} multiple />
              </div>
            );
          }}
        </Dropzone>
        {files && Array.isArray(files) && (
          <div className="dropzone__imgs-wrapper">
            {files.map((file, i) => (
              <div
                className="dropzone__img"
                key={i}
                style={{
                  backgroundImage: `url(${file.preview})`,
                  width: "150px"
                }}
              >
                <p className="dropzone__img-name">{file.name}</p>
                <button
                  className="dropzone__img-delete"
                  type="button"
                  onClick={e => this.removeFile(i, e)}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
}

const renderDropZoneMultipleField = props => {
  const { input, handleOnDrop, selectedColour } = props;

  return (
    <DropZoneMultipleField
      {...input}
      handleOnDrop={handleOnDrop}
      selectedColour={selectedColour}
    />
  );
};

renderDropZoneMultipleField.propTypes = {
  input: PropTypes.shape({
    onChange: PropTypes.func,
    name: PropTypes.string
  }).isRequired
};

export default renderDropZoneMultipleField;
