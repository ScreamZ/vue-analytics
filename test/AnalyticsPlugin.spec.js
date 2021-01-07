import sinon from 'sinon'
import AnalyticsPlugin from '../src/AnalyticsPlugin'
import pluginConfig from '../src/config'
import * as utils from '../src/utils'

describe('AnalyticsPlugin', () => {
  const analyticsPlugin = new AnalyticsPlugin()

  beforeEach(() => {
    sinon.spy(utils, 'logDebug')
    sinon.spy(global, 'ga')
  })

  afterEach(() => {
    utils.logDebug.restore()
    global.ga.restore()
  })

  describe('#trackView', () => {
    describe('when tracking "screens"', () => {
      beforeEach(() => {
        analyticsPlugin.trackView('myScreen')
      })

      it('should log event', () => {
        expect(utils.logDebug).to.have.been.calledWith('Dispatching TrackView', { name: 'myScreen', trackPage: false })
      })

      it('should set "screenName"', () => {
        expect(ga.firstCall.args).to.eql(['set', 'screenName', 'myScreen'])
      })

      it('should set "screenView"', () => {
        expect(ga.secondCall.args).to.eql(['send', 'screenview'])
      })
    })

    describe('when tracking "pages"', () => {
      beforeEach(() => {
        analyticsPlugin.trackView('myPage', true)
      })

      it('should log event', () => {
        expect(utils.logDebug).to.have.been.calledWith('Dispatching TrackView', { name: 'myPage', trackPage: true })
      })

      it('should set "screenName"', () => {
        expect(ga.firstCall.args).to.eql(['set', 'page', 'myPage'])
      })

      it('should set "screenView"', () => {
        expect(ga.secondCall.args).to.eql(['send', 'pageview'])
      })
    })
  })

  describe('#trackEvent', () => {
    beforeEach(() => {
      analyticsPlugin.trackEvent('myCategory', 'myAction', 'myLabel', 'myValue')
    })

    it('should log event', () => {
      expect(utils.logDebug).to.have.been.calledWith('Dispatching event', { category: 'myCategory', action: 'myAction', label: 'myLabel', value: 'myValue' })
    })

    it('should send "event"', () => {
      expect(ga).to.have.been.calledWith('send', 'event', 'myCategory', 'myAction', 'myLabel', 'myValue')
    })
  })

  describe('#trackException', () => {
    beforeEach(() => {
      analyticsPlugin.trackException('my error', true)
    })

    it('should log event', () => {
      expect(utils.logDebug).to.have.been.calledWith('Dispatching exception event', { description: 'my error', isFatal: true })
    })

    it('should send "exception event"', () => {
      expect(ga).to.have.been.calledWith('send', 'exception', { exDescription: 'my error', exFatal: true })
    })
  })

  describe('#trackTiming', () => {
    const conf = {
      hitType: 'timing',
      timingCategory: 'myTiming',
      timingVar: 'testVar',
      timingValue: 1234,
      timingLabel: 'myTimingLabel'
    }

    describe('with "timingLabel"', () => {
      beforeEach(() => {
        analyticsPlugin.trackTiming('myTiming', 'testVar', 1234, 'myTimingLabel')
      })

      it('should log event', () => {
        expect(utils.logDebug).to.have.been.calledWith('Dispatching timing', conf)
      })

      it('should send timing event', () => {
        expect(ga).to.have.been.calledWith('send', conf)
      })
    })

    describe('without "timingLabel"', () => {
      beforeEach(() => {
        analyticsPlugin.trackTiming('myTiming', 'testVar', 1234)
        delete conf.timingLabel
      })

      it('should log event', () => {
        expect(utils.logDebug).to.have.been.calledWith('Dispatching timing', conf)
      })

      it('should send timing event', () => {
        expect(ga).to.have.been.calledWith('send', conf)
      })
    })
  })

  describe('#injectGlobalDimension', () => {
    describe('when new dimension', () => {
      beforeEach(() => {
        pluginConfig.globalDimensions = []
        analyticsPlugin.injectGlobalDimension(123, 'abc')
      })

      it('should log event', () => {
        expect(utils.logDebug.firstCall.args).to.eql(['Trying dimension Injection...', { dimensionNumber: 123, value: 'abc' }])
        expect(utils.logDebug.secondCall.args).to.eql(['Dimension injected'])
      })

      it('should push a new dimension to plugin configuration', () => {
        expect(pluginConfig.globalDimensions).to.eql([{ dimension: 123, value: 'abc' }])
      })

      it('should set ga dimension', () => {
        expect(ga).to.have.been.calledWith('set', 'dimension123', 'abc')
      })
    })

    describe('when existing dimension', () => {
      beforeEach(() => {
        pluginConfig.globalDimensions = [{ dimension: 123, value: 'abc' }]
      })

      it('should throw exception', () => {
        expect(() => analyticsPlugin.injectGlobalDimension(123, 'abc')).to.throw(Error)
      })
    })
  })

  describe('#injectGlobalMetric', () => {
    describe('when new metric', () => {
      beforeEach(() => {
        pluginConfig.globalMetrics = []
        analyticsPlugin.injectGlobalMetric(123, 'abc')
      })

      it('should log event', () => {
        expect(utils.logDebug.firstCall.args).to.eql(['Trying metric Injection...', { metricNumber: 123, value: 'abc' }])
        expect(utils.logDebug.secondCall.args).to.eql(['Metric injected'])
      })

      it('should push a new metric to plugin configuration', () => {
        expect(pluginConfig.globalMetrics).to.eql([{ metric: 123, value: 'abc' }])
      })

      it('should set ga metric', () => {
        expect(ga).to.have.been.calledWith('set', 'metric123', 'abc')
      })
    })

    describe('when existing metric', () => {
      beforeEach(() => {
        pluginConfig.globalMetrics = [{ dimension: 123, value: 'abc' }]
      })

      it('should throw exception', () => {
        expect(() => analyticsPlugin.injectGlobalDimension(123, 'abc')).to.throw(Error)
      })
    })
  })

  describe('#injectGlobalContentGroups', () => {
    describe('when new contentGroup', () => {
      beforeEach(() => {
        pluginConfig.globalContentGroups = []
        analyticsPlugin.injectGlobalContentGroups(123, 'abc')
      })

      it('should log event', () => {
        expect(utils.logDebug.firstCall.args).to.eql(['Trying contentGroup Injection...', { contentGroupNumber: 123, value: 'abc' }])
        expect(utils.logDebug.secondCall.args).to.eql(['Content Grouping injected'])
      })

      it('should push a new contentGroup to plugin configuration', () => {
        expect(pluginConfig.globalContentGroups).to.eql([{ contentGroup: 123, value: 'abc' }])
      })

      it('should set ga contentGroup', () => {
        expect(ga).to.have.been.calledWith('set', 'contentGroup123', 'abc')
      })
    })

    describe('when existing contentGroup', () => {
      beforeEach(() => {
        pluginConfig.globalContentGroups = [{ dimension: 123, value: 'abc' }]
      })

      it('should throw exception', () => {
        expect(() => analyticsPlugin.injectGlobalDimension(123, 'abc')).to.throw(Error)
      })
    })
  })

  describe('#changeSessionLanguage', () => {
    beforeEach(() => {
      analyticsPlugin.changeSessionLanguage('pt-BR')
    })

    it('should log event', () => {
      expect(utils.logDebug).to.have.been.calledWith('Changing application localisation & language to pt-BR')
    })

    it('should set language to "pt-BR"', () => {
      expect(ga).to.have.been.calledWith('set', 'language', 'pt-BR')
    })
  })
})
