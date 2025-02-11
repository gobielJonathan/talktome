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

export const setMutedValue = (value: boolean) =>
  localStorage.setItem(CONFIG_AUDIO_ENABLED, value.toString());

export const setVideoValue = (value: boolean) =>
  localStorage.setItem(CONFIG_VIDEO_ENABLED, value.toString());

export const setUsername = (value: boolean) =>
  localStorage.setItem(CONFIG_NAME, value.toString());


export const MAX_TEAMS_HIGHLIGHTED_PER_PAGE = 6;

export const MAX_TEAMS_GRID_PER_PAGE = 9;

export const MAX_TEAMS_HIGHLIGHT = 4