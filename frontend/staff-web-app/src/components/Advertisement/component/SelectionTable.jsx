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
  Instagram
} from "@material-ui/icons";
import MaterialTable from "material-table";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
// Redux
import {
  getInstagramInfo,
  createInstagramPost
} from "../../../redux/actions/instagramActions";
import {
  openCircularProgress,
  closeCircularProgress
} from "./../../../redux/actions/utilActions";
import withPage from "../../Layout/page/withPage";

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
  ViewColumn: ViewColumn
};

const SelectionTable = props => {
  const dispatch = useDispatch();
  const confirmDialog = useConfirm();

  const [edges, setEdges] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  window.scrollTo(0, 0);

  // default search term - apricotandnut
  useEffect(() => {
    const source = axios.CancelToken.source();
    const fetchData = async () => {
      dispatch(openCircularProgress());
      setEdges(await getInstagramInfo("apricotandnut", source));
      dispatch(closeCircularProgress());
    };
    fetchData();
    return () => {
      // clean up in case axios call gets cancelled before finish loading
      source.cancel();
    };
  }, []);

  useEffect(() => {}, [_.isEqual(edges)]);

  const handleCreateInstagramPost = data => {
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
    setEdges(await getInstagramInfo(searchTerm));
    dispatch(closeCircularProgress());
  };

  const onChange = e => {
    setSearchTerm(e.target.value);
  };

  let data = [];
  if (_.get(edges, "length", -1) > 0) {
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
        instagramImgUrl
      };
    });
  }

  return (
    <div
      className="table"
      style={{ verticalAlign: "middle", textAlign: "right" }}
    >
      <TextField
        label="Search"
        name="searchTerm"
        value={searchTerm}
        fullWidth
        margin="normal"
        InputLabelProps={{
          shrink: true
        }}
        variant="outlined"
        onChange={onChange}
      />
      <Button
        variant="contained"
        color="primary"
        autoFocus={true}
        onClick={handleSearchTag}
      >
        Search
      </Button>
      <MaterialTable
        title="Instagram post"
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
            render: ({ instagramImgUrl, shortCode }) => (
              <a href={`http://instagram.com/p/${shortCode}`} target="_blank">
                <img src={instagramImgUrl} />
              </a>
            ),
            cellStyle: {
              width: 200,
              maxWidth: 200
            },
            headerStyle: {
              width: 200,
              maxWidth: 200
            }
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
              maxWidth: 200
            },
            headerStyle: {
              width: 200,
              maxWidth: 200
            }
          }
        ]}
        data={data}
        options={{
          filtering: true,
          sorting: true,
          pageSize: 10,
          pageSizeOptions: [10, 20, 40],
          actionsColumnIndex: -1,
          headerStyle: { textAlign: "center" }, //change header padding
          cellStyle: { textAlign: "center" },
          draggable: false
        }}
        actions={[
          {
            icon: Instagram,
            tooltip: "Add to Instagram list",
            onClick: (e, rowData) => {
              handleCreateInstagramPost(rowData);
            }
          }
        ]}
      />
    </div>
  );
};

export default withPage(SelectionTable);
