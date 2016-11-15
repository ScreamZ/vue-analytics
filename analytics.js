export default class AnalyticsPlugin {
  constructor (conf) {
    this.conf = conf
  }

  trackView (screenName) {
    if (this.conf.debug) {
      console.log('Dispatching TrackView', { screenName })
    }

    ga('send', 'screenview', { screenName })
  }

  /**
   * Dispatch an analytics event
   *
   * @param category
   * @param action
   * @param label
   * @param value
   * @param fieldsObject
   */
  trackEvent (category, action = null, label = null, value = null, fieldsObject = {}) {
    if (this.conf.debug) {
      console.log('VueAnalytics : Dispatching event', { category, action, label, value, fieldsObject })
    }

    ga('send', 'event', category, action, label, value, fieldsObject)
  }

  /**
   * Inject a new GlobalDimension that will be sent every time.
   *
   * Prefer inject through plugin configuration.
   *
   * @param {int} dimensionNumber
   * @param {string|int} value
   */
  injectGlobalDimension (dimensionNumber, value) {
    if (this.conf.debug) {
      console.log('VueAnalytics : Trying dimension Injection...', { dimensionNumber, value })
    }

    // Test if dimension already registered
    if (this.conf.globalDimensions.find(el => el.dimension === dimensionNumber)) {
      throw new Error('VueAnalytics : Dimension already registered')
    }

    // Otherwise add dimension
    const newDimension = { dimension: dimensionNumber, value }

    this.conf.globalDimensions.push(newDimension)
    ga('set', `dimension${newDimension.dimension}`, newDimension.value)
    console.log('VueAnalytics : Dimension injected')
  }
}

AnalyticsPlugin.install = function (Vue, conf) {

  // Default
  conf.debug = conf.debug || false

  if (!conf.trackingId) {
    throw new Error('VueAnalytics : Please provide a "trackingId" from the config')
  }

  if (!conf.appName) {
    throw new Error('VueAnalytics : Please provide a "appName" from the config')
  }

  // Declare analytics snipper
  (function (i, s, o, g, r, a, m) {
    i[ 'GoogleAnalyticsObject' ] = r;
    i[ r ] = i[ r ] || function () {
        (i[ r ].q = i[ r ].q || []).push(arguments)
      }, i[ r ].l = 1 * new Date();
    a = s.createElement(o),
      m = s.getElementsByTagName(o)[ 0 ];
    a.async = 1;
    a.src = g;
    m.parentNode.insertBefore(a, m)
  })(window, document, 'script', 'https://www.google-analytics.com/analytics.js', 'ga');

  // Register tracker
  ga('create', conf.trackingId, 'auto')
  ga('set', 'appName', conf.appName)

  // Create global dimensions
  if (conf.globalDimensions) {
    conf.globalDimensions.forEach(dimension => {
      ga('set', `dimension${dimension.dimension}`, dimension.value)
    })
  }

  // Handle vue-router if defined
  if (conf.vueRouter) {
    if (conf.debug) {
      console.log('Vue router found ! Dispatching views tracking with navigation guards...')
    }

    conf.vueRouter.afterEach(({ name: routeName }) => {
      if (conf.ignoredViews && config.ignoredViews.indexOf(routeName) !== -1) {
        return
      }

      // Dispatch vue event
      window.vueAnalytics.trackView(routeName)
    })
  }

  const analyticsPlugin = new AnalyticsPlugin(conf)

  // Add to vue prototype and also window for access through store...
  Vue.prototype.$ua = window.vueAnalytics = analyticsPlugin
}
