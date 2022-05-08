const { ipcRenderer } = require('electron')
const submitBtn = document.getElementById('submit');
const ipAddress = document.getElementById('ip-address');
// const storeIp = document.getElementById('store-ip')


const existingIp = localStorage.getItem('ip')
if (existingIp) {
    // storeIp.checked = true
    ipAddress.value = existingIp

}
ipcRenderer.on('getIp', (e, ip) => {
    if (existingIp) {
        // storeIp.checked = true
        ipAddress.value = existingIp
    }
})



ipcRenderer.on('error', (e, error) => {
    ipAddress.parentElement.classList.add('error')
    const errorTag = document.getElementById('error-tag')
    if (errorTag) {
        errorTag.innerHTML = error
        return
    }
    createErrorTag(error)
})


if (submitBtn) {
    submitBtn.addEventListener('click', logon)
}

function createErrorTag(errorText) {
    const errorTag = document.createElement('p')
    errorTag.id = 'error-tag'
    ipAddress.parentElement.appendChild(errorTag)
    errorTag.innerHTML = errorText
}

function logon(e) {
    if (ipAddress) {
        ipAddress.classList.remove('error')
        if (!ipAddress.value) {
            ipAddress.parentElement.classList.add('error')
            const errorTag = document.getElementById('error-tag')
            if (errorTag){
                errorTag.innerHTML = 'Please enter a valid IP address'
                return
            }
            createErrorTag('Please enter a valid IP address')
            return
        }
        ipcRenderer.send('sendip', ipAddress.value)
        // if (storeIp.checked) {
        //     localStorage.setItem('ip', ipAddress.value)
        // }
        localStorage.setItem('ip', ipAddress.value)
        ipAddress.value = ''
    }
}