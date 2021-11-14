function getActionLogin(userSession, userData) {
  return {
    type: 'auth/login',
    payload: {
      userSession: userSession,
      userData: userData,
    },
  }
};

function getActionLogout() {
  return {
    type: 'auth/logout',
  }
};

export default {
  getActionLogin,
  getActionLogout
}
