import { app, BrowserWindow, ipcMain } from 'electron'
import models from './model.js'

/**
 * Set `__statics` path to static files in production;
 * The reason we are setting it here is that the path needs to be evaluated at runtime
 */
if (process.env.PROD) {
  global.__statics = require('path').join(__dirname, 'statics').replace(/\\/g, '\\\\')
}

let mainWindow

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 600,
    useContentSize: true,
    webPreferences: {
      // keep in sync with /quasar.conf.js > electron > nodeIntegration
      // (where its default value is "true")
      // More info: https://quasar.dev/quasar-cli/developing-electron-apps/node-integration
      nodeIntegration: true
    }
  })

  mainWindow.loadURL(process.env.APP_URL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

/**
* API
*/
////ipcMain.on('synchronous-message',  function (event, arg) {
////  console.log(event, arg)
////    //event.returnValue = 'ok' 
////    models[arg](function (res) {
////      event.returnValue = res
////    })
////})
ipcMain.handle('amc', async (event, args) => {
    let arg = args[0]
    let payload = null
    if (args.length > 1) {
      payload = args[1]
    }
    console.log(arg)
    let pro = new Promise((resolve, reject) => {
      models[arg](payload, function (res) {
        console.log('res -->', res)
        resolve(res)
      })
    })
    return await pro.then((mex) => {
      return mex
    })
})

















