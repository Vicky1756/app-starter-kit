package db

const (
	LoginQuery = "SELECT id, name, email, password FROM users WHERE email = $1"
)
