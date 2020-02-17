import React, { Component, Fragment } from "react";
import Breadcrumb from "../../common/breadcrumb";
import Modal from "react-responsive-modal";
import "react-toastify/dist/ReactToastify.css";
import data from "../../../assets/data/category";
import Datatable from "../../common/datatable";

export class Category extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false
    };
  }
  onOpenModal = () => {
    this.setState({ open: true });
  };

  onCloseModal = () => {
    this.setState({ open: false });
  };

  render() {
    const { open } = this.state;
    return (
      <Fragment>
        <Breadcrumb title="Category" parent="Physical" />
        {/* <!-- Container-fluid starts--> */}
        <div className="container-fluid">
          <div className="row">
            <div className="col-sm-12">
              <div className="card">
                <div className="card-header">
                  <h5>Products Category</h5>
                </div>
                <div className="card-body">
                  <div className="btn-popup pull-right">
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={this.onOpenModal}
                      data-toggle="modal"
                      data-original-title="test"
                      data-target="#exampleModal"
                    >
                      Add Category
                    </button>
                    <Modal open={open} onClose={this.onCloseModal}>
                      <div className="modal-header">
                        <h5
                          className="modal-title f-w-600"
                          id="exampleModalLabel2"
                        >
                          Add Physical Product
                        </h5>
                      </div>
                      <div className="modal-body">
                        <form>
                          <div className="form-group">
                            <label
                              htmlFor="recipient-name"
                              className="col-form-label"
                            >
                              Category Name :
                            </label>
                            <input type="text" className="form-control" />
                          </div>
                          <div className="form-group">
                            <label
                              htmlFor="message-text"
                              className="col-form-label"
                            >
                              Category Image :
                            </label>
                            <input
                              className="form-control"
                              id="validationCustom02"
                              type="file"
                            />
                          </div>
                        </form>
                      </div>
                      <div className="modal-footer">
                        <button
                          type="button"
                          className="btn btn-primary"
                          onClick={() => this.onCloseModal("VaryingMdo")}
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          className="btn btn-secondary"
                          onClick={() => this.onCloseModal("VaryingMdo")}
                        >
                          Close
                        </button>
                      </div>
                    </Modal>
                  </div>
                  <div className="clearfix"></div>
                  <div id="basicScenario" className="product-physical">
                    <Datatable
                      multiSelectOption={false}
                      myData={data}
                      pageSize={10}
                      pagination={true}
                      class="-striped -highlight"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* <!-- Container-fluid Ends--> */}
      </Fragment>
    );
  }
}

export default Category;
