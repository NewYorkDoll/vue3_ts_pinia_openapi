import axios, {
  AxiosError,
  AxiosRequestConfig,
  AxiosResponse,
  Canceler,
} from "axios";
import {
  Extract200JSON,
  ExtractParamQuery,
  ExtractRequestBodyJSON,
  PathKeyOfMethod,
} from "./openapi";


/**
 * 取消请求
 */
const { CancelToken } = axios;
const cancels: Canceler[] = [];
const cancelAllRequest = (message?: string) => {
  cancels.forEach((cancel) => cancel(message));
};

// eslint-disable-next-line no-unused-vars
const requests: Array<(token: string) => void> = [];
/**
 * 超时判断
 */
const isTimeoutError = (error: AxiosError) =>
  error.code === "ECONNABORTED" && error.message.includes("timeout");

/**
 * 设置全局参数
 */
axios.defaults.timeout = 300000;
axios.defaults.baseURL = "env.server";
axios.defaults.withCredentials = true;


/**
 * 创建实例
 */
const http = axios.create({
  baseURL: "/baseurl",
});

const cancelRequestConfig: AxiosRequestConfig = {
  cancelToken: new CancelToken((cancel) => {
    cancels.push(cancel);
  }),
};

/**
 * Get
 */
const getRequestConfig: AxiosRequestConfig = {
  ...cancelRequestConfig,
};

const get = <R extends PathKeyOfMethod<"get">>(
  url: R,
  data?: ExtractParamQuery<"get", R>,
  config: AxiosRequestConfig = getRequestConfig
): Promise<AxiosResponse<Extract200JSON<"get", R>>> => {
  config.params = data;
  return http.get(url, config);
};
const getData = <R = any, P = any>(
  url: string,
  data?: P,
  config: AxiosRequestConfig = getRequestConfig
): Promise<R> => {
  config.params = data;
  return http.get(url, config);
};

/**
 * Post
 */
const postRequestConfig: AxiosRequestConfig = {
  headers: {
    "Content-Type": "application/json",
  },
  transformRequest: (data: any, headers: any) => {
    console.log("transformRequest...");
    console.log(headers);
    console.log(JSON.stringify(data));
    return JSON.stringify(data);
  },
  ...cancelRequestConfig,
};

/**
 * put
 */
const putRequestConfig: AxiosRequestConfig = {
  headers: {
    "Content-Type": "application/json",
  },
  transformRequest: (data: any) => JSON.stringify(data),
  ...cancelRequestConfig,
};

const putBoBy = <R = any, P = any>(
  url: string,
  data?: P,
  config: AxiosRequestConfig = putRequestConfig
): Promise<R> => http.put(url, data || {}, config);

/**
 * delete
 */
const deleteRequestConfig: AxiosRequestConfig = {
  ...cancelRequestConfig,
};

const deleteUrl = <R extends PathKeyOfMethod<"delete">>(
  url: R,
  data?: ExtractParamQuery<"delete", R>,
  config: AxiosRequestConfig = deleteRequestConfig
): Promise<AxiosResponse<Extract200JSON<"delete", R>>> => {
  config.params = data;
  return http.delete(url, config);
};

/**
 * put  请求通过boby传参
 */
const putBoByRequestConfig: AxiosRequestConfig = {
  ...cancelRequestConfig,
};

const put = <R extends PathKeyOfMethod<"put">>(
  url: R,
  data?: ExtractRequestBodyJSON<"put", R>,
  config: AxiosRequestConfig = putBoByRequestConfig
): Promise<AxiosResponse<Extract200JSON<"put", R>>> => {
  return http.put(url, data || {}, config);
};

/**
 * Post Json
 */
const postJsonRequestConfig: AxiosRequestConfig = {
  headers: {
    "Content-Type": "application/json",
  },
  transformRequest: (data: any) => JSON.stringify(data),
  ...cancelRequestConfig,
};

const postJson = <R extends PathKeyOfMethod<"post">>(
  url: R,
  data?: ExtractRequestBodyJSON<"post", R>,
  config: AxiosRequestConfig = postJsonRequestConfig
): Promise<AxiosResponse<Extract200JSON<"post", R>>> =>
  http.post(url, data || {}, config);

const postFormJson = <R = any, P = any>(
  url: string,
  data?: P,
  config: AxiosRequestConfig = postJsonRequestConfig
): Promise<R> => http.post(url, data || {}, config);

/**
 * Post FormBody
 */
const postFormRequestConfig: AxiosRequestConfig = {
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
  },
  ...cancelRequestConfig,
};

const postForm = <R = any, P = any>(
  url: string,
  data?: P,
  config: AxiosRequestConfig = postFormRequestConfig
): Promise<R> => http.post(url, data || {}, config);

/**
 * Post Multipart
 */
const postMultipartRequestConfig: AxiosRequestConfig = {
  headers: {
    "Content-Type": "multipart/form-data",
  },
  ...cancelRequestConfig,
};

const postMultipart = <R = any, P = any>(
  url: string,
  data?: P,
  config: AxiosRequestConfig = postMultipartRequestConfig
): Promise<R> => http.post(url, data || {}, config);

/**
 * Authorization
 */
const setupAuthorizationInterceptor = () => {
  http.interceptors.request.use(async (config: AxiosRequestConfig) => {
    if (config.headers && config.headers.common) {
        const token = "gettoken";
      config.headers.common["token"] = token;
    }
    return config;
  });
};

/**
 * Response
 */
const setupResponseInterceptor = () => {
  http.interceptors.response.use(
    (response: AxiosResponse) => {
      if (response.status === 200 && !response.data.success) {
        throw new Error(response.data.message);
      }
      return response;
    },
    (error: AxiosError) => {
      const response = error.response as AxiosResponse;
      if (error.response) {
        switch (response.status) {
          case 404:
            alert("接口不存在");
            break;
          case 401:
            alert("登陆信息过期");
            break;
          case 503:
            alert("请稍后再试");
            break;
          default:
            break;
        }
      } else if (isTimeoutError(error)) {
        alert("网络连接超时");
      } else {
        alert(error);
      }
      return Promise.reject(error);
    }
  );
};

/**
 * 默认设置
 */
const setupHttp = () => {
  setupAuthorizationInterceptor();
  setupResponseInterceptor();
};

export default http;

export {
  axios,
  isTimeoutError,
  get,
  postForm,
  postFormJson,
  postJson,
  postMultipart,
  deleteUrl,
  put,
  getData,
  putBoBy,
};

export {
  getRequestConfig,
  postRequestConfig,
  postFormRequestConfig,
  postJsonRequestConfig,
  postMultipartRequestConfig,
};

export { setupHttp, setupAuthorizationInterceptor, setupResponseInterceptor };

export { cancelAllRequest, cancels, CancelToken };
