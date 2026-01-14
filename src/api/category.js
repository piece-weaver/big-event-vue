import request from "@/utils/request.js";

export const categoryListService = () => {
  return request.get("/category");
};

export const categoryDetailService = (id) => {
  return request.get(`/category/${id}`);
};

export const categoryAddService = (categoryData) => {
  return request.post("/category", categoryData);
};

export const categoryUpdateService = (id, categoryData) => {
  return request.put(`/category/${id}`, categoryData);
};

export const categoryDeleteService = (id) => {
  return request.delete(`/category/${id}`);
};

export const categoryArticlesService = (id) => {
  return request.get(`/category/${id}/articles`);
};

export const categoryForceDeleteService = (id) => {
  return request.delete(`/category/${id}/force`);
};
