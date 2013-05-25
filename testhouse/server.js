function sleep(ms) {
	var dt = new Date();
	dt.setTime(dt.getTime() + ms);
	while (new Date().getTime() < dt.getTime())
		;
}

var html = require('fs').readFileSync(__dirname + '/public/index.html');
var app = require('http').createServer(function(req, res) {
	res.end(html);
});
app.listen(80);
var io = require("socket.io");
var io = io.listen(app);

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
