const express = require('express')
const app = express()
const port = 3000
const noblox = require('noblox.js')



app.get('/', (req, res) => {
  res.send('Ro-Service has blocked you , you are not a bot!')
})

app.listen(port, () => {
  console.log(`Ro-Service is listening at http://localhost:${port}`)
})

app.get('/Shout', function(req, res) {
    const groupid = req.query.groupid
  const cookie = req.query.cookie
  const shoutstring = req.query.shoutstring.replace("+", " ")
  if(!groupid || !cookie || !target) return
  noblox.setCookie(cookie).then(() => {
    noblox.shout(groupid, shoutstring).catch(() => {"There was an error while shouting at that specific group."})
  }).catch(() => {
    console.warn("An invalid cookie was provided.")
  })
})

app.get('/setRank', function(req, res) {
  const groupid = req.query.groupid
  const cookie = req.query.cookie
  const idtoRank = req.query.rankid
  const target = req.query.target
  if(!groupid || !cookie || !target) return
  noblox.setCookie(cookie).then(() => {
    noblox.setRank(groupid, target, idtoRank).catch(() => {
      console.warn("There was an error while ranking that user.")
    })
  }).catch(() => {
    console.warn("An invalid cookie was provided.")
  })
})

app.get('/Promote', function(req, res) {
  const groupid = req.query.groupid
  const cookie = req.query.cookie
  const target = req.query.target
  if(!groupid || !cookie || !target) return
  noblox.setCookie(cookie).then(() => {
    noblox.promote(groupid, target).catch(() => {
      console.warn("There was an error while ranking that user.")
    })
  }).catch(() => {
    console.warn("An invalid cookie was provided.")
  })
})

app.get('/Demote', function(req, res) {
  const groupid = req.query.groupid
  const cookie = req.query.cookie
  const target = req.query.target
  noblox.setCookie(cookie).then(() => {
    noblox.demote(groupid, target).catch(() => {
      console.warn("There was an error while ranking that user.")
    })
  }).catch(() => {
    console.warn("An invalid cookie was provided.")
  })
})
