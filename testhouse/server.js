var app = require('express')()
  , server = require('http').createServer(app)
  , io = require('socket.io').listen(server);

server.listen(80);

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/public/index.html');
});




var mysql = require('mysql');
var connection = mysql.createConnection({
	host : 'localhost',
	user : 'root',
	password : '',
	database : 'testhouse',
});
connection.connect();

io.sockets
		.on(
				'connection',
				function(socket) {

					// nouvelle connection
					socket
							.on(
									'getGrid',
									function(id) {
										connection
												.query(
														'SELECT id, type, id_page, row, col, valeur, color, bgcolor, editable from grid where id_page = '
																+ id
																+ ' order by row, col ',
														function(err, rows,
																fields) {
															if (err)
																throw err;
															socket.emit(
																	'setGrid',
																	rows);
														});
										// connection.end();
									});
					// fin nouvelle connect

					// socket.broadcast.emit('faitUneAlerte');
					socket.on('setSelCel', function(id) {

						// On envoie a tout les clients connectes (sauf celui
						// qui a appelle l'evenement) le nouveau message
						socket.broadcast.emit('getSelCel', id);
						// socket.broadcast.emit('faitUneAlerte',id);
					});

				});
