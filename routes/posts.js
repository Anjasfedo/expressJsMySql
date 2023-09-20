var express = require('express');
var router = express.Router();

//import database
var connection = require('../library/database');

/**
 * INDEX POSTS
 */
router.get('/', function (req, res, next) {
    //query
    connection.query('SELECT * FROM posts ORDER BY id desc', function (err, rows) {
        if (err) {
            req.flash('error', err);
            res.render('posts', {
                data: ''
            });
        } else {
            //render ke view posts index
            res.render('posts/index', {
                data: rows // <-- data posts
            });
        }
    });
});

/**
 * CREATE POST
 */
router.get('/create', function (req, res, next) {
    res.render('posts/create', {
        judul: '',
        konten: ''
    })
})

/**
 * STORE POST
 */
router.post('/store', function (req, res, next) {
    
    let judul   = req.body.judul;
    let konten = req.body.konten;
    let errors  = false;

    if(judul.length === 0) {
        errors = true;

        // set flash message
        req.flash('error', "Silahkan Masukkan judul");
        // render to add.ejs with flash message
        res.render('posts/create', {
            judul: judul,
            konten: konten
        })
    }

    if(konten.length === 0) {
        errors = true;

        // set flash message
        req.flash('error', "Silahkan Masukkan Konten");
        // render to add.ejs with flash message
        res.render('posts/create', {
            judul: judul,
            konten: konten
        })
    }

    // if no error
    if(!errors) {

        let formData = {
            judul: judul,
            konten: konten
        }
        
        // insert query
        connection.query('INSERT INTO posts SET ?', formData, function(err, result) {
            //if(err) throw err
            if (err) {
                req.flash('error', err)
                 
                // render to add.ejs
                res.render('posts/create', {
                    judul: formData.judul,
                    konten: formData.konten                    
                })
            } else {                
                req.flash('success', 'Data Berhasil Disimpan!');
                res.redirect('/posts');
            }
        })
    }

})


/**
 * EDIT POST
 */
router.get('/edit/(:id)', function(req, res, next) {

    let id = req.params.id;
   
    connection.query('SELECT * FROM posts WHERE id = ' + id, function(err, rows, fields) {
        if(err) throw err
         
        // if user not found
        if (rows.length <= 0) {
            req.flash('error', 'Data Post Dengan ID ' + id + " Tidak Ditemukan")
            res.redirect('/posts')
        }
        // if book found
        else {
            // render to edit.ejs
            res.render('posts/edit', {
                id:      rows[0].id,
                judul:   rows[0].judul,
                konten: rows[0].konten
            })
        }
    })
})

/**
 * UPDATE POST
 */
router.post('/update/:id', function(req, res, next) {

    let id      = req.params.id;
    let judul   = req.body.judul;
    let konten = req.body.konten;
    let errors  = false;

    if(judul.length === 0) {
        errors = true;

        // set flash message
        req.flash('error', "Silahkan Masukkan judul");
        // render to edit.ejs with flash message
        res.render('posts/edit', {
            id:         req.params.id,
            judul:      judul,
            konten:    konten
        })
    }

    if(konten.length === 0) {
        errors = true;

        // set flash message
        req.flash('error', "Silahkan Masukkan Konten");
        // render to edit.ejs with flash message
        res.render('posts/edit', {
            id:         req.params.id,
            judul:      judul,
            konten:    konten
        })
    }

    // if no error
    if( !errors ) {   
 
        let formData = {
            judul: judul,
            konten: konten
        }

        // update query
        connection.query('UPDATE posts SET ? WHERE id = ' + id, formData, function(err, result) {
            //if(err) throw err
            if (err) {
                // set flash message
                req.flash('error', err)
                // render to edit.ejs
                res.render('posts/edit', {
                    id:     req.params.id,
                    name:   formData.name,
                    author: formData.author
                })
            } else {
                req.flash('success', 'Data Berhasil Diupdate!');
                res.redirect('/posts');
            }
        })
    }
})


/**
 * DELETE POST
 */
router.get('/delete/(:id)', function(req, res, next) {

    let id = req.params.id;
     
    connection.query('DELETE FROM posts WHERE id = ' + id, function(err, result) {
        //if(err) throw err
        if (err) {
            // set flash message
            req.flash('error', err)
            // redirect to posts page
            res.redirect('/posts')
        } else {
            // set flash message
            req.flash('success', 'Data Berhasil Dihapus!')
            // redirect to posts page
            res.redirect('/posts')
        }
    })
})

module.exports = router;