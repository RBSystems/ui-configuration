# ui-configuration
Contains the JSON Object for our UI Configuration. 

## Definitions
Each object defines a hostname, and contains it"s UI Configuration. 

* ``ui``
  * defines which ui to show:
  ```json
    "ui": "circle-default"
  ```
* ``inputdevices``
  * an array of input device objects
    ```json
    {
      "name": "Overflow",
      "icon": "settings_input_hdmi"
    }
    ```
* ``outputdevices``
  * an array of output device objects
  ```json
  {
    "name": "D1",
    "icon": "tv",
    "inputs": [
      "Overflow",
      "HDMIIn"
    ],
    "defaultinput": "AppleTV"
  }
  ```
* ``features``
  * an array of feature names
  ```json
  [
    "display-to-all",
    "power-off-all",
    "group-input"
  ]
  ```
