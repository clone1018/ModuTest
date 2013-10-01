export class Plugin {

	reload(bot, namespace) {
		this.unload(bot, namespace);
		this.load(bot, namespace);
	}

	addPluginEvent(bot, plugin, ev, f) {
		if (typeof bot.hooks[plugin ] == 'undefined') {
			bot.hooks[plugin] = [];
		}

		var callback = (function () {
			return function () {
				f.apply(that, arguments);
			};
		})();

		bot.hooks[plugin ].push({event: ev, callback: callback});

		var that = bot.plugins[plugin];
		return bot.client.addListener(ev, callback);
	}

	addPluginCommand(bot, plugin, command, func) {
		bot.client.addListener('command.' + command, function (from, to, message) {
			var args = message.split(' ');
			bot.plugins[plugin][func](from, to, message, args);
		});
	}

	unload(bot, namespace) {
		delete bot.plugins[namespace];
	}

	load(bot, namespace) {
		bot.config.bot.debug && console.log("Loading Plugin: " + namespace);

		var name = namespace.split('/')[1];

		this.unload(bot, namespace);


		// Load the plugin
		var pluginFile = require('../plugins/' + namespace + '/' + name);
		var pluginConfig = bot.config.plugin[name] || {};
		bot.plugins[namespace] = new pluginFile.Plugin(bot, pluginConfig);

		// Load the hooks
		['registered', 'motd', 'names', 'topic', 'join', 'part', 'quit', 'kick', 'kill', 'message', 'notice', 'ping', 'pm', 'ctcp', 'ctcpNotice', 'ctcpPrivmsg', 'ctcpVersion', 'nick', 'plusMode', 'minusMode', 'whois', 'channelistStart', 'channelistItem', 'channelList', 'raw', 'error'].forEach(function (event) {
			var onEvent = 'on' + event.charAt(0).toUpperCase() + event.substr(1),
				callback = bot.plugins[namespace][onEvent];

			if (typeof callback == 'function') {
				this.addPluginEvent(bot, namespace, event, callback);
				bot.config.bot.debug && console.log("Registered " + onEvent + " hook for " + namespace);
			}
		}, bot);

		// Load the commands
		var commands = bot.plugins[namespace].commands;
		for (var key in commands) {
			var command = key;
			var func = commands[key];
			var callback = bot.plugins[namespace][func];

			this.addPluginCommand(bot, namespace, command, func);
		}

	}

	getAllMethods(object) {
		return Object.getOwnPropertyNames(object).filter(function (property) {
			return typeof object[property] == 'function';
		});
	}
}

