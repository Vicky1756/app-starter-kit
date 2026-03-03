package controller

import (
	"app-stater-kit/backend/packages/models"
	"database/sql"
	"fmt"
	"net/http"
	"os"
	"time"

	"github.com/dgrijalva/jwt-go"
	"github.com/labstack/echo/v4"
)

func Login(c echo.Context, dbConn *sql.DB) error {
	req := new(models.LoginRequest)
	if err := c.Bind(req); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"message": "Invalid request"})
	}

	var dbUser models.User
	// Using the query logic you established
	err := dbConn.QueryRow("SELECT id, name, email, password FROM users WHERE email = $1", req.Email).Scan(&dbUser.ID, &dbUser.Name, &dbUser.Email, &dbUser.Password)

	if err == sql.ErrNoRows {
		return c.JSON(http.StatusUnauthorized, map[string]string{"message": "Invalid email or password"})
	} else if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"message": "Database error"})
	}

	// Create the JWT Claims
	claims := &jwt.StandardClaims{
		Subject:   fmt.Sprintf("%d", dbUser.ID),
		ExpiresAt: time.Now().Add(time.Hour * 72).Unix(),
	}

	// Sign the token
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	t, err := token.SignedString([]byte(os.Getenv("JWT_SECRET")))
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"message": "Could not generate token"})
	}

	// Set JWT as a Cookie
	cookie := new(http.Cookie)
	cookie.Name = "access_token"
	cookie.Value = t
	cookie.Expires = time.Now().Add(72 * time.Hour)
	cookie.HttpOnly = true // Prevents JavaScript access (XSS protection)
	cookie.Secure = false  // Set to true only if using HTTPS
	cookie.Path = "/"
	cookie.SameSite = http.SameSiteLaxMode // CSRF protection

	c.SetCookie(cookie)

	// Return user info.
	return c.JSON(http.StatusOK, models.UserResponseWithTokens{
		ID:          dbUser.ID,
		Name:        dbUser.Name,
		Email:       dbUser.Email,
		AccessToken: t,
	})
}
