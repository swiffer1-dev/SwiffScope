import axios from 'axios';

export async function httpGet<T = any>(url: string): Promise<T> {
  const res = await axios.get(url);
  return res.data as T;
}
