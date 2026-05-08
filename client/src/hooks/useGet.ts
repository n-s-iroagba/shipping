"use client";

import { getRequest } from "@/utils/apiUtils";
import { useState, useEffect } from "react";

export function useGetList<T>(endpoint: string, options?: any) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!endpoint) return;
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getRequest<T[]>(endpoint, undefined, options);

        setData(response);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [endpoint, JSON.stringify(options)]);

  return { data, loading, error };
}

export function useGetSingle<T>(endpoint: string, options?: any) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!endpoint) return;
    const fetchData = async () => {
      setLoading(true);
      setError(null); // reset error state
      try {
        const response = await getRequest<T>(endpoint, undefined, options);
        setData(response);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [endpoint, JSON.stringify(options)]);

  return { data, loading, error };
}
