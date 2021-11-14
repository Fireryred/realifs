const initialState = {
  userSession: null,
  userData: null
};

export default (state = initialState, action) => {
  switch (action.type) {


    case 'auth/login':
      return Object.assign({}, state, {
        userSession: action.payload.userSession,
        userData: action.payload.userData
      });
  

    case 'auth/logout':
      return Object.assign({}, state, {
        userSession: null,
        userData: null
      });


    default:
      return state;
  }
};
