// Full List (Hash) of Feedback states and their icons with metadata
//

export interface FeedbackIconState {
	icon: string;
	position: 'before' | 'after' | null;
	allowHide: boolean;
	message: string | null;
}

const feedbackIcons: Record<string, FeedbackIconState> = {
	play          : {icon: 'play',               position: 'after',   allowHide: true,   message: null},
	pause         : {icon: 'pause',              position: 'before',   allowHide: false,  message: null},
	rewind        : {icon: 'backward',           position: 'before',  allowHide: false,  message: 'x'},
	slowRewind    : {icon: 'pausebackward',      position: 'before',  allowHide: false,   message: 'x'},
	fastForward   : {icon: 'forward',            position: 'after',   allowHide: false,  message: 'x'},
	slowForward   : {icon: 'pauseforward',       position: 'after',   allowHide: false,   message: 'x'},
	jumpBackward  : {icon: 'pausejumpbackward',  position: 'before',  allowHide: false,  message: ' '},
	jumpForward   : {icon: 'pausejumpforward',   position: 'after',   allowHide: false,  message: ' '},
	jumpToStart   : {icon: 'jumpbackward',       position: 'before',  allowHide: true,   message: null},
	jumpToEnd     : {icon: 'jumpforward',        position: 'after',   allowHide: true,   message: null},
	stop          : {icon: 'stop',               position: null,      allowHide: true,   message: null}
};

export default feedbackIcons;
