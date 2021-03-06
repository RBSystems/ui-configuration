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
	router.POST("/add/:building/:room", handlers.CreateUIConfig)
	router.PUT("/update/:building/:room", handlers.UpdateUIConfig)

	router.GET("/devices/:building/:room/:role", handlers.GetDevicesInRoomByRole)
	router.GET("/icons", handlers.GetIcons)
	router.GET("/template/:id", handlers.GetTemplate)

	router.Static("/", "ui-config-tool/dist")
	router.Static("/newroom", "ui-config-tool/dist")
	router.Static("/editroom", "ui-config-tool/dist")

	router.StartServer(&server)
}
