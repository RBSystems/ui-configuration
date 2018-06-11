package handlers

import (
	"fmt"
	"net/http"

	"github.com/byuoitav/common/db"
	"github.com/byuoitav/common/log"
	"github.com/labstack/echo"
)

// GetDevicesByRoom finds all devices in the room from the database.
// ...I actually haven't used this yet.
func GetDevicesByRoom(context echo.Context) error {
	building := context.Param("building")
	room := context.Param("room")

	devices, err := db.GetDB().GetDevicesByRoom(fmt.Sprintf("%s-%s", building, room))
	if err != nil {
		return context.JSON(http.StatusInternalServerError, err.Error())
	}

	return context.JSON(http.StatusOK, devices)
}

// GetDevicesInRoomByRole finds all the devices of a specific type in this room.
// This one seems more effective for the config tool...
func GetDevicesInRoomByRole(context echo.Context) error {
	building := context.Param("building")
	room := context.Param("room")
	role := context.Param("role")
	roomID := fmt.Sprintf("%s-%s", building, room)

	log.L.Infof("[ui-config] Trying to get %s devices in %s", role, roomID)

	devices, err := db.GetDB().GetDevicesByRoomAndRole(roomID, role)
	if err != nil {
		return context.JSON(http.StatusInternalServerError, err.Error())
	}

	names := make([]string, len(devices))

	for i, d := range devices {
		names[i] = d.Name
	}

	log.L.Infof("[ui-config] Got %s devices for %s", role, roomID)

	return context.JSON(http.StatusOK, names)
}
