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
  /*eslint-disable*/
  // Load the analytics snippet
  (function (i, s, o, g, r, a, m) {
    i['GoogleAnalyticsObject'] = r;
    i[r] = i[r] || function () {
      (i[r].q = i[r].q || []).push(arguments)
    }, i[r].l = 1 * new Date();
    a = s.createElement(o),
      m = s.getElementsByTagName(o)[0];
    a.async = 1;
    a.src = g;
    m.parentNode.insertBefore(a, m)
  })(window, document, 'script', 'https://www.google-analytics.com/analytics.js', 'ga');
  /*eslint-enable*/

  // Apply default configuration
  initConf = { ...pluginConfig, ...initConf }
  Utils.checkMandatoryParams(initConf)

  pluginConfig.debug = initConf.debug
  pluginConfig.globalDimensions = initConf.globalDimensions
  pluginConfig.globalMetrics = initConf.globalMetrics

  // register tracker
  ga('create', initConf.trackingId, 'auto', initConf.createOptions)

  // set app name and version
  ga('set', 'appName', initConf.appName)
  ga('set', 'appVersion', initConf.appVersion)

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
    initVueRouterGuard(Vue, initConf.vueRouter, initConf.ignoredViews, initConf.trackPage)
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
const initVueRouterGuard = function (Vue, vueRouter, ignoredViews, trackPage) {
  // Flatten routes name
  if (ignoredViews) {
    ignoredViews = ignoredViews.map(view => view.toLowerCase())
  }

  vueRouter.afterEach(to => {
    // Ignore some routes
    if (ignoredViews && ignoredViews.indexOf(to.name.toLowerCase()) !== -1) {
      return
    }

    // If specified : the system will use the path instead of the route name.
    const viewName = to.meta.usePathAnalytics ? to.path : to.name

    // Dispatch vue event using meta analytics value if defined otherwise fallback to route name/path.
    Vue.analytics.trackView(to.meta.analytics || viewName, trackPage)
  })

  return ignoredViews
}

// Export module
export default { install }
