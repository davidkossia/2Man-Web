import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { profileApi } from '../services/api/profiles';
import { duoApi } from '../services/api/duos';

export const useProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [duo, setDuo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      fetchProfile();
      if (user.duoId) {
        fetchDuo();
      }
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const response = await profileApi.getProfile();
      setProfile(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchDuo = async () => {
    try {
      const response = await duoApi.getDuo(user.duoId);
      setDuo(response.data);
    } catch (err) {
      console.error('Failed to fetch duo:', err);
    }
  };

  const updateProfile = async (updates) => {
    try {
      const response = await profileApi.updateProfile(updates);
      setProfile(response.data);
      return response.data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  return {
    profile,
    duo,
    loading,
    error,
    updateProfile,
    refetch: fetchProfile,
  };
};