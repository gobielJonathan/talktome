import {
  CONFIG_AUDIO_ENABLED,
  CONFIG_NAME,
  CONFIG_VIDEO_ENABLED,
} from "./storage";

export const DEFAULT_AUDIO_ENABLED = false;
export const DEFAULT_VIDEO_ENABLED = true;
export const DEFAULT_NAME = "Jhon Doe";

export const getMutedValue = () =>
  localStorage.getItem(CONFIG_AUDIO_ENABLED)
    ? localStorage.getItem(CONFIG_AUDIO_ENABLED) === "true"
    : DEFAULT_AUDIO_ENABLED;

export const getVideoValue = () =>
  localStorage.getItem(CONFIG_VIDEO_ENABLED)
    ? localStorage.getItem(CONFIG_VIDEO_ENABLED) === "true"
    : DEFAULT_AUDIO_ENABLED;

export const getUsername = () =>
  localStorage.getItem(CONFIG_NAME)
    ? localStorage.getItem(CONFIG_NAME) || DEFAULT_NAME
    : DEFAULT_NAME;
