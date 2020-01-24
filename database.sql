create database library_new;
CREATE TABLE library_new.authors (
	id BIGINT(20) NOT NULL AUTO_INCREMENT,
	author_name VARCHAR(200) NOT NULL DEFAULT '',
	author_lname VARCHAR(200) NOT NULL DEFAULT '',
	author_notes VARCHAR(200) NOT NULL DEFAULT '',
	PRIMARY KEY (id)
)
COMMENT='Authors'
COLLATE='latin1_swedish_ci'
ENGINE=InnoDB
;
CREATE TABLE library_new.genre (
	genre_id BIGINT(20) NOT NULL AUTO_INCREMENT,
	genre_desc VARCHAR(200) NULL DEFAULT NULL,
	PRIMARY KEY (genre_id)
)
COMMENT='Genre table'
COLLATE='latin1_swedish_ci'
ENGINE=InnoDB
;
CREATE TABLE library_new.books (
book_id BIGINT(20) NOT NULL auto_increment,
	book_title VARCHAR(2000) NOT NULL,
	book_date DATE NOT NULL,
	book_image BLOB NULL DEFAULT '',
	book_annotation VARCHAR(50) NULL DEFAULT NULL,
	author_id BIGINT(20) NOT NULL,
	genre_id BIGINT(20) NOT NULL,
	PRIMARY KEY (book_id),
	INDEX BOOK_AUTH_GENRE (author_id, genre_id, book_id),
	INDEX BOOK_GENRE (genre_id),
	CONSTRAINT BOOK_AUTH_FK FOREIGN KEY (author_id) REFERENCES library_new.authors (id),
	CONSTRAINT BOOK_GENRE FOREIGN KEY (genre_id) REFERENCES library_new.genre (genre_id)
)
COMMENT='Books table'
COLLATE='latin1_swedish_ci'
ENGINE=InnoDB
;
create user 'book_reader' identified by 'book_reader';

GRANT SELECT, UPDATE,INSERT,DELETE ON library_new.authors TO book_reader;
GRANT SELECT, UPDATE,INSERT,DELETE ON library_new.books TO book_reader;
GRANT SELECT, UPDATE,INSERT,DELETE ON library_new.genre TO book_reader;

