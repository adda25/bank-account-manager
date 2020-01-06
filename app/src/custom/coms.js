const {ipcRenderer} = require('electron')

module.exports = {
	send (event, args, callback) {
		ipcRenderer.invoke('amc', [event, args]).then((result) => {
		  	callback(result)
		})
	}
}