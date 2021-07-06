# DashboardServer
## Running the system

* Clone the repo
* Install mongoDB
* Start the mongoDB service
* Enter credentials into the .env.sample file and rename it to .env or do git secret reveal if you are a member
* Run `npm ci`
* On one terminal session run `npm run watch-ts`
* On another terminal session run `npm run watch-node`
* View at `localhost:3000`

* Donot run `npm install` since this will update the package-lock.json file and create discrepancies
