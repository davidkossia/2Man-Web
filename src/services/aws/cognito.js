import { Auth } from 'aws-amplify';

export const cognitoService = {
  signUp: async ({ email, password, phone, name }) => {
    const { user } = await Auth.signUp({
      username: email,
      password,
      attributes: {
        email,
        phone_number: phone,
        name,
      },
    });
    return user;
  },

  confirmSignUp: async (email, code) => {
    await Auth.confirmSignUp(email, code);
  },

  signIn: async (email, password) => {
    const user = await Auth.signIn(email, password);
    return user;
  },

  signOut: async () => {
    await Auth.signOut();
  },

  forgotPassword: async (email) => {
    await Auth.forgotPassword(email);
  },

  forgotPasswordSubmit: async (email, code, newPassword) => {
    await Auth.forgotPasswordSubmit(email, code, newPassword);
  },

  changePassword: async (oldPassword, newPassword) => {
    const user = await Auth.currentAuthenticatedUser();
    await Auth.changePassword(user, oldPassword, newPassword);
  },

  updateAttributes: async (attributes) => {
    const user = await Auth.currentAuthenticatedUser();
    await Auth.updateUserAttributes(user, attributes);
  },

  verifyAttribute: async (attribute, code) => {
    const user = await Auth.currentAuthenticatedUser();
    await Auth.verifyUserAttributeSubmit(user, attribute, code);
  },

  resendVerificationCode: async (attribute) => {
    const user = await Auth.currentAuthenticatedUser();
    await Auth.verifyUserAttribute(user, attribute);
  },

  getCurrentUser: async () => {
    try {
      const user = await Auth.currentAuthenticatedUser();
      return user;
    } catch (error) {
      return null;
    }
  },

  getSession: async () => {
    const session = await Auth.currentSession();
    return {
      idToken: session.getIdToken().getJwtToken(),
      accessToken: session.getAccessToken().getJwtToken(),
      refreshToken: session.getRefreshToken().getToken(),
    };
  },
};