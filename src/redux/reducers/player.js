const INITIAL_STATE = {
  name: '',
  assertions: 0,
  score: 0,
  gravatarEmail: '',
};

const player = (state = INITIAL_STATE, action) => {
  switch (action.type) {
  case 'PLAYER':
    return {
      ...state,
      name: action.payload.name,
      gravatarEmail: action.payload.email,
    };
  case 'PONTUATION':
    return {
      ...state,
      score: action.payload.score,
      assertions: action.payload.assertions,
    };
  default:
    return state;
  }
};

export default player;
