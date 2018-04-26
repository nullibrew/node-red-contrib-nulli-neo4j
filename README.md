# node-red-contrib-nulli-neo4j
A <a href="http://nodered.org" target="_new">Node-RED</a> node that lets you run generic cypher queries on a Neo4j graph database.

## Install

Run the following command in the root directory of your Node-RED install or home directory (usually ~/.node-red) and will also install needed libraries.

```
npm install node-red-contrib-nulli-neo4j
```

## Usage

You can define the Neo4j bolt URL and the basic authentication username and password in the node's configuration.

You can also specify a cypher query in the configuration. The parameters for the query (if needed) are read from `msg.params`. The cypher query can also be passed to the node as `msg.query`. Below are some examples:

1. Example of hard coded query in the configuratiob of the node.
```
MATCH (m:Movie {title: 'Forrest Gump'}) return m
```

2. Example of a parameterized query.
```
Query in the configuration:

MATCH (m:Movie {title: $moviename}) return m

msg.params = '{"moviename": "Forrest Gump"}'
```

3. Example of both query and params being passed in `msg`
```
msg.query = 'MATCH (m:Movie {title: $moviename}) return m'

msg.params = '{"moviename": "Forrest Gump"}'
```

The node has two outputs. If the query returns only 1 record, the requested properties of the node are sent to output #1. If the query returns multiple records, an array of requested properties of the nodes are sent to output #2.

You can import the following and use it with the [neo4j example movie dataset](https://neo4j.com/developer/movie-database/)

![Example Flow](./blob/master/docs/images/example_flow.png)

```
[{"id":"e10395d.a56ef68","type":"inject","z":"488d970f.76d278","name":"Single record query","topic":"","payload":"","payloadType":"date","repeat":"","crontab":"","once":false,"onceDelay":0.1,"x":178,"y":170,"wires":[["9eb7f4e.b975a08"]]},{"id":"edc735f1.c9aeb8","type":"debug","z":"488d970f.76d278","name":"","active":true,"tosidebar":true,"console":false,"tostatus":false,"complete":"payload","x":978,"y":215,"wires":[]},{"id":"9f02f37e.2cb1c","type":"nulli-neo4j","z":"488d970f.76d278","name":"","url":"bolt://localhost:7687","username":"neo4j","password":"test1234","query":"","x":738.5,"y":277,"wires":[["edc735f1.c9aeb8"],["b2bd2c4.0a654d"]]},{"id":"9eb7f4e.b975a08","type":"change","z":"488d970f.76d278","name":"","rules":[{"t":"set","p":"query","pt":"msg","to":"MATCH (m:Movie {title: $moviename})  RETURN m","tot":"str"},{"t":"set","p":"params","pt":"msg","to":"{\"moviename\": \"Forrest Gump\"}","tot":"str"}],"action":"","property":"","from":"","to":"","reg":false,"x":415,"y":169,"wires":[["9f02f37e.2cb1c","c9467e8a.62018"]]},{"id":"b2bd2c4.0a654d","type":"debug","z":"488d970f.76d278","name":"","active":true,"tosidebar":true,"console":false,"tostatus":false,"complete":"payload","x":976,"y":349,"wires":[]},{"id":"3e3a33b3.12f48c","type":"inject","z":"488d970f.76d278","name":"Multi record query","topic":"","payload":"","payloadType":"date","repeat":"","crontab":"","once":false,"onceDelay":0.1,"x":171,"y":275,"wires":[["9e73c15d.04eb4"]]},{"id":"9e73c15d.04eb4","type":"change","z":"488d970f.76d278","name":"","rules":[{"t":"set","p":"query","pt":"msg","to":"MATCH (m:Movie {title: $moviename})<-[:ACTS_IN]-(a:Actor)  RETURN a","tot":"str"},{"t":"set","p":"params","pt":"msg","to":"{\"moviename\": \"Forrest Gump\"}","tot":"str"}],"action":"","property":"","from":"","to":"","reg":false,"x":411,"y":274,"wires":[["9f02f37e.2cb1c","c9467e8a.62018"]]},{"id":"94ca7897.d13bd8","type":"change","z":"488d970f.76d278","name":"","rules":[{"t":"set","p":"query","pt":"msg","to":"merge (m:Movie {title: $moviename}) set m += $props return m","tot":"str"},{"t":"set","p":"params","pt":"msg","to":"{\t   \"moviename\": \"My Blockbuster Movie\",\t   \"props\": {\t       \"studio\":\"Home Prod\",\t       \"runtime\":142,\t       \"description\":\"This is my first movie\",\t       \"language\":\"en\",\t       \"version\":274,\t       \"imageUrl\":\"https://c1.staticflickr.com/9/8387/8453530769_9bab22d205_b.jpg\",\t       \"genre\":\"Comedy\",\t       \"tagline\":\"How not to make a movie...\",\t       \"homepage\":\"\"\t   } \t}","tot":"jsonata"}],"action":"","property":"","from":"","to":"","reg":false,"x":411,"y":374,"wires":[["9f02f37e.2cb1c","c9467e8a.62018"]]},{"id":"8f998b68.265728","type":"inject","z":"488d970f.76d278","name":"Create example","topic":"","payload":"","payloadType":"date","repeat":"","crontab":"","once":false,"onceDelay":0.1,"x":167,"y":375,"wires":[["94ca7897.d13bd8"]]},{"id":"c9467e8a.62018","type":"debug","z":"488d970f.76d278","name":"query and params","active":true,"tosidebar":true,"console":false,"tostatus":false,"complete":"true","x":752,"y":459,"wires":[]}]
```

This node uses the [neo4j-driver](https://www.npmjs.com/package/neo4j-driver) package to communicate with neo4j.

### Runtime information
This node was tested to Node.js v8.10.0 LTS and NPM 5.6.0 on Node-Red v0.18.4
