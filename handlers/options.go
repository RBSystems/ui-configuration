package handlers

import (
	"net/http"

	"github.com/byuoitav/common/db"
	"github.com/byuoitav/common/log"
	"github.com/labstack/echo"
)

// GetIcons retrieves the list of icons from the database.
func GetIcons(context echo.Context) error {
	iconList, err := db.GetDB().GetIcons()
	if err != nil {
		log.L.Errorf("[ui-config] There was a problem getting the icon list : %v", err.Error())
		return context.JSON(http.StatusInternalServerError, err)
	}

	return context.JSON(http.StatusOK, iconList)
}

// GetTemplate returns a template of a UIConfig file.
func GetTemplate(context echo.Context) error {
	id := context.Param("id")
	template, err := db.GetDB().GetTemplate(id)
	if err != nil {
		log.L.Errorf("[ui-config] There was a problem getting the %s template : %v", id, err.Error())
		return context.JSON(http.StatusInternalServerError, err)
	}

	return context.JSON(http.StatusOK, template)
}
