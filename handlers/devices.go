package handlers

import (
	"log"
	"net/http"

	"github.com/byuoitav/av-api/dbo"
	"github.com/labstack/echo"
)

func GetDevicesByRoom(context echo.Context) error {
	building := context.Param("building")
	room := context.Param("room")

	devices, err := dbo.GetDevicesByRoom(building, room)
	if err != nil {
		return context.JSON(http.StatusInternalServerError, err.Error())
	}

	return context.JSON(http.StatusOK, devices)
}

func GetTouchPanels(context echo.Context) error {
	log.Print("Trying to get touchpanels")
	building := context.Param("building")
	room := context.Param("room")
	role := "ControlProcessor"

	devices, err := dbo.GetDevicesByBuildingAndRoomAndRole(building, room, role)
	if err != nil {
		return context.JSON(http.StatusInternalServerError, err.Error())
	}

	log.Printf("Got devices for %s %s", building, room)

	var addresses = make([]string, len(devices))
	for i, device := range devices {
		addresses[i] = device.Address
	}

	return context.JSON(http.StatusOK, addresses)
}
