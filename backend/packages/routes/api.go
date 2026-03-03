package routes

import (
	"app-stater-kit/backend/packages/controller"
	"database/sql"

	"github.com/labstack/echo/v4"
)

func Handlers(e *echo.Echo, db *sql.DB) {

	// Public Routes
	e.GET("/", func(c echo.Context) error { return c.String(200, "Public API") })
	e.POST("/login", func(c echo.Context) error { return controller.Login(c, db) })

	// Protected Routes (Grouped)
	// r := e.Group("/api")
	// r.Use(ValidateJWT) // Everything in this group requires a valid cookie

	// r.GET("/profile", func(c echo.Context) error {
	// 	userID := c.Get("userID") // Easily get the user ID we saved in middleware
	// 	return c.JSON(http.StatusOK, map[string]interface{}{"id": userID, "status": "authenticated"})
}
