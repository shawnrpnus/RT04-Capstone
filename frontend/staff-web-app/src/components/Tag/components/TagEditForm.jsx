import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import 'moment';
import { connect } from "react-redux";

import { clearErrors } from "../../../redux/actions";
import { createNewTag } from "../../../redux/actions/tagAction";
import { KeyboardTimePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import MaterialTextField from "../../../shared/components/Form/MaterialTextField";
import { Grid, MenuItem, Select } from "@material-ui/core";
import { Button, ButtonToolbar } from "reactstrap";
import MomentUtils from "@date-io/moment";
import CreateTagRequest from "../../../models/createTagRequest";


class TagEditForm extends Component {
    static propTypes = {
        createdUpdatedTag: PropTypes.object,
        errors: PropTypes.object,
        clearErrors: PropTypes.func.isRequired,
        createNewTag: PropTypes.func.isRequired
    }
    constructor(props) {
        super(props);
        this.state = {
            name: ""
        }
    }

    onChange = (e) => {
        const name = e.target.name;
        this.setState({[name]: e.target.value}); //computed property name syntax
        if (Object.keys(this.props.errors).length !== 0) this.props.clearErrors();
        console.log(this.state);
    }

    // this method makes the api calls
    handleSubmit = (e) => {
        e.preventDefault();
        const{name} = this.state;
        const req = new CreateTagRequest(name);
        
        this.props.createNewTag(req, this.props.history);
    }

    render() {
        const { errors, createdUpdatedTag } = this.props;
        console.log("HIHIHIHIHI");
        return (
            <MuiPickersUtilsProvider utils={MomentUtils}>
                <form className="material-form" onSubmit={this.handleSubmit}>
                    <Grid container spacing={3}>
                        <Grid item xs={3}>
                            {/*<MaterialTextField fieldLabel="Tag Name"*/}
                            {/*    onChange={this.onChange}*/}
                            {/*    state={this.state}*/}
                            {/*    fieldName="name"*/}
                            {/*    errors={errors} />*/}
                        </Grid>
                        <Grid item xs={12}>
                            <ButtonToolbar className="form__button-toolbar">
                                <Button color="primary" type="submit">Submit</Button>
                                <Button type="button">
                                    Cancel
                                </Button>
                            </ButtonToolbar>
                        </Grid>
                    </Grid>
                </form>
            </MuiPickersUtilsProvider>


        )
    }
}

//connect state with redux/props
const mapStateToProps = (state) => ({
    createdUpdatedTag: state.tag.createdUpdatedTag,
    errors: state.errors
})

const mapDispatchToProps = {
    //actions
    createNewTag,
    clearErrors
}

const connectedForm = connect(
    mapStateToProps,
    mapDispatchToProps
)(TagEditForm);

export default withRouter(connectedForm);
