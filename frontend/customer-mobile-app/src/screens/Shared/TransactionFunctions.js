export const renderStatus = transaction => {
  if (transaction.deliveryStatus === "DELIVERED") {
    if (transaction.collectionMode === "DELIVERY") {
      return ["Delivered", "green"];
    } else if (transaction.collectionMode === "IN_STORE") {
      return ["Collected", "green"];
    }
  } else if (transaction.deliveryStatus === "READY_FOR_COLLECTION") {
    return ["Ready for collection", "#3D9970"];
  } else {
    if (transaction.collectionMode === "DELIVERY") {
      return ["Pending delivery", "darkorange"];
    } else if (transaction.collectionMode === "IN_STORE") {
      return ["Pending collection", "darkorange"];
    }
  }
};
