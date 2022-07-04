const models = require("./models");
const { fetchTopics } = require("./models");



exports.getTopics = (req, res) => {
  models.fetchTopics().then((result) => {
    res.status(200).send({ result });
  });
};

