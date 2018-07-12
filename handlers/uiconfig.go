package handlers

import (
	"fmt"
	"net/http"

	"github.com/byuoitav/common/db"
	"github.com/byuoitav/common/log"
	"github.com/byuoitav/common/structs"

	"github.com/labstack/echo"
)

// GetUIConfig -- Handler to get a UI config file from the database.
func GetUIConfig(context echo.Context) error {
	building := context.Param("building")
	room := context.Param("room")
	roomID := fmt.Sprintf("%s-%s", building, room)

	config, err := db.GetDB().GetUIConfig(roomID)
	if err != nil {
		log.L.Errorf("[ui-config] Failed to get config file for %s : %s", roomID, err.Error())
		return context.JSONPretty(http.StatusInternalServerError, err, "   ")
	}

	return context.JSONPretty(http.StatusOK, config, "   ")
}

// CreateUIConfig -- Handler to put a UI config file into the database.
func CreateUIConfig(context echo.Context) error {
	roomID := fmt.Sprintf("%s-%s", context.Param("building"), context.Param("room"))
	var ui structs.UIConfig

	err := context.Bind(&ui)

	toReturn, err := db.GetDB().CreateUIConfig(roomID, ui)
	if err != nil {
		log.L.Errorf("[ui-config] Failed to create config file for %s : %s", roomID, err.Error())
		return context.JSON(http.StatusInternalServerError, err.Error())
	}

	log.L.Infof("[ui-config] Successfully created ui config for %s", roomID)

	return context.JSON(http.StatusOK, toReturn)
}

// UpdateUIConfig -- Handler to update a UIConfig file in the database.
func UpdateUIConfig(context echo.Context) error {
	log.L.Info("start of update function")
	roomID := fmt.Sprintf("%s-%s", context.Param("building"), context.Param("room"))
	var ui structs.UIConfig

	err := context.Bind(&ui)
	if err != nil {
		log.L.Errorf("[ui-config] Error binding to ui config : %v", err.Error())
		return context.JSON(http.StatusBadRequest, err.Error())
	}

	log.L.Infof("The bound config is: %v", ui)
	toReturn, err := db.GetDB().UpdateUIConfig(roomID, ui)
	if err != nil {
		log.L.Errorf("[ui-config] Failed to update config file for %s : %s", ui.ID, err.Error())
		return context.JSON(http.StatusInternalServerError, err.Error())
	}

	log.L.Infof("[ui-config] Successfully updated ui config for %s", ui.ID)

	return context.JSON(http.StatusOK, toReturn)
}
