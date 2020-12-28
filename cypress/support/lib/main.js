
import * as mainPage from '../pageObjects/mainPage.js'
import * as manageUsers from '../pageObjects/manageUsersPage.js'

export function verifyCommonMenuItems(){
    //verify links for admin/end user
    cy.allure().startStep('Verify common menu items')
    let menuItems = ['Dashboard', 'Profile', 'Edit Profile', 'Change Password', 'Logout', 'Collapse']
    menuItems.forEach(item=>{
        cy.allure().step('Verify menu item - ' + item + ' is visible')
        mainPage.getMenuItem(item)
            .should('be.visible')
    })
    cy.allure().endStep()
}

export function verifyAdminMenuItems(role, leftNav=false){
    cy.allure().step('Verify admin specific menu items')
    let admin= ['Manage Users', 'Create User']
    if (leftNav){
        mainPage.getLeftNavButton().click()
    }
    admin.forEach(item=>{
        if (role.toLowerCase() === 'admin') {
            cy.allure().step('Verify menu item - ' + item + ' is visible for admin')
            mainPage.getMenuItem(item).should('be.visible')
        } else {
            cy.allure().step('Verify menu item - ' + item + ' is NOT visible for end user')
            mainPage.getMenuItem(item).should('not.be.visible')
        }
    })
}

export function goToDashBoard(){
    cy.allure().step('Go to Dashboard')
    cy.visit('/main/dashboard')
    mainPage.getLeftNavButton().click({force: true})
    cy.verifyPageTitle('Dashboard')
}

export function goToUserProfile(path = 'menu'){
    goToDashBoard()
    cy.allure().step('Go to User Profile Page via ' + path)
    if (path.toLowerCase()=='dashboard') {
        cy.getButton('View Profile').click()
    } else if (path.toLowerCase()=='leftnav') {
        mainPage.getLeftNavButton().click()
        mainPage.getMenuItem('Profile').click()
    } else { //default is from menu
        mainPage.getMenuActivator().click()
        mainPage.getInactiveMenuItem('Profile').should('be.visible').click()
    }
    cy.allure().step('Verify user is on User Profile Page')
    cy.verifyPageTitle('User Profile')
}

export function goToEditUserProfile(path = 'leftnav'){
    goToDashBoard()
    cy.allure().step('Go to Edit User Profile Page via ' + path)
    if (path.toLowerCase()=='leftnav') {
        mainPage.getLeftNavButton().click()
        mainPage.getMenuItem('Edit Profile').should('be.visible').click()
    } else if (path.toLowerCase()=='userprofile'){
        goToUserProfile()
        cy.getButton('Edit').click()
    } else if (path.toLowerCase()=='dashboard'){
        cy.getButton('Edit Profile').click()
    }
    cy.allure().step('Verify user is on Edit User Profile Page')
    cy.verifyPageTitle('Edit User Profile')
}

export function goToChangePassword(path='leftnav'){
    goToDashBoard()
    cy.allure().step('Go to Change Password Page via ' + path)
    if (path.toLowerCase()=='dashboard'){
        cy.getButton('Change Password').click()
    } else {
        mainPage.getLeftNavButton().click()
        mainPage.getMenuItem('Change Password').click()
    }
    cy.allure().step('Verify user is on Set Password Page')
    cy.verifyPageTitle('Set Password')
}

export function goToManageUsers(){
    goToDashBoard()
    cy.allure().step('Go to Edit User Profile Page')
    mainPage.getLeftNavButton().click()
    mainPage.getMenuItem('Manage Users').click()
    cy.allure().step('Verify user is on Manage Users Page')
    manageUsers.getTitle().should('be.visible')
}

export function goToCreateUser(leftNav = false){
    goToDashBoard()
    let path = (!!leftNav)? 'LeftNav' : 'Manage Users'
    cy.allure().step('Go to Create User Page via ' + path)
    if (leftNav) {
        mainPage.getLeftNavButton().click()
        mainPage.getMenuItem('Create User').click()
    } else {
        goToManageUsers()
        cy.getButton('Create User').click()
    }
    cy.allure().step('Verify user is on Create User Page')
    cy.verifyPageTitle('Create User')
}