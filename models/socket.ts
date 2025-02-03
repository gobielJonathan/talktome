export const JOIN_ROOM_EVENT = "join-room";
export const USER_TOGGLE_VIDEO_EVENT = 'user-toggle-video'
export const USER_TOGGLE_AUDIO_EVENT = 'user-toggle-audio'
export const USER_LEAVE_EVENT = 'user-leave'
export const USER_CONNECTED_EVENT = 'user-connected'

export interface ListenerServerEvent { 
    [JOIN_ROOM_EVENT] : (roomId: string, userId: string) => void;
    [USER_CONNECTED_EVENT]: (userId: string) => void;
    [USER_TOGGLE_VIDEO_EVENT]: (userId: string, roomId: string) => void;
    [USER_TOGGLE_AUDIO_EVENT]: (userId: string, roomId: string) => void;
    [USER_LEAVE_EVENT]: (userId: string, roomId: string) => void;
}

export interface EmitterServerEvent { 
    [USER_CONNECTED_EVENT]: (userId: string) => void;
    [USER_TOGGLE_VIDEO_EVENT]: (userId: string) => void;
    [USER_TOGGLE_AUDIO_EVENT]: (userId: string) => void;
    [USER_LEAVE_EVENT]: (userId: string) => void;
    [JOIN_ROOM_EVENT] : (roomId: string, userId: string) => void;
}


export interface ListenerClientEvent { 
    [USER_TOGGLE_AUDIO_EVENT]: (userId: string) => void;
    [USER_LEAVE_EVENT]: (userId: string) => void;
    [USER_TOGGLE_VIDEO_EVENT]: (userId: string) => void;
    [USER_CONNECTED_EVENT]: (userId: string) => void;

}

export interface EmitterClientEvent { 
    [USER_TOGGLE_AUDIO_EVENT]: (userId: string, roomId: string) => void;
    [USER_TOGGLE_VIDEO_EVENT]: (userId: string, roomId: string) => void;
    [USER_LEAVE_EVENT]: (userId: string, roomId: string) => void;
    [JOIN_ROOM_EVENT] : (roomId: string, userId: string) => void;
    
}