var http = require('http');
var formidable = require('formidable');
var fs = require('fs');

http.createServer(function (req, res) {
	var path = req.url;
	switch(path){
		case "/fileupload":upload(req, res); break;
		case "/register":register(req, res); break;
 
	}
}).listen(8080);

function upload(req, res){
	var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
      var oldpath = files.photo.path;
      var newpath = 'C:/Channel/' + files.photo.name;
      fs.rename(oldpath, newpath, function (err) {
        if (err) throw err;
        res.write('File uploaded and moved!');
        res.end();
      });
    });
}

function register(req,res){
	res.writeHead(200, {'Content-Type': 'text/html'});
    res.write('<form action="fileupload" method="post" enctype="multipart/form-data">');
    res.write('<input type="file" name="photo"><br>');
    res.write('<input type="submit">');
    res.write('</form>');
    return res.end();
}
