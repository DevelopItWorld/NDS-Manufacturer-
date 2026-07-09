# NDS Manufacturer - Setup Guide

## 🚀 Backend Setup Steps

### 1. Create Database & Tables

Run the following SQL command in MySQL (use phpMyAdmin or MySQL command line):

```sql
CREATE DATABASE IF NOT EXISTS nds_manufacturer;
USE nds_manufacturer;

CREATE TABLE IF NOT EXISTS users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  firstName VARCHAR(100) NOT NULL,
  lastName VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE KEY,
  company VARCHAR(150),
  password VARCHAR(255) NOT NULL,
  auth_token VARCHAR(255),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX idx_email ON users(email);

CREATE TABLE IF NOT EXISTS bookings (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  machineType VARCHAR(100),
  machineModel VARCHAR(100),
  machineCapacity VARCHAR(100),
  quantity INT,
  deliveryAddress TEXT,
  phoneNumber VARCHAR(20),
  whatsappMessage TEXT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

**Alternative:** Open `database_setup.sql` in phpMyAdmin and run it.

---

### 2. Configure Database Connection

Edit `config.php` if your database details are different:

```php
$dbHost = 'localhost';      // Your MySQL host
$dbUsername = 'root';       // Your MySQL username
$dbPassword = '';           // Your MySQL password
$dbName = 'nds_manufacturer'; // Database name
```

---

### 3. File Structure

Ensure all these files are in your project root:

```
config.php          ← Database configuration
register.php        ← User signup endpoint
login.php          ← User login endpoint
logout.php         ← User logout endpoint
verify.php         ← Session verification
auth.js            ← Frontend authentication (updated)
auth.html          ← Login/Signup page
index.html         ← Home page
booking.html       ← Booking form
styles.css         ← Styling
js.js             ← Booking logic
database_setup.sql ← Database schema
```

---

### 4. Set Up Local Server

#### Using XAMPP:
1. Copy the `nds` folder to `htdocs`
2. Start Apache & MySQL in XAMPP
3. Access via: `http://localhost/nds/`

#### Using PHPStorm/VS Code:
- Configure built-in PHP server
- Or use `php -S localhost:8000` in terminal

---

### 5. Test the System

#### Test Signup:
1. Go to `auth.html`
2. Fill signup form
3. Click "Sign Up"
4. Check MySQL if user is created: `SELECT * FROM users;`

#### Test Login:
1. Log out, then try login
2. Use the email & password from signup
3. Should redirect to `index.html`

#### Test "Remember Me":
1. Check login, check "Remember Me"
2. Close browser
3. Revisit website → Should auto-login

---

## 🔐 Security Notes

- Passwords are hashed using **bcrypt** (secure)
- Auth tokens (30-day cookies) for "Remember Me"
- Session-based authentication
- Input sanitization to prevent SQL injection
- CORS headers configured

---

## 📧 WhatsApp Integration

Booking form still sends data to WhatsApp (unchanged).

To capture bookings in database:
1. Update `js.js` to emit booking to `/record_booking.php`
2. Create `record_booking.php` to store in bookings table
3. (Coming next)

---

## ❌ Troubleshooting

**"Database connection failed"**
- Check MySQL is running
- Verify credentials in `config.php`
- Ensure database exists

**"Email already exists"**
- Clear old test users: `DELETE FROM users;`

**"Login not working"**
- Verify session is enabled in PHP
- Check browser cookies are enabled
- Inspect Network tab for API responses

**"403 Forbidden"**
- Ensure file permissions are correct
- Check PHP can access files

---

## 📞 Still Need Help?

All authentication is now **completely handled by PHP + MySQL**:
- ✅ Secure password storage (bcrypt)
- ✅ Database persistence
- ✅ Multi-device login via "Remember Me"
- ✅ Professional session management
