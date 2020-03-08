# RT04-Capstone

## Spring Boot Backend 
### Setup
1. Create MySQL8 databases: retaildb and retaildbtest
   ```
   create schema retaildb`;
   create schema retaildbtest`;
   ```
2. Clone repository
   `git clone https://github.com/shawnrpnus/RT04-Capstone.git`
3. Open IntelliJ > Import Project> navigate to RT04-Capstone/backend/pom.xml 
4. Install the Lombok Plugin for IntelliJ: follow steps in https://projectlombok.org/setup/intellij
5. Double tap `Shift` button and search for `Database` and click on the `Database` action
6. Select New > Datasource > MySQL
7. Fill in user as `root`, password as `password`, database as `retaildb` and press OK.
8. Repeat step 7 for and change the database to `retaildbtest`.
9. Ensure that project can run (right click RetailbackendApplication > Run, or use run button at top left)
10. Ensure tables are created in database by inspecting `retaildb@localhost` in the `Database` tab
<br/>
<br/>

## Node.js Backend
### Setup
1. From the root folder of `RT04-Capstone`, navigate to node-backend folder by `cd node-backend`
2. Using terminal that support npm command, run `npm install` when running for the first time
3. Create a `uploads` folder in the root folder of `node-backend`
4. Manually add in the `.env` file that is attached in the submission folder in the root folder of `node-backend` and ensure that the file is named `.env` with the `.` in front of the file name.
5. Run `node app.js` and you will see `Listening on port 5000...` in the terminal upon successful starting of the programme.
<br/>
<br/>

## Staff Web App
### Setup
1. From the root folder of `RT04-Capstone`, navigate to staff-web-app folder by `cd frontend/staff-web-app`
2. Run the following command to get started
```
npm install
npm start
```
### Using the website
1. Login with the preconfigured roles with username and password combination specified below

| Username | Password | Department |
| -------- | -------- | ---------- |
| Warehouse42 | password | Warehouse |
| ITStaff44 | password | IT |
| HRStaff46 | password | HR |
| SalesMarketing48 | password | Sales and Marketing | 
| Store50 | password | Store |
<br/>
<br/>

## Customer Web App
### Setup
1. From the root folder of `RT04-Capstone`, navigate to customer-web-app folder by `cd frontend/customer-web-app`
2. Run the following command to get started
```
npm install
npm start
```

### Using the website
1. Register an account and verify the account using the link sent to the registered email
2. Start shopping!
