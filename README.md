# RT04-Capstone

## Spring Boot Backend

### Setup

1. Create MySQL8 databases: **retaildb** and **retaildbtest**
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
7. Fill in user as `root`, password as `password`, database as `retaildb` and click OK.
8. Repeat step 7 for and change the database to `retaildbtest`.
9. Ensure that project can run (right click RetailbackendApplication > Run, or use run button at top left)
10. Ensure tables are created in database by inspecting `retaildb@localhost` in the `Database` tab
11. Double tap `Shift` button and search for `Maven` and click on the `Maven` action
12. Right click `retailbackend` and click `reimport`.
13. Double tap `Shift` button and search for `Edit configurations` and click on the `Edit configurations` action
14. On the left bar, click Spring Boot, RetailbackendApplication.
15. Under the Environment, VM Options, fill in `-Dspring.profiles.active=dev` and click OK.
    <br/>
    <br/>

### Preloading Data

1. This will be done automatically you run the application. This will create all database tables and fill with preloaded information.
2. Call API: GET http://localhost:8080/api/product/updateAlgolia. This will update the Algolia search index with our product information.
3. Run update1000.sql in src/main/resources/scripts. This will preload stocks to be used for preloading transactions.
4. Call API: GET http://localhost:8080/api/transaction/generateTestTransactions/400, where 400 is the number of transactions to preload.
5. Run randomTxnDate.sql in src/main/resources/scripts. This will randomise the preloaded transactions' dates.
6. Call API: GET http://localhost:8080/api/reservation/generateTestReservations/400, where 400 is the number of reservations to preload.
7. Run update.sql in src/main/resources/scripts. This will preload the appropriate stock data.

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

| Username                 | Password | Department          |
| ------------------------ | -------- | ------------------- |
| HRSTAFF42                | password | HR                  |
| SalesMarketingManager56  | password | Sales and Marketing |
| SalesMarketing44         | password | Sales and Marketing |
| WarehouseManager66       | password | Warehouse           |
| Warehouse40              | password | Warehouse           |
| Store1Manager46          | password | Store               |
| Store1Assistant64        | password | Store               |
| Store2Manager62          | password | Store               |
| Store2Assistant48        | password | Store               |
| Deliverymanager50        | password | Delivery            |
| Deliveryguy68            | password | Delivery            |
| CustomerServiceManager60 | password | Customer Service    |
| Customerservice52        | password | Customer Service    |

<br/>
<br/>

## Customer Web App

### Setup

1. From the root folder of `RT04-Capstone`, navigate to customer-web-app folder by `cd frontend/customer-web-app`
2. Run the following command to get started.

```
npm install
npm start
```

3. If staff web app is being run concurrently, run PORT={OTHER_PORT} `npm start` to run customer web app on another port.

### Using the website

1. Register an account and verify the account using the link sent to the registered email
2. Start shopping!

<br/>
<br/>

## Staff Mobile App

### Setup

1. From the root folder of `RT04-Capstone`, navigate to staff-mobile-app folder by `cd frontend/staff-mobile-app`
2. At the root of the folder, find `config.js` and change the **IP_ADDR** to your laptop's IP address. (Using command line on Windows, type `ipconfig` and find IPv4 address)
3. Navigate to `src/constants/routes.js`
4. Uncomment line 3 and comment out line 5 in order to run the mobile application on localhost
5. Install expo-cli with `npm install -g expo-cli` if you do not have expo-cli installed.
6. Run the following command to get started

```
npm install
expo start
```

### Using the mobile app

1. Ensure that you are using an Android phone to run the application.
2. Install [Expo](https://play.google.com/store/apps/details?id=host.exp.exponent&hl=en_SG) from Google Play Store if you do not have Expo installed
3. Ensure that the laptop that is hosting the customer mobile application is using the same network as the mobile phone
4. Open Expo app on your Android mobile phone once installation is complete.
5. Click **Scan QR Code** and scan the QR code generated from `expo start`
6. The Javascript bundle will be built and might take a while when accessing the app for the first time.
7. Once the build is done, the login page will be shown and login with the preconfigured roles with username and password combination specified below

| Username          | Password | Department |
| ----------------- | -------- | ---------- |
| Store1Manager46   | password | Store      |
| Store1Assistant64 | password | Store      |
| Store2Manager62   | password | Store      |
| Store2Assistant48 | password | Store      |
| Deliveryguy68     | password | Delivery   |

8. Allow permission (camera) when prompted in order for the mobile application to work.

<br/>
<br/>

## Customer Mobile App

### Setup

1. From the root folder of `RT04-Capstone`, navigate to customer-mobile-app folder by `cd frontend/customer-mobile-app`
2. At the root of the folder, find `config.js` and change the **IP_ADDR** to your laptop's IP address. (Using command line on Windows, type `ipconfig` and find IPv4 address)
3. Navigate to `src/constants/routes.js`
4. Uncomment line 3 and comment out line 5 in order to run the mobile application on localhost
5. Install expo-cli with `npm install -g expo-cli` if you do not have expo-cli installed.
6. Run the following command to get started

```
npm install
expo start
```

### Using the mobile app

1. Ensure that you are using an Android phone to run the application.
2. Install [Expo](https://play.google.com/store/apps/details?id=host.exp.exponent&hl=en_SG) from Google Play Store if you do not have Expo installed
3. Ensure that the laptop that is hosting the customer mobile application is using the same network as the mobile phone
4. Open Expo app on your Android mobile phone once installation is complete.
5. Click **Scan QR Code** and scan the QR code generated from `expo start`
6. The Javascript bundle will be built and might take a while when accessing the app for the first time
7. Once the build is done, login with your account registered on the customer web app.
8. Allow permission (camera) when prompted in order for the mobile application to work.
9. Start shopping!
