# Node Defender

Defend against waves of murderous server side code that wants nothing more than to kill and disconnect your node client.

## Installation

```bash
npm install
```

## Running the game

* Define the host location of the game server and run npm start as follows:

```bash
HOST=<server host> npm start
```

By default, `HOST` is `http://localhost:8080`.

## Playing the game

To defend your node, you will need to implement a strategy against the waves of enemies that will attack you. A sample strategy has been provided to make you familiar with the available API to the server.

To begin, login and edit the code in the code editor and devise your strategy to last as long as possible against the onslaught.

1. The code is wrapped in a method that is called once per round and passed the following variables:
	* The `roundInfo` object contains methods for getting information about the round, such as a list of mobs.
	* The `commander` is where you will define what enemy to attack and what attack mode you want to use.
2. Click "Start Game"

## Information on the Game

Consult [The Client Wiki](https://github.com/zumba/booth-node-defender-client/wiki) for more information on the attack modes and mob types.

## Configuraion

All the below configurations are optional.

* `HOST` - Node Defender Game server to connect.
* `PORT` - Port of the client application. Default to 8081.
* `SECURECLIENT` - `0` or `1` to force HTTPS only. Default to false.
* `SECURECLIENTURL` - Url when HTTPS only is on.
* `SESSION_SECRET` - Secret code for session encryption.
* `SESSION_KEY` - Cookie name for the session.
* `TWITTER_CONSUMER_KEY` - OAuth app key. If not defined, twitter oauth will redirect to home page.
* `TWITTER_CONSUMER_SECRET` - OAuth app secret. If not dfeined, twitter oauth will redirect to home page.
* `GITHUB_CONSUMER_KEY` - OAuth app key.
* `GITHUB_CONSUMER_SECRET` - OAuth app secret.
* `MONGO_DSN` - Mongo connector used for session storage in the form of `mongodb://user:password@host/db/collection`. If not specified will fallback to node sessions storage.
* `GA_ACCOUNT` - Google Analytics account code.
