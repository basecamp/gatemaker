const EventEmitter = require("events")
const { app, session } = require("electron")

const observer = new EventEmitter
const sessions = new WeakSet

app.whenReady().then(start)

function start() {
  addSession(session.defaultSession)
  app.on("session-created", addSession)
}

function addSession(session) {
  if (sessions.has(session)) return
  sessions.add(session)
  session.on("will-download", sessionWillDownload)
}

function sessionWillDownload(event, download) {
  download.once("done", (event, state) => {
    if (state == "completed") {
      observer.emit("download-completed", download)
    }
  })
}

module.exports = observer
