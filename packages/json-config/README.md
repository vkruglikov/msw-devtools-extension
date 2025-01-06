![Private](https://img.shields.io/badge/status-private-red?)
## @msw-devtools/json-config

JSON config used by the extension to configure the responses.

### Example config
```json
{
  "version": 1,
  "name": "example",
  "handlers": {
    "/profile": {
      "method": "GET",
      "body": {
        "name": "Valentin",
        "surname": "Kruglikov",
        "location": "World"
      },
      "init": {
        "headers": {
          "Content-Type": "application/json"
        }
      }
    },
    "/forbidden": {
      "method": "GET",
      "body": "403 Forbidden",
      "init": {
        "status": 403,
        "headers": {
          "Content-Type": "application/json"
        }
      }
    }
  }
}
```

### ZOD Schema 
[MSW JSON Config reference](./docs/README.md)

### Create your own config
[DEMO page](https://vkruglikov.github.io/msw-devtools-extension/)

