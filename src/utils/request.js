import axios from "axios";
import constant from "./constant";
//处理url参数
import qs from "qs";

import store from "../store";


axios.defaults.baseURL = constant.baseURL;

// 添加请求拦截器
axios.interceptors.request.use(function (config) {
  if(localStorage.getItem("adminToken") || localStorage.getItem("userToken")) {
    let token = localStorage.getItem("adminToken")
      ? localStorage.getItem("adminToken") : localStorage.getItem("userToken")
    config.headers.common['Authorization'] =  "Bearer " + token
  }
  return config;
}, function (error) {
  return Promise.reject(error);
});

// 添加响应拦截器
axios.interceptors.response.use(function (response) {
  if (response !== null && response.hasOwnProperty("status") && response.status !== 201) {
    if (response.status === 300) {
      store.commit("loadCurrentUser", {});
      if(localStorage.getItem("userToken")) {
        localStorage.removeItem("userToken");
      }
      store.commit("loadCurrentAdmin", {});
      if(localStorage.getItem("adminToken")) {
        localStorage.removeItem("adminToken");
      }
      window.location.href = constant.webURL + "/user";
    }
    return Promise.reject(new Error(response.data.message));
  } else {
    return response;
  }
}, function (error) {
  // 对响应错误做点什么
  return Promise.reject(error);
});

// 当data为URLSearchParams对象时设置为application/x-www-form-urlencoded;charset=utf-8
// 当data为普通对象时，会被设置为application/json;charset=utf-8


export default {
  patch(url, params = {}, isAdmin = false, json = true) {
    return new Promise((resolve, reject) => {
      axios
        .patch(url, json ? params : qs.stringify(params))
        .then(res => {
          resolve(res.data);
        })
        .catch(err => {
          reject(err);
        });
    });
  },

  post(url, params = {}, isAdmin = false, json = true) {
    return new Promise((resolve, reject) => {
      axios
        .post(url, json ? params : qs.stringify(params))
        .then(res => {
          resolve(res.data);
        })
        .catch(err => {
          reject(err);
        });
    });
  },

  get(url, params = {}, isAdmin = false) {
    return new Promise((resolve, reject) => {
      axios.get(url, {
        params: params,
      }).then(res => {
        resolve(res.data);
      }).catch(err => {
        reject(err)
      })
    });
  },

  upload(url, param, isAdmin = false) {
    let config;

    config = {
      headers: { "Content-Type": "multipart/form-data"}
    };
    return new Promise((resolve, reject) => {
      axios
        .post(url, param, config)
        .then(res => {
          resolve(res.data);
        })
        .catch(err => {
          reject(err);
        });
    });
  },

  uploadQiniu(url, param) {
    let config = {
      headers: {"Content-Type": "multipart/form-data"},
      timeout: 60000
    };

    return new Promise((resolve, reject) => {
      axios
        .post(url, param, config)
        .then(res => {
          resolve(res.data);
        })
        .catch(err => {
          reject(err);
        });
    });
  }
}
