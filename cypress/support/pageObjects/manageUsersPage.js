
import * as editUserPage from './editUserPage'

//page elements
function getEditButton(email){
    return cy.contains(email).parent().find('[class="v-btn__content"]')
}

export function getTitle(){
    return cy.contains('[class="v-toolbar__title"]', 'Manage Users')
}

//page actions

export function clickOnEditButton(email){
    getEditButton(email).click()
    cy.verifyPageTitle('Edit User')
    return editUserPage
}