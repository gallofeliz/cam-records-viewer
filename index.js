const express = require('express')
const app = express()
const port = 8080
const fs = require('fs')
//const sharp = require('sharp');
const glob = require('glob');
const moment = require('moment');

app.get('/', (req, res) => {
    res.send(fs.readFileSync('./index.html', {encoding: 'utf8'}))
})

app.get('/moment.js', (req, res) => {
    res.type('text/javascript')
    res.send(fs.readFileSync('./node_modules/moment/moment.js', {encoding: 'utf8'}))
});

app.get('/flatpickr.js', (req, res) => {
    res.type('text/javascript')
    res.send(fs.readFileSync('./node_modules/flatpickr/dist/flatpickr.min.js', {encoding: 'utf8'}))
})

app.get('/fontawesome.css', (req, res) => {
    res.type('text/css')
    res.send(fs.readFileSync('./node_modules/@fortawesome/fontawesome-free/css/all.css', {encoding: 'utf8'}))
})

app.get('/webfonts/fa-solid-900.woff2', (req, res) => {
    res.type('font/woff2')
    res.send(fs.readFileSync('./node_modules/@fortawesome/fontawesome-free/webfonts/fa-solid-900.woff2'))
})

app.get('/webfonts/fa-regular-400.woff2', (req, res) => {
    res.type('font/woff2')
    res.send(fs.readFileSync('./node_modules/@fortawesome/fontawesome-free/webfonts/fa-regular-400.woff2'))
})

app.get('/flatpickr.css', (req, res) => {
    res.type('text/css')
    res.send(fs.readFileSync('./node_modules/flatpickr/dist/flatpickr.min.css', {encoding: 'utf8'}))
})

app.get('/cameras.json', (req, res) => {
    glob(`*/`, {cwd: 'images'}, (e, dirs) => {
        res.json(dirs.map(dir => dir.replace('/', '')))
    })
})

app.get('/images.json', (req, res) => {

    const camera = req.query.camera;
    const from = moment(req.query.start)
    const to = moment(req.query.end);
    const nbDays = to.diff(from, 'hours') + 1;
    const dirsSearch = []
    const filesSearch = (new Array(nbDays)).fill().map((_, i) =>  {
        const d = from.clone().add(i, 'hours');
        const day = d.format('YYYY-MM-DD');
        if (!dirsSearch.includes(day)) {
            dirsSearch.push(day)
        }
        return d.format('YYYY-MM-DDTHH')
    }
    );

    const globP = `images/${camera}/@(${dirsSearch.join('|')})/@(${filesSearch.join('|')})*.jpg`

    console.log(globP)

    glob(globP, (e, files) => {
        if (e) {
            res.status(500)
            res.end()
            console.error(e)
        }
        res.json(files)
    })

})

app.get('/images/:camera/:date/:datetime.jpg', async (req, res) => {
    const imagePath = 'images/' + req.params.camera + '/' + req.params.date + '/' + (req.query.thumb ? 'thumbs/' : '') + req.params.datetime + '.jpg'

    try {
        res.type('image/jpeg')
        res.send(fs.readFileSync(imagePath))
    } catch (e) {
        res.status(500)
        res.end()
        console.error(e)
    }

    // res.send(await sharp(imagePath)
    //     .resize(768)
    //     .toBuffer())

})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
