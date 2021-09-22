# Documentations

1. Get the login status of the current user and returns id
	* Method: `<GET>`
	* Url: `</isloggedin/>`
	* Request body: `<none>`
	* Response Body (JSON Object): `<{"username": "xy6r3kt45"}>`
	* Example: `<curl -X GET http://localhost:3001/isloggedin/>`
	
1. Sign up a user and store info in database
	* Method: `<POST>`
	* Url: `</signup/>`
	* Request body (JSON Object): `<{"username": "user", "password": "pass"}>`
	* Response Body: `<"Success">`
	* Example: `<curl -H 'Content-Type: application/json' -X POST -d "{"username": "user", "password": "pass"}" http://localhost:3001/signup/>`
	
1. Sign in a user
	* Method: `<POST>`
	* Url: `</signin/>`
	* Request body (JSON Object): `<{"username": "user", "password": "pass"}>`
	* Response Body: `<none>`
	* Example: `<curl -H 'Content-Type: application/json' -X POST -d "{"username": "user", "password": "pass"}" http://localhost:3001/signin/>`
	
1. Sign out a user
	* Method: `<GET>`
	* Url: `</signout/>`
	* Request body: `<none>`
	* Response Body: `<"user has been signed out">`
	* Example: `<curl -X GET http://localhost:3001/signout/>`
	
1. Get preference settings of a signed in user
	* Method: `<GET>`
	* Url: `</user/preference/:username>`
	* Request body: `<none>`
	* Response Body: `<{"numCategories": 3, "numRestaurants": 10}>`
	* Example: `<curl -X GET http://localhost:3001/user/preference/user>`
	
1. Modify preference settings of a signed in user
	* Method: `<PATCH>`
	* Url: `</user/preference/>`
	* Request body (JSON Object): `<{"username": "xy6r3kt45", "preference": {"numCategories": 5, "numRestaurants": 15}}>`
	* Response Body: `<none>`
	* Example: `<curl -H 'Content-Type: application/json' -X PATCH -d "{"username": "xy6r3kt45", "preference": {"numCategories": 5, "numRestaurants": 15}}" http://localhost:3001/user/preference/>`
	
1. Get the history of a user
	* Method: `<GET>`
	* Url: `</user/history/:username>`
	* Request body: `<none>`
	* Response Body (JSON Object): `<{"history": [{obj1} ...]}>`
	* Example: `<curl -X GET http://localhost:3001/user/history/user>`
	
1. Modify history of a user
	* Method: `<POST>`
	* Url: `</user/history/>`
	* Request body (JSON Object): `<{"username": "user", "restaurant": [{Obj1} ...]}>`
	* Response Body: `<none>`
	* Example: `<curl -H 'Content-Type: application/json' -X POST -d "{"username": "user", "restaurant": [{Obj1} ...]}" http://localhost:3001/user/history/>`
	
1. Calling Yelp Fusion API for business search
	* Method: `<POST>`
	* Url: `</yelp/find/>`
	* Request body (JSON Object): `<{"latitude": this.state.latitude,
          "longitude": this.state.longitude,
          "location": this.state.location,
          "categories": selected}>`
	* Response Body: `<Results returned from yelp api>`
	* Example: `<curl -H 'Content-Type: application/json' -X POST "{"latitude": this.state.latitude,"longitude": this.state.longitude,"location": this.state.location,"categories": selected}" http://localhost:3001/yelp/find/>`
	
1. Create a group for storing vote data in database
	* Method: `<POST>`
	* Url: `</group/create/>`
	* Request body (JSON Object): `<{"roomNum": "111111", members: 1}>`
	* Response Body: `<none>`
	* Example: `<curl -H 'Content-Type: application/json' -X POST "{"roomNum": "111111", members: 1}" http://localhost:3001/group/create/>`
	
1. Join a group
	* Method: `<POST>`
	* Url: `</group/join/>`
	* Request body (JSON Object): `<{"roomNum": "111111"}>`
	* Response Body: `<none>`
	* Example: `<curl -X POST "{"roomNum": "111111"}" http://localhost:3001/group/join/>`
	
1. Add category vote to database
	* Method: `<POST>`
	* Url: `</group/individual/>`
	* Request body (JSON Object): `<{"roomNum": "111111", "categories": {"chinese": true, "hotdogs": false ...}>`
	* Response Body: `<none>`
	* Example: `<curl -H 'Content-Type: application/json' -X POST "{"roomNum": "111111", "categories": {"chinese": true, "hotdogs": false ...}" http://localhost:3001/group/individual/>`
	
1. Add restaurant vote to database
	* Method: `<POST>`
	* Url: `</group/vote/>`
	* Request body (JSON Object): `<{"roomNum": "111111", restaurants: {..."selection": true}}>`
	* Response Body: `<none>`
	* Example: `<curl -H 'Content-Type: application/json' -X POST "{"roomNum": "111111", restaurants: {..."selection": true}}">`
