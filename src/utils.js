import pluginConfig from './config'

/**
 * Console log depending on config debug mode
 * @param {...*} message
 */
export const logDebug = function (message) {
  if (pluginConfig.debug) {
    console.log('VueAnalytics :', ...arguments)
  }
}

export const checkMandatoryParams = function (params) {
  const mandatoryParams = [ 'trackingId', 'appName', 'appVersion' ]

  mandatoryParams.forEach(el => {
    if (!params[ el ]) throw new Error(`VueAnalytics : Please provide a "${el}" from the config.`)
  })
}

/**
 * Handle tools for cordova app workarounds
 */
export const cordovaApp = {
  bootstrapWindows () {
    // Disable activeX object to make Analytics.js use XHR, or something else
    window.ActiveXObject = undefined
    ga('set', 'checkProtocolTask', null)
  }
}
