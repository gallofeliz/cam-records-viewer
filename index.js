const express = require('express')
const app = express()
const port = process.env.PORT || 80
const fs = require('fs')
const glob = require('glob-promise')
const moment = require('moment')
const snapshotsPath = '/data'

async function listCameras() {
    const dirs = await glob(`*/`, {cwd: snapshotsPath})

    return dirs.map(dir => dir.replace('/', ''))
}

async function listImages(camera, {from, to}) {
    from = moment(from)
    to = moment(to);
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

    const globP = `@(${dirsSearch.join('|')})/@(${filesSearch.join('|')})*.jpg`
    const files = await glob(globP, {cwd: `${snapshotsPath}/${camera}`});

    return files.map(file => file.split('/')[1].split('.')[0]);
}

async function getImagePath(camera, datetime, thumb) {
    const parts = [
        snapshotsPath,
        camera,
        datetime.split('T')[0],
        thumb ? 'thumbs' : null,
        datetime
    ].filter(part => part)

    return parts.join('/') + '.jpg'
}

// The best practice ever ahah
app.use('/', express.static('.'));

app.get('/cameras.json', async (req, res) => {
    res.json(await listCameras())
})

app.get('/images.json', async (req, res) => {
    res.json(await listImages(
        req.query.camera,
        {
            from: req.query.start,
            to: req.query.end
        }
    ))
})

app.get('/images/:camera/:datetime.jpg', async (req, res) => {
    res.sendFile(await getImagePath(
        req.params.camera,
        req.params.datetime,
        req.query.thumb
    ), {root: '/'})
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
