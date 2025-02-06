export interface Team {
  url: MediaStream;
  muted: boolean;
  video: boolean;
  username: string;
  peerId: string;
  pinned: boolean
}

export type TeamId = string;
export type Teams = Record<TeamId, Team>;
