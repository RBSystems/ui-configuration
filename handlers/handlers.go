package handlers

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"strings"

	"github.com/byuoitav/touchpanel-ui-microservice/uiconfig"
	"github.com/labstack/echo"
)

//GetUIConfig -- Handler to get a UI config file from the database.
func GetUIConfig(context echo.Context) error {
	building := context.Param("building")
	room := context.Param("room")
	url := os.Getenv("UI_CONFIGURATION_ADDRESS")

	url = strings.Replace(url, "BUILDING", building, 1)
	url = strings.Replace(url, "ROOM", room, 1)

	//Prepared response in case the file is not found.
	msg := fmt.Sprintf("Config file not found for %s %s", building, room)

	resp, err := http.Get(url)
	if err != nil {
		log.Printf("GET request failed for %s: %s", url, err)
		return context.JSON(http.StatusInternalServerError, msg)
	}
	defer resp.Body.Close()

	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		log.Printf("Cannot read body from %s: %s", url, err)
		return context.JSON(http.StatusBadRequest, msg)
	}

	var config uiconfig.UIConfig
	err = json.Unmarshal(body, &config)
	if err != nil {
		log.Printf("Cannot unmarshal body from %s: %s", url, err)
		return context.JSON(http.StatusInternalServerError, msg)
	}

	return context.JSONPretty(http.StatusOK, config, "   ")
}

//PutUIConfig -- Handler to put a UI config file into the database.
func PutUIConfig(context echo.Context) error {
	return nil
}
