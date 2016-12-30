import pluginConfig from './config'
import AnalyticsPlugin from './AnalyticsPlugin'
import * as Utils from './utils'

/**
 * Installation procedure
 *
 * @param Vue
 * @param initConf
 */
const install = function (Vue, initConf = {}) {
  // Apply default configuration
  initConf = { ...pluginConfig, ...initConf }
  Utils.checkMandatoryParams(initConf)

  pluginConfig.debug = initConf.debug
  pluginConfig.globalDimensions = initConf.globalDimensions
  pluginConfig.globalMetrics = initConf.globalMetrics

  // Register tracker
  ga('create', initConf.trackingId, 'auto', {
    transport: 'beacon',
    appName: initConf.appName,
    appVersion: initConf.appVersion
  })

  // Inject global dimensions
  if (initConf.globalDimensions) {
    initConf.globalDimensions.forEach(dimension => {
      ga('set', `dimension${dimension.dimension}`, dimension.value)
    })
  }

  // Inject global metrics
  if (initConf.globalMetrics) {
    initConf.globalMetrics.forEach(metric => {
      ga('set', `metric${metric.metric}`, metric.value)
    })
  }

  // Handle vue-router if defined
  if (initConf.vueRouter) {
    initVueRouterGuard(Vue, initConf.vueRouter, initConf.ignoredViews)
  }

  // Add to vue prototype and also from globals
  Vue.prototype.$analytics = Vue.prototype.$ua = Vue.analytics = new AnalyticsPlugin()
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

// Export module
export default { install }