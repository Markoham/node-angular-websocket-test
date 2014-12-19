
var express         = require('express');
var app             = express();
var path            = require('path');
var ejs             = require('ejs');

// view engine setup
app.engine('html', ejs.renderFile);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');

// public files
app.use(express.static(path.join(__dirname, 'public')));

// ROUTES
app.get('/', function(req, res, next)
{
    res.render('main');
});



// =======================================================
// --------- ERROR HANDLING ------------------------------
// =======================================================

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

var panels = [
    {id: 1, top:10, left: 10, text: "First"},
    {id: 2, top:100, left: 10, text: "Second"}
];

function updatePanel(panel)
{
    for(var i = 0, c = panels.length; i < c; i++)
    {
        if(panels[i].id === panel.id)
        {
            panels[i].top = panel.top;
            panels[i].left = panel.left;
        }
    }
}

var server = require('http').createServer(app);
var io = require('socket.io')(server);
io.on('connection', function(socket){
    socket.on('all', function(data)
    {
        socket.emit('all', JSON.stringify({elements: panels}));
    });
    
    socket.on('update', function(data)
    {
        if(data)
        {
            var obj = JSON.parse(data).element;
            if(obj)
            {
                console.log(data);
                socket.broadcast.emit('update', data);
                updatePanel(obj);
            }
        }
    });
});

//module.exports = app;
server.listen(3000);