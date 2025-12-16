import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';

export const useApi = (apiCall, dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();

  const execute = async (...args) => {
    console.log('🔄 API Hook executing:', apiCall.name);
    setLoading(true);
    setError(null);
    
    try {
      const result = await apiCall(...args);
      console.log('✅ API Hook success:', apiCall.name);
      setData(result);
      return result;
    } catch (err) {
      console.error('❌ API Hook error:', apiCall.name, err.message);
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (dependencies.length > 0) {
      execute();
    }
  }, dependencies);

  return { data, loading, error, execute };
};