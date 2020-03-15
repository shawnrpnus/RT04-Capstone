import { OPEN_CIRCULAR_PROGRESS, CLOSE_CIRCULAR_PROGRESS } from "./types";

export const openCircularProgress = () => ({
  type: OPEN_CIRCULAR_PROGRESS
});

export const closeCircularProgress = () => ({
  type: CLOSE_CIRCULAR_PROGRESS
});
