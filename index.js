const express = require('express');
const path = require('path');
const sql = require('mssql');
const app = express();
const port = 3000;

//Database configuration
const config = {
    user: 'bootcamp',
    password: 'Pass@123',
    server: 'bootcampaug5server.database.windows.net',
    database: 'bootcampaug5db',
    options: {
        encrypt: true,
        trustServerCertificate: false
    }
};

// Set up view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', (req, res) => {
    res.render('index');
});

app.get('/task2', async (req, res) => {
    try {
        let pool = await sql.connect(config);
        let result = await pool.request().query('SELECT TOP 20 * FROM SalesLT.Customer');
        let columns = result.recordset.length ? Object.keys(result.recordset[0]) : [];
        let data = result.recordset;
        res.render('task2', { tables: [data], columns });
    } catch (err) {
        console.error(err);
        res.status(500).send('Database error');
    }
});

app.get('/task3', async (req, res) => {
    try {
        let pool = await sql.connect(config);
        let result = await pool.request().query(`
            SELECT 
                SalesLT.Product.Name AS ProductName, 
                SalesLT.Product.Color, 
                SalesLT.Product.Size, 
                SalesLT.Product.Weight 
            FROM SalesLT.Product 
            JOIN SalesLT.ProductCategory 
            ON SalesLT.Product.ProductCategoryID = SalesLT.ProductCategory.ProductCategoryID
        `);
        let columns = result.recordset.length ? Object.keys(result.recordset[0]) : [];
        let data = result.recordset;
        res.render('task3', { tables: [data], columns });
    } catch (err) {
        console.error(err);
        res.status(500).send('Database error');
    }
});

// testing 

app.get('/test', (req, res) => {
    res.send('Server is working good');
});


// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
