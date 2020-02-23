import React, {Component, PureComponent} from "react";
import "moment";
import * as PropTypes from "prop-types";
import withPage from "../../Layout/page/withPage";
import { css } from "@emotion/core";
import { ClipLoader } from "react-spinners";
import { connect } from "react-redux";
import StaffForm from "./StaffForm";
import { clearErrors, updateErrors } from "../../../redux/actions";
import {
    createNewStaff
} from "../../../redux/actions/staffActions";
import {ButtonToolbar, Card, CardBody, Col} from "reactstrap";
import MagnifyIcon from "mdi-react/MagnifyIcon";
import {Link} from "react-router-dom";
import EditTable from "../../../shared/components/Table/EditableTable";

export default class ProductsListTable extends PureComponent {

}
