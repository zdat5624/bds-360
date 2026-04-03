import Axios, { AxiosRequestConfig } from 'axios';

export const AXIOS_INSTANCE = Axios.create({ baseURL: 'http://localhost:8080' });

export const customFetch = async <T>(config: AxiosRequestConfig): Promise<T> => {
    const response = await AXIOS_INSTANCE(config);
    const backendData = response.data;
    if (backendData.code !== 10000) throw backendData;
    return backendData.data;
};