# MSW JSON Config reference

## JsonConfigHandler

Response configuration.

_Object containing the following properties:_

| Property          | Description                                        | Type                                                                                                                                                                                                                 |
| :---------------- | :------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`method`** (\*) | HTTP method to intercept.                          | `'GET' \| 'POST' \| 'PUT' \| 'DELETE' \| 'PATCH' \| 'HEAD' \| 'OPTIONS'`                                                                                                                                             |
| **`body`** (\*)   | Response's body. Can be a string or a JSON object. | _Object with properties:_<ul></ul> _or_ `string`                                                                                                                                                                     |
| **`init`** (\*)   | Response init object.                              | _Object with properties:_<ul><li>`headers`: _Object with properties:_<ul><li>`Content-Type`: `string`</li></ul> - Response headers.</li><li>`status`: `number` (_int, ≥100, ≤599_) - Response status code.</li></ul> |

_(\*) Required._

## JsonConfig

JSON configuration schema.

_Object containing the following properties:_

| Property            | Description                                                                                                | Type                                                                                                     |
| :------------------ | :--------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------- |
| **`version`** (\*)  | Major version of the config. If it changes, the config should not be compatible with the previous version. | `1`                                                                                                      |
| **`name`** (\*)     | Name of the config. This name displayed in the extension's list of configs. Should be unique per host.     | `string` (_min length: 3, max length: 50_)                                                               |
| **`handlers`** (\*) | List of handlers to intercept.                                                                             | _Object with dynamic keys of type_ `string` _and values of type_ [JsonConfigHandler](#jsonconfighandler) |

_(\*) Required._
