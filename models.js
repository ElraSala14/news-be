const connection = require("./db/connection");
const models ={};

exports.fetchTopics = () => {
    return connection.query("SELECT * FROM topics;")
        .then((result) => {
            return result.rows;  
});
};
