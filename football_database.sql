-- ===============================================
-- ⚽ FOOTBALL DATABASE (MySQL Workbench Compatible)
-- ===============================================

-- 1️⃣ CREATE DATABASE & USE IT
DROP DATABASE IF EXISTS football_database;
CREATE DATABASE football_database;
USE football_database;

-- 2️⃣ CREATE TABLES
CREATE TABLE football_club(
    club_id INT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    crest VARCHAR(50) NOT NULL,
    jersey INT NOT NULL UNIQUE
);

CREATE TABLE stadium(
    s_id INT PRIMARY KEY,
    s_name VARCHAR(50) NOT NULL UNIQUE,
    country VARCHAR(50) NOT NULL,
    city VARCHAR(20) NOT NULL,
    capacity INT NOT NULL
);

CREATE TABLE player(
    p_id INT PRIMARY KEY,
    f_name VARCHAR(50) NOT NULL,
    l_name VARCHAR(50) NOT NULL,
    jersey_no INT UNIQUE,
    DOB DATE NOT NULL,
    age INT NOT NULL CHECK(age >= 15 AND age <= 45),
    position VARCHAR(20) NOT NULL,
    nationality VARCHAR(20) NOT NULL,
    salary DECIMAL(10,2),
    club_id INT,
    CONSTRAINT fk_player_club FOREIGN KEY (club_id) REFERENCES football_club(club_id)
);

CREATE TABLE revenue(
    rev_id INT PRIMARY KEY,
    club_id INT NOT NULL,
    ticket_sales DECIMAL(10,2),
    jersey_sales DECIMAL(10,2),
    CONSTRAINT fk_club FOREIGN KEY (club_id) REFERENCES football_club(club_id)
);

-- 3️⃣ INSERT DATA
INSERT INTO football_club VALUES
(1,'Barcelona','FCB',45),
(2,'Real Madrid','RM',4),
(3,'Chelsea','CFC',3),
(4,'Mumbai City','MFC',2),
(5,'FC Goa','GFC',5);

INSERT INTO stadium VALUES
(1,'Camp Nou','Spain','Barcelona',60000),
(2,'Bernabeu','Spain','Madrid',70000),
(3,'Stamford Bridge','England','London',30000),
(4,'Mumbai Sports Arena','India','Mumbai',40000),
(5,'PJ Nehra','India','Goa',20000);

INSERT INTO player VALUES
(1,'Diego','Maradona',21,'1989-01-01',36,'Striker','Argentina',50000,1),
(2,'Sunil','Chhetri',2,'1984-08-03',40,'Striker','India',60000,2),
(3,'Lionel','Messi',10,'1987-06-24',37,'Right Winger','Argentina',80000,3),
(4,'Cristiano','Ronaldo',7,'1985-02-05',39,'Striker','Portugal',90000,4),
(5,'Neymar','Junior',11,'1992-02-05',32,'Left Winger','Brazil',100000,5);

INSERT INTO revenue VALUES
(1,1,20000,30000),
(2,2,30000,40000),
(3,3,40000,50000),
(4,4,50000,60000),
(5,5,60000,70000);

-- Add stadium foreign key to club
ALTER TABLE football_club ADD s_id INT;
UPDATE football_club SET s_id = 1 WHERE club_id = 1;
UPDATE football_club SET s_id = 2 WHERE club_id = 2;
UPDATE football_club SET s_id = 3 WHERE club_id = 3;
UPDATE football_club SET s_id = 4 WHERE club_id = 4;
UPDATE football_club SET s_id = 5 WHERE club_id = 5;
ALTER TABLE football_club ADD CONSTRAINT fk_stadium FOREIGN KEY (s_id) REFERENCES stadium(s_id);

-- ============================================================
-- 🔥 CREATE LOG TABLES (Must be created BEFORE triggers)
-- ============================================================

CREATE TABLE salary_log (
    log_id INT AUTO_INCREMENT PRIMARY KEY,
    player_id INT,
    old_salary DECIMAL(10,2),
    new_salary DECIMAL(10,2),
    change_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE revenue_log (
    log_id INT AUTO_INCREMENT PRIMARY KEY,
    rev_id INT,
    old_ticket DECIMAL(10,2),
    new_ticket DECIMAL(10,2),
    old_jersey DECIMAL(10,2),
    new_jersey DECIMAL(10,2),
    changed_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- 🔥 CREATE TRIGGERS
-- ============================================================

DELIMITER $$

CREATE TRIGGER after_salary_update
AFTER UPDATE ON player
FOR EACH ROW
BEGIN
    IF OLD.salary <> NEW.salary THEN
        INSERT INTO salary_log (player_id, old_salary, new_salary)
        VALUES (OLD.p_id, OLD.salary, NEW.salary);
    END IF;
END$$

CREATE TRIGGER after_revenue_update
AFTER UPDATE ON revenue
FOR EACH ROW
BEGIN
    IF OLD.ticket_sales <> NEW.ticket_sales OR OLD.jersey_sales <> NEW.jersey_sales THEN
        INSERT INTO revenue_log (rev_id, old_ticket, new_ticket, old_jersey, new_jersey)
        VALUES (OLD.rev_id, OLD.ticket_sales, NEW.ticket_sales, OLD.jersey_sales, NEW.jersey_sales);
    END IF;
END$$

DELIMITER ;

-- ============================================================
-- 🧮 STORED FUNCTION
-- ============================================================

DELIMITER $$

CREATE FUNCTION get_total_revenue(c_id INT)
RETURNS DECIMAL(10,2)
DETERMINISTIC
BEGIN
    DECLARE total DECIMAL(10,2);
    SELECT (ticket_sales + jersey_sales) INTO total FROM revenue WHERE club_id = c_id;
    RETURN total;
END$$

DELIMITER ;

-- ============================================================
-- 👁️ VIEWS
-- ============================================================

CREATE VIEW player_club_view AS
SELECT p.p_id, p.f_name, p.l_name, p.position, f.name AS club_name, p.salary
FROM player p
JOIN football_club f ON p.club_id = f.club_id;

CREATE VIEW top_players AS
SELECT f_name, l_name, salary
FROM player
WHERE salary > 70000;

-- ============================================================
-- ✅ TEST TRIGGERS
-- ============================================================

-- Test salary trigger
UPDATE player SET salary = salary + 2000 WHERE p_id = 5;

-- Test revenue trigger  
UPDATE revenue SET ticket_sales = 95000 WHERE rev_id = 2;

-- ============================================================
-- 📊 VERIFICATION QUERIES
-- ============================================================

-- Verify all tables exist
SHOW TABLES;

-- Count records in each table
SELECT 'football_club' AS table_name, COUNT(*) AS record_count FROM football_club
UNION ALL
SELECT 'stadium', COUNT(*) FROM stadium
UNION ALL
SELECT 'player', COUNT(*) FROM player
UNION ALL
SELECT 'revenue', COUNT(*) FROM revenue
UNION ALL
SELECT 'salary_log', COUNT(*) FROM salary_log
UNION ALL
SELECT 'revenue_log', COUNT(*) FROM revenue_log;

-- Check triggers exist
SHOW TRIGGERS;

-- Check views exist
SHOW FULL TABLES WHERE TABLE_TYPE LIKE 'VIEW';

-- ============================================================
-- ✅ END OF SCRIPT - DATABASE READY TO USE!
-- ============================================================