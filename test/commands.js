module.exports = function(app) {

  app.client.addCommand('selectNetwork', function(network) {
    return this.click('[aria-label="Switch Network"] button')
      .pause(500)
      .click("//button[contains(text(), '"+network+"')]")
      .pause(500)
  })

  app.client.addCommand('createAccount', function() {
    return this
      .click('[aria-label="Settings"] button')
      .pause(500)
      .click('button[aria-label="Create Account"]')
      .pause(2000)
  })

  app.client.addCommand('dismissAboutPage', function() {
    return this.isVisible('.js-nav').then(function(navVisible) {
      if (!navVisible) {
        return this.click('button[id="get-started"]').pause(500)
      }
    })
  })

  app.client.addCommand('selectSection', function(section) {
    return this.click('button[data-section="' + section + '"]').pause(100)
      .waitForVisible('#' + section + '-section')
  })

  app.client.addCommand('expandDemos', function() {
    return this.execute(function() {
      for (let demo of document.querySelectorAll('.demo-wrapper')) {
        demo.classList.add('is-open')
      }
    })
  })

  app.client.addCommand('collapseDemos', function() {
    return this.execute(function() {
      for (let demo of document.querySelectorAll('.demo-wrapper')) {
        demo.classList.remove('is-open')
      }
    })
  })

  app.client.addCommand('auditSectionAccessibility', function(section) {
    const options = {
      ignoreRules: ['AX_COLOR_01', 'AX_TITLE_01']
    }
    return this.selectSection(section)
      .expandDemos()
      .auditAccessibility(options).then(function(audit) {
        if (audit.failed) {
          throw Error(section + ' section failed accessibility audit\n' + audit.message)
        }
      })
  })

}
