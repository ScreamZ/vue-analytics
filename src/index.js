import pluginConfig from './config';
import AnalyticsPlugin from './AnalyticsPlugin'
import * as Utils from './utils'

/**
 * Installation procedure
 *
 * @param Vue
 * @param conf
 */
export const install = function (Vue, conf = {}) {
  Utils.checkMandatoryParams(conf)

  conf.debug = conf.debug || false
  pluginConfig.debugMode = conf.debug

  // Experimental
  if (conf.appType) {
    switch (conf.appType) {
      case 'cordova-windows':
        Utils.cordovaApp.bootstrapWindows()
        break
    }
  }

  // Register tracker
  ga('create', conf.trackingId, 'auto', {
    transport: 'beacon',
    appName: conf.appName,
    appVersion: conf.appVersion
  })

  // Inject global dimensions
  if (conf.globalDimensions) {
    conf.globalDimensions.forEach(dimension => {
      ga('set', `dimension${dimension.dimension}`, dimension.value)
    })
  }

  // Handle vue-router if defined
  if (conf.vueRouter) {
    // Flatten routes name
    if (conf.ignoredViews) {
      conf.ignoredViews = conf.ignoredViews.map(view => view.toLowerCase())
    }

    conf.vueRouter.afterEach(({ name: routeName }) => {
      if (conf.ignoredViews && conf.ignoredViews.indexOf(routeName.toLowerCase()) !== -1) {
        return
      }

      // Dispatch vue event
      Vue.analytics.trackView(routeName)
    })
  }

  // Add to vue prototype and also from globals
  Vue.prototype.$analytics = Vue.prototype.$ua = Vue.analytics = new AnalyticsPlugin(conf)
}