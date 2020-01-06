import electron from 'electron'
import path from 'path'
import fs from 'fs'
import sqlite3 from 'sqlite3'
let db = undefined

function generateDB (name, callback) {
	db = new sqlite3.Database(name)
	db.serialize(function() {
		db.run(`CREATE TABLE IF NOT EXISTS account_type(at_id INTEGER PRIMARY KEY,
				name VARCHAR(255) NOT NULL,
				active INT UNSIGNED DEFAULT 1,
  				insdate DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP)`)

		db.run(`CREATE TABLE IF NOT EXISTS account_unit(au_id INTEGER PRIMARY KEY,
				unit VARCHAR(255) NOT NULL,
				active INT UNSIGNED DEFAULT 1,
  				insdate DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP)`)

		db.run(`CREATE TABLE IF NOT EXISTS a_registry(a_id INTEGER PRIMARY KEY, 
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

		db.run(`CREATE TABLE IF NOT EXISTS movements_type(mv_type_id INTEGER PRIMARY KEY,
				name VARCHAR(255) NOT NULL,
				multipler INT NOT NULL, 
				active INT UNSIGNED DEFAULT 1,
  				insdate DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP)`)

		db.run(`CREATE TABLE IF NOT EXISTS a_movements(am_id INTEGER PRIMARY KEY, 
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
		
		db.run(`CREATE TABLE IF NOT EXISTS r_movements(rm_id INTEGER  PRIMARY KEY,
				am_id INT UNSIGNED NOT NULL,
				period INT NOT NULL, 
				first DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
				active INT UNSIGNED DEFAULT 1,
  				insdate DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP)`)

		db.run(`INSERT INTO movements_type(name, multipler) VALUES('STIPENDIO',   1)`)
		db.run(`INSERT INTO movements_type(name, multipler) VALUES('AFFITTO',   -1)`)
		db.run(`INSERT INTO account_unit(unit) VALUES('€')`)
		db.run(`INSERT INTO account_type(name) VALUES('Bank account')`)

		callback('INIT DB')
	})
}

function checkInit (callback) {
	try {
		const userDataPath = (electron.app || electron.remote.app).getPath('userData')
		const tpath = path.join(userDataPath, 'conf.json')
		let contents = fs.readFileSync(tpath, 'utf8')
		const dbpath = path.join(userDataPath, contents)
		db = new sqlite3.Database(dbpath)

		callback('Loaded DB')
	} catch (err) {
		const userDataPath = (electron.app || electron.remote.app).getPath('userData')
		const tpath = path.join(userDataPath, 'conf.json')
		let date = new Date().toISOString()
		fs.writeFileSync(tpath, 'DBAM-' + date)
		const dbpath = path.join(userDataPath, 'DBAM-' + date)
		generateDB(dbpath, callback)
	}
}

export default {
	initOnce (arg, callback) {
		checkInit(callback)
	},

	getMvnTypes (arg, callback) {
		db.all(`SELECT * FROM movements_type`, (err, result) => {
			callback(result)
		})
	},

	getAccountUnits (arg, callback) {
		db.all(`SELECT * FROM account_unit`, (err, result) => {
			callback(result)
		})
	},

	getAccountTypes (arg, callback) {
		db.all(`SELECT * FROM account_type`, (err, result) => {
			callback(result)
		})
	},

	getAccounts (arg, callback) {
		db.all(`SELECT a_registry.*, account_type.name as type, account_unit.unit as unit FROM a_registry
			INNER JOIN account_unit ON a_registry.au_id=account_unit.au_id
			INNER JOIN account_type ON a_registry.at_id=account_type.at_id`, (err, result) => {
			callback(result)
		})
	},

	createAccount (arg, callback) {
		console.log(arg)
		let b = JSON.parse(arg)
		console.log(b, b.au_id)
 		var stmt = db.prepare(`INSERT INTO a_registry (au_id, at_id, name, min_value, max_value) VALUES(?, ?, ?, ?, ?)`)
 		stmt.run(b.au_id, b.at_id, b.name, b.min_value, b.max_value)
 		var res = stmt.finalize()
		//////db.run(`INSERT INTO a_registry (au_id, at_id, name, min_value, max_value) VALUES($au_id, $at_id, $name, $min_value, $max_value)`, arg)
		callback(res)
	},

	close () {
		db.close()
	}
}