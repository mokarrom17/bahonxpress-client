import axios from "axios";

const axiosInstance = axios.create({
  baseURL: `https://bahonxpress-server.vercel.app`,
});
const useAxios = () => {
  return axiosInstance;
};

export default useAxios;
