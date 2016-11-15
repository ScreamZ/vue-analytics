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
  ignoredViews: ['homepage'], // If router, you can exclude some routes name
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
      }
    },
    mounted () {
      this.$ua.trackView('MyScreenName')
    }
}
```

You can also access the instance everywhere using `window.vueAnalytics`, it's useful when you are in the store or somewhere else than components.

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