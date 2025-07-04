// middleware/getIp.js
export const getIp = (req, res, next) => {
  req.ipAddress =
    req.headers["x-forwarded-for"]?.split(",").shift() ||
    req.socket?.remoteAddress;
  next();
};
