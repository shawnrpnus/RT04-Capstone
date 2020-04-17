import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useConfirm } from "material-ui-confirm";
import axios from "axios";
import {
  AddBox,
  Check,
  ChevronLeft,
  ChevronRight,
  Clear,
  DeleteOutline,
  Edit,
  FirstPage,
  LastPage,
  Remove,
  SaveAlt,
  Search,
  ViewColumn,
  Instagram,
} from "@material-ui/icons";
import MaterialTable from "material-table";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
// Redux
import {
  getInstagramPostsByHashtag,
  getInstagramPostByShortcode,
  createInstagramPost,
} from "../../../redux/actions/instagramActions";
import {
  openCircularProgress,
  closeCircularProgress,
} from "./../../../redux/actions/utilActions";
import withPage from "../../Layout/page/withPage";
import { toast } from "react-toastify";
import { ButtonGroup } from "@material-ui/core";

const _ = require("lodash");
const tableIcons = {
  Add: AddBox,
  Check: Check,
  Clear: Clear,
  Delete: DeleteOutline,
  DetailPanel: ChevronRight,
  Edit: Edit,
  Export: SaveAlt,
  Filter: Search,
  FirstPage: FirstPage,
  LastPage: LastPage,
  NextPage: ChevronRight,
  PreviousPage: ChevronLeft,
  ResetSearch: Clear,
  Search: Search,
  SortArrow: () => <div />,
  ThirdStateCheck: Remove,
  ViewColumn: ViewColumn,
};

const SelectionTable = (props) => {
  const dispatch = useDispatch();
  const confirmDialog = useConfirm();

  const [edges, setEdges] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [byHashtag, setByHashtag] = useState(true);
  window.scrollTo(0, 0);

  // default search term - apricotandnut
  useEffect(() => {
    const source = axios.CancelToken.source();
    const fetchData = async () => {
      dispatch(openCircularProgress());
      // setEdges(await getInstagramPostsByHashtag("apricotandnut", source));
      dispatch(closeCircularProgress());
    };
    fetchData();
    return () => {
      // clean up in case axios call gets cancelled before finish loading
      source.cancel();
    };
  }, []);

  useEffect(() => {}, [_.isEqual(edges)]);

  const handleCreateInstagramPost = (data) => {
    confirmDialog({ description: "Add Instagram post to database" })
      .then(() =>
        dispatch(
          createInstagramPost(
            _.pick(data, ["caption", "shortCode", "instagramImgUrl"])
          )
        )
      )
      .catch(() => null);
  };

  const handleSearchTag = async () => {
    dispatch(openCircularProgress());
    await getInstagramPostsByHashtag(searchTerm.replace(/[^a-z^A-Z]/g, ""))
      .then((response) => {
        setEdges(response);
        dispatch(closeCircularProgress());
      })
      .catch((err) => {
        console.log(err.response);
        dispatch(closeCircularProgress());
      });
  };

  const handleSearchPost = async () => {
    dispatch(openCircularProgress());
    await getInstagramPostByShortcode(searchTerm)
      .then((response) => {
        setEdges(response);
        dispatch(closeCircularProgress());
      })
      .catch((err) => {
        console.log(err.response);
        dispatch(closeCircularProgress());
      });
  };

  const onChange = (e) => {
    setSearchTerm(e.target.value.trim());
  };

  console.log(edges);

  let data = [];
  if (_.get(edges, "length", -1) > 0 && byHashtag) {
    data = edges.map(({ node }) => {
      const caption = _.get(
        node,
        "edge_media_to_caption.edges[0].node.text",
        ""
      );
      const shortCode = _.get(node, "shortcode", "");
      const instagramImgUrl = _.get(node, "thumbnail_resources[4].src", "");
      return {
        caption,
        shortCode,
        instagramImgUrl,
      };
    });
  } else if (edges && !byHashtag) {
    const caption = _.get(
      edges,
      "edge_media_to_caption.edges[0].node.text",
      ""
    );
    const shortCode = _.get(edges, "shortcode", "");
    const instagramImgUrl = _.get(edges, "display_resources[0].src", "");
    data = edges ? [{ caption, shortCode, instagramImgUrl }] : [];
  }

  return (
    <div
      className="table"
      style={{ verticalAlign: "middle", textAlign: "right" }}
    >
      <ButtonGroup>
        <Button
          variant={byHashtag ? "contained" : "outlined"}
          color="primary"
          onClick={() => setByHashtag(true)}
        >
          Search by hashtag
        </Button>
        <Button
          variant={byHashtag ? "outlined" : "contained"}
          color="primary"
          onClick={() => setByHashtag(false)}
        >
          Search by post
        </Button>
      </ButtonGroup>
      <TextField
        label="Search"
        name="searchTerm"
        value={searchTerm}
        fullWidth
        margin="normal"
        InputLabelProps={{
          shrink: true,
        }}
        variant="outlined"
        onChange={onChange}
        autoFocus={true}
        placeholder={
          byHashtag
            ? "Enter hashtag without '#'. Any symbols will be ignored"
            : "Enter shortcode"
        }
      />
      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={byHashtag ? handleSearchTag : handleSearchPost}
      >
        {byHashtag ? "Search by hashtag" : "Search by post"}
      </Button>
      <MaterialTable
        title=""
        style={{ boxShadow: "none" }}
        icons={tableIcons}
        onChangePage={() => {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        columns={[
          { title: "Shortcode", field: "shortCode" },
          {
            title: "Image",
            field: "instagramImgUrl",
            sorting: false,
            render: ({ instagramImgUrl, shortCode }) => (
              <a href={`http://instagram.com/p/${shortCode}`} target="_blank">
                <img src={instagramImgUrl} />
              </a>
            ),
            cellStyle: {
              width: 200,
              maxWidth: 200,
            },
            headerStyle: {
              width: 200,
              maxWidth: 200,
            },
          },
          {
            title: "Caption",
            field: "caption",
            render: ({ caption }) =>
              _.get(caption, "length", -1) > 1000
                ? `${caption.slice(0, 1000)}...`
                : caption,
            cellStyle: {
              width: 200,
              maxWidth: 200,
            },
            headerStyle: {
              width: 200,
              maxWidth: 200,
            },
          },
        ]}
        data={data}
        options={{
          filtering: false,
          sorting: true,
          pageSize: 10,
          pageSizeOptions: [10, 20, 40],
          actionsColumnIndex: -1,
          headerStyle: { textAlign: "center" }, //change header padding
          cellStyle: { textAlign: "center" },
          draggable: false,
        }}
        actions={[
          {
            icon: Instagram,
            tooltip: "Add to Instagram list",
            onClick: (e, rowData) => {
              handleCreateInstagramPost(rowData);
            },
          },
        ]}
      />
    </div>
  );
};

export default withPage(SelectionTable, "Instagram Post");
