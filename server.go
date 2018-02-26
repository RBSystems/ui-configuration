package main

import (
	"net/http"

	"github.com/byuoitav/ui-configuration/handlers"

	"github.com/byuoitav/authmiddleware"
	"github.com/labstack/echo"
	"github.com/labstack/echo/middleware"
)

func main() {
	port := ":9900"
	router := echo.New()

	router.Pre(middleware.RemoveTrailingSlash())
	router.Use(middleware.CORS())
	router.Use(echo.WrapMiddleware(authmiddleware.Authenticate))

	server := http.Server{
		Addr:           port,
		MaxHeaderBytes: 1024 * 10,
	}

	router.GET("/get/:building/:room", handlers.GetUIConfig)

	router.Static("/", "html")

	router.StartServer(&server)
}
