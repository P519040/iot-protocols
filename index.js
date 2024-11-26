var restify = require('restify');

var server = restify.createServer();
server.use(restify.plugins.bodyParser());

server.get('/water_coolers', function(req, res, next) {
    res.send('List of coolers: [TODO]');
    return next();
});

server.get('/water_coolers/:id', function(req, res, next) {
    res.send('Current values for cooler ' + req.params['id'] + ': [TODO]');
    return next();
});

server.post('/water_coolers/:id', function(req, res, next) {
    res.send('Data received from cooler [TODO]');

    console.log(req.body);

    return next();
});

server.listen(8011, function() {
    console.log('%s listening at %s', server.name, server.url);
});
