// Biblioteca com métodos para web
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

// DB
const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
var db;
var table = "quotes";

// Usar o midlleware body-parser no express aplication
app.use(bodyParser.urlencoded({extended: true}));

// Usar o midlleware EJS (Embedded JavaScripit) como view engine
app.set('view engine', 'ejs');


app.get('/', (req, res) => {
	res.sendFile(__dirname + '/index.html');
})

var mongoUrlConnection = "mongodb://localhost/quotes";
MongoClient.connect(mongoUrlConnection, (err, database) => {
	if(err)
		return console.error(err);
	db = database;

	// Inicia servidor na porta 3000
	app.listen(3000, function() {
		console.log('listening on port 3000');
	});
});


app.post('/quotes/create', (req, res) => {
	db.collection(table).save(req.body, function(err, result){
		if (err)
			return console.error(err);

		console.log('Salvo no banco de dados!');
		res.redirect('/quotes/list');
	});
	console.log(db);
});

app.get('/quotes/list', (req, res) => {
	var cursor = db.collection(table).find();
	cursor.toArray((err, results) => {
		if (err)
			return console.error(err);

		// NOTA: As view TEM que estar na pasta views
		res.render('list_quotes.ejs', {quotes: results});
	}); 
	// res.send();
});

// Delete
app.get('/quotes/delete', (req,res) => {
	var retorno = db.collection(table).remove({_id:  mongodb.ObjectId(req.query.id)}, true);
	console.log('deletando: ' + req.query.id);
	// console.log('retorno: ' +  retorno);

	res.redirect('/quotes/list');
});