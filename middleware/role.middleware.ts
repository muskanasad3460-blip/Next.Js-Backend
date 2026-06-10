export const isAdmin = (req: any, res: any, next: any) => {
  if (req.user.type !== "admin") {
    return res.status(403).json({ message: "Admin only" });
  }
  next();
};

export const isUser = (req: any, res: any, next: any) => {
  if (req.user.type !== "user") {
    return res.status(403).json({ message: "User only" });
  }
  next();
};
