package handlers

import (
	"bytes"
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
	log.Printf("-- We made it past Echo!! --")
	building := context.Param("building")
	room := context.Param("room")
	url := os.Getenv("UI_CONFIGURATION_ADDRESS")

	url = strings.Replace(url, "BUILDING", building, 1)
	url = strings.Replace(url, "ROOM", room, 1)

	//Prepared response in case the file is not found.

	client := &http.Client{}
	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		log.Printf("GET request failed for %s: %s", url, err)
		msg := fmt.Sprintf("GET request failed for %s: %s", url, err)
		return context.JSON(http.StatusInternalServerError, fmt.Sprintf("%s - request error", msg))
	}
	req.Header.Set("Content Type", "application/json")
	resp, err := client.Do(req)
	if err != nil {
		log.Printf("GET request failed for %s: %s", url, err)
		msg := fmt.Sprintf("GET request failed for %s: %s", url, err)
		return context.JSON(http.StatusInternalServerError, fmt.Sprintf("%s - request error", msg))
	}
	defer resp.Body.Close()

	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		log.Printf("Cannot read body from %s: %s", url, err)
		msg := fmt.Sprintf("Cannot read body from %s: %s", url, err)
		return context.JSON(http.StatusBadRequest, fmt.Sprintf("%s - read error", msg))
	}

	var config uiconfig.UIConfig
	err = json.Unmarshal(body, &config)
	if err != nil {
		log.Printf("Cannot unmarshal body from %s: %s", url, err)
		msg := fmt.Sprintf("Cannot unmarshal body from %s: %s", url, err)
		return context.JSON(http.StatusInternalServerError, fmt.Sprintf("%s - JSON error - %s", msg, err.Error()))
	}

	return context.JSONPretty(http.StatusOK, config, "   ")
}

//PutUIConfig -- Handler to put a UI config file into the database.
func PutUIConfig(context echo.Context) error {
	building := context.Param("building")
	room := context.Param("room")
	url := os.Getenv("UI_CONFIGURATION_ADDRESS")

	url = strings.Replace(url, "BUILDING", building, 1)
	url = strings.Replace(url, "ROOM", room, 1)

	config, err := ioutil.ReadAll(context.Request().Body)
	if err != nil {
		log.Printf("Cannot read JSON from request.")
		return context.JSON(http.StatusInternalServerError, err.Error())
	}

	client := &http.Client{}
	req, err := http.NewRequest(http.MethodPut, url, bytes.NewReader(config))
	if err != nil {
		log.Printf("Failed to make PUT request for %s: %s", url, err)
		return context.JSON(http.StatusBadRequest, err.Error())
	}

	req.Header.Set("Content-Type", "application/json")
	resp, err := client.Do(req)
	if err != nil {
		log.Printf("PUT request failed for %s: %s", url, err)
		return context.JSON(http.StatusInternalServerError, err.Error())
	}

	defer resp.Body.Close()

	if resp.StatusCode/100 != 2 {
		log.Printf("Non-200 response received: %v", resp.StatusCode)

		body, err := ioutil.ReadAll(resp.Body)
		if err != nil {
			log.Printf("Could not read body: %v", err.Error())
			return context.JSON(http.StatusInternalServerError, err.Error())
		}

		return context.JSON(http.StatusInternalServerError, body)
	}

	return context.JSON(http.StatusOK, fmt.Sprintf("Config file added for %s %s", building, room))
}
