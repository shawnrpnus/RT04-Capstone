import React, { Component, Fragment } from 'react';
import Breadcrumb from '../../common/breadcrumb';
import CKEditors from "react-ckeditor-component";
import { AvField, AvForm } from 'availity-reactstrap-validation';
import one from '../../../assets/images/pro3/1.jpg'
import user from '../../../assets/images/user.png';

export class AddProduct extends Component {
    constructor(props) {
        super(props)
        this.state = {
            quantity: 1,
            file: '',
            dummyimgs: [
                { img: user },
                { img: user },
                { img: user },
                { img: user },
                { img: user },
                { img: user },
            ],
            colours: [],
            selectedColours: []
        }
    }
    IncrementItem = () => {
        this.setState(prevState => {
            if (prevState.quantity < 9) {
                return {
                    quantity: prevState.quantity + 1
                }
            } else {
                return null;
            }
        });
    }
    DecreaseItem = () => {
        this.setState(prevState => {
            if (prevState.quantity > 0) {
                return {
                    quantity: prevState.quantity - 1
                }
            } else {
                return null;
            }
        });
    }
    handleChange = (event) => {
        this.setState({ quantity: event.target.value });
    }

    handleSelectColour = (e) => {
        console.log(e.target.color)
        // this.setState({c})
    }

    handleOnCheckboxButtonClick = (e) => {
        const selectedColours = [...this.state.selectedColours];
        const index = selectedColours.indexOf(e);
        if (index < 0) {
            console.log("add");
            selectedColours.push(e);
        } else {
            console.log("remove");
            selectedColours.splice(index, 1);
        }
        this.setState({ selectedColours })
    }

    //image upload
    _handleSubmit(e) {
        e.preventDefault();
    }

    _handleImgChange(e, i) {
        e.preventDefault();

        let reader = new FileReader();
        let file = e.target.files[0];
        const { dummyimgs } = this.state;

        reader.onloadend = () => {
            dummyimgs[i].img = reader.result;
            this.setState({
                file: file,
                dummyimgs,
            });
        }
        reader.readAsDataURL(file)
    }

