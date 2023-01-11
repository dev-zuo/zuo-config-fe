import axios from "axios";
import { ElMessage } from "element-plus";

console.log("axios base url", import.meta.env.VITE_BASE_URL);
// console.log("axios base url", process.env.VUE_APP_BASE_URL);
const instance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  timeout: 60000,
  headers: { "X-Custom-Header": "foobar" },
});

// axios.interceptors.request.use(resolve func, reject func)
// Add a request interceptor
instance.interceptors.request.use(
  async function (config) {
    // Do something before request is sent
    console.log("request 拦截: ", config);

    // 为所有请求加一个时间戳参数
    config.url += (config?.url?.includes("?") ? "&" : "?") + "t=" + +new Date();

    return config; // 用来请求的参数
  },
  function (error: any) {
    // Do something with request error
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    console.log("响应拦截", response);

    // 如果身份校验失败，返回登录页
    // response.data.code === 111 && (window.location.href = response.data);

    const { code, msg, plainMsg } = response.data;

    if (code !== 0) {
      ElMessage.error(`${msg}: ${plainMsg}`);
    }

    return response.data; // 过滤掉除data参数外的其它参数，响应接收到的值。
    // return response;
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error);
  }
);

export default instance;
