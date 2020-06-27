/* eslint-disable camelcase */

// const requireFolder = require('require-folder');
const requireFolder = require('../../../require-folder');

const {
	normalizeEntryName,
	forIn,
} = require('../utils');

const supportedVerbs = [
	'get',
	'post',
	'put',
	'delete',
];

const requireHooks = {
	alias: {
		in: '_in',
		out: '_out',
		index: ['_before_verb', '_before-verb'],
		get: '_get',
		post: '_post',
		put: '_put',
		delete: '_delete',
		verbs: '_verbs',
		noVerb: ['_no-verb', '_no_verb'],
		afterVerb: ['_after_verb', '_after-verb'],
		preMethod: ['_pre_method', '_pre-method'],
		postMethod: ['_post_method', '_post-method'],
		preSub: ['_pre_sub', '_pre-sub'],
		postSub: ['_post_sub', '_post-sub'],
	},
	hooks: {
		verbs (obj, map) {
			const rawVerbs = requireFolder(map.path);
			const verbs = obj.verbs || Object.create(null);

			forIn(rawVerbs, (key, value) => {
				let verb = normalizeEntryName(key, false);

				const [isVerbOk, isNoVerbOk] = validateVerbName(this, verb);

				if (isVerbOk || isNoVerbOk) {
					if (!verbs[verb]) {
						verbs[verb] = value.index || value;
					}
				}
			})

			obj.verbs = verbs;
		},
		get (obj, map) {
			obj.verbs = obj.verbs || Object.create(null);
			obj.verbs.get = requireFolder(map.path);
		},
		post (obj, map) {
			obj.verbs = obj.verbs || Object.create(null);
			obj.verbs.post = requireFolder(map.path);
		},
		put (obj, map) {
			obj.verbs = obj.verbs || Object.create(null);
			obj.verbs.put = requireFolder(map.path);
		},
		delete (obj, map) {
			obj.verbs = obj.verbs || Object.create(null);
			obj.verbs.delete = requireFolder(map.path);
		},
		noVerb (obj, map) {
			obj.verbs = obj.verbs || Object.create(null);
			obj.verbs.noVerb = requireFolder(map.path);
		},
	}
};

module.exports = {
	hookNames: getHookNames(),
	requireHooks,
}

function validateVerbName (ctrl, verbName) {
	const isVerbOk   = isVerb(verbName); // && !ctrl.verbs[verbName];
	const isNoVerbOk = isNoVerb(verbName); // && !ctrl.noVerb;

	return [isVerbOk, isNoVerbOk];
}

const noVerb = ['no-verb', 'no_verb'];

function isVerb (verb) {
	return supportedVerbs.includes(verb);
}

function isNoVerb (verb) {
	return noVerb.includes(verb);
}

function getHookNames () {
	const allNames = new Set();

	forIn(requireHooks.alias, (key) => {
		allNames.add(key);
	});

	return allNames;
}