    render() {

        const { selectedColours } = this.state;

        return (
            <Fragment>
                <Breadcrumb title="Add Product" parent="Physical" />

                <div className="container-fluid">
                    <div className="row">
                        <div className="col-sm-12">
                            <div className="card">
                                <div className="card-header">
                                    <h5>Add Product</h5>
                                </div>
                                <div className="card-body">
                                    <div className="row product-adding">
                                        <div className="col-xl-5">
                                            <div className="add-product">
                                                <div className="row">
                                                    <div className="col-xl-9 xl-50 col-sm-6 col-9">
                                                        <img src={one} alt="" className="img-fluid image_zoom_1 blur-up lazyloaded" />
                                                    </div>
                                                    <div className="col-xl-3 xl-50 col-sm-6 col-3">
                                                        <ul className="file-upload-product">
                                                            {
                                                                this.state.dummyimgs.map((res, i) => {
                                                                    return (
                                                                        <li key={i}>
                                                                            <div className="box-input-file">
                                                                                <input className="upload" type="file" onChange={(e) => this._handleImgChange(e, i)} />
                                                                                <img src={res.img} style={{ width: 50, height: 50 }} />
                                                                                <a id="result1" onClick={(e) => this._handleSubmit(e.target.id)}></a>
                                                                            </div>
                                                                        </li>
                                                                    )
                                                                })
                                                            }
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-xl-7">
                                            <AvForm className="needs-validation add-product-form" onValidSubmit={this.handleValidSubmit} onInvalidSubmit={this.handleInvalidSubmit}>
                                                <div className="form form-label-center">
                                                    <div className="form-group mb-3 row">
                                                        <label className="col-xl-3 col-sm-4 mb-0">Product Name :</label>
                                                        <div className="col-xl-8 col-sm-7">
                                                            <AvField className="form-control" name="product_name" id="validationCustom01" type="text" required />
                                                        </div>
                                                        <div className="valid-feedback">Looks good!</div>
                                                    </div>
                                                    <div className="form-group mb-3 row">
                                                        <label className="col-xl-3 col-sm-4 mb-0">Price :</label>
                                                        <div className="col-xl-8 col-sm-7">
                                                            <AvField className="form-control mb-0" name="price" id="validationCustom02" type="number" required />
                                                        </div>
                                                        <div className="valid-feedback">Looks good!</div>
                                                    </div>
                                                    <div className="form-group mb-3 row">
                                                        <label className="col-xl-3 col-sm-4 mb-0">Product Code :</label>
                                                        <div className="col-xl-8 col-sm-7">
                                                            <AvField className="form-control " name="product_code" id="validationCustomUsername" type="number" required />
                                                        </div>
                                                        <div className="invalid-feedback offset-sm-4 offset-xl-3">Please choose Valid Code.</div>
                                                    </div>
                                                </div>
                                                <div className="form">
                                                    <div className="form-group row">
                                                        <label className="col-xl-3 col-sm-4 mb-0" >Select Size :</label>
                                                        <div className="col-xl-8 col-sm-7">
                                                            <button color={selectedColours.includes(1) ? 'rgb(200,200,200,1)' : 'rgb(200,200,200,0.5)'} onClick={() => { this.handleOnCheckboxButtonClick(1) }} >One</button>
                                                            <button color={selectedColours.includes(1) ? 'rgb(200,255,200,1)' : 'rgb(200,0,200,0.5)'} onClick={() => { this.handleOnCheckboxButtonClick(2) }} >Two</button>
                                                            <button color={selectedColours.includes(1) ? 'rgb(200,100,214,1)' : 'rgb(200,105,200,0.5)'} onClick={() => { this.handleOnCheckboxButtonClick(3) }}>Three</button>
                                                        </div>
                                                    </div>

                                                    <div className="product-page-details product-right mb-0">
                                                        <div className="form-group row">
                                                            <label className="col-xl-3 col-sm-4 mb-0" >Select Colour :</label>
                                                            <div className="col-xl-8 col-sm-7">
                                                                <ul className="color-variant" onClick={this.handleSelectColour}>
                                                                    <button hidden> <li style={{ backgroundColor: "pink" }} color="pink"></li></button>
                                                                    <li className="bg-light1" color="gold"></li>
                                                                    <li className="bg-light2" color="grey"></li>
                                                                </ul>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="form-group row">
                                                        <label className="col-xl-3 col-sm-4 mb-0">Total Products :</label>
                                                        <fieldset className="qty-box ml-0">
                                                            <div className="input-group bootstrap-touchspin">
                                                                <div className="input-group-prepend">
                                                                    <button className="btn btn-primary btn-square bootstrap-touchspin-down" type="button" onClick={this.DecreaseItem} >
                                                                        <i className="fa fa-minus"></i>
                                                                    </button>
                                                                </div>
                                                                <div className="input-group-prepend">
                                                                    <span className="input-group-text bootstrap-touchspin-prefix" ></span>
                                                                </div>
                                                                <input className="touchspin form-control" type="text" value={this.state.quantity} onChange={this.handleChange} />
                                                                <div className="input-group-append">
                                                                    <span className="input-group-text bootstrap-touchspin-postfix"></span>
                                                                </div>
                                                                <div className="input-group-append ml-0">
                                                                    <button className="btn btn-primary btn-square bootstrap-touchspin-up" type="button" onClick={this.IncrementItem}>
                                                                        <i className="fa fa-plus"></i>
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </fieldset>
                                                    </div>
                                                    <div className="form-group row">
                                                        <label className="col-xl-3 col-sm-4">Add Description :</label>
                                                        <div className="col-xl-8 col-sm-7 description-sm">
                                                            <CKEditors
                                                                activeclassName="p10"
                                                                content={this.state.content}
                                                                events={{
                                                                    "blur": this.onBlur,
                                                                    "afterPaste": this.afterPaste,
                                                                    "change": this.onChange
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="offset-xl-3 offset-sm-4">
                                                    <button type="submit" className="btn btn-primary">Add</button>
                                                    <button type="button" className="btn btn-light">Discard</button>
                                                </div>
                                            </AvForm>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div >
                </div >
            </Fragment >
        )
    }
}

export default AddProduct
