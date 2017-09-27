'use strict'

const electron = require('electron')

const hooks = require('../hooks')
const userData = require('../user_data')

describe('ARK Client Tests', function() {
  hooks.bind(this)()

  it('checks hardcoded path for userData is correct', function () {
    return this.app.client.execute(function () {
      return electron.remote.app.getPath('userData')
    }).then(function (result) {
      return result.value
    }).should.eventually.equal(userData.getPath())
  })

  it('opens a window whose title is "Ark Client"', function () {
    return this.app.client.getWindowCount().should.eventually.equal(1)
      .browserWindow.isMinimized().should.eventually.be.false
      .browserWindow.isDevToolsOpened().should.eventually.be.false
      .browserWindow.isVisible().should.eventually.be.true
      .browserWindow.isFocused().should.eventually.be.true
      .browserWindow.getBounds().should.eventually.have.property('width').and.be.above(0)
      .browserWindow.getBounds().should.eventually.have.property('height').and.be.above(0)
      .browserWindow.getTitle().should.eventually.equal('Ark Client')
  })

  it('gets to darknet network', function () {
    return this.app.client.selectNetwork("DEVNET")
  })

  it('creates account', function () {
    return this.app.client.createAccount()
  })

//   describe('when clicking on a section from the nav bar', function () {
//     it('it shows the selected section in the main area', function () {
//       return this.app.client.dismissAboutPage()
//         .selectSection('windows')
//         .isExisting('button.is-selected[data-section="windows"]').should.eventually.be.true
//         .isVisible('#pdf-section').should.eventually.be.false
//         .selectSection('pdf')
//         .isVisible('#windows-section').should.eventually.be.false
//         .isExisting('button.is-selected[data-section="windows"]').should.eventually.be.false
//         .isExisting('button.is-selected[data-section="pdf"]').should.eventually.be.true
//     })
//   })

//   describe('when a demo title is clicked', function () {
//     it('it expands the demo content', function () {
//       let onlyFirstVisible = Array(30).fill(false)
//       onlyFirstVisible[0] = true

//       return this.app.client.dismissAboutPage()
//         .collapseDemos()
//         .selectSection('windows')
//         .click('.js-container-target')
//         .waitForVisible('.demo-box')
//         .isVisible('.demo-box').should.eventually.deep.equal(onlyFirstVisible)
//     })
//   })

//   describe('when the app is restarted after use', function () {
//     it('it launches at last visted section & demo', function () {
//       let onlyFirstVisible = Array(30).fill(false)
//       onlyFirstVisible[0] = true

//       return this.app.client.waitForVisible('#windows-section')
//         .then(restartApp)
//         .then(function () {
//           return this.app.client.waitForVisible('#windows-section')
//             .isVisible('#windows-section').should.eventually.be.true
//             .isVisible('.demo-box').should.eventually.deep.equal(onlyFirstVisible)
//         })
//     })
//   })

//   it('does not contain any accessibility warnings or errors', function () {
//     return this.app.client.dismissAboutPage()
//       .auditSectionAccessibility('windows')
//       .auditSectionAccessibility('crash-hang')
//       .auditSectionAccessibility('menus')
//       .auditSectionAccessibility('shortcuts')
//       .auditSectionAccessibility('ex-links-file-manager')
//       .auditSectionAccessibility('notifications')
//       .auditSectionAccessibility('dialogs')
//       .auditSectionAccessibility('tray')
//       .auditSectionAccessibility('ipc')
//       .auditSectionAccessibility('app-sys-information')
//       .auditSectionAccessibility('clipboard')
//       .auditSectionAccessibility('protocol')
//       .auditSectionAccessibility('pdf')
//       .auditSectionAccessibility('desktop-capturer')
//   })
})
