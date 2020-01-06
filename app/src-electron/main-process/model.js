const electron = require('electron')
const path = require('path')
let fs = require ('fs')
let sqlite3 = require('sqlite3').verbose()
let db = undefined

function generateDB (name, callback) {
	db = new sqlite3.Database(name)
	db.serialize(function() {
		db.run(`CREATE TABLE IF NOT EXISTS account_type(at_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
				name VARCHAR(255) NOT NULL,
				active INT UNSIGNED DEFAULT 1,
  				insdate DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP)`)

		db.run(`CREATE TABLE IF NOT EXISTS account_unit(au_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
				unit VARCHAR(255) NOT NULL,
				active INT UNSIGNED DEFAULT 1,
  				insdate DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP)`)

		db.run(`CREATE TABLE IF NOT EXISTS a_registry(a_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY, 
				at_id INT UNSIGNED NOT NULL,
				au_id INT UNSIGNED NOT NULL,
				name VARCHAR(255) NOT NULL,
				hidden INT UNSIGNED DEFAULT 0,
				min_value INT UNSIGNED DEFAULT NULL,
				max_value INT UNSIGNED DEFAULT NULL,
				active INT UNSIGNED DEFAULT 1,
  				insdate DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  				FOREIGN KEY(at_id)
  					REFERENCES account_type(at_id),
  				FOREIGN KEY(au_id)
  					REFERENCES account_unit(au_id))`)

		db.run(`CREATE TABLE IF NOT EXISTS movements_type(mv_type_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
				name VARCHAR(255) NOT NULL,
				multipler INT NOT NULL, 
				active INT UNSIGNED DEFAULT 1,
  				insdate DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP)`)

		db.run(`CREATE TABLE IF NOT EXISTS a_movements(am_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY, 
				a_id INT UNSIGNED NOT NULL,
				mv_type_id INT UNSIGNED NOT NULL,
				notes VARCHAR(255) DEFAULT NULL,
				value FLOAT NOT NULL,
				active INT UNSIGNED DEFAULT 1,
  				mdate DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  				insdate DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  				FOREIGN KEY(a_id)
  					REFERENCES a_registry(a_id),
  				FOREIGN KEY(mv_type_id)
  					REFERENCES movements_type(mv_type_id))`)
		
		db.run(`CREATE TABLE IF NOT EXISTS r_movements(rm_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
				am_id INT UNSIGNED NOT NULL,
				period INT NOT NULL, 
				first DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
				active INT UNSIGNED DEFAULT 1,
  				insdate DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP)`)

		db.run(`INSERT INTO movements_type(name, multipler) VALUES('STIPENDIO',   1)`)
		db.run(`INSERT INTO movements_type(name, multipler) VALUES('AFFITTO',   -1)`)

		callback('INIT DB')
	})
}

function checkInit (callback) {
	try {
		const userDataPath = (electron.app || electron.remote.app).getPath('userData')
		console.log(userDataPath)
		const tpath = path.join(userDataPath, 'conf.json')

		let contents = fs.readFileSync(tpath, 'utf8')
		const dbpath = path.join(userDataPath, contents)
		db = new sqlite3.Database(dbpath)
		callback('Loaded DB')
	} catch (err) {
		const userDataPath = (electron.app || electron.remote.app).getPath('userData')
		console.log(userDataPath)
		const tpath = path.join(userDataPath, 'conf.json')
		let date = new Date().toISOString()
		fs.writeFileSync(tpath, 'DB-' + date)
		const dbpath = path.join(userDataPath, 'DB-' + date)
		generateDB(dbpath, callback)
	}
}

var self = module.exports = {
	initOnce (callback) {
		checkInit(callback)
	},

	getMvnTypes (callback) {
		db.all(`SELECT * FROM movements_type`, (err, result) => {
			console.log(err, result)
			callback(result)
		})
	},

	getAccountUnits (callback) {
		db.all(`SELECT * FROM account_unit`, (err, result) => {
			console.log(err, result)
			callback(result)
		})
	},

	getAccountTypes (callback) {
		db.all(`SELECT * FROM account_type`, (err, result) => {
			console.log(err, result)
			callback(result)
		})
	},

	getAccounts (callback) {
		db.all(`SELECT * FROM a_registry`, (err, result) => {
			console.log(err, result)
			callback(result)
		})
	},


	createAccount () {

	},

	close () {
		db.close()
	}
}