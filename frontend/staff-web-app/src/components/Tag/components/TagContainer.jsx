import React, { Component } from "react";
import TagDetails from "./TagDetails";
import { BounceLoader } from "react-spinners";
import TagForm from "./TagForm";
import {
  createNewTag,
  retrieveAllTags,
  updateTag
} from "../../../redux/actions/tagAction";
import { clearErrors } from "../../../redux/actions";
import connect from "react-redux/es/connect/connect";
import withPage from "../../Layout/page/withPage";
import CreateUpdateTagRequest from "../../../models/CreateUpdateTagRequest";
import * as PropTypes from "prop-types";
import StoreForm from "../../Store/components/StoreForm";
import { css } from "@emotion/core";
import TagTable from "./TagTable";
import { Grid } from "@material-ui/core";

const override = css`
  display: block;
  margin: 0 auto;
`;

class TagContainer extends Component {
  static propTypes = {
    mode: PropTypes.oneOf(["viewAll", "viewOne"]),
    currentTag: PropTypes.object,
    errors: PropTypes.object,
    clearErrors: PropTypes.func.isRequired,
    createNewTag: PropTypes.func,
    updateTag: PropTypes.func
  };

  componentDidMount() {
    const { mode, history } = this.props;
    if (mode === "viewOne") {
      // const storeId = this.props.match.params.storeId;
      // this.props.retrieveTagById(tagId, history);
    }
  }

  // this method makes the api calls
  handleSubmit = (e, formState) => {
    e.preventDefault();
    const { name } = formState;
    console.log(formState);
    const req = new CreateUpdateTagRequest(name);

    switch (this.props.mode) {
      case "viewAll":
        this.props.createNewTag(req, this.props.history);
        this.props.retrieveAllTags();
        formState.name = "";
        break;
      case "viewOne":
        req.tagId = this.props.currentTag.tagId;
        this.props.updateTag(req, this.props.history);
        break;
      default:
    }
  };

  render() {
    const { errors, clearErrors, mode, currentTag } = this.props;
    const header =
      mode === "viewAll"
        ? "Tag Information"
        : mode === "viewOne"
        ? "Tag Information"
        : "";
    return (
      <React.Fragment>
        <div className="card__title">
          <h5 className="bold-text">{header}</h5>
        </div>
        {mode === "viewAll" ? (
          //View All, Create, Update, Delete
          <div>
            <Grid container spacing={3}>
              <Grid item xs={12} md={3}>
                <TagForm
                  handleSubmit={this.handleSubmit}
                  clearErrors={clearErrors}
                  errors={errors}
                  history={this.props.history}
                />
              </Grid>
              <Grid item xs={12} md={9}>
                <TagTable history={this.props.history} />
              </Grid>
            </Grid>
          </div>
        ) : currentTag !== null ? (
          <TagDetails /> //View One Tag Details
        ) : (
          <BounceLoader
            css={override}
            size={100}
            color={"#36D7B7"}
            loading={true}
          />
        )}
      </React.Fragment>
    );
  }
}

//mapping global state to this component
const mapStateToProps = state => ({
  currentTag: state.tag.currentTag,
  errors: state.errors
});

const mapDispatchToProps = {
  createNewTag, //api/storeEntity/createNewStore
  updateTag,
  clearErrors,
  retrieveAllTags
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withPage(TagContainer, "Tag Management"));
