USE ascs;

# Users
CREATE TABLE IF NOT EXISTS users(user_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
	username VARCHAR(255) NOT NULL,
	password VARCHAR(255) NOT NULL,
	active INT UNSIGNED DEFAULT 1,
  	insdate DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

# Conto bancario, ecc
CREATE TABLE IF NOT EXISTS account_type(at_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
	name VARCHAR(255) NOT NULL,
	active INT UNSIGNED DEFAULT 1,
  	insdate DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

# Unità conto [€,$ ecc]
CREATE TABLE IF NOT EXISTS account_unit(au_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
	unit VARCHAR(255) NOT NULL,
	active INT UNSIGNED DEFAULT 1,
  	insdate DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

# Anagrafica account
CREATE TABLE IF NOT EXISTS a_registry(a_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY, 
	at_id INT UNSIGNED NOT NULL,
	au_id INT UNSIGNED NOT NULL,
	name VARCHAR(255) NOT NULL,
	hidden INT UNSIGNED DEFAULT 0,
	min_value INT UNSIGNED DEFAULT NULL,
	max_value INT UNSIGNED DEFAULT NULL,
	user_id INT UNSIGNED NOT NULL,
	active INT UNSIGNED DEFAULT 1,
  	insdate DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  	FOREIGN KEY(user_id)
  		REFERENCES users(user_id),
  	FOREIGN KEY(at_id)
  		REFERENCES account_type(at_id),
  	FOREIGN KEY(au_id)
  		REFERENCES account_unit(au_id)
) ENGINE=InnoDB;

# Entrata carico ecc...
CREATE TABLE IF NOT EXISTS movements_type(mv_type_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
	name VARCHAR(255) NOT NULL,
	multipler INT NOT NULL, 
	active INT UNSIGNED DEFAULT 1,
  	insdate DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

# Movimenti conto
CREATE TABLE IF NOT EXISTS a_movements(am_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY, 
	a_id INT UNSIGNED NOT NULL,
	mv_type_id INT UNSIGNED NOT NULL,
	notes VARCHAR(255) DEFAULT NULL, # Eventually, DDT number ecc ecc
	value FLOAT NOT NULL,
	user_id VARCHAR(255) NOT NULL,
	active INT UNSIGNED DEFAULT 1,
  	mdate DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, # Override data se post o pre
  	insdate DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  	FOREIGN KEY(a_id)
  		REFERENCES a_registry(a_id),
  	FOREIGN KEY(mv_type_id)
  		REFERENCES movements_type(mv_type_id),
  	FOREIGN KEY(user_id)
  		REFERENCES users(user_id)
) ENGINE=InnoDB;

# Ricorrenze movimenti
CREATE TABLE IF NOT EXISTS r_movements(rm_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
	am_id INT UNSIGNED NOT NULL,
	period INT NOT NULL, # Days between
	first DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, # First time
	active INT UNSIGNED DEFAULT 1,
  	insdate DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;


####
#### E N D  S C H E M A 
####
INSERT INTO movements_type(name, multipler) VALUES('STIPENDIO',   1);
INSERT INTO movements_type(name, multipler) VALUES('AFFITTO',    -1);
INSERT INTO movements_type(name, multipler) VALUES('BENZINA',    -1);
INSERT INTO movements_type(name, multipler) VALUES('SIGARETTE',  -1);
INSERT INTO movements_type(name, multipler) VALUES('SERATA',	 -1);
INSERT INTO movements_type(name, multipler) VALUES('INTERNET',	 -1);
INSERT INTO movements_type(name, multipler) VALUES('BOLLETTE',	 -1);
INSERT INTO movements_type(name, multipler) VALUES('MULTE',	 	 -1);














