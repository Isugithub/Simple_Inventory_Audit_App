const allowedRoles = new Set(["admin", "super_admin"]);

const requireInventoryAdmin = (req, res, next) => {
  const role = req.user?.role;

  if (!allowedRoles.has(role)) {
    return res.status(403).json({
      success: false,
      message: "Only an admin or super admin can edit or delete inventory items.",
    });
  }

  req.user = { role };
  next();
};

module.exports = requireInventoryAdmin;
