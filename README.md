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

Dispatch events and track views from Vue components.

<img src="http://occhiobiancogiuseppe.it/wp-content/uploads/2015/09/work_in_progress.png" height=130>

This is a work in progress, this is stable for production but breaking changes may be introduced through minor revisions, but never in patch version.

# Requirements

- **Vue.js.** >= 2.0.0
- **Google Analytics account.** To retrieve Data

**Optionnals dependencies**

- **Vue Router** >= 2.x - In order to use auto-tracking


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

Once registered you can access vue analytics in your components like this :

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

You can also access the instance everywhere using `Vue.analytics`, it's useful when you are in the store or somewhere else than components.

## Using vue-router guards

You can automatically dispatch new screen views on router change, to use this feature simply pass the router instance on plugin initialization.

This feature will generate the view name depending on two case :
- If you defined a meta field for you route named `analytics` this will take the value of this field for the view name.
- If the plugin don't have a value for the `meta.analytics` it will fallback to the internal route name.

Example : 
```javascript
const myRoute = {
  path: 'myRoute',
  name: 'MyRouteName',
  component: SomeComponent,
  meta: {analytics: 'MyCustomValue'}
}
```

This will use `MyCustomValue` as the view name.

## API reference

### trackEvent (category, action = null, label = null, value = null, fieldsObject = {})
```javascript
  /**
   * Dispatch an analytics event.
   * Format is the same as analytics classical values.
   *
   * @param category
   * @param action
   * @param label
   * @param value
   * @param fieldsObject
   */
```

### trackView (screenName)
```javascript
 /**
   * Dispatch a view using the screen name
   * 
   * @param screenName
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
