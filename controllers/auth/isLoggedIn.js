const isLoggedIn = (req, res, next) => {
  res.status(200).json({ message: "Authorised" });
};

module.exports = { isLoggedIn };
