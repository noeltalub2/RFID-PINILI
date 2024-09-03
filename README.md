# App Installation Instructions

Follow these steps to install and run the LMS (Learning Management System) app:

1. **Install Node.js:**
   - Install Node.js - https://nodejs.org/dist/v20.11.1/node-v20.11.1-x64.msi.

2. **Install NPM Dependencies:**
   - Click on 'INSTALL ME FIRST!' to install the npm dependencies.

3. **Set Up Database:**
   - Use XAMPP Control Panel to create a database named 'vehicle-gatepass'.
   - Import 'vehicle-gatepass.sql' from the 'database' folder into the newly created database.

4. **Run the App:**
   - Go back to the app folder.
   - Find and click the 'run me' file.

5. **Access the App:**
   - Open your web browser.
   - Visit [http://localhost:3000/](http://localhost:3000/) to access the app.

### Access URLs:

- **RFID Login:** [http://localhost:3000/rfid/login](http://localhost:3000/rfid/login)
- **RFID Reader:** [http://localhost:3000/rfid/](http://localhost:3000/rfid/)

- **User Sign In:** [http://localhost:3000/signin](http://localhost:3000/signin)
- **User Sign Up:** [http://localhost:3000/signup](http://localhost:3000/signup)

- **User Dashboard:** [http://localhost:3000/v1/home](http://localhost:3000/v1/home)

You are now ready to use the app!
