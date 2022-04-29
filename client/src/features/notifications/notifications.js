import Notify from 'bnc-notify'


const notifyOptions = {
  networkId: 1,
  darkMode: true, // (default: false)
  mobilePosition: 'bottom', // 'top', 'bottom' (default: 'top')
  desktopPosition: 'bottomRight', // 'bottomLeft', 'bottomRight', 'topLeft', 'topRight' (default: 'bottomRight')
}

const notify = Notify(notifyOptions);

const showNotification = (eventCode, type, message) => {
  const { update, dismiss } = notify.notification({ eventCode: eventCode, type: type, message: message })


  if (type === 'error') {
    setTimeout(() => {
      dismiss();
    }, 5000)
  }


}


export { showNotification }
