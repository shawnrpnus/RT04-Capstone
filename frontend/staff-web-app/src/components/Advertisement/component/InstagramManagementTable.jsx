import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useConfirm } from "material-ui-confirm";
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
  Delete,
  Block,
  Visibility
} from "@material-ui/icons";
import { AiOutlineSelect } from "react-icons/ai";
import MaterialTable from "material-table";
import Chip from "@material-ui/core/Chip";
// Redux
import {
  retrieveAllInstagramPost,
  activateInstagramPost,
  disableInstagramPost,
  deleteInstagramPost
} from "../../../redux/actions/instagramActions";
import withPage from "../../Layout/page/withPage";
import ProductTableDialog from "./ProductTableDialog";
import ViewAssociatedProductDialog from "./ViewAssociatedProductDialog";

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

const InstagramManagementTable = props => {
  const dispatch = useDispatch();
  const instagramPosts = useSelector(state => state.instagram.instagramPosts);
  const confirmDialog = useConfirm();

  const [openAdd, setOpenAdd] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [postId, setPostId] = useState("");
  const [associatedProducts, setAssociatedProducts] = useState([]);

  useEffect(() => {
    dispatch(retrieveAllInstagramPost());
  }, [_.isEqual(instagramPosts)]);

  console.log(instagramPosts);

  const toggleAddDialog = () => {
    setOpenAdd(!openAdd);
  };

  const toggleViewDialog = () => {
    setOpenView(!openView);
  };

  let data = [];
  if (instagramPosts.length > 0) {
    data = instagramPosts.map(
      ({
        instagramPostId,
        instagramImgUrl,
        active,
        caption,
        shortCode,
        associatedProducts
      }) => {
        return {
          instagramPostId,
          instagramImgUrl,
          active: active ? "ACTIVE" : "DISABLED",
          caption,
          shortCode,
          associatedProducts
        };
      }
    );
  }

  const handleDeleteInstagramPost = instagramPostId => {
    confirmDialog({ description: "Deleting Instagram post..." })
      .then(() => dispatch(deleteInstagramPost(instagramPostId)))
      .catch(() => null);
  };

  return (
    <div
      className="table"
      style={{ verticalAlign: "middle", textAlign: "right" }}
    >
      <MaterialTable
        title="Instagram Post Management"
        style={{ boxShadow: "none" }}
        icons={tableIcons}
        onChangePage={() => {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        columns={[
          {
            title: "Instagram post ID",
            field: "instagramPostId"
          },
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
              width: 150,
              maxWidth: 150
            },
            headerStyle: {
              width: 150,
              maxWidth: 150
            }
          },
          {
            title: "Caption",
            field: "caption",
            render: ({ caption }) =>
              _.get(caption, "length", -1) > 100
                ? `${caption.slice(0, 100)}...`
                : caption
          },
          {
            title: "Status",
            field: "active",
            render: rowData => {
              let style;
              const { active } = rowData;
              if (active === "ACTIVE") style = { backgroundColor: "#33ba0a" };
              else style = { backgroundColor: "#e1282d" };
              return (
                <Chip style={{ ...style, color: "white" }} label={active} />
              );
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
          rowData =>
            rowData.active === "ACTIVE"
              ? {
                  icon: Block,
                  tooltip: "Disable",
                  onClick: (e, { instagramPostId }) => {
                    dispatch(disableInstagramPost(instagramPostId));
                  }
                }
              : {
                  icon: AiOutlineSelect,
                  tooltip: "Activate",
                  onClick: (e, { instagramPostId }) => {
                    dispatch(activateInstagramPost(instagramPostId));
                  }
                },
          ,
          {
            icon: Visibility,
            tooltip: "View associated products",
            onClick: (e, { associatedProducts, instagramPostId }) => {
              setAssociatedProducts(associatedProducts);
              setPostId(instagramPostId);
              toggleViewDialog();
            }
          },
          {
            icon: AddBox,
            tooltip: "Associate products to Instagram post",
            onClick: (e, { instagramPostId }) => {
              setPostId(instagramPostId);
              toggleAddDialog();
            }
          },
          {
            icon: Delete,
            tooltip: "Delete Instagram post",
            onClick: (e, { instagramPostId }) => {
              handleDeleteInstagramPost(instagramPostId);
            }
          }
        ]}
      />
      {openAdd && (
        <ProductTableDialog
          open={openAdd}
          onClose={toggleAddDialog}
          staffId={_.get(props, "staff.staffId", "")}
          postId={postId}
          renderLoader={props.renderLoader}
        />
      )}
      {openView && (
        <ViewAssociatedProductDialog
          open={openView}
          onClose={toggleViewDialog}
          staffId={_.get(props, "staff.staffId", "")}
          postId={postId}
          associatedProducts={associatedProducts}
        />
      )}
    </div>
  );
};

export default withPage(InstagramManagementTable);
