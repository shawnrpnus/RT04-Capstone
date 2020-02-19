import React, { Component, Fragment } from 'react';
import Breadcrumb from '../../common/breadcrumb';
import CKEditors from "react-ckeditor-component";
import { AvField, AvForm } from 'availity-reactstrap-validation';
import one from '../../../assets/images/pro3/1.jpg'
import user from '../../../assets/images/user.png';
import Checkbox from '@material-ui/core/Checkbox';
import CircleCheckedFilled from '@material-ui/icons/CheckCircle';
import Brightness1Icon from '@material-ui/icons/Brightness1';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

const light = "rgb(255,128,132, 0.3)"
const dark = "rgb(255,128,132, 0.8)"

export class AddProduct extends Component {
    constructor(props) {
        super(props)
        this.state = {
            colours: [],
            selectedColours: [],
            selectedSizes: [],
            details: {
                description: "",
                productName: "",
                cost: "",
                price: ""
            }
        }
    }


    handleChange = ({ target: input }) => {
        const details = { ...this.state.details }
        details[input.name] = input.value;
        this.setState({ details })
    }

    handleSelectSize = e => {
        const size = e.currentTarget.value || e.target.value
        const selectedSizes = [...this.state.selectedSizes];
        const index = selectedSizes.indexOf(size);
        if (index < 0) {
            selectedSizes.push(size);
        } else {
            selectedSizes.splice(index, 1);
        }
        this.setState({ selectedSizes })
    }

    handleOnCheckboxButtonClick = (event, colour) => {
        const selectedColours = [...this.state.selectedColours];
        const index = selectedColours.indexOf(colour);
        if (index < 0) {
            selectedColours.push(colour);
        } else {
            selectedColours.splice(index, 1);
        }
        this.setState({ selectedColours })
    }

    handleDiscard = () => {
        this.setState({
            colours: [],
            selectedColours: [],
            selectedSizes: [],
            details: {
                description: "",
                productName: "",
                cost: "",
                price: ""
            }
        })
    }

    handleCreateProduct = () => {
    }



    render() {

        const { selectedColours, selectedSizes, content } = this.state;
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
                                        {/* <div className="col-xl-5">
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
                                        </div> */}
                                        <div className="col-xl-8">
                                            <AvForm className="needs-validation add-product-form" onValidSubmit={this.handleValidSubmit} onInvalidSubmit={this.handleInvalidSubmit}>
                                                <div className="form form-label-center">
                                                    <div className="form-group mb-3 row">
                                                        <label className="col-xl-3 col-sm-4 mb-0">Product Name :</label>
                                                        <div className="col-xl-8 col-sm-7">
                                                            <AvField className="form-control" name="productName" id="validationCustom01" type="text" required
                                                                onChange={this.handleChange} />
                                                        </div>
                                                        <div className="valid-feedback">Looks good!</div>
                                                    </div>
                                                    <div className="form-group mb-3 row">
                                                        <label className="col-xl-3 col-sm-4 mb-0">Price :</label>
                                                        <div className="col-xl-8 col-sm-7">
                                                            <AvField className="form-control mb-0" name="price" id="validationCustom02" type="number" required
                                                                onChange={this.handleChange} />
                                                        </div>
                                                        <div className="valid-feedback">Looks good!</div>
                                                    </div>
                                                    <div className="form-group mb-3 row">
                                                        <label className="col-xl-3 col-sm-4 mb-0">Cost :</label>
                                                        <div className="col-xl-8 col-sm-7">
                                                            <AvField className="form-control " name="cost" id="validationCustomUsername"
                                                                type="number" required onChange={this.handleChange} />
                                                        </div>
                                                        <div className="invalid-feedback offset-sm-4 offset-xl-3">Please choose Valid Code.</div>
                                                    </div>
                                                </div>
                                                <div className="form">
                                                    <div className="form-group row">
                                                        <label className="col-xl-3 col-sm-4 mb-0" >Select Colour :</label>
                                                        <div className="col-xl-8 col-sm-7">
                                                            <Checkbox
                                                                disableRipple
                                                                onChange={(e) => this.handleOnCheckboxButtonClick(e, '0072ea')} value={selectedColours.includes("0072ea")}
                                                                icon={<Brightness1Icon style={{ fill: '#0072ea' }} />}
                                                                checkedIcon={<CircleCheckedFilled style={{ fill: '#0072ea' }} />}
                                                            />
                                                            <Checkbox
                                                                disableRipple
                                                                onChange={(e) => this.handleOnCheckboxButtonClick(e, 'gold')} value={selectedColours.includes("gold")}
                                                                icon={<Brightness1Icon style={{ fill: 'gold' }} />}
                                                                checkedIcon={<CircleCheckedFilled style={{ fill: 'gold' }} />}
                                                            />
                                                            <Checkbox
                                                                disableRipple
                                                                onChange={(e) => this.handleOnCheckboxButtonClick(e, 'red')} value={selectedColours.includes("red")}
                                                                icon={<Brightness1Icon style={{ fill: 'red' }} />}
                                                                checkedIcon={<CircleCheckedFilled style={{ fill: 'red' }} />}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="form">
                                                        <div className="form-group row">
                                                            <label className="col-xl-3 col-sm-4 mb-0" >Select Size :</label>
                                                            <div className="col-xl-8 col-sm-7">
                                                                {["XS", "S", "M", "L", "XL"].map((size) => {
                                                                    return <Button
                                                                        variant="contained" color="primary"
                                                                        style={{
                                                                            backgroundColor: !selectedSizes.includes(size) ? light : dark,
                                                                            borderRadius: 50,
                                                                            margin: "0 1% 3% 1%"
                                                                        }}
                                                                        onClick={this.handleSelectSize} value={size}><p style={{ color: "black" }}>{size}</p></Button>
                                                                })}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="form-group row">
                                                        <label className="col-xl-3 col-sm-4">Add Description :</label>
                                                        <div className="col-xl-8 col-sm-7 description-sm">
                                                            <AvField className="form-control" name="product_name" id="validationCustom01" type="textarea" required
                                                                onChange={this.handleChange} />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="offset-xl-3 offset-sm-4">
                                                    <button type="submit" className="btn btn-primary" onClick={this.handleCreateProduct}>Create</button>
                                                    <button type="button" className="btn btn-light" onClick={this.handleDiscard}>Discard</button>
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
