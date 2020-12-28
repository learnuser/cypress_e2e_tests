
import {verifyCommonMenuItems, verifyAdminMenuItems, goToDashBoard,
        goToUserProfile, goToEditUserProfile, goToChangePassword,
        goToManageUsers, goToCreateUser}
        from '../../support/lib/main.js'

describe('Admin and End User LogIns', () => {

    beforeEach(() => {
        cy.visit('/login')
    });

    it('Verify Common Menu Items and Admin Menu Items for Admin', () => {
        let user = Cypress.env('adminUser')
        let password = Cypress.env('password')
        cy.logIn(user, password);
        verifyCommonMenuItems()
        verifyAdminMenuItems('admin')
    })

    it('Verify Common Menu Items and Admin Menu Items for End User', () => {
        let user = Cypress.env('endUser')
        let password = Cypress.env('password')
        cy.logIn(user, password);
        verifyCommonMenuItems()
        verifyAdminMenuItems('endUser')
    })
})

describe('GUI Navigation', () => {

    beforeEach(() => {
        cy.visit('/login')
    });

    it('Verify navigation to User Profile Page for Admin', () => {
        let user = Cypress.env('adminUser')
        let password = Cypress.env('password')
        cy.logIn(user, password);
        goToUserProfile('dashboard')
        goToUserProfile('leftnav')
        goToUserProfile()
        cy.logout()
    })

    it('Verify navigation to Edit User Profile Page for End User', () => {
        let user = Cypress.env('endUser')
        let password = Cypress.env('password')
        cy.logIn(user, password);
        goToEditUserProfile('leftnav')
        goToEditUserProfile('dashboard')
        goToEditUserProfile('userProfile')
        cy.logout()
    })

    it('Verify navigation to Change Password Page for End User', () => {
        let user = Cypress.env('endUser')
        let password = Cypress.env('password')
        cy.logIn(user, password);
        goToChangePassword()
        goToChangePassword('dashboard')
    })

    it('Verify navigation to Manage User and Create User Page for Admin', () => {
        let user = Cypress.env('adminUser')
        let password = Cypress.env('password')
        cy.logIn(user, password);
        goToCreateUser()
        goToCreateUser(true)
        cy.logout()
    })
})
