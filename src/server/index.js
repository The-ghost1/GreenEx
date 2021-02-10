const express = require('express');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const app = express();

require('dotenv').config({ path: path.resolve(__dirname, ".env") })

const { createToken, checkTokenMiddleware } = require("./helpers.js")

app.use(cors());

const db = mysql.createConnection({
  host: 'localhost',
  port: 8889,
  user: 'mamp',
  password: 'root',
  database: 'Greenex'
});

db.connect();

const port = process.env.PORT || 8080;

app
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({ extended: true }));

app.listen(port, () => {
  console.log(`Express server listening on port ${port}`);
});

app.get('/', (req, res) => {
  res.send('Hello Le monde ooouh!')
})



/*
*
* Récupérer la liste des utilisateurs
*/
app.get('/users', checkTokenMiddleware, function (req, res) {
// app.get('/users', checkTokenMiddleware, function (req, res) {
    db.query('SELECT id, name, firstname, email, role FROM users', [], function (err, rows) {
      if (err) {
        return res.json({ status: 'error' });
      } else {
        return res.send(rows)
      }
    })  
});


/*
*
* L'admin va créer un nouvel utilisateur
*/
app.post('/create-user', checkTokenMiddleware, function (req, res) {
  const name = req.body.name; 
  const firstname = req.body.firstname;
  const email = req.body.email;
  const password = req.body.password;
  const role = req.body.role;

  if (!name && !firstname && !email && !password && !role) return;

  bcrypt.hash(password, saltRounds, (err, hash) => {
    if (err) return res.json({ status: 'error' });

    db.query('SELECT id FROM users WHERE email = ?', [email], function (err, rows) {
      if (err) {
        return res.json({ title: "Échec", status: 'error', message: "" });
      } else {
        if (rows.length > 0) {
          return res.send({ title: "Échec", status: 'error', message: "Ce compte existe déja ! Vous ne pouvez pas créer 2 fois le même utilisateur." });
        } else {
          return db
            .query(
              'INSERT INTO users (name, firstname, email, password, role) VALUES (?,?,?,?,?)',
              [name, firstname, email, hash, role],
              (error, user) => {
                if (error) {
                  return res.json({ title: "Échec", status: 'error', message: "" });
                } else {
                  return res.send({ 
                    title: "Bravo !", 
                    status: 'success', 
                    message: "L'utilisateur à été créé avec succès !",
                    user: user
                  });
                }
              }
            );
        }
      }
    });
  });
});

/*
*
* L'admin va modifier un utilisateur
*/
app.put('/edit-user/:id', checkTokenMiddleware, function (req, res) {
  const userId = req.params.id;
  const name = req.body.name;
  const firstname = req.body.firstname;
  const email = req.body.email;
  const role = req.body.role;

  if (!name && !firstname && !email && !role) return;

  db.query('SELECT id FROM users WHERE email = ?', [email], function (err, rows) {
      if (err) {
        return res.json({ title: "Échec", status: 'error', message: "" });
      } else {
       return db
        .query(`UPDATE users SET name = ?, firstname = ?, email = ?, role = ? WHERE id = ?`, [name, firstname, email, role, userId],
          (error, r) => {
            if (error) {
              return res.json({ title: "Échec", status: 'error', message: "" });
            } else {
              return res.send({ 
                title: "Bravo !", 
                status: 'success', 
                message: "L'utilisateur à été modifié avec succès !",
                createdUserId: r.insertId
              });
            }
          }
        );
      }
    });
});


/*
*
* L'admin va supprimer un utilisateur
*/
app.delete('/delete-user/:id', checkTokenMiddleware, function (req, res) {
  const userId = req.params.id;

  db.query("DELETE FROM users WHERE id = ?", [userId], (err) => {
        if (err) {
          return res.json({ title: "Échec", status: 'error', message: "" });
        } else {
         return res.send({ 
            title: "Bravo !", 
            status: 'success', 
            message: "L'utilisateur à été supprimé avec succès !",
          });
        }
    });
});



app.post('/create-produit', checkTokenMiddleware, function (req, res) {
  const responseText = 'Votre produit vient d\'être créé avec succès !';
  const gaz = req.body.gaz;
  const eau = req.body.eau;
  const temperature = req.body.temperature;

  db.query('INSERT INTO produits (gaz, eau, temperature) VALUES (?,?,?)',
    [gaz, eau, temperature],
    (error) => {
      if (error) {
        return res.json({ status: 'error' });
      } else {
        return res.send({
          title: "Bravo !", 
          status: 'success', 
          message: "Le produit a été créé avec succès !",
          createdProduitId: res.insertId
        });
      }
    }
    );
});

