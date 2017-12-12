'use strict'

describe('DashboardController', function () {
  const expect = chai.expect

  let ctrl

  let feedServiceMock,
    storageServiceMock,
    mdToastMock

  beforeEach(() => {
    module('arkclient.components', $provide => {
      feedServiceMock = {
        fetchBlogEntries: sinon.stub()
      }
      storageServiceMock = {
        getGlobal: sinon.stub()
      }
      mdToastMock = {
        show: sinon.stub()
      }

      $provide.value('feedService', feedServiceMock)
      $provide.value('storageService', storageServiceMock)
      $provide.value('$mdToast', mdToastMock)
    })

    inject(_$componentController_ => {
      ctrl = _$componentController_('dashboard', null, {})
    })
  })

  describe('showAnnouncements()', () => {
    context('when fetches the blog entries', () => {
      // NOTE: isoDate is a full datetime
      const entries = [ { guid: 'b', isoDate: 2017 } ]

      beforeEach(() => feedServiceMock.fetchBlogEntries.resolves(entries))

      context("when isn't stored any announcement", () => {
        it('shows the new one', function () {
          storageServiceMock.getGlobal.returns(null)

          return ctrl.showAnnouncements().then(() => {
            expect(mdToastMock.show.called).to.be.true
          })
        })
      })

      context('when the last stored announcement is older', () => {
        it('shows the new one', function () {
          storageServiceMock.getGlobal.returns({ last: { guid: 'a', isoDate: 2010 } })

          return ctrl.showAnnouncements().then(() => {
            expect(mdToastMock.show.called).to.be.true
          })
        })
      })

      context('when the last stored announcement is from the exact same date', () => {
        it("doesn't show anything", function () {
          storageServiceMock.getGlobal.returns({ last: { guid: 'c', isoDate: 2017 } })

          return ctrl.showAnnouncements().then(() => {
            expect(mdToastMock.show.called).to.be.false
          })
        })
      })

      context('when the last stored announcement is the same than the new one', () => {
        it("doesn't show anything", function () {
          storageServiceMock.getGlobal.returns({ last: { guid: 'b', isoDate: 2010 } })

          return ctrl.showAnnouncements().then(() => {
            expect(mdToastMock.show.called).to.be.false
          })
        })
      })

      context('when the last stored announcement is newer', () => {
        it("doesn't show anything", function () {
          storageServiceMock.getGlobal.returns({ last: { guid: 'c', isoDate: 2018 } })

          return ctrl.showAnnouncements().then(() => {
            expect(mdToastMock.show.called).to.be.false
          })
        })
      })
    })
  })
})
