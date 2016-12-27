import pluginConfig from './config'
import AnalyticsPlugin from './AnalyticsPlugin'
import * as Utils from './utils'

const defaultConfig = {
  debug: false
}
/**
 * Installation procedure
 *
 * @param Vue
 * @param conf
 */
export const install = function (Vue, conf = {}) {
  // Apply default configuration
  conf = { ...defaultConfig, ...conf }
  Utils.checkMandatoryParams(conf)

  pluginConfig.debugMode = conf.debug

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

  // Inject global metrics
  if (conf.globalMetrics) {
    conf.globalMetrics.forEach(metric => {
      ga('set', `metric${metric.metric}`, metric.value)
    })
  }

  // Handle vue-router if defined
  if (conf.vueRouter) {
    initVueRouterGuard(Vue, conf.vueRouter, conf.ignoredViews)
  }

  // Add to vue prototype and also from globals
  Vue.prototype.$analytics = Vue.prototype.$ua = Vue.analytics = new AnalyticsPlugin(conf)
}

/**
 * Init the router guard.
 *
 * @param Vue - The Vue instance
 * @param vueRouter - The Vue router instance to attach guard
 * @param {string[]} ignoredViews - An array of route name to ignore
 *
 * @returns {string[]} The ignored routes names formalized.
 */
const initVueRouterGuard = function (Vue, vueRouter, ignoredViews) {
  // Flatten routes name
  if (ignoredViews) {
    ignoredViews = ignoredViews.map(view => view.toLowerCase())
  }

  vueRouter.afterEach(to => {
    // Ignore some routes
    if (ignoredViews && ignoredViews.indexOf(to.name.toLowerCase()) !== -1) {
      return
    }

    // Dispatch vue event using meta analytics value if defined otherwise fallback to route name
    Vue.analytics.trackView(to.meta.analytics || to.name)
  })

  return ignoredViews;
}