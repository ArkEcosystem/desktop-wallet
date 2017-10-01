const hooks = require('../hooks')

xdescribe('Accessibility', function() {

  hooks.createApp.bind(this)()

  before(function() {
    return hooks.beforeBlock.bind(this)()
  })

  after(function() {
    return hooks.afterBlock.bind(this)()
  })

  // TODO fix aria 
  it('there are not any accessibility warnings or errors', function () {

    // Audit rules: https://github.com/GoogleChrome/accessibility-developer-tools/wiki/Audit-Rules
    const options = {
      ignoreRules: ['AX_COLOR_01', 'AX_TITLE_01']
    }

    return this.app.client.windowByIndex(0)
      .auditAccessibility(options).then(function(audit) {
        if (audit.failed)
          throw Error('Failed accessibility audit\n' + audit.message)
      })
  })

  // NOTE: this code could be used to check dynamic elements
  // beforeEach(function() {
  //
  //   app.client.addCommand('selectSection', function(section) {
  //     return this.click('button[data-section="' + section + '"]').pause(100)
  //       .waitForVisible('#' + section + '-section')
  //   })
  //
  //   this.app.client.addCommand('auditSectionAccessibility', function(section, options) {
  //     if (! options)
  //       options = {}
  //
  //     // Audit rules: https://github.com/GoogleChrome/accessibility-developer-tools/wiki/Audit-Rules
  //     if (! options.ignoreRules)
  //       options.ignoreRules = ['AX_COLOR_01', 'AX_TITLE_01']
  //
  //     return this.selectSection(section)
  //       .auditAccessibility(options).then(function(audit) {
  //         if (audit.failed)
  //           throw Error(section + ' section failed accessibility audit\n' + audit.message)
  //       })
  //   })
  // })

})
