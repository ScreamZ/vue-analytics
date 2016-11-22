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

- **Vue.js.** > 2.0.0
- **Google Analytics account.** To retrieve Data


# Configuration

`npm install vue-ua -S` or `yarn add vua-ua` if you use [Yarn package manager](https://yarnpkg.com/)

Here is an example of configuration, compose with it on your own :

```javascript
import VueAnalytics from 'vue-ua'
import VueRouter from 'vue-router'
const router = new VueRouter({routes, mode, linkActiveClass})

Vue.use(VueAnalytics, {
  appName: '<app_name>',
  appVersion: '<app_version>',
  trackingId: '<your_tracking_id>',
  debug: true, // Whether or not display console logs (optional)
  vueRouter: router, // Pass the router instance to automatically sync with router (optional)
  ignoredViews: ['homepage'], // If router, you can exclude some routes name (case insensitive)
  globalDimensions: [
    {dimension: 1, value: 'MyDimensionValue'},
    {dimension: 2, value: 'AnotherDimensionValue'}
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

You can automatically dispatch new screen views on router change, to do this simply pass the router instance on plugin initialization.
At the moment, this is using the `route name` to name the HIT, but this is going to be updated to allow you to specify whatever values you wants.


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