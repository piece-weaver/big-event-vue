import request from "@/utils/request.js";

export const userRegisterService = (registerData) => {
  return request.post("/user/register", registerData);
};

export const userLoginService = (loginData) => {
  return request.post("/user/login", loginData);
};

export const userInfoService = () => {
  return request.get("/user/userInfo");
};

export const userInfoUpdateService = (userInfoData) => {
  return request.put("/user/update", userInfoData);
};

export const userAvatarUpdateService = (avatarUrl) => {
  const params = new URLSearchParams();
  params.append('avatarUrl', avatarUrl);
  return request.patch("/user/updateAvatar", params, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
};

export const userPasswordUpdateService = (passwordData) => {
  return request.patch("/user/updatePwd", passwordData);
};
