'use strict'

import { app, BrowserWindow, screen, Tray, Menu, nativeImage, remote} from 'electron'
import * as path from 'path'
import { format as formatUrl } from 'url'

const isDevelopment = process.env.NODE_ENV !== 'production'

// global reference to mainWindow (necessary to prevent window from being garbage collected)
let mainWindow
let tray
var iconpath = path.join(__dirname, 'resources' ,'icon.ico')

function createMainWindow() {

  let display = screen.getPrimaryDisplay();
  let width = display.bounds.width;
  let height = display.bounds.height;

  const window = new BrowserWindow({
    width: 415,
    height: 570,
    x: width - 415,
    y: height - 595, //515 normal
    frame: false,
    transparent: true,
    webPreferences: {nodeIntegration: true},
    icon: iconpath,
    resizable: false,
    show: true,
  })

  // window.loadURL(`http://localhost:5000/noBubble/`)
  window.loadURL(`https://max-assistant.tk/noBubble/`)
  
  // var tray = new Tray(iconpath)
  let trayIcon = nativeImage.createFromPath(iconpath)
  trayIcon = trayIcon.resize({ width: 16, height: 16 });
  tray = new Tray(trayIcon)
//
  var contextMenu = Menu.buildFromTemplate([
    {
        label: 'Abrir Chat', click: function () {
            window.show()
        }
    },
    {
        label: 'Esconder', click: function () {
            window.hide();
        }
    },
    {
        label: 'Fechar', click: function () {
            // app.isQuiting = true
            window.destroy();
            app.quit()
        }
    }
  ])

  tray.setToolTip('Max Desktop')
  tray.setContextMenu(contextMenu)

  tray.on('double-click', (event) => {
    window.show()
  })

  window.on('close', (event) => {
    // mainWindow = null
    event.preventDefault();
    window.hide();
  })

  // window.once('ready-to-show', () => {
  //   window.show()//
  // })

  window.webContents.on('devtools-opened', () => {
    window.focus()
    setImmediate(() => {
      window.focus()
    })
  })

  return window
}

// quit application when all windows are closed
app.on('window-all-closed', () => {
  // on macOS it is common for applications to stay open until the user explicitly quits
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // on macOS it is common to re-create a window even after all windows have been closed
  if (mainWindow === null) {
    mainWindow = createMainWindow()
  }
})

// create main BrowserWindow when electron is ready
app.on('ready', () => {
  mainWindow = createMainWindow()
})