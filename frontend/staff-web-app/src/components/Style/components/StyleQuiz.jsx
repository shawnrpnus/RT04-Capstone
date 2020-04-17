import React, { Component, useState } from "react";
import MaterialTextField from "../../../shared/components/Form/MaterialTextField";
import {
  retrieveAllStyles,
  createStyleQuizQns,
  deleteStyleQuizQns,
  updateStyleQuizQns,
} from "../../../redux/actions/styleAction";
import { clearErrors } from "../../../redux/actions";
import connect from "react-redux/es/connect/connect";
import withPage from "../../Layout/page/withPage";
import StyleIdAnswerMap from "../../../models/style/StyleIdAnswerMap";
import Button from "@material-ui/core/Button";
import { Grid } from "@material-ui/core";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import MaterialObjectSelect from "../../../shared/components/Form/MaterialObjectSelect";

const _ = require("lodash");

class StyleQuiz extends Component {
  constructor(props) {
    super(props);
    this.handleChangeAddTo = this.handleChangeAddTo.bind(this);
    this.handleChangeUpdateAndDelete = this.handleChangeUpdateAndDelete.bind(
      this
    );

    this.state = {
      question: "", //for adding new qns
      styleIdAnswerMaps: [],
      currentStyleId: 0,
      mode: true,
      questionsCreated: [],
      selectedQns: "", //for selecting qns to update/delete
      updatedQns: "",
      viewMode: true, //by default is in viewMode, unless click on update button
      readOnly: true,
      answersForSelectedQns: [],
      hasUpdated: false,
      answers: [],
      fieldsNotChanged: true,
      fieldsNotFilled: true
    };
  }

  componentDidMount() {
    this.props.retrieveAllStyles();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.allStyles) {
      console.log("reached");
      let qnsCreated = this.props.allStyles[0].questions.map((v) => ({
        question: v,
      }));
      if (!_.isEqual(this.state.questionsCreated, qnsCreated)) {
        this.setState({
          questionsCreated: qnsCreated,
        });
      }
    }
    //qns is selected or updated, retrieve answers for the styles
    if (
      this.props.allStyles &&
      this.state.selectedQns !== prevState.selectedQns
    ) {
      const ans = [];
      const qns = this.state.selectedQns;
      console.log(qns);
      this.props.allStyles.forEach(function(value, index) {
        Object.entries(value.answers).forEach(function(key, val) {
          if (key[0] === qns) {
            ans.push({
              styleId: value.styleId,
              styleName: value.styleName,
              answer: key[1],
            });
          }
        });
      });
      this.setState({ answersForSelectedQns: ans });
    }
    console.log(this.props.allStyles);

    console.log(this.state.questionsCreated.length);
    console.log(prevState.questionsCreated.length);
    console.log(this.state.questionsCreated);
  }

  //for adding style qns when creating qns
  addStyleQns = (e) => {
    this.setState({ question: e.target.value });
    if (Object.keys(this.props.errors).length !== 0) {
      this.props.clearErrors();
    }
  };

  checkIfCanSubmit = () => {
    if (
      this.state.question == "" ||
      this.state.answers.length !== this.props.allStyles.length
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

  checkIfCanUpdate = () => {
    if (this.state.fieldsNotChanged == true) {
      return true;
    }

    if (this.state.hasUpdated == false) {
      return true;
    }
    if (this.state.updatedQns === "") {
      return true;
    }
    const ansOnly = [];

    if (this.state.answersForSelectedQns.length !== 0) {
      for (let i = 0; i < this.state.answersForSelectedQns.length; i++) {
        ansOnly.push(this.state.answersForSelectedQns[i].answer);
        if (this.state.answersForSelectedQns[i].answer === "") {
          console.log("cannot update");
          return true;
        }
      }
      if (ansOnly.length !== 0) {
        console.log(ansOnly);
        let duplicateExists = this.checkIfDuplicateExists(ansOnly);
        if (duplicateExists) {
          return true;
        }
      }
    }
    return false;
  };

  checkIfDuplicateExists(w) {
    return new Set(w).size !== w.length;
  }
  

  //for adding style ans when creating qns
  handleTextChange = (e, index) => {
    console.log(e.target.value);
    const ansCopy = _.cloneDeep(this.state.answers);
    ansCopy[index] = e.target.value;
    this.setState({ answers: ansCopy });
  };

  selectStyleQns = (e) => {
    console.log(e.target.value);
    this.setState({ selectedQns: e.target.value, updatedQns: e.target.value });
    if (Object.keys(this.props.errors).length !== 0) {
      this.props.clearErrors();
    }
  };

  //for update selected style qns
  updateStyleQns = (e) => {
    this.setState({ updatedQns: e.target.value, fieldsNotChanged: false });
    if (Object.keys(this.props.errors).length !== 0) {
      this.props.clearErrors();
    }
  };

  //for updating style
  updateStyleAns = (e, index) => {
    console.log(e.target.value);
    const ansCopy = _.cloneDeep(this.state.answersForSelectedQns);
    ansCopy[index].answer = e.target.value;
    this.setState({
      answersForSelectedQns: ansCopy,
      hasUpdated: true,
      fieldsNotChanged: false,
    });
  };

  handleChangeAddTo() {
    this.setState({
      mode: true,
      selectedQns: "",
      updatedQns: "",
      answersForSelectedQns: [],
      questionsCreated: [],
      styleIdAnswerMaps: [],
    });
  }
  handleChangeUpdateAndDelete() {
    this.setState({
      mode: false,
      selectedQns: "",
      updatedQns: "",
      answersForSelectedQns: [],
      questionsCreated: [],
      question: "",
      styleIdAnswerMaps: [],
      answers: [],
    });
  }

  checkIfCanClearForm = () => {
    //cannot clear if both qns and answers not filled up
    if (this.state.question == "" && this.state.answers.length == 0) {
      console.log("cannot clear")
      return true
    } 
    return false
  }

  //handle delete style qns
  handleDeleteQns(qnsToDelete) {
    let qnsCreated = this.props.allStyles[0].questions;
    let qnsNum = 0;
    for (let i = 0; i < qnsCreated.length; i++) {
      if (qnsCreated[i] === qnsToDelete) {
        qnsNum = i;
      }
    }
    console.log(qnsNum);
    this.props.deleteStyleQuizQns(qnsNum);
    this.setState({ selectedQns: "", updatedQns: "" });
  }
  //handle update style qns
  handleUpdate = (event) => {
    const styleIdAnswerMaps = [];
    console.log(this.state.answersForSelectedQns);
    const qnsToUpdate = this.state.selectedQns;
    const updatedQns = this.state.updatedQns;
    console.log(qnsToUpdate);
    console.log(updatedQns);
    //send in the qns
    const answers = [];
    const answersForQns = this.state.answersForSelectedQns;
    for (let i = 0; i < answersForQns.length; i++) {
      styleIdAnswerMaps.push(
        new StyleIdAnswerMap(answersForQns[i].styleId, answersForQns[i].answer)
      );
    }
    console.log(styleIdAnswerMaps);
    //need to send in qnsSelected, qnsUpdated, answersToString
    this.props.updateStyleQuizQns({
      qnsToUpdate,
      updatedQns,
      styleIdAnswerMaps,
    });
    this.setState({
      answersForSelectedQns: [],
      selectedQns: "",
      updatedQns: "",
      fieldsNotChanged: true,
      hasUpdated: false,
    });
  };

  clearForm = (e) => {
    this.setState({
      answers: [],
      question: "",
    });
  }

  resetFields = (e) => {
    const ans = [];
    const qns = this.state.selectedQns;
    this.props.allStyles.forEach(function(value, index) {
      Object.entries(value.answers).forEach(function(key, val) {
        if (key[0] === qns) {
          ans.push({
            styleId: value.styleId,
            styleName: value.styleName,
            answer: key[1],
          });
        }
      });
    });
    this.setState({
      updatedQns: qns,
      answersForSelectedQns: ans,
      fieldsNotChanged: true,
    });
  };

  handleSubmit = (event) => {
    const styleIdAnswerMaps = [];
    console.log(this.state.answers);
    //send in the qns
    const answersForQns = this.state.answers;
    for (let i = 0; i < answersForQns.length; i++) {
      styleIdAnswerMaps.push(
        new StyleIdAnswerMap(this.props.allStyles[i].styleId, answersForQns[i])
      );
    }
    console.log(styleIdAnswerMaps);
    const question = this.state.question;
    this.props.createStyleQuizQns({ question, styleIdAnswerMaps });
    this.setState({
      mode: false,
      question: "",
      answers: [],
      currentStyleId: 0,
      styleIdAnswerMaps: [],
      questionsCreated: [],
    });
  };

  render() {
    let readOnly = this.state.readOnly;
    const { errors, clearErrors } = this.props;
    const salesmarketing =
      _.get(this.props, "staff.department.departmentName") ===
      "Sales and Marketing";

    return (
      <React.Fragment>
        <div className="card__title">
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              {this.state.mode ? (
                <h5 className="bold-text">Add Style Question</h5>
              ) : (
                <h5 className="bold-text">Update/Delete Style Question</h5>
              )}
            </Grid>
            <Grid item xs={12} md={3} />
            <Grid item xs={12} md={3}>
              {salesmarketing && (
                <ButtonGroup color="primary">
                  <Button
                    onClick={this.handleChangeAddTo}
                    variant={this.state.mode ? "contained" : "outlined"}
                  >
                    Add
                  </Button>
                  <Button
                    onClick={this.handleChangeUpdateAndDelete}
                    variant={this.state.mode ? "outlined" : "contained"}
                    // disabled={this.state.questionsCreated.length == 0}
                  >
                    Update/Delete
                  </Button>
                </ButtonGroup>
              )}
            </Grid>
          </Grid>
        </div>
        <form className="material-form">
          <Grid container spacing={3}>
            {this.state.mode && salesmarketing ? (
              <Grid item xs={12}>
                {this.props.allStyles ? (
                  <Grid item xs={12} md={12}>
                    <MaterialTextField
                      fieldLabel="Question"
                      fieldName="question"
                      state={this.state}
                      errors={errors}
                      onChange={this.addStyleQns}
                    />
                    <br />
                    <h5 className="bold-text">Answer For Each Style</h5>
                    <br />
                    {Object.keys(this.props.allStyles)
                      .filter((key) => this.props.allStyles[key].styleId)
                      .map((key, index) => {
                        return (
                          <div>
                            <Grid item xs={12} md={12}>
                              <MaterialTextField
                                fieldLabel={
                                  this.props.allStyles[index].styleName
                                }
                                fieldName={`answers[${index}]`}
                                state={this.state}
                                errors={errors}
                                onChange={(event) =>
                                  this.handleTextChange(event, index)
                                }
                              />
                            </Grid>
                          </div>
                        );
                      })}
                    <br />
                    <Grid align="center">
                      <Button
                        style={{ justifyContent: "center" }}
                        color="primary"
                        variant="contained"
                        style={{ marginRight: "10px" }}
                        disabled={this.checkIfCanSubmit()}
                        onClick={(event) => this.handleSubmit(event)}
                      >
                        Submit
                      </Button>
                      <Button
                        color="primary"
                        variant="contained"
                        disabled={this.checkIfCanClearForm()}
                        onClick={(e) => this.clearForm(e)}
                      >
                        Clear
                      </Button>
                    </Grid>
                  </Grid>
                ) : (
                  <h5>No Styles Found</h5>
                )}
              </Grid>
            ) : (
              <Grid item xs={12}>
                {this.props.allStyles && this.state.questionsCreated ? (
                  <Grid>
                    <MaterialObjectSelect
                      fieldName="selectedQns"
                      fieldLabel="Select Style Question"
                      onChange={this.selectStyleQns}
                      state={this.state}
                      objects={this.state.questionsCreated}
                      objectFieldForValue="question"
                      objectFieldForKey="question"
                      objectFieldToDisplay="question"
                    />
                    <Grid>
                      <br />
                      <MaterialTextField
                        fieldLabel="Question"
                        fieldName="updatedQns"
                        state={this.state}
                        errors={errors}
                        onChange={(e) => this.updateStyleQns(e)}
                      />
                      <br />
                    </Grid>
                    <h5 className="bold-text">Answer For Each Style</h5>
                    <br />
                    {this.state.answersForSelectedQns.map((key, index) => (
                      <Grid>
                        <MaterialTextField
                          fieldLabel={
                            this.state.answersForSelectedQns[index].styleName
                          }
                          fieldName={`answersForSelectedQns[${index}].answer`}
                          state={this.state}
                          errors={errors}
                          onChange={(event) =>
                            this.updateStyleAns(event, index)
                          }
                        />
                        <br />
                      </Grid>
                    ))}
                    <br />
                    <Grid>
                      {this.state.selectedQns === "" ? (
                        <Grid></Grid>
                      ) : (
                        <Grid align="center">
                          <Button
                            color="primary"
                            variant="contained"
                            disabled={this.checkIfCanUpdate()}
                            onClick={(e) => this.handleUpdate(e)}
                            style={{ marginRight: "10px" }}
                          >
                            Update
                          </Button>
                          <Button
                            color="primary"
                            variant="contained"
                            disabled={this.state.questionsCreated.length == 1}
                            onClick={(e) =>
                              this.handleDeleteQns(this.state.selectedQns)
                            }
                            style={{ marginRight: "10px" }}
                          >
                            Delete Question
                          </Button>
                          <Button
                            color="primary"
                            variant="contained"
                            disabled={this.state.fieldsNotChanged}
                            onClick={(e) => this.resetFields(e)}
                          >
                            Reset Fields
                          </Button>
                        </Grid>
                      )}
                    </Grid>
                  </Grid>
                ) : (
                  <h5>No Style Questions Found</h5>
                )}
              </Grid>
            )}
          </Grid>
        </form>
      </React.Fragment>
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
  createStyleQuizQns,
  deleteStyleQuizQns,
  updateStyleQuizQns,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withPage(StyleQuiz, "Style Quiz"));
