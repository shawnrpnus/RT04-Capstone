import React, { useEffect, useRef, useState } from "react";
import GridContainer from "components/Layout/components/Grid/GridContainer";
import CustomTextField from "components/UI/CustomInput/CustomTextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import { clearErrors } from "redux/actions";
import { useDispatch, useSelector } from "react-redux";
import signupPageStyle from "assets/jss/material-kit-pro-react/views/signupPageStyle";
import { makeStyles } from "@material-ui/core/styles";
import Button from "components/UI/CustomButtons/Button";
import UpdateMeasurementsRequest from "models/customer/UpdateMeasurementsRequest";
import { useSnackbar } from "notistack";
import GridItem from "components/Layout/components/Grid/GridItem";
import {addMeasurements, updateMeasurements, deleteMeasurements} from "redux/actions/customerActions";
import { Accessibility } from "@material-ui/icons";
const useStyles = makeStyles(signupPageStyle);
const _ = require("lodash");

function Measurements(props) {
  //Hooks
  const classes = useStyles();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  //Redux
  const dispatch = useDispatch();
  const errors = useSelector(state => state.errors);
  const customer = useSelector(state => state.customer.loggedInCustomer);

  //State
  const [inputState, setInputState] = useState({
    shoulder: "",
    waist: "",
    chest: "",
    hip: "",
    height: ""
  });
  
  const [hasAddMeasurements, setAddedMeasurements] = useState(true);

  //check if customer has added measurements
  useEffect(() => {
      if (customer.measurements == null) {
          console.log(customer);
          setAddedMeasurements(false);  
      } else {
          //set input state
          setInputState(inputState => 
            ({ ...inputState, 
                shoulder: customer.measurements.shoulder,
                waist: customer.measurements.waist,
                chest: customer.measurements.chest,
                hip: customer.measurements.hip,
                height: customer.measurements.height 
            }));
      }
  },[customer]);

  const handleAddMeasurements = () => {
    const measurements = new UpdateMeasurementsRequest(
        inputState.shoulder,
        inputState.waist,
        inputState.chest,
        inputState.hip,
        inputState.height
    );
    const customerId = customer.customerId;
    const req = {customerId, measurements};
    dispatch(addMeasurements(req, enqueueSnackbar, setAddedMeasurements));
  }

  const handleUpdateMeasurements = () => {
    if (inputState.shoulder == customer.measurements.shoulder && inputState.waist == customer.measurements.waist && inputState.chest == customer.measurements.chest && inputState.hip == customer.measurements.hip && inputState.height == customer.measurements.height) {
        enqueueSnackbar("No changes in measurements", {
            variant: "error",
            autoHideDuration: 1200
          });
    } else {
        const measurements = new UpdateMeasurementsRequest(
            inputState.shoulder,
            inputState.waist,
            inputState.chest,
            inputState.hip,
            inputState.height
        );
        const customerId = customer.customerId;
        const req = {customerId, measurements};
        dispatch(updateMeasurements(req, enqueueSnackbar, setAddedMeasurements));
    }
  }

  const handleDeleteMeasurements = () => {
    const customerId = customer.customerId;
    dispatch(deleteMeasurements(customerId, enqueueSnackbar));
    setInputState(inputState => 
        ({ ...inputState, 
            shoulder: "",
            waist: "",
            chest: "",
            hip: "",
            height: "" 
        }));
  }

  //Misc
  const onChange = e => {
    e.persist();
    setInputState(inputState => ({
      ...inputState,
      [e.target.name]: e.target.value
    }));
    if (Object.keys(errors).length !== 0) {
      dispatch(clearErrors());
    }
  };



  const resetInputState = () => {
    setInputState(prevInputState => ({
      ...prevInputState
    }));
  };
  return (
    <React.Fragment>
        <GridContainer>
          <GridItem xs={12} sm={12} md={4}>
            <form className={classes.form}>
              <CustomTextField
                fieldLabel="Shoulder (cm)" 
                fieldName="shoulder"
                inputState={inputState}
                onChange={onChange}
                errors={errors}
                InputProps={{
                    startAdornment: (
                      <InputAdornment
                        position="start"
                        className={classes.inputAdornment}
                      >
                        <Accessibility className={classes.inputAdornmentIcon} />
                      </InputAdornment>
                    )
                  }}
              />
              <CustomTextField
                fieldLabel="Waist (cm)" 
                fieldName="waist"
                inputState={inputState}
                onChange={onChange}
                errors={errors}
                InputProps={{
                    startAdornment: (
                      <InputAdornment
                        position="start"
                        className={classes.inputAdornment}
                      >
                        <Accessibility className={classes.inputAdornmentIcon} />
                      </InputAdornment>
                    )
                  }}
              />
              <CustomTextField
                fieldLabel="Chest (cm)" 
                fieldName="chest"
                inputState={inputState}
                onChange={onChange}
                errors={errors}
                InputProps={{
                    startAdornment: (
                      <InputAdornment
                        position="start"
                        className={classes.inputAdornment}
                      >
                        <Accessibility className={classes.inputAdornmentIcon} />
                      </InputAdornment>
                    )
                  }}
              />
              <CustomTextField
                fieldLabel="Hip (cm)"  
                fieldName="hip"
                inputState={inputState}
                onChange={onChange}
                errors={errors}
                InputProps={{
                    startAdornment: (
                      <InputAdornment
                        position="start"
                        className={classes.inputAdornment}
                      >
                        <Accessibility className={classes.inputAdornmentIcon} />
                      </InputAdornment>
                    )
                  }}
              />
              <CustomTextField
                fieldLabel="Height (cm)" 
                fieldName="height"
                inputState={inputState}
                onChange={onChange}
                errors={errors}
                InputProps={{
                    startAdornment: (
                      <InputAdornment
                        position="start"
                        className={classes.inputAdornment}
                      >
                        <Accessibility className={classes.inputAdornmentIcon} />
                      </InputAdornment>
                    )
                  }}
              />
              <div className={classes.textCenter}>
                {hasAddMeasurements ? (
                  <React.Fragment>
                    <Button
                    onClick={handleUpdateMeasurements}
                    round
                    color="primary">
                    Update Measurements
                    </Button>

                    <Button
                    onClick={handleDeleteMeasurements}
                    round
                    color="primary"
                    >
                    Reset Measurements
                    </Button>    
                </React.Fragment>
                ) : (
                    <React.Fragment>
                      <Button
                        onClick={handleAddMeasurements}
                        round
                        color="primary"
                      >
                        Add Measurements
                      </Button>
                  </React.Fragment>    
                )}
              </div>
            </form>
          </GridItem>
        </GridContainer>
    </React.Fragment>
  );
}

  export default Measurements;