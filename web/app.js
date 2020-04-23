var express = require('express');
var exphbs  = require('express-handlebars');
var path = require('path');
var cookieParser = require('cookie-parser');
const fetch = require('isomorphic-unfetch')

var app = express();
app.engine('.hbs', exphbs({
    extname: '.hbs',
    layoutsDir: __dirname + '/views/layouts/',
    partialsDir: __dirname + '/views/partials/',
    helpers: {
        prettyStringifyObject: obj => {
            let retString = "";
            retString += `name: ${obj.name}, `
            for (key of Object.keys(obj).sort()) {
                if (key == "name") continue;
                retString += `${key}: ${obj[key]}, `
            }
            return retString;
        },
        generateSearchString: obj => {
            let retString = "";
            for (key of Object.keys(obj)) {
                retString += `${key}: ${obj[key]} `;
            }
            return retString;
        }
    }

}))
app.set('view engine', '.hbs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.render('home')
})

app.get('/machines', async (req, res) => {
    let machines = await fetch("http://localhost:3000/api/machines").then(r => r.json())
    res.render('machines', {machines})
})

app.get('/machines/:id/tools', async (req, res) => {
    let machine = await fetch("http://localhost:3000/api/machines/" + req.params.id).then(r => r.json())
    let tools = await fetch("http://localhost:3000/api/tools").then(r => r.json())
    tools.forEach(t => {
        let searchString = "";
        Object.keys(t.attributes).forEach(k => searchString += t.attributes[k] + " ");
    })
    res.render('./machines/tools.hbs', {machine, tools})
})

app.get('/machines/:id/attributes', async (req, res) => {
    let machine = await fetch("http://localhost:3000/api/machines/" + req.params.id).then(r => r.json());
    res.render('./machines/attributes.hbs', {machine});
});

app.get('/machines/add', async (req, res) => {
    res.render('./machines/add.hbs')
})

app.get('/tools', async (req, res) => {
    let tools = await fetch("http://localhost:3000/api/tools").then(r => r.json())
    let machines = await fetch("http://localhost:3000/api/machines/").then(r => r.json());
    tools.forEach(t => {
        if (t.machine) {
            t.machine = (machines.find(m => m.id == t.machine)).attributes.name;
        }
    })
    res.render('./tools/toolLibrary.hbs', {tools})
})

app.get('/tools/add', async (req, res) => {
    res.render('./tools/add.hbs')
})

app.listen(80, () => {
    console.log("Listening on port 80");
})