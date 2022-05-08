const { app, Menu, BrowserWindow, ipcMain } = require('electron')
const getMainmenuTemplate = require('./utils/menuItems')

app.disableHardwareAcceleration()

let startWindow, browserWindow
function createWindow() {

    startWindow = new BrowserWindow({
        height: 600, width: 800, webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true
        },
        icon: `${__dirname}/public/jamb-logo.ico`,
    });



    startWindow.loadFile('public/index.html')

    startWindow.webContents.send('getIp', '')


    const mainMenu = Menu.buildFromTemplate(getMainmenuTemplate())
    Menu.setApplicationMenu(mainMenu)
}

app.whenReady()
    .then(() => {

        createWindow()
        app.on('activate', () => {
            if (BrowserWindow.getAllWindows().length === 0) {
                createWindow()
            }
        })
    }).catch(err => { console.log(err) })

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})


ipcMain.on('sendip', function (e, ipAddress) {
    try {
        browserWindow = new BrowserWindow({
            webPreferences: {
                contextIsolation: false,
                enableRemoteModule: true,
                allowRunningInsecureContent: true
            },
            icon: `${__dirname}/public/jamb-logo.ico`,
            show: false,
            title: "FlahCBT",
            fullscreen: true
        });

        browserWindow.loadURL(`http://${ipAddress}:9091`)
        browserWindow.show()
        browserWindow.webContents.on('did-fail-load', () => {
            browserWindow.close()
            startWindow.show()
            startWindow.webContents.send('getIp', '')
            startWindow.webContents.send('error', 'Could not Load page. Please check your connection, check Ip Address and try again.')
        })
        browserWindow.webContents.on('did-finish-load', () => {
            if (startWindow) {
                startWindow.close()
                startWindow = null
            }

        })
        startWindow.hide()

    } catch (err) {

    }

})
