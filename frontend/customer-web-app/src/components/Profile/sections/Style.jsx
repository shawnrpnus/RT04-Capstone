import React, { useEffect, useRef, useState } from "react";
import { clearErrors } from "redux/actions";
import { useDispatch, useSelector } from "react-redux";
import signupPageStyle from "assets/jss/material-kit-pro-react/views/signupPageStyle";
import { makeStyles } from "@material-ui/core/styles";
import Button from "components/UI/CustomButtons/Button";
import { useSnackbar } from "notistack";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Paper from "@material-ui/core/Paper";
import Popper from "@material-ui/core/Popper";
import {
  addStylePreferences,
  deleteStylePreferences,
  updateStylePreferences,
} from "redux/actions/customerActions";
import { retrieveAllStyles } from "redux/actions/styleActions";
import { CheckBoxOutlineBlankRounded } from "@material-ui/icons";
const useStyles = makeStyles(signupPageStyle);
const _ = require("lodash");

//Quiz Questions
const questionBank = [
  {
    id: 0,
    question: "What is your gender",
    answers: ["Male", "Female"],
  },
];

function Style(props) {
  //Hooks
  const classes = useStyles();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  //Redux
  const dispatch = useDispatch();
  const errors = useSelector((state) => state.errors);
  const customer = useSelector((state) => state.customer.loggedInCustomer);
  const stylesRetrieved = useSelector((state) => state.style.allStyles);

  //State
  const [inputState, setInputState] = useState({
    question0: questionBank[0].question,
    questions: [],
    answer0: questionBank[0].answers,
    answers: [],
    error: "",
    style: "",
    //new
    questionsRetrieved: [],
    answer0Retrieved: [],
    answersRetrieved: [],
    stylePreferences: [],
    currentQns: 0,
    totalQns: 0,
    indexes: [], //to store styleIds for finding out style preferences
  });

  const [popoverOpen, setPopoverOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [hasAddStyle, setAddedStyle] = useState(false);
  const [updateMode, setUpdateMode] = useState(false);

  useEffect(() => {
    dispatch(retrieveAllStyles());
    const ans = [];
    if (stylesRetrieved && stylesRetrieved[0].questions.length !== 0) {
      stylesRetrieved.forEach(function(value, index) {
        ans.push({
          styleId: value.styleId,
          answers: value.answers,
        });
      });
      console.log(ans);
      setInputState((inputState) => ({
        ...inputState,
        questions: stylesRetrieved[0].questions,
        answers: ans,
        totalQns: stylesRetrieved[0].questions.length + 1,
      }));
    }
    if (customer.style !== null) {
      //customer did the style quiz
      var style = new Array();
      style = customer.style.stylePreference.split(",");
      var qns = new Array();
      var answer = new Array();
      var numQns = style.length / 2;
      console.log(numQns);
      for (var i = 0; i < style.length; i++) {
        qns.push(style[i]);
        answer.push(style[i + 1]);
        i++;
      }
      setInputState((inputState) => ({
        ...inputState,
        style: customer.style.styleName,
        answer0Retrieved: customer.style.gender,
        questionsRetrieved: qns,
        answersRetrieved: answer,
      }));
      setAddedStyle(true);
    } else {
    }
  }, [customer]);

  const checkIfCanAns = (index) => {
    if (index === inputState.currentQns) {
      return false;
    } else {
      return true;
    }
  };

  const handleSaveAns = (index, qns, answer) => {
    console.log(index);
    console.log(qns);
    console.log(answer);
    inputState.stylePreferences.push(qns);
    inputState.stylePreferences.push(answer);
    inputState.indexes.push(index);
    console.log(inputState.stylePreferences);
    console.log(inputState.indexes);
    setInputState((inputState) => ({
      ...inputState,
      currentQns: inputState.currentQns + 1,
    }));
  };

  const handleSaveGender = (answer) => {
    console.log(answer);
    setInputState((inputState) => ({
      ...inputState,
      answer0: [answer],
      currentQns: inputState.currentQns + 1,
    }));
  };

  const handleSubmitStylePreferences = () => {
    const customerId = customer.customerId;
    const stylePreference = inputState.stylePreferences.toString();
    setInputState((inputState) => ({
      ...inputState,
      answers: [],
    }));
    const gender = inputState.answer0.toString();
    console.log(gender);
    //find the most common index
    var counts = {};
    var compare = 0;
    var mostFrequent;
    for (var i = 0, len = inputState.indexes.length; i < len; i++) {
      var index = inputState.indexes[i];

      if (counts[index] === undefined) {
        counts[index] = 1;
      } else {
        counts[index] = counts[index] + 1;
      }
      if (counts[index] > compare) {
        compare = counts[index];
        mostFrequent = inputState.indexes[i];
      }
    }
    //based on most common index, find the styleId
    var styleId = stylesRetrieved[mostFrequent].styleId;
    console.log(styleId);
    const req = { customerId, stylePreference, styleId, gender };
    dispatch(addStylePreferences(req, enqueueSnackbar, setAddedStyle));
    setAddedStyle(true);
  };

  const updateStyle = () => {
    console.log("update");
    setAddedStyle(false);
    setUpdateMode(true);
    const ans = [];
    stylesRetrieved.forEach(function(value, index) {
      ans.push({
        styleId: value.styleId,
        answers: value.answers,
      });
    });
    setInputState((inputState) => ({
      ...inputState,
      question0: questionBank[0].question,
      questions: stylesRetrieved[0].questions,
      answers: ans,
      answer0: questionBank[0].answers,
      currentQns: 0,
      totalQns: stylesRetrieved[0].questions.length + 1,
    }));
  };

  const cancelUpdateStylePreferences = () => {
    setAddedStyle(true);
    setUpdateMode(false);
    var style = new Array();
    style = customer.style.stylePreference.split(",");
    var qns = new Array();
    var answer = new Array();
    var numQns = style.length / 2;
    console.log(numQns);
    for (var i = 0; i < style.length; i++) {
      qns.push(style[i]);
      answer.push(style[i + 1]);
      i++;
    }
    setInputState((inputState) => ({
      ...inputState,
      style: customer.style.styleName,
      answer0: questionBank[0].answers,
      currentQns: 0,
      stylePreferences: [],
      indexes: [],
      questions: [],
      answers: [],
    }));
  };

  const cancelSubmitStylePreferences = () => {
    setInputState((inputState) => ({
      ...inputState,
      stylePreferences: [],
      indexes: [],
      answer0: questionBank[0].answers,
      currentQns: 0
    }));
  };

  const handleUpdateStylePreferences = () => {
    //check if customer made changes to style quiz
    const customerId = customer.customerId;
    const stylePreference = inputState.stylePreferences.toString();
    setInputState((inputState) => ({
      ...inputState,
      answers: [],
      stylePreferences: [],
      indexes: [],
      questions: [],
      currentQns: 0
    }));
    const gender = inputState.answer0.toString();
    console.log(gender);
    //find the most common index
    var counts = {};
    var compare = 0;
    var mostFrequent;
    for (var i = 0, len = inputState.indexes.length; i < len; i++) {
      var index = inputState.indexes[i];

      if (counts[index] === undefined) {
        counts[index] = 1;
      } else {
        counts[index] = counts[index] + 1;
      }
      if (counts[index] > compare) {
        compare = counts[index];
        mostFrequent = inputState.indexes[i];
      }
    }
    //based on most common index, find the styleId
    var styleId = stylesRetrieved[mostFrequent].styleId;
    console.log(styleId);
    const req = { customerId, stylePreference, styleId, gender };
    dispatch(addStylePreferences(req, enqueueSnackbar, setAddedStyle));
    setAddedStyle(true);
  };

  const clearConfirmation = (e) => {
    setAnchorEl(e.currentTarget);
    setPopoverOpen(true);
  };

  const handleDeleteStylePreferences = () => {
    setUpdateMode(false);
    setAddedStyle(false);
    const ans = [];
    stylesRetrieved.forEach(function(value, index) {
      ans.push({
        styleId: value.styleId,
        answers: value.answers,
      });
    });
    setInputState((inputState) => ({
      ...inputState,
      question0: questionBank[0].question,
      questions: stylesRetrieved[0].questions,
      answers: ans,
      answer0: questionBank[0].answers,
      currentQns: 0,
      totalQns: stylesRetrieved[0].questions.length + 1,
    }));
    const customerId = customer.customerId;
    const styleChosen = customer.style.styleName;
    const req = { customerId, styleChosen };
    dispatch(deleteStylePreferences(req, enqueueSnackbar, setAddedStyle));
    setPopoverOpen(false);
  };

  return (
    <div className={classes.textCenter}>
      <h4>Style Quiz</h4>
      <small>Receive recommendations on products that suit your style</small>
      {stylesRetrieved && stylesRetrieved[0].questions.length === 0 ? (
        <h5 className="bold-text">Look out for upcoming Style Quiz!</h5>
      ) : (
        <React.Fragment>
          {hasAddStyle ? ( //if added style
            <div>
              <div>
                <h5>
                  <i>
                    Your Style is <b>{inputState.style}</b>
                  </i>
                </h5>
                <div>
                  <h6>{inputState.question0}</h6>
                  <Button color="rose">{inputState.answer0Retrieved}</Button>
                  {inputState.questionsRetrieved.map((qns, qnsNo) => (
                    <div>
                      <h6>{qns}</h6>
                      <Button color="rose">{inputState.answersRetrieved[qnsNo]}</Button>
                    </div>
                  ))}
                </div>
                <div className={classes.textCenter} style={{ marginTop: 20 }}>
                  <Button round color="primary" onClick={updateStyle}>
                    Redo Style Quiz
                  </Button>
                  <Button round color="primary" onClick={clearConfirmation}>
                    Delete Style Preferences
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            //have not done/update
            <div>
              <form>
                <h6>{inputState.question0}</h6>
                {inputState.answer0.map((text, index) => (
                  <Button
                    key={index}
                    disabled={checkIfCanAns(0)}
                    color="rose"
                    onClick={() => handleSaveGender(text)}
                  >
                    {text}
                  </Button>
                ))}
                {inputState.questions.map((question, qnsNo) => (
                  <div>
                    <h6>{question}</h6>
                    {inputState.answers
                      .map((answer) =>
                        Object.entries(answer.answers).filter(
                          (pair) => pair[0] === question
                        )
                      )
                      .map((ans, index) => (
                        <Button
                          color="rose"
                          disabled={checkIfCanAns(qnsNo + 1)}
                          onClick={(e) =>
                            handleSaveAns(index, question, ans[0][1])
                          }
                        >
                          {ans[0][1]}
                        </Button>
                      ))}
                  </div>
                ))}
                <div className={classes.textCenter} style={{ marginTop: 20 }}>
                  {updateMode ? (
                    <React.Fragment>
                      <Button
                        onClick={handleUpdateStylePreferences}
                        round
                        color="primary"
                        disabled={inputState.currentQns !== inputState.totalQns}
                      >
                        Update Style Preferences
                      </Button>

                      <Button
                        onClick={cancelUpdateStylePreferences}
                        round
                        color="primary"
                      >
                        Cancel
                      </Button>
                    </React.Fragment>
                  ) : (
                    <React.Fragment>
                      <Button
                        onClick={handleSubmitStylePreferences}
                        disabled={inputState.currentQns !== inputState.totalQns}
                        round
                        color="primary"
                      >
                        Find Out Your Style
                      </Button>

                      <Button
                        onClick={cancelSubmitStylePreferences}
                        round
                        color="primary"
                        disabled={inputState.currentQns == 0}
                      >
                        Cancel
                      </Button>
                    </React.Fragment>
                  )}
                </div>
              </form>
            </div>
          )}
        </React.Fragment>
      )}
      <Popper
        open={popoverOpen}
        anchorEl={anchorEl}
        style={{ zIndex: "2000" }}
        placement="bottom"
      >
        <ClickAwayListener onClickAway={() => setPopoverOpen(false)}>
          <Paper style={{ padding: "5px" }}>
            <h5 style={{ textAlign: "center", marginBottom: "0" }}>Delete?</h5>
            <Button color="danger" onClick={handleDeleteStylePreferences}>
              Yes
            </Button>
            <Button onClick={() => setPopoverOpen(false)}>No</Button>
          </Paper>
        </ClickAwayListener>
      </Popper>
    </div>
  );
}

export default Style;
