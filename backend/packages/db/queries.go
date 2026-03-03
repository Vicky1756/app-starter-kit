package db

const (
	LoginQuery    = `SELECT id, name, email, password FROM users WHERE email = $1`
	Registerquery = `INSERT INTO users (name, email, password, created_at, updated_at) 
              VALUES ($1, $2, $3, $4, $5) RETURNING id`
	CheckUserExistsQuery = `SELECT COUNT(*) FROM users WHERE email = $1`
)
