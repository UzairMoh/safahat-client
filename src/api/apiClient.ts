import { ApiClient } from './Client';
import axiosConfig from "./axiosConfig";

const apiClient = new ApiClient(
    "https://localhost:7118",
    axiosConfig
);

export default apiClient;