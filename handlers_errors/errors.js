exports.handleInvalidPath = (req, res) => {
    res.status(404).send({ msg: "This path is invalid" });
  };
  
  exports.handleCustomErr = (err, req, res, next) => {
    if (err.msg && err.status) {
      res.status(err.status).send({ msg: err.msg });
    } else {
      next(err);
    }
  };
  
  exports.unhandledErr = (req, res) => {
    res.status(500).send({ msg: "ooops something went wrong, internal server error" });
  };