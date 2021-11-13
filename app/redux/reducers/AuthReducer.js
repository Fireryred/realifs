const initialState = {
  userSession: null,
};

export default (state = initialState, action) => {
  switch (action.type) {


    case 'auth/login':
      return Object.assign({}, state, {
        userSession: action.payload.userSession,
      });
  

    case 'auth/logout':
      return Object.assign({}, state, {
        userSession: action.payload.userSession,
      });


    default:
      return state;
  }
};
