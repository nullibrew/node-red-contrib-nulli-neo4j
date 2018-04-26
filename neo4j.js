const neo4j = require('neo4j-driver').v1;
module.exports = function (RED) {
    function NulliNeo4j(config) {
        RED.nodes.createNode(this, config);
        var node = this;
        //console.log(`url = ${config.url}`);
        const driver = neo4j.driver(config.url, neo4j.auth.basic(config.username, config.password));
        const session = driver.session();

        node.on('input', function (msg) {
            //console.log(`decoding QR data from ${msg.payload}`);
            var query = config.query || msg.query;
            let params = null;
            if(typeof(msg.params) === 'string') {
                params = JSON.parse(msg.params);
            } else {
                params = msg.params;
            }
            //console.log(`params: ${params}`);
            var scalar_result = {
                payload: null
            };
            const resultPromise = session.run(query, params);

            var array_result = {
                payload: []
            }
            resultPromise.then(result => {
                session.close();
                if(result.records.length > 1) {
                    result.records.forEach(function(item, index, array) {
                        array_result.payload.push(item.get(0).properties);
                    });
                    //console.log(`array size: ${array_result.payload.length}`)
                    node.send([null, array_result]);
                } else {
                    scalar_result.payload = result.records[0].get(0).properties;
                    //msg.payload = result.records;
                    node.send([scalar_result, null]);

                }
            });
        });

        node.on('close', function() {
            // tidy up any state
            driver.close();
        });
    }
    RED.nodes.registerType("nulli-neo4j", NulliNeo4j);
}
