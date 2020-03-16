import React, { PureComponent } from "react";
import Dropzone from "react-dropzone";
import PropTypes from "prop-types";

class DropZoneField extends PureComponent {
  static propTypes = {
    name: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    customHeight: PropTypes.bool,
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.arrayOf(
        PropTypes.shape({
          name: PropTypes.string
        })
      )
    ]).isRequired
  };

  static defaultProps = {
    customHeight: false
  };

  constructor() {
    super();
    this.state = {
      files: []
    };
  }

  onDrop = files => {
    console.log(this.props);
    const { onChange, handleOnDrop } = this.props;
    onChange(
      files.map(fl =>
        Object.assign(fl, {
          preview: URL.createObjectURL(fl)
        })
      )
    );
    this.setState({ files });
    handleOnDrop(files);
  };

  removeFile = (index, e) => {
    const { onChange, handleOnDrop } = this.props;
    const { files } = this.state;
    e.preventDefault();
    const filtered = files.filter((val, i) => i !== index);
    onChange(filtered);
    this.setState({ files: filtered });
    console.log(filtered);
    handleOnDrop(filtered);
  };

  render() {
    const { customHeight, name } = this.props;
    const { files } = this.state;

    return (
      <div
        className={`dropzone dropzone--single${
          customHeight ? " dropzone--custom-height" : ""
        }`}
      >
        <Dropzone
          accept="image/jpeg, image/png"
          name={name}
          multiple={false}
          onDrop={fileToUpload => {
            this.onDrop(fileToUpload);
          }}
        >
          {({ getRootProps, getInputProps }) => (
            <div {...getRootProps()} className="dropzone__input">
              {(!files || files.length === 0) && (
                <div className="dropzone__drop-here">
                  <span className="lnr lnr-upload" /> Drop file here to upload
                </div>
              )}
              <input {...getInputProps()} />
            </div>
          )}
        </Dropzone>
        {files && Array.isArray(files) && files.length > 0 && (
          <aside className="dropzone__img">
            <img src={files[0].preview} alt="drop-img" />
            <p className="dropzone__img-name">{files[0].name}</p>
            <button
              className="dropzone__img-delete"
              type="button"
              onClick={e => this.removeFile(0, e)}
            >
              Remove
            </button>
          </aside>
        )}
      </div>
    );
  }
}

const renderDropZoneField = props => {
  const { input, customHeight, handleOnDrop } = props;
  return (
    <DropZoneField
      {...input}
      customHeight={customHeight}
      handleOnDrop={handleOnDrop}
    />
  );
};

renderDropZoneField.propTypes = {
  input: PropTypes.shape({
    name: PropTypes.string,
    onChange: PropTypes.func
  }).isRequired,
  customHeight: PropTypes.bool,
  handleOnDrop: PropTypes.func.isRequired
};

renderDropZoneField.defaultProps = {
  customHeight: false
};

export default renderDropZoneField;
