import { logDebug } from './utils'
/**
 * Plugin main class
 */
export default class AnalyticsPlugin {
  constructor (conf) {
    this.conf = conf
  }

  trackView (screenName) {
    logDebug('Dispatching TrackView', { screenName })

    ga('set', 'screenName', screenName)
    ga('send', 'screenview')
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
    // TODO : FieldObject is full syntax, refactor this
    logDebug('Dispatching event', { category, action, label, value, fieldsObject })

    ga('send', 'event', category, action, label, value, fieldsObject)
  }

  /**
   * Track an exception that occurred in the application.
   *
   * @param {string} description - Something describing the error (max. 150 Bytes)
   * @param {boolean} isFatal - Specifies whether the exception was fatal
   */
  trackException (description, isFatal = false) {
    ga('send', 'exception', { 'exDescription': description, 'exFatal': isFatal });
  }

  /**
   * Inject a new GlobalDimension that will be sent every time.
   *
   * Prefer inject through plugin configuration.
   *
   * @param {int} dimensionNumber
   * @param {string|int} value
   * @throws Error - If already defined
   */
  injectGlobalDimension (dimensionNumber, value) {
    logDebug('Trying dimension Injection...', { dimensionNumber, value })

    // Test if dimension already registered
    if (this.conf.globalDimensions.find(el => el.dimension === dimensionNumber)) {
      throw new Error('VueAnalytics : Dimension already registered')
    }

    // Otherwise add dimension
    const newDimension = { dimension: dimensionNumber, value }

    this.conf.globalDimensions.push(newDimension)
    ga('set', `dimension${newDimension.dimension}`, newDimension.value)
    logDebug('Dimension injected')
  }

  /**
   * Set the current session language, use this if you change lang in the application after initialization.
   *
   * @param {string} code - Must be like in that : http://www.lingoes.net/en/translator/langcode.htm
   */
  changeSessionLanguage (code) {
    logDebug('Changing application localisation & language');
    ga('set', 'language', code);
  }
}