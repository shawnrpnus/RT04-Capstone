import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useConfirm } from "material-ui-confirm";
import { makeStyles } from "@material-ui/core/styles";

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
} from "@material-ui/icons";
import { AiOutlineSelect } from "react-icons/ai";
import MaterialTable from "material-table";
import Button from "@material-ui/core/Button";
import Chip from "@material-ui/core/Chip";
// Redux
import {
  retrieveAllAdvertisement,
  activateAdvertisement,
  disableAdvertisement,
  deleteAdvertisement,
} from "../../../redux/actions/advertisementActions";
import withPage from "../../Layout/page/withPage";
import AdvertisementUploadDialog from "./AdvertisementUploadDialog";

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

const AdvertisementTable = (props) => {
  const dispatch = useDispatch();
  const advertisements = useSelector(
    (state) => state.advertisement.advertisements
  );
  const confirmDialog = useConfirm();
  const classes = useStyle();

  const [open, setOpen] = useState(false);

  useEffect(() => {
    dispatch(retrieveAllAdvertisement());
  }, [_.isEqual(advertisements)]);

  const toggleOpenDialog = () => {
    setOpen(!open);
  };

  let data = [];
  if (advertisements.length > 0) {
    data = advertisements.map((e) => {
      const { advertisementId, advertisementImgUrl, creator, active } = e;
      const staffName = `${creator.firstName} ${creator.lastName}`;
      return {
        advertisementId,
        advertisementImgUrl,
        staffName,
        active: active ? "ACTIVE" : "DISABLED",
      };
    });
  }

  return (
    <div
      className="table"
      style={{ verticalAlign: "middle", textAlign: "right" }}
    >
      <Button
        variant="contained"
        color="primary"
        onClick={toggleOpenDialog}
        style={{ marginRight: "2%" }}
      >
        CREATE ADVERTISEMENT
      </Button>
      <MaterialTable
        title="Advertisement"
        style={{ boxShadow: "none" }}
        icons={tableIcons}
        columns={[
          { title: "Advertisement ID", field: "advertisementId" },
          {
            title: "Preview image",
            field: "advertisementImgUrl",
            filtering: false,
            render: (rowData) => (
              <img
                className={classes.image}
                src={rowData.advertisementImgUrl}
              />
            ),
          },
          { title: "Staff name", field: "staffName" },
          {
            title: "Active status",
            field: "active",
            render: (rowData) => {
              let style;
              const { active } = rowData;
              if (active === "ACTIVE") style = { backgroundColor: "#33ba0a" };
              else style = { backgroundColor: "#e1282d" };
              return (
                <Chip style={{ ...style, color: "white" }} label={active} />
              );
            },
          },
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
          draggable: false,
        }}
        actions={[
          (rowData) =>
            rowData.active === "ACTIVE"
              ? {
                  icon: Block,
                  tooltip: "Disable",
                  onClick: (e, { advertisementId }) => {
                    dispatch(disableAdvertisement(advertisementId));
                  },
                }
              : {
                  icon: AiOutlineSelect,
                  tooltip: "Activate",
                  onClick: (e, { advertisementId }) => {
                    dispatch(activateAdvertisement(advertisementId));
                  },
                },
          {
            icon: Delete,
            tooltip: "Delete",
            onClick: (e, { advertisementId }) => {
              confirmDialog({
                description: "The selected advertisement will be deleted",
              })
                .then(() => {
                  dispatch(deleteAdvertisement(advertisementId));
                })
                .catch(() => null);
            },
          },
        ]}
      />
      {open && (
        <AdvertisementUploadDialog
          open={open}
          onClose={toggleOpenDialog}
          staffId={_.get(props, "staff.staffId", "")}
        />
      )}
    </div>
  );
};

const styles = {
  image: {
    "&:hover": {
      transform: "scale(2.0)",
      zIndex: 100000,
    },
  },
};
const useStyle = makeStyles(styles);

export default withPage(AdvertisementTable);
