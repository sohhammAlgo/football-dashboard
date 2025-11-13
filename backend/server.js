// server.js
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MySQL Connection Pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'football_database',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

const promisePool = pool.promise();

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key_here';

// ==================== MIDDLEWARE ====================

// Authentication Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// ==================== AUTH ROUTES ====================

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // For demo purposes - in production, check against users table
    if (username === 'admin' && password === 'admin123') {
      const token = jwt.sign(
        { id: 1, username: 'admin' },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.json({
        success: true,
        token,
        user: { id: 1, username: 'admin' }
      });
    } else {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ==================== PLAYER ROUTES ====================

// Get all players with club info
app.get('/api/players', authenticateToken, async (req, res) => {
  try {
    const [rows] = await promisePool.query(`
      SELECT 
        p.p_id as id,
        p.f_name as firstName,
        p.l_name as lastName,
        p.jersey_no as jersey,
        p.DOB as dob,
        p.age,
        p.position,
        p.nationality,
        p.salary,
        p.club_id as clubId,
        f.name as clubName,
        TIMESTAMPDIFF(YEAR, p.DOB, CURDATE()) as calculatedAge
      FROM player p
      LEFT JOIN football_club f ON p.club_id = f.club_id
      ORDER BY p.p_id
    `);
    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get single player
app.get('/api/players/:id', authenticateToken, async (req, res) => {
  try {
    const [rows] = await promisePool.query(`
      SELECT 
        p.p_id as id,
        p.f_name as firstName,
        p.l_name as lastName,
        p.jersey_no as jersey,
        p.DOB as dob,
        p.age,
        p.position,
        p.nationality,
        p.salary,
        p.club_id as clubId,
        f.name as clubName
      FROM player p
      LEFT JOIN football_club f ON p.club_id = f.club_id
      WHERE p.p_id = ?
    `, [req.params.id]);

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Player not found' });
    }

    res.json({ success: true, data: rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Add new player
app.post('/api/players', authenticateToken, async (req, res) => {
  try {
    const { firstName, lastName, jersey, dob, position, nationality, salary, clubId } = req.body;
    
    // Calculate age
    const [ageResult] = await promisePool.query(
      'SELECT TIMESTAMPDIFF(YEAR, ?, CURDATE()) as age',
      [dob]
    );
    const age = ageResult[0].age;

    const [result] = await promisePool.query(
      `INSERT INTO player (f_name, l_name, jersey_no, DOB, age, position, nationality, salary, club_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [firstName, lastName, jersey, dob, age, position, nationality, salary, clubId]
    );

    res.status(201).json({
      success: true,
      message: 'Player added successfully',
      data: { id: result.insertId }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update player
app.put('/api/players/:id', authenticateToken, async (req, res) => {
  try {
    const { firstName, lastName, jersey, dob, position, nationality, salary, clubId } = req.body;
    
    // Calculate age
    const [ageResult] = await promisePool.query(
      'SELECT TIMESTAMPDIFF(YEAR, ?, CURDATE()) as age',
      [dob]
    );
    const age = ageResult[0].age;

    await promisePool.query(
      `UPDATE player 
       SET f_name = ?, l_name = ?, jersey_no = ?, DOB = ?, age = ?, 
           position = ?, nationality = ?, salary = ?, club_id = ?
       WHERE p_id = ?`,
      [firstName, lastName, jersey, dob, age, position, nationality, salary, clubId, req.params.id]
    );

    res.json({ success: true, message: 'Player updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete player
app.delete('/api/players/:id', authenticateToken, async (req, res) => {
  try {
    await promisePool.query('DELETE FROM player WHERE p_id = ?', [req.params.id]);
    res.json({ success: true, message: 'Player deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get players by position
app.get('/api/players/filter/position/:position', authenticateToken, async (req, res) => {
  try {
    const [rows] = await promisePool.query(
      'SELECT * FROM player WHERE position = ?',
      [req.params.position]
    );
    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get players by nationality
app.get('/api/players/filter/nationality/:nationality', authenticateToken, async (req, res) => {
  try {
    const [rows] = await promisePool.query(
      'SELECT * FROM player WHERE nationality = ?',
      [req.params.nationality]
    );
    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get top paid players
app.get('/api/players/stats/top-paid', authenticateToken, async (req, res) => {
  try {
    const limit = req.query.limit || 5;
    const [rows] = await promisePool.query(`
      SELECT p.*, f.name as clubName 
      FROM player p
      LEFT JOIN football_club f ON p.club_id = f.club_id
      ORDER BY p.salary DESC 
      LIMIT ?
    `, [parseInt(limit)]);
    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ==================== CLUB ROUTES ====================

// Get all clubs with stadium info
app.get('/api/clubs', authenticateToken, async (req, res) => {
  try {
    const [rows] = await promisePool.query(`
      SELECT 
        c.club_id as id,
        c.name,
        c.crest,
        c.jersey,
        c.s_id as stadiumId,
        s.s_name as stadiumName,
        s.country as stadiumCountry,
        s.city as stadiumCity,
        s.capacity as stadiumCapacity
      FROM football_club c
      LEFT JOIN stadium s ON c.s_id = s.s_id
      ORDER BY c.club_id
    `);
    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get single club with players
app.get('/api/clubs/:id', authenticateToken, async (req, res) => {
  try {
    const [clubRows] = await promisePool.query(`
      SELECT 
        c.club_id as id,
        c.name,
        c.crest,
        c.jersey,
        c.s_id as stadiumId,
        s.s_name as stadiumName,
        s.country as stadiumCountry,
        s.city as stadiumCity,
        s.capacity as stadiumCapacity
      FROM football_club c
      LEFT JOIN stadium s ON c.s_id = s.s_id
      WHERE c.club_id = ?
    `, [req.params.id]);

    if (clubRows.length === 0) {
      return res.status(404).json({ success: false, message: 'Club not found' });
    }

    const [playerRows] = await promisePool.query(
      'SELECT * FROM player WHERE club_id = ?',
      [req.params.id]
    );

    res.json({
      success: true,
      data: {
        ...clubRows[0],
        players: playerRows
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ==================== STADIUM ROUTES ====================

// Get all stadiums
app.get('/api/stadiums', authenticateToken, async (req, res) => {
  try {
    const [rows] = await promisePool.query(`
      SELECT 
        s_id as id,
        s_name as name,
        country,
        city,
        capacity
      FROM stadium
      ORDER BY s_id
    `);
    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ==================== REVENUE ROUTES ====================

// Get all revenue with club info
app.get('/api/revenue', authenticateToken, async (req, res) => {
  try {
    const [rows] = await promisePool.query(`
      SELECT 
        r.rev_id as id,
        r.club_id as clubId,
        r.ticket_sales as ticketSales,
        r.jersey_sales as jerseySales,
        (r.ticket_sales + r.jersey_sales) as totalRevenue,
        f.name as clubName
      FROM revenue r
      LEFT JOIN football_club f ON r.club_id = f.club_id
      ORDER BY r.rev_id
    `);
    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get revenue by club
app.get('/api/revenue/club/:clubId', authenticateToken, async (req, res) => {
  try {
    const [rows] = await promisePool.query(`
      SELECT 
        r.rev_id as id,
        r.club_id as clubId,
        r.ticket_sales as ticketSales,
        r.jersey_sales as jerseySales,
        (r.ticket_sales + r.jersey_sales) as totalRevenue,
        f.name as clubName
      FROM revenue r
      LEFT JOIN football_club f ON r.club_id = f.club_id
      WHERE r.club_id = ?
    `, [req.params.clubId]);

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Revenue data not found' });
    }

    res.json({ success: true, data: rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update revenue (triggers will log automatically)
app.put('/api/revenue/:clubId', authenticateToken, async (req, res) => {
  try {
    const { ticketSales, jerseySales } = req.body;

    await promisePool.query(
      `UPDATE revenue 
       SET ticket_sales = ?, jersey_sales = ?
       WHERE club_id = ?`,
      [ticketSales, jerseySales, req.params.clubId]
    );

    res.json({ success: true, message: 'Revenue updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get total revenue using stored function
app.get('/api/revenue/total/:clubId', authenticateToken, async (req, res) => {
  try {
    const [rows] = await promisePool.query(
      'SELECT get_total_revenue(?) as totalRevenue',
      [req.params.clubId]
    );
    res.json({ success: true, data: rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ==================== LOGS ROUTES ====================

// Get salary logs
app.get('/api/logs/salary', authenticateToken, async (req, res) => {
  try {
    const [rows] = await promisePool.query(`
      SELECT 
        sl.log_id as id,
        sl.player_id as playerId,
        sl.old_salary as oldSalary,
        sl.new_salary as newSalary,
        sl.change_date as changeDate,
        p.f_name as firstName,
        p.l_name as lastName
      FROM salary_log sl
      LEFT JOIN player p ON sl.player_id = p.p_id
      ORDER BY sl.change_date DESC
    `);
    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get revenue logs
app.get('/api/logs/revenue', authenticateToken, async (req, res) => {
  try {
    const [rows] = await promisePool.query(`
      SELECT 
        rl.log_id as id,
        rl.rev_id as revId,
        rl.old_ticket as oldTicket,
        rl.new_ticket as newTicket,
        rl.old_jersey as oldJersey,
        rl.new_jersey as newJersey,
        rl.changed_on as changedOn,
        r.club_id as clubId,
        f.name as clubName
      FROM revenue_log rl
      LEFT JOIN revenue r ON rl.rev_id = r.rev_id
      LEFT JOIN football_club f ON r.club_id = f.club_id
      ORDER BY rl.changed_on DESC
    `);
    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ==================== VIEWS ROUTES ====================

// Get player club view
app.get('/api/views/player-club', authenticateToken, async (req, res) => {
  try {
    const [rows] = await promisePool.query('SELECT * FROM player_club_view');
    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get top players view
app.get('/api/views/top-players', authenticateToken, async (req, res) => {
  try {
    const [rows] = await promisePool.query('SELECT * FROM top_players');
    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ==================== ANALYTICS ROUTES ====================

// Get upcoming birthdays
app.get('/api/analytics/birthdays', authenticateToken, async (req, res) => {
  try {
    const [rows] = await promisePool.query(`
      SELECT 
        p_id as id,
        f_name as firstName,
        l_name as lastName,
        DOB as dob,
        TIMESTAMPDIFF(YEAR, DOB, CURDATE()) as age,
        MONTH(DOB) as birthMonth,
        DAY(DOB) as birthDay
      FROM player
      WHERE MONTH(DOB) IN (MONTH(CURDATE()), IF(MONTH(CURDATE()) = 12, 1, MONTH(CURDATE()) + 1))
      ORDER BY MONTH(DOB), DAY(DOB)
    `);
    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get age distribution
app.get('/api/analytics/age-distribution', authenticateToken, async (req, res) => {
  try {
    const [rows] = await promisePool.query(`
      SELECT 
        CASE 
          WHEN TIMESTAMPDIFF(YEAR, DOB, CURDATE()) < 25 THEN 'Under 25'
          WHEN TIMESTAMPDIFF(YEAR, DOB, CURDATE()) BETWEEN 25 AND 29 THEN '25-29'
          WHEN TIMESTAMPDIFF(YEAR, DOB, CURDATE()) BETWEEN 30 AND 34 THEN '30-34'
          ELSE '35+'
        END as ageGroup,
        COUNT(*) as count
      FROM player
      GROUP BY ageGroup
      ORDER BY 
        CASE ageGroup
          WHEN 'Under 25' THEN 1
          WHEN '25-29' THEN 2
          WHEN '30-34' THEN 3
          WHEN '35+' THEN 4
        END
    `);
    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get salary statistics
app.get('/api/analytics/salary-stats', authenticateToken, async (req, res) => {
  try {
    const [rows] = await promisePool.query(`
      SELECT 
        position,
        COUNT(*) as playerCount,
        AVG(salary) as avgSalary,
        MIN(salary) as minSalary,
        MAX(salary) as maxSalary,
        SUM(salary) as totalSalary
      FROM player
      GROUP BY position
      ORDER BY avgSalary DESC
    `);
    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ==================== DASHBOARD STATS ====================

app.get('/api/dashboard/stats', authenticateToken, async (req, res) => {
  try {
    const [playerCount] = await promisePool.query('SELECT COUNT(*) as count FROM player');
    const [clubCount] = await promisePool.query('SELECT COUNT(*) as count FROM football_club');
    const [totalSalary] = await promisePool.query('SELECT SUM(salary) as total FROM player');
    const [totalRevenue] = await promisePool.query('SELECT SUM(ticket_sales + jersey_sales) as total FROM revenue');

    res.json({
      success: true,
      data: {
        totalPlayers: playerCount[0].count,
        totalClubs: clubCount[0].count,
        totalSalaries: totalSalary[0].total,
        totalRevenue: totalRevenue[0].total
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ==================== ERROR HANDLING ====================

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// ==================== START SERVER ====================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📊 API available at http://localhost:${PORT}/api`);
});

module.exports = app;