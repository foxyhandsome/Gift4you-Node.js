const express = require('express')
const bodyParser = require('body-parser')
const mysql = require('mysql')

const app = express()
const port = process.env.PORT || 5000;

app.use(bodyParser.json({limit: '50mb', extended: true}));
app.use(bodyParser.urlencoded({limit: "50mb", extended: true, parameterLimit:50000}));
app.use(bodyParser.text({ limit: '200mb' }));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// MySQL
const pool  = mysql.createPool({
    connectionLimit : 10,
    host            : 'localhost',
    user            : 'root',
    // password        : '',
    database        : 'gift4you'
})

// Get all beers
app.get('b', (req, res) => {
    pool.getConnection((err, connection) => {
        if(err) throw err
        // console.log('connected as username ' + connection.threadId)
        connection.query('SELECT * from user join user_role on user.role_id = user_role.role_id', (err, rows) => {
            connection.release() // return the connection to pool

            if (!err) {
                res.send(rows)
            } else {
                console.log(err)
            }

            // if(err) throw err
            console.log('The data from user table are: \n', rows)
        })
    })
})

app.get('/get-user-role', (req, res) => {
    pool.getConnection((err, connection) => {
        if(err) throw err
        // console.log('connected as username ' + connection.threadId)
        connection.query('SELECT * from user_role', (err, rows) => {
            connection.release() // return the connection to pool

            if (!err) {
                res.send(rows)
            } else {
                console.log(err)
            }

            // if(err) throw err
            console.log('The data from user_role table are: \n', rows)
        })
    })
})

app.get('/get-user-byusername/:username', (req, res) => {
    pool.getConnection((err, connection) => {
        if(err) throw err
        connection.query('SELECT * FROM user WHERE username = ?', [req.params.username], (err, rows) => {
            connection.release() // return the connection to pool
            if (!err) {
                res.send(rows)
            } else {
                console.log(err)
            }
            
            console.log('The data from user table are: \n', rows)
        })
    })
});

app.get('/delete-by-username/:username', (req, res) => {
    pool.getConnection((err, connection) => {
        if(err) throw err
        connection.query('DELETE FROM user WHERE username = ?', [req.params.username], (err, rows) => {
            connection.release() // return the connection to pool
            if (!err) {
                res.send(rows)
            } else {
                console.log(err)
            }
            
            console.log('The data from user table are: \n', rows)
        })
    })
});

app.post('/register', (req, res) => {

    pool.getConnection((err, connection) => {
        if(err) throw err
        console.log(`connected as id ${connection.threadId}`)

        const params = req.body

        connection.query('INSERT INTO user SET ?', params , (err, rows) => {
            connection.release() // return the connection to pool

            if(!err) {
                res.send(`register: ${params.username} has been added.`)
            } else {
                console.log(err)
            }

        })

        console.log(req.body)
    })
})

app.post('/login', (req, res) => {

    pool.getConnection((err, connection) => {
        if(err) throw err
        console.log(`connected as id ${connection.threadId}`)

        const {username,password} = req.body 
        connection.query('SELECT * FROM user WHERE username = ? AND password = ?', [username,password] , (err, rows) => {
            connection.release() // return the connection to pool

            if (!err) {
                res.send(rows)
            } else {
                console.log(err)
            }

            // if(err) throw err
            console.log('The data from user table are: \n', rows)
        })

        console.log(req.body)
    })
})

app.post('/insert-product', (req, res) => {

    pool.getConnection((err, connection) => {
        if(err) throw err
        console.log(`connected as id ${connection.threadId}`)

        const params = req.body

        connection.query('INSERT INTO product SET ?', params , (err, rows) => {
            connection.release() // return the connection to pool

            if(!err) {
                res.send(`product: ${params.username} has been added.`)
            } else {
                console.log(err)
            }

        })

        console.log(req.body)
    })
})

app.post('/list-product', (req, res) => {
    pool.getConnection((err, connection) => {
      if (err) throw err;
      const { username } = req.body;
      const sql = "SELECT * FROM product ORDER BY product_price DESC LIMIT 10";
      connection.query(sql, (err, rows) => {
        connection.release(); // return the connection to pool
        if (err) {
          console.log(err);
          res.status(500).send("Error retrieving data from database");
        } else {
          console.log('The data from product table are: \n', rows);
          res.status(200).send(rows);
        }
      });
      console.log(req.body);
    });
  });

  app.get('/get-product-byusername/:username', (req, res) => {
    pool.getConnection((err, connection) => {
        if(err) throw err
        connection.query('SELECT * FROM user JOIN market ON user.username = market.username JOIN product ON market.market_id = product.market_id WHERE user.username = ?', [req.params.username], (err, rows) => {
            connection.release() // return the connection to pool
            if (!err) {
                res.send(rows)
            } else {
                console.log(err)
            }
            
            console.log('The data from user table are: \n', rows)
        })
    })
});

app.listen(port, () => console.log(`Listening on port ${port}`))