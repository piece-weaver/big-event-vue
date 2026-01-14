import request from "@/utils/request.js";

export const articleListService = (params) => {
  return request.get("/article", { params });
};

export const articleDetailService = (id) => {
  return request.get(`/article/${id}`);
};

export const articleAddService = (articleData) => {
  return request.post("/article", articleData);
};

export const articleUpdateService = (id, articleData) => {
  return request.put(`/article/${id}`, articleData);
};

export const articleDeleteService = (id) => {
  return request.delete(`/article/${id}`);
};
