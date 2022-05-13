function getMainmenuTemplate() {
    let menuTemplate = [
        {
            label: 'Zoom In',
            role: 'zoomIn'
        },
        {
            label: 'Zoom Out',
            role: 'zoomOut'
        }
    ]

    // if (process.env.NODE_ENV !== 'production') {
    //     menuTemplate.push({
    //         label: 'Developer Tools',
    //         submenu: [{
    //             label: 'Toggle DevTools',
    //             accelerator: process.platform == 'darwin' ? 'Command+I' : 'Ctrl+I',
    //             click(item, focusedWindow) {
    //                 focusedWindow.toggleDevTools();
    //             }
    //         },
    //         {
    //             role: 'reload'
    //         }]
    //     })
    // }

    return menuTemplate;

}

module.exports = getMainmenuTemplate;