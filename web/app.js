var express = require('express');
var exphbs  = require('express-handlebars');
var path = require('path');
var cookieParser = require('cookie-parser');
const fetch = require('isomorphic-unfetch');

const WEBSITE_IP = 'localhost'

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
        },
        intervalsToTime(intervals) {
            intervals = parseInt(intervals);
            let retString = "";
            if (intervals >= 4) retString += `${Math.floor(intervals / 4)} hour${Math.floor(intervals / 4) == 1 ? '' : "s"}`
            if (retString.length && intervals % 4) retString += ", "
            if (intervals % 4) retString += `${(intervals % 4) * 15} minutes`
            retString += "."
            return retString;
        },
        dateToFromNowDateString(dateString) {
            const dateObj = new Date(new Date(dateString).getTime() + 18000000);
            if (dateObj.getTime() > Date.now()) return `Starts ${dateObj.toLocaleString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} - ${Math.ceil((dateObj.getTime() - Date.now()) / 1000 / 60 / 60 / 24)} days from today.`
            return `Started ${dateObj.toLocaleString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} - ${-1 * Math.ceil((dateObj.getTime() - Date.now()) / 1000 / 60 / 60 / 24)} days ago.`
        },
        subtract(a, b) {return a - b},
        parseBooleanString(string) {return {"true": true, "false": false}}
    }
}))

app.set('view engine', '.hbs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => res.render('home', {WEBSITE_IP}))

app.get('/machines', async (req, res) => {
    let machines = await fetch("http://localhost:3000/api/machines").then(r => r.json())
    res.render('machines/machines.hbs', {machines, WEBSITE_IP})
})

app.get('/machines/:id/tools', async (req, res) => {
    let machine = await fetch("http://localhost:3000/api/machines/" + req.params.id).then(r => r.json())
    let tools = await fetch("http://localhost:3000/api/tools").then(r => r.json())
    tools.forEach(t => {
        let searchString = "";
        Object.keys(t.attributes).forEach(k => searchString += t.attributes[k] + " ");
    })
    res.render('./machines/tools.hbs', {machine, tools, WEBSITE_IP})
})

app.get('/machines/:id/attributes', async (req, res) => {
    let machine = await fetch("http://localhost:3000/api/machines/" + req.params.id).then(r => r.json());
    res.render('./machines/attributes.hbs', {machine, WEBSITE_IP});
});

app.get('/machines/add', async (req, res) => res.render('./machines/add.hbs', {WEBSITE_IP}))

app.get('/tools', async (req, res) => {
    let tools = await fetch("http://localhost:3000/api/tools").then(r => r.json())
    let machines = await fetch("http://localhost:3000/api/machines/").then(r => r.json());
    tools.forEach(t => {
        if (t.machine) {
            t.machine = (machines.find(m => m.id == t.machine)).attributes.name;
        }
    })
    res.render('./tools/toolLibrary.hbs', {tools, WEBSITE_IP})
})

app.get('/tools/add', async (req, res) => res.render('./tools/add.hbs', {WEBSITE_IP}))

app.get('/parts', async (req, res) => {
    let parts = await fetch("http://localhost:3000/api/parts").then(r => r.json())
    res.render('./parts/partLibrary.hbs', {parts, WEBSITE_IP})
})

app.get('/parts/add', async (req, res) => {
    res.render('./parts/add.hbs', {WEBSITE_IP});
})

app.get('/parts/:id', async (req, res) => {
    const [part, tools, machines] = await Promise.all([
        fetch("http://localhost:3000/api/parts/" + req.params.id).then(r => r.json()),
        fetch("http://localhost:3000/api/tools").then(r => r.json()),
        fetch("http://localhost:3000/api/machines/").then(r => r.json())
    ])
    part.ops.forEach(o => {
        o.machines.forEach((om, i) => o.machines[i] = machines.find(m => om == m.id).attributes.name)
        o.tools.forEach((ot, i) => o.tools[i] = tools.find(t => ot == t.id).attributes.name)
    })
    res.render('./parts/part.hbs', {part, WEBSITE_IP})
})

app.get('/parts/:id/addOp', async (req, res) => {
    const part = await fetch("http://localhost:3000/api/parts/" + req.params.id).then(r => r.json())
    res.render('./parts/addOp.hbs', {part, WEBSITE_IP})
})

app.get('/parts/:partId/:opId/machines', async (req, res) => {
    let machines = await fetch("http://localhost:3000/api/machines/").then(r => r.json());
    let op = (await fetch("http://localhost:3000/api/ops/" + req.params.opId).then(r => r.json()))
    res.render('./parts/opMachines.hbs', {machines, op, WEBSITE_IP});
})

app.get('/parts/:partId/:opId/tools', async (req, res) => {
    let tools = await fetch("http://localhost:3000/api/tools").then(r => r.json())
    let op = (await fetch("http://localhost:3000/api/ops/" + req.params.opId).then(r => r.json()))
    res.render('./parts/opTools.hbs', {tools, op, WEBSITE_IP})
})

app.get('/parts/:partId/:opId(o[0-9]+)/edit', async (req, res) => {
    let op = (await fetch("http://localhost:3000/api/ops/" + req.params.opId).then(r => r.json()));
    res.render('./parts/editOp.hbs', {op, WEBSITE_IP});
})


app.get('/jobs', async (req, res) => {
    let jobs = await fetch("http://localhost:3000/api/jobs").then(r => r.json());
    let parts = await fetch("http://localhost:3000/api/parts").then(r => r.json());
    jobs.forEach(j => {
        j.partName = parts.find(p => j.partId == p.partId).partName
    })
    res.render('./jobs/jobs.hbs', {jobs, WEBSITE_IP});
})

app.get('/jobs/add', async (req, res) => {
    let parts = await fetch("http://localhost:3000/api/parts").then(r => r.json());
    res.render('./jobs/add.hbs', {parts, WEBSITE_IP});
})

app.get('/scheduling', async (req, res) => {
    let machines = await fetch("http://localhost:3000/api/machines").then(r => r.json())
    res.render('./schedule/schedule.hbs', {machines, WEBSITE_IP});
})

app.get('/production', async (req, res) => {
    res.render('./production/production.hbs', {WEBSITE_IP});
})


app.listen(80, () => console.log("Listening on port 80"))