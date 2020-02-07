# RT04-Capstone

## Setup
1. Create MySQL8 databases: retaildb and retaildbtest
     - create schema retaildb;
     - create schema retaildbtest;
2. Clone repository
     - git clone https://github.com/shawnrpnus/RT04-Capstone.git
3. Open IntelliJ > Import Project> navigate to RT04-Capstone/backend/pom.xml 
4. Install the Lombok Plugin for IntelliJ: follow steps in https://projectlombok.org/setup/intellij
5. Ensure that project can run (right click RetailbackendApplication > Run, or use run button at top left)
6. Ensure tables are created in db
     - In IntelliJ, use the search function and search Database > Datasource > MySQL
7. Go to Backend > src > test > ... > services > CustomerServiceTest > right click, run (make sure can pass 100% test case)
8. Done!
