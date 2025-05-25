import { ApiClient } from './Client';
import axiosConfig from "./axiosConfig";

const apiClient = new ApiClient(undefined, axiosConfig);
export default apiClient;