module.exports = {
	public (publicExport) {
		this.hookArg = publicExport === 'PUBLIC';
		this.hookThis = Object.getPrototypeOf(this).constructor.name === 'Ctrl';
		this.public = 'public';
	},
};
