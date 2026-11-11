import jwt from 'jsonwebtoken';

const authenticateToken = (requiredRole=null) => {

return (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.sendStatus(401);
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.sendStatus(403);
    }
    req.user = decoded;
    if(requiredRole && req.user.role !== requiredRole) {
      return res.status(403).json({ error: "Access denied " });
    }
    next();
  });
};
}
export default authenticateToken;