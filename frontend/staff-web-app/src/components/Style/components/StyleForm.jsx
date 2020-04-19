import React, { Component } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import "moment";
import { connect } from "react-redux";
import { retrieveAllStyles } from "../../../redux/actions/styleAction";
import { clearErrors } from "../../../redux/actions";
import {
  KeyboardTimePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import MaterialTextField from "../../../shared/components/Form/MaterialTextField";
import { Grid, MenuItem, Select } from "@material-ui/core";
import { Button, ButtonToolbar } from "reactstrap";
import MomentUtils from "@date-io/moment";

const _ = require("lodash");

class StyleForm extends React.Component {
  static propTypes = {
    handleSubmit: PropTypes.func,
    errors: PropTypes.object,
    clearErrors: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
  };
  constructor(props) {
    super(props);
    this.state = {
      styleName: "",
      qnsCreated: [],
      answers: [],
    };
  }

  onChange = (e) => {
    this.setState({ styleName: e.target.value });
    if (Object.keys(this.props.errors).length !== 0) this.props.clearErrors();
  };

  //for adding style ans when creating qns
  handleTextChange = (e, index) => {
    console.log(e.target.value);
    const ansCopy = _.cloneDeep(this.state.answers);
    ansCopy[index] = e.target.value;
    this.setState({ answers: ansCopy });
  };

  clear = () => {
    this.setState({ styleName: "", answers: [] });
  };

  checkIfCanSubmit = () => {
    if (this.state.styleName == "") {
      return true;
    }
    if (
      this.props.allStyles &&
      this.state.answers.length !== this.props.allStyles[0].questions.length
    ) {
      return true;
    }
    const ansOnly = [];
    if (this.state.answers.length !== 0) {
      for (let i = 0; i < this.state.answers.length; i++) {
        ansOnly.push(this.state.answers[i]);
        if (this.state.answers[i] === "") {
          console.log("cannot submit");
          return true;
        }
      }
      if (this.checkIfDuplicateExists(ansOnly)) {
        return true;
      }
    }
    return false;
  };

  checkIfDuplicateExists(w) {
    return new Set(w).size !== w.length;
  }

  render() {
    const { handleSubmit, errors } = this.props;
    const hasErrors = Object.keys(this.props.errors).length !== 0;
    const qnsCreated = [];
    if (
      this.props.allStyles &&
      this.props.allStyles[0].questions.length !== 0 &&
      this.state.qnsCreated.length == 0
    ) {
      this.setState({ qnsCreated: this.props.allStyles[0].questions });
    }
    return (
      <MuiPickersUtilsProvider utils={MomentUtils}>
        <form className="material-form">
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <MaterialTextField
                fieldLabel="Style Name"
                onChange={this.onChange}
                state={this.state}
                fieldName="styleName"
                errors={errors}
              />
            </Grid>
            {this.state.qnsCreated.length !== 0 ? (
              <Grid item xs={12}>
                <h5 className="bold-text">
                  Add Answer to Created Quiz Questions
                </h5>
                <br />
                {this.state.qnsCreated.map((key, index) => {
                  return (
                    <Grid>
                      <MaterialTextField
                        fieldLabel={key}
                        fieldName={`answers[${index}]`}
                        state={this.state}
                        errors={errors}
                        onChange={(event) =>
                          this.handleTextChange(event, index)
                        }
                      />
                      <br />
                    </Grid>
                  );
                })}
                <ButtonToolbar className="form__button-toolbar">
                  <Button
                    color="primary"
                    onClick={(e) => {handleSubmit(e, this.state)
                      this.setState({ styleName: "", answers: [] });
                    }}
                    disabled={hasErrors || this.checkIfCanSubmit()}
                  >
                    Submit
                  </Button>
                  <Button type="button" onClick={this.clear}>
                    Clear
                  </Button>
                </ButtonToolbar>
              </Grid>
            ) : (
              <Grid item xs={12}>
                <ButtonToolbar className="form__button-toolbar">
                  <Button
                    color="primary"
                    onClick={(e) => {handleSubmit(e, this.state)
                      this.setState({ styleName: "" });
                    }}
                    disabled={hasErrors}
                  >
                    Submit
                  </Button>
                  <Button type="button" onClick={this.clear}>
                    Clear
                  </Button>
                </ButtonToolbar>
              </Grid>
            )}
          </Grid>
        </form>
      </MuiPickersUtilsProvider>
    );
  }
}

//mapping global state to this component
const mapStateToProps = (state) => ({
  allStyles: state.style.allStyles,
  errors: state.errors,
});

const mapDispatchToProps = {
  retrieveAllStyles,
  clearErrors,
};

export default connect(mapStateToProps, mapDispatchToProps)(StyleForm);
