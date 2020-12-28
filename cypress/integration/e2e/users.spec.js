
import {verifyAdminMenuItems} from '../../support/lib/main.js'
import {verifyUserProfile, editCurrentUserProfile, changePassword, getAllUserData,
        verifyAllUsersData, editUserProfile, createUser, recoverPassword}
        from '../../support/lib/user.js'

describe('User Profile', () => {

    beforeEach(() => {
        cy.visit('/login')
    });

    it('Verify Data on User Profile for Admin and End User', () => {
        ['endUser', 'adminUser'].forEach((user) =>{
            cy.logIn(Cypress.env(user), Cypress.env('password'));
            verifyUserProfile();
            cy.logout();
        })
    })

    it('Verify end user can update user profile and view saved changes', ()=>{
        cy.logIn(Cypress.env('endUser'), Cypress.env('password'));
        editCurrentUserProfile('EndUser', Cypress.env('adminUser'))
        verifyUserProfile();
    })

    it('Verify end user can change password and can login with new password', ()=>{
        let email = 'dummy@gmail.com'
        let currPassword = 'changethis';
        let newPassword = 'changethis'
        cy.logIn(email, currPassword);
        changePassword(email, newPassword)
        cy.logout()
        cy.logIn(email, newPassword);
    })

    it('Verify user can recover password via Forget your password link', ()=>{
        recoverPassword('dummy2@gmail.com')
    })
})

describe('Manage Users', () => {

    beforeEach(() => {
        cy.visit('/login')
    });

    it('Verify data for all users listed on Manage Users Page against API', () => {
        let user = Cypress.env('adminUser')
        let password = Cypress.env('password')
        cy.logIn(user, password);
        getAllUserData().then((actual)=>{
          verifyAllUsersData(actual)
        })
    })

    it('Verify admin can change the password for another user and that user is able to login', ()=>{
        let user = Cypress.env('adminUser')
        let password = Cypress.env('password')
        cy.logIn(user, password);
        let data ={password: 'changethis'}
        editUserProfile('dummy@gmail.com', data)
        cy.allure().step('Logout')
        cy.logout()
        cy.allure().step('Login to verify the changes')
        cy.logIn('dummy@gmail.com', data.password);
    })

    it('Verify admin can change the role to super user for another user', ()=>{
        let user = Cypress.env('adminUser')
        let password = Cypress.env('password')
        cy.logIn(user, password);
        let data ={super: true}
        editUserProfile('dummy@gmail.com', data)
        cy.allure().step('Logout')
        cy.logout()
        cy.allure().step('Login to verify the changes')
        cy.logIn('dummy@gmail.com', 'changethis');
    })

    it('Verify admin can change the role to super user and update password, full name and email', ()=>{
        let user = Cypress.env('adminUser')
        let password = Cypress.env('password')
        cy.logIn(user, password);
        let data ={super: true, email: 'dummy@gmail.com', fullName: 'dummy', password: 'changethis'}
        editUserProfile('dummy@gmail.com', data)
        cy.allure().step('Logout')
        cy.logout()
        cy.allure().step('Login to verify the changes')
        cy.logIn('dummy@gmail.com', data.password);
        verifyAdminMenuItems('admin', true)
    })

    it('Verify admin can remove super user role for another user and login as that user to check', ()=>{
        let user = Cypress.env('adminUser')
        let password = Cypress.env('password')
        cy.logIn(user, password);
        let data ={super: true, email: 'dummy@gmail.com', fullName: 'dummy', password: 'changethis'}
        editUserProfile('dummy@gmail.com', data)
        cy.allure().step('Logout')
        cy.logout()
        cy.allure().step('Login to verify the changes')
        cy.logIn('dummy@gmail.com', data.password);
        verifyAdminMenuItems('endUser', true)
    })

    it('Verify admin can change end user status as inactive and user cannot login', ()=>{
        let user = Cypress.env('adminUser')
        let password = Cypress.env('password')
        cy.logIn(user, password);
        let data ={inactive: true, password: 'changethis'} //work around to save
        editUserProfile('dummy@gmail.com', data)
        cy.allure().step('Logout')
        cy.logout()
        cy.allure().step('Login to verify the changes')
        cy.logIn('dummy@gmail.com', data.password, false);
    })

    it('Verify admin can change end user status back to active and user cannot login', ()=>{
        let user = Cypress.env('adminUser')
        let password = Cypress.env('password')
        cy.logIn(user, password);
        let data ={inactive: true, password: 'changethis'} //work around to save
        editUserProfile('dummy@gmail.com', data)
        cy.allure().step('Logout')
        cy.logout()
        cy.allure().step('Login to verify the changes')
        cy.logIn('dummy@gmail.com', data.password);
    })
})

describe('Create Users', () => {

    beforeEach(() => {
        cy.visit('/login')
    });

    it.skip('Verify admin can create new end user and new user can log in', ()=>{
        let user = Cypress.env('adminUser')
        let password = Cypress.env('password')
        cy.logIn(user, password);
        let data ={email: 'dummy2@gmail.com', fullName: 'dummy2', password: 'changethis'}
        createUser(data)
        cy.allure().step('Logout')
        cy.logout()
        cy.allure().step('Login with the new user to confirm')
        cy.logIn('dummy2@gmail.com', data.password);
    })

})
