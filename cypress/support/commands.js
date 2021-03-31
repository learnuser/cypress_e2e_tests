// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//

import * as mainPage from './pageObjects/mainPage.js'
import addContext from "mochawesome/addContext"

Cypress.Commands.add("addContext", (context) => {
  cy.once("test:after:run", (test) => addContext({ test }, context))
})

//selectors
const userField = 'input[name="login"]';
const pwdField = 'input[name="password"]';

Cypress.Commands.add('logIn', (userName, password, valid=true) =>{
    cy.get(userField).type(userName)
    cy.get(pwdField).type(password)
    cy.intercept('POST', '/api/v1/login/access-token').as('token')
    cy.getButton('Login').click()
    if (valid){
        cy.verifyPageTitle('Dashboard');
    } else {
        cy.contains('[class="v-alert error"]', 'Incorrect email or password')
    }
})

Cypress.Commands.add('logout', () =>{
    mainPage.getMenuActivator().should('be.visible').click()
    mainPage.getInactiveMenuItem('Logout').should('be.visible').click()
})

Cypress.Commands.add('getButton', (label) =>{
    return cy.contains('[class="v-btn__content"]', label)
})

Cypress.Commands.add('getField', (label) =>{
    return cy.get('input[aria-label="'+label+'"]')
})

Cypress.Commands.add('verifyPageTitle', (text) =>{
    mainPage.getPageTitle().then((title)=>{
        expect(title).to.eq(text)
    })
})

Cypress.Commands.add('getFieldText', (label) =>{
    return cy.contains('[class*="subheading secondary--text"]', label)
            .next('[class*="title primary--text"]').then((el) => {
                return el.text()
            })
})

