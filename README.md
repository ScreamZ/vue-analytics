<h1 align="center">
  Vue Analytics
  <br>
  <br>
</h1>

<h4 align="center">Simple implementation of Google Analytics in Vue.js</h4>

<p align="center">
  <a href="https://github.com/feross/standard"><img src="https://cdn.rawgit.com/feross/standard/master/badge.svg" alt="Standard - JavaScript Style Guide"></a>
</p>
<br>

This plugin will helps you in your common analytics tasks. Dispatching events, register some dimensions, metric and track views from Vue components.

# Requirements

- **Vue.js.** >= 2.0.0
- **Google Analytics account.** To send data to

**Optionnals dependencies**

- **Vue Router** >= 2.x - In order to use auto-tracking of screens


# Configuration

`npm install vue-ua -S` or `yarn add vue-ua` if you use [Yarn package manager](https://yarnpkg.com/)

Here is an example of configuration, compose with it on your own :

```javascript
import VueAnalytics from 'vue-ua'
import VueRouter from 'vue-router'
const router = new VueRouter({routes, mode, linkActiveClass})

Vue.use(VueAnalytics, {
  appName: '<app_name>', // Mandatory
  appVersion: '<app_version>', // Mandatory
  trackingId: '<your_tracking_id>', // Mandatory
  debug: true, // Whether or not display console logs debugs (optional)
  vueRouter: router, // Pass the router instance to automatically sync with router (optional)
  ignoredViews: ['homepage'], // If router, you can exclude some routes name (case insensitive) (optional)
  trackPage: true|false, // Whether you want page changes to be recorded as pageviews (website) or screenviews (app), default: false
  createOptions: { // Optional, Option when creating GA tracker, ref: https://developers.google.com/analytics/devguides/collection/analyticsjs/field-reference
    siteSpeedSampleRate: 10, 
  },
  globalDimensions: [ // Optional
    {dimension: 1, value: 'MyDimensionValue'},
    {dimension: 2, value: 'AnotherDimensionValue'}
  ],
  globalMetrics: [ // Optional
      {metric: 1, value: 'MyMetricValue'},
      {metric: 2, value: 'AnotherMetricValue'}
    ]
})
```

# Documentation

Once the configuration is completed, you can access vue analytics instance in your components like that :

```javascript
export default {
    name: 'MyComponent',
    data () {
      return {
        someData: false
      }
    },
    methods: {
      onClick: function() {
        this.$ua.trackEvent('Banner', 'Click', 'I won money!')
        // OR
        this.$analytics.trackEvent('Banner', 'Click', 'I won money!')
      }
    },
    mounted () {
      this.$ua.trackView('MyScreenName')
    }
}
```

You can also access the instance anywhere whenever you imported `Vue` by using `Vue.analytics`. It is especially useful when you are in a store module or
somewhere else than a component's scope.

## Sync analytics with your router

Thanks to vue-router guards, you can automatically dispatch new screen views on router change !
To use this feature, you just need to inject the router instance on plugin initialization.

This feature will generate the view name according to a priority rule :
- If you defined a meta field for you route named `analytics` this will take the value of this field for the view name.
- Otherwise, if the plugin don't have a value for the `meta.analytics` it will fallback to the internal route name.

Most of time the second case is enough, but sometimes you want to have more control on what is sent, this is where the first rule shine.

Example : 
```javascript
const myRoute = {
  path: 'myRoute',
  name: 'MyRouteName',
  component: SomeComponent,
  meta: {analytics: 'MyCustomValue'}
}
```

> This will use `MyCustomValue` as the view name.

## API reference

### trackEvent (category, action = null, label = null, value = null)
```javascript
  /**
   * Dispatch an analytics event.
   * Format is the same as analytics classical values.
   *
   * @param category
   * @param action
   * @param label
   * @param value
   */
```

### trackView (screenName, trackPage = false)
```javascript
 /**
   * Dispatch a view using the screen name
   * 
   * @param screenName {string}
   * @param trackPage {boolean} - Whether you want the dispatched view to be recorded as pageview (website) or screenview (app)
   */
```

### trackTiming (timingCategory, timingVar, timingValue, timingLabel = null)
```javascript
/**
   * Track an user timing to measure periods of time.
   *
   * @param {string} timingCategory - A string for categorizing all user timing variables into logical groups (e.g. 'JS Dependencies').
   * @param {string} timingVar -  A string to identify the variable being recorded (e.g. 'load').
   * @param {number} timingValue - The number of milliseconds in elapsed time to report to Google Analytics (e.g. 20).
   * @param {string|null} timingLabel -  A string that can be used to add flexibility in visualizing user timings in the reports (e.g. 'Google CDN').
   */
```
### injectGlobalDimension (dimensionNumber, value)
```javascript
  /**
   * Inject a new GlobalDimension that will be sent every time.
   *
   * Prefer inject through plugin configuration.
   *
   * @param {int} dimensionNumber
   * @param {string|int} value
   * 
   * @throws Error - If already defined
   */
```

### injectGlobalMetric (metricNumber, value)
```javascript
 /**
   * Inject a new GlobalMetric that will be sent every time.
   *
   * Prefer inject through plugin configuration.
   *
   * @param {int} metricNumber
   * @param {string|int} value
   * 
   * @throws Error - If already defined
   */
```

### trackException (description, isFatal = false)
```javascript
  /**
   * Track an exception that occurred in the application.
   *
   * @param {string} description - Something describing the error (max. 150 Bytes)
   * @param {boolean} isFatal - Specifies whether the exception was fatal
   */
```

### changeSessionLanguage (code)
```javascript
  /**
   * Set the current session language, use this if you change lang in the application after initialization.
   *
   * @param {string} code - Must be like in that : http://www.lingoes.net/en/translator/langcode.htm
   */
```
