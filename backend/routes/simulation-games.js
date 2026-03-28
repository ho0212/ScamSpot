import express from 'express'
import pool from '../config/database.js'

const router = express.Router()

router.get('/test', (req, res) => {
  res.json({ message: 'Route is working!' })
})

// Get 10 random true/false questions
router.get('/true-false', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT * FROM true_false
      ORDER BY RANDOM()
      LIMIT 10
    `)

    res.json({
      success: true,
      count: result.rows.length,
      questions: result.rows
    })
  } catch (error) {
    console.error('Error fetching true/false questions:', error)
    res.status(500).json({ error: 'Failed to fetch true/false questions' })
  }
})

// Get click and match questions - returns one complete set (5 items)
router.get('/click-match', async (req, res) => {
  try {
    // First, get all available set numbers, then pick one randomly in JavaScript
    const setsResult = await pool.query(`
      SELECT DISTINCT set FROM click_match
    `)

    if (setsResult.rows.length === 0) {
      return res.status(404).json({ error: 'No click and match sets found' })
    }

    // Pick a random set from the available sets
    const availableSets = setsResult.rows.map(row => row.set)
    const randomIndex = Math.floor(Math.random() * availableSets.length)
    const setNumber = availableSets[randomIndex]

    //Get all items from that set
    const result = await pool.query(`
      SELECT * FROM click_match
      WHERE set = $1
      ORDER BY id
    `, [setNumber])


    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'No items found for selected set' })
    }

    // Prepare the data for the game
    const items = result.rows.map(item => ({
      id: item.id,
      set: item.set,
      scenario: item.scenario,
      class: item.class
    }))


    // Create shuffled arrays for the game
    const scenarios = items.map(item => ({
      id: item.id,
      text: item.scenario
    }))

    const classes = [...items.map(item => ({
      id: item.id,
      text: item.class
    }))].sort(() => Math.random() - 0.5) // Shuffle the classes

    res.json({
      success: true,
      setNumber: setNumber,
      count: items.length,
      scenarios: scenarios,
      classes: classes,
      correctMatches: items.map(item => ({
        id: item.id,
        scenario: item.scenario,
        class: item.class
      }))
    })
  } catch (error) {
    console.error('Error fetching click and match questions:', error)
    res.status(500).json({ error: 'Failed to fetch click and match questions' })
  }
})

router.get('/choose-clue', async (req, res) => {
  try {
    // Emails
    const emailQuery = `
      SELECT
        e.id as id,
        'email' as type,
        e.sender,
        e.address,
        e.subject,
        e.content,
        JSON_AGG(
          JSON_BUILD_OBJECT(
            'id', eha.id,
            'content', eha.content,
            'explanation', eha.explanation,
            'is_red_flag', eha.is_red_flag
          )
        ) as highlighted_areas
      FROM email e
      JOIN email_highlighted_area eha ON e.id = eha.email_id
      GROUP BY e.id, e.sender, e.address, e.subject, e.content
      ORDER BY RANDOM()
      LIMIT 3
    `;

    // SMS
    const smsQuery = `
      SELECT
        s.id as id,
        'sms' as type,
        s.phone_number,
        s.content,
        JSON_AGG(
          JSON_BUILD_OBJECT(
            'id', sha.id,
            'content', sha.content,
            'explanation', sha.explanation,
            'is_red_flag', sha.is_red_flag
          )
        ) as highlighted_areas
      FROM sms s
      JOIN sms_highlighted_area sha ON s.id = sha.sms_id
      GROUP BY s.id, s.phone_number, s.content
      ORDER BY RANDOM()
      LIMIT 2
    `;

    const [emails, sms] = await Promise.all([
      pool.query(emailQuery),
      pool.query(smsQuery)
    ]);

    // Combine and randomize
    const combined = [...emails.rows, ...sms.rows]
    combined.sort(() => Math.random() - 0.5) // shuffle
    const selected = combined.slice(0, 5) // pick 5 for game

    res.json({
      success: true,
      data: selected
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ success: false, message: 'Failed to fetch game data' })
  }
});

export default router
