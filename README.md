# RT04-Capstone

## Spring Boot Backend

### Setup

1. Create MySQL8 databases: retaildb and retaildbtest
   ```
   create schema retaildb;
   create schema retaildbtest;
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

### Preloading Data
1. Run the application. This will create all database tables and fill with some preloaded information. 
2. Call API: GET http://localhost:8080/api/product/updateAlgolia. This will update the Algolia search index with our product information. 
3. Run update1000.sql in src/main/resources/scripts. This will preload stocks to be used for preloading transactions.
4. Call API: GET http://localhost:8080/api/transaction/generateTestTransactions/300, where 300 is the number of transactions to preload.
5. Run randomTxnDate.sql in src/main/resources/scripts. This will randomise the preloaded transactions' dates.
6. Run update.sql in src/main/resources/scripts. This will preload the appropriate stock data.

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

| Username         | Password | Department          |
| ---------------- | -------- | ------------------- |
| Warehouse43      | password | Warehouse           | 
| HRStaff45        | password | HR                  | 
| SalesMarketing47 | password | Sales and Marketing | 
| Store1Staff49    | password | Store               | 
| Store2Staff51    | password | Store               | 
| Deliveryguy53    | password | Delivery            | 
| Customerservice55| password | Customer Service    | 

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

<br/>
<br/>

## Staff Mobile App

### Setup

1. From the root folder of `RT04-Capstone`, navigate to staff-mobile-app folder by `cd frontend/staff-mobile-app`
2. Run the following command to get started

```
npm install -g expo-cli
npm install
expo start
```

### Using the mobile app

1. Login with the preconfigured roles with username and password combination specified below

| Username         | Password | Department          |
| ---------------- | -------- | ------------------- |
| Store1Staff49    | password | Store               | 
| Store2Staff51    | password | Store               | 

<br/>
<br/>

## Customer Mobile App

### Setup

1. From the root folder of `RT04-Capstone`, navigate to customer-mobile-app folder by `cd frontend/customer-mobile-app`
2. Run the following command to get started

```
npm install
expo start
```

### Using the mobile app

1. Login with your account registered on the customer web app.
2. Start shopping!
