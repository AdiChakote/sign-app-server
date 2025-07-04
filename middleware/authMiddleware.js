import jwt from "jsonwebtoken";

function auth(req, res, next) {
  const authHeader = req.header("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ msg: "No token, access denied" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);

    if (!verified?.user?.id) {
      return res.status(401).json({ msg: "Token payload missing 'user.id'" });
    }

    req.user = verified.user;
    next();
  } catch (err) {
    console.error("Auth error:", err.message);
    res.status(401).json({ msg: "Token is not valid" });
  }
}

export default auth;

/*import jwt from "jsonwebtoken";

function auth(req, res, next) {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) return res.status(401).json({ msg: "No token, access denied" });

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);


    if (!verified.user || !verified.user.id) {
      return res.status(401).json({ msg: "Token payload missing 'user.id'" });
    }

    req.user = verified.user;
    next();
  } catch (err) {
    console.error("Auth error:", err.message);
    res.status(401).json({ msg: "Token is not valid" });
  }
}

export default auth;
*/
