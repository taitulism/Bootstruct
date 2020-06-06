module.exports = {
	public (entryMap) {
		this.hookArg = entryMap.path && entryMap.type;
		this.hookThis = Object.getPrototypeOf(this).constructor.name === 'Ctrl';
		this.public = 'public';
	},
};
