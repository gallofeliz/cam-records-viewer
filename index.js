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

app.get('/images.json', (req, res) => {

    const from = moment().subtract(1, 'day')
    const to = moment();
    const nbDays = Math.ceil(to.diff(from, 'hours', true));

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

    console.log(dirsSearch, filesSearch)

    glob(`images/@(${dirsSearch.join('|')})/@(${filesSearch.join('|')})*.jpg`, (e, files) => {
        res.json(files)
    })

})

app.get('/images/:a/:b.jpg', async (req, res) => {
    const imagePath = 'images/' + req.params.a + '/' + req.params.b + '.jpg'

     res.send(fs.readFileSync(imagePath))
 return;

    res.send(await sharp(imagePath)
        .resize(768)
        .toBuffer())

})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