/*
*
* Récupérer la liste des produits
*/
app.get('/listproduit', function (req, res) {
    db.query('SELECT * FROM produits', [], function (err, rows) {
      if (err) {
        return res.json({ status: 'error' });
      } else {
        return res.send(rows)
      }
    })  
});


/*
*
* L'utilisateur va créer un nouveau produit
*/
app.post('/create-produit', function (req, res) {
  const eau = req.body.eau;
  const gaz = req.body.gaz;
  const temperature = req.body.temperature;
  const libelle = req.body.libelle;

  if (!eau && !gaz && !temperature && !libelle ) return;

    db.query('SELECT id FROM produits WHERE eau = ?', [eau], function (err, rows) {
      if (err) {
        return res.json({ title: "Échec", status: 'error', message: "" });
      } else {
        if (rows.length > 0) {
          return res.send({ title: "Échec", status: 'error', message: "Ce produit existe déja ! Vous ne pouvez pas créer 2 fois le même produit." });
        } else {
          return db
            .query(
              'INSERT INTO produits (eau, gaz, temperature,libelle) VALUES (?,?,?,?)',
              [eau, gaz, temperature,libelle],
              (error, produit) => {
                if (error) {
                  return res.json({ title: "Échec", status: 'error', message: "" });
                } else {
                  return res.send({ 
                    title: "Bravo !", 
                    status: 'success', 
                    message: "Le produit à été créé avec succès !",
                  });
                }
              }
            );
        }
      }
    });
  });


  app.delete('/delete-produit/:id', function (req, res) {
    const requestId = req.params.id;
  
    db.query("DELETE FROM produits WHERE id = ?", [requestId], (err) => {
          if (err) {
            return res.json({ title: "Échec", status: 'error', message: "" });
          } else {
           return res.send({ 
              title: "Bravo !", 
              status: 'success', 
              message: "La demande a été supprimée avec succès !",
            });
          }
      });
  });
  


/*
*
* L'admin va modifier un produit
*/
app.put('/edit-produit/:id', function (req, res) {
  const produitId = req.params.id;
  const libelle = req.body.libelle;
  const gaz = req.body.gaz;
  const eau = req.body.eau;
  const temperature = req.body.temperature;
  if (!gaz && !eau && !temperature && !libelle) return;

  db.query('SELECT id FROM produits WHERE libelle =?', [libelle], function (err, rows) {
      if (err) {
        return res.json({ title: "Échec", status: 'error', message: "" });
      } else {
       return db
        .query(`UPDATE produits SET gaz =?, eau =?, temperature =?, libelle =? WHERE id =?`, [gaz, eau, temperature,libelle, produitId],
          (error, r) => {
            if (error) {
              return res.json({ title: "Échec", status: 'error', message: "" });
            } else {
              return res.send({ 
                title: "Bravo !", 
                status: 'success', 
                message: "L'utilisateur à été modifié avec succès !",
                createdProduitId: r.insertId
              });
            }
          }
        );
      }
    });
});


/*
*
* Inscription d'un nouveau client
*/
app.post('/inscription', function (req, res) {
  const responseText = 'Votre compte vient d\'être crée avec succès !';
  const name = req.body.name;
  const firstname = req.body.firstname;
  const email = req.body.email;
  const password = req.body.password;

  if (!name || !firstname || !email || !password) return;

  bcrypt.hash(password, saltRounds, (err, hash) => {

    if (err) return;
    db.query('SELECT id FROM users WHERE email = ?', [email], function (err, rows) {
      if (err) {
        return res.json({ status: 'error' });
      } else {
        if (rows.length > 0) {
          return res.send("Ce compte existe déja ! Vous ne pouvez pas vous inscrire 2 fois.");
        } else {
          return db
            .query(
              'INSERT INTO users (name, firstname, email, password) VALUES (?,?,?,?)',
              [name, firstname, email, hash],
              (error) => {
                if (error) {
                  return res.json({ status: 'error' });
                } else {
                  return res.send(responseText);
                }
              } 
            );
        }
      }
    });
  });
});

/*
*
* Connexion
*/
app.post('/connexion', function (req, res) {
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password) return;

  db.query('SELECT * FROM users WHERE email = ?', [email], function (err, rows) {
    if (err) {
      return res.json({ status: 'error' });
    } else {
      if (rows.length > 0) {
        return bcrypt.compare(password, rows[0].password, function (err, bcryptRes) {
          if (bcryptRes) {
            const token = createToken(email)

            return res.json({ user: { email: rows[0].email, role: rows[0].role }, token });
          } else {
            return res.send("Vos identifiants de connexion sont incorrectes !");
          }
        });
      }

      return res.send("Ce utilisateur n'existe pas !");
    }
  });
});

module.exports = { db };