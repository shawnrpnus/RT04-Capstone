import {
  createNewStore,
  retrieveStoreById,
  updateStore,
  retrieveAllStores
} from "./storeActions";
import { CLEAR_ERRORS } from "./types";

export const clearErrors = () => ({
  type: CLEAR_ERRORS
});

export { createNewStore, retrieveStoreById, updateStore, retrieveAllStores };
