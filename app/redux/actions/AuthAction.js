function getActionLogin(userSession) {
  return {
    type: 'auth/login',
    payload: {
      userSession: userSession
    },
  }

};

export default {
  getActionLogin
}
