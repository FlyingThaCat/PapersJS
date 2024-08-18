const { ipcRenderer } = require('electron')

window.addEventListener('load', () => {
  const checkCookie = (captcha) => {
    const cookie = document.cookie
    //get needed cookie
    let bwCookie = cookie.match(/bw=.*?;/g)
    let visCookie = cookie.match(/vis=.*?;/g)
    //get value of cookie
    bwCookie = bwCookie ? bwCookie[0].split('=')[1].slice(0, -1) : null
    visCookie = visCookie ? visCookie[0].split('=')[2].slice(0, -1) : null
    if (captcha) {
      if (bwCookie.length !== 0 && visCookie.length !== 0) {
        return cookie
      } else {
        return false
      }
    } else {
      return cookie
    }
  }

  const isCaptchaPresent = !!document.getElementById('g-recaptcha-response')
  if (isCaptchaPresent) {
    window.alert('You need to solve the captcha!')
    const intervalId = setInterval(() => {
      const cookie = checkCookie(true)
      if (cookie) {
        ipcRenderer.send('despawn-gettyImages', cookie)
        clearInterval(intervalId)
      }
    }, 2000)
  } else {
    const cookie = checkCookie(false)
    ipcRenderer.send('despawn-gettyImages', cookie)
  }
  // TODO HANDLE REFRESH BW TOKEN
})
