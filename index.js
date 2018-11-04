var http = require("http");
var url = require("url");
var mysql = require("mysql");
var qs = require("querystring");
var formidable = require('formidable');
var fs = require('fs');

var con = mysql.createConnection({
   host:"localhost",
   user:"root",
   password:"0147",
   database:"dbchannel"
});

var server = http.createServer(function (req, res){
    res.writeHead(200, {'Content-Type':'text/html'});
    var q = url.parse(req.url, true);
    var path1 = q.pathname;

        switch(path1){
            case "/hospital/list":
                hospital_list(req, res); break;
            case "/hospital/add":
                hospital_add(req, res); break;
            case "/doctor/list":
                doctor_list(req, res); break;
            case "/speciality/list":
                speciality_list(req, res); break;
            case "/doctor_session/list":
                doctor_session_list(req, res); break;
            case "/book/add":
                book_add(req,res);break;
            case "/register":
                register(req,res);
            case "/patient/add":
                patient_add(req,res);
        }


});
server.listen(8080);

function hospital_list(req, res){
    var sql = "SELECT * FROM hospital";
    con.query(sql, function(err, result, fields){
        if(err) throw err;
        res.end(JSON.stringify(result));
    });
}

function hospital_add(req, res){

}

function doctor_list(req, res){
    var sql = "SELECT *," +
        "(SELECT name FROM speciality " +
        "WHERE speciality.id=doctor.speciality) " +
        "AS speciality_name FROM doctor";
    con.query(sql, function (err, result, fields) {
            if (err) throw err;
            res.end(JSON.stringify(result));
        });
}


function speciality_list(req, res){
    var sql ="SELECT * FROM speciality";
    con.query(sql, function (err, result, fields) {
        if (err) throw err;
        res.end(JSON.stringify(result));
    });
}
function doctor_session_list(req, res){
    var q = url.parse(req.url,true);
    var query = q.query;
    var where = "";
    if(query.hid){
        where+=" AND doctor_session.hospital = '"+query.hid+"'";
    }
    if(query.sid){
        where+=" AND doctor.speciality = '"+query.sid+"'";
    }
    if(query.did){
        where+=" AND doctor_session.doctor = '"+query.did+"'";
    }
    var sql ="SELECT doctor_session.*, doctor.name AS doctor_name," +
        "hospital.name AS hospital_name," +
        "speciality.name AS speciality_name," +
        "hospital.place AS hospital_place  " +
        "FROM doctor_session, doctor, hospital, speciality " +
        "WHERE doctor_session.doctor = doctor.id AND " +
        "doctor_session.hospital=hospital.id AND " +
        "doctor.speciality=speciality.id "+where;
    con.query(sql, function (err, result, fields) {
        if (err) throw err;
        res.end(JSON.stringify(result));
    });

}

function book_add(req, res){
    req.on('data', function(data){
        data = data.toString();
        var post = qs.parse(data);

        var sql = "INSERT INTO appointment " +
            "(doctor_session, name, email, phone)" +
            " VALUES ('"+post.session_id+"'," +
            "'"+post.name+"'," +
            "'"+post.email+"'," +
            "'"+post.phone+"')";
            con.query(sql, function (err, result) {
                if (err) throw err;
                console.log("1 record inserted");
            });
    });
}



function register(req, res){
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write('<form action="patient/add" method="post" enctype="multipart/form-data">');
    res.write('<input type="file" name="photo"><br>');
    res.write('<input type="submit">');
    res.write('</form>');
    return res.end();
}

function patient_add(req, res){
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        if (err) throw err;
        console.log(files);
        console.log(fields);
        var oldpath = files.photo.path;
        var newpath = 'C:/Channel/' + files.photo.name;
        fs.rename(oldpath, newpath, function (err) {
            if (err) throw err;
            res.write('File uploaded and moved!');
            res.end();
        });
    });
}
