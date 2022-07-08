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
  exports.handlePsqlErr = (err, req, res, next) => {
    if (err.code === "22P02") {
      res.status(400).send({ msg: "Bad Request" });
    } else {
      next(err);
    }
  };
  exports.unhandledErr = (err, req, res, next) => {
    console.log(err)
    res.status(500).send({ msg: "ooops something went wrong, internal server err" });
  };