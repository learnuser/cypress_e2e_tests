// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'
import '@shelex/cypress-allure-plugin';
import addContext from 'mochawesome/addContext'

Cypress.on("uncaught:exception", (err) => {
  return false;
})

Cypress.on('test:after:run', (test, runnable) => {
    if (test.state === 'failed') {
      let item = runnable
      const nameParts = [runnable.title]
  
      // Iterate through all parents and grab the titles
      while (item.parent) {
        nameParts.unshift(item.parent.title)
        item = item.parent
      }
  
      const MAX_SPEC_NAME_LENGTH = 220;
      const fullTestName = nameParts
              .filter(Boolean)
              .join(' -- ')           // this is how cypress joins the test title fragments
              .slice(0, MAX_SPEC_NAME_LENGTH)
              .replace(/\//g, '')

      const imageUrl = `screenshots/${
        Cypress.spec.name
      }/${fullTestName} (failed).png`
  
      addContext({ test }, imageUrl)
    }
  })


// Alternatively you can use CommonJS syntax:
// require('./commands')
