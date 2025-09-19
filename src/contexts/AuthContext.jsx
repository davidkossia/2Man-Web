import React, { createContext, useContext, useState, useEffect } from 'react';
import { Auth, Hub } from 'aws-amplify';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuthState();
    
    const listener = Hub.listen('auth', ({ payload: { event, data } }) => {
      switch (event) {
        case 'signIn':
          checkAuthState();
          break;
        case 'signOut':
          setUser(null);
          setIsAuthenticated(false);
          break;
        case 'signIn_failure':
          console.error('Sign in failure', data);
          break;
      }
    });

    return () => Hub.remove('auth', listener);
  }, []);

  const checkAuthState = async () => {
    try {
      const currentUser = await Auth.currentAuthenticatedUser();
      const attributes = await Auth.userAttributes(currentUser);
      const formattedUser = {
        id: currentUser.attributes.sub,
        email: currentUser.attributes.email,
        phone: currentUser.attributes.phone_number,
        name: currentUser.attributes.name,
        onboardingComplete: currentUser.attributes['custom:onboarding_complete'] === 'true',
        duoId: currentUser.attributes['custom:duo_id'],
      };
      setUser(formattedUser);
      setIsAuthenticated(true);
    } catch (error) {
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email, password) => {
    const user = await Auth.signIn(email, password);
    await checkAuthState();
    return user;
  };

  const signUp = async (email, password, attributes = {}) => {
    const { user } = await Auth.signUp({
      username: email,
      password,
      attributes: {
        email,
        ...attributes,
      },
    });
    return user;
  };

  const signOut = async () => {
    await Auth.signOut();
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    signIn,
    signUp,
    signOut,
    checkAuthState,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
