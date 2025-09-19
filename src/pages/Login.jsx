import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { matchingApi } from '../services/api/matching';
import { setCandidates, removeCandidate, addMatch } from '../store/slices/matchingSlice';

export const useMatchmaking = () => {
  const dispatch = useDispatch();
  const { candidates, matches } = useSelector((state) => state.matching);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    setLoading(true);
    try {
      const response = await matchingApi.getCandidates();
      dispatch(setCandidates(response.data));
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Failed to fetch candidates:', err);
    } finally {
      setLoading(false);
    }
  };

  const swipeCandidate = async (duoId, action) => {
    try {
      const response = await matchingApi.swipe(duoId, action);
      dispatch(removeCandidate(duoId));
      
      if (response.data.match) {
        dispatch(addMatch(response.data.matchDetails));
        return { matched: true, matchDetails: response.data.matchDetails };
      }
      
      return { matched: false };
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const refreshCandidates = () => {
    fetchCandidates();
  };

  return {
    candidates,
    matches,
    loading,
    error,
    swipeCandidate,
    refreshCandidates,
  };
};s