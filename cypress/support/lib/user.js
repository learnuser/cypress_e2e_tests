
import {goToDashBoard, goToUserProfile, goToEditUserProfile,
        goToChangePassword, goToCreateUser, goToManageUsers}
        from './main.js'
import * as manageUsersPage from '../pageObjects/manageUsersPage.js'
import * as api from './api.js'

export function verifyUserProfile(){
    goToUserProfile('dashboard');
    cy.allure().step('Verify Full Name and Email on User Profile Page (against API)')
    cy.wait('@token').then((token)=>{
            let accessToken = token.response.body.access_token
            api.getCurrentUserData(accessToken).then((body)=>{
                cy.getFieldText('Full Name').then((text)=>{
                    text = (text.includes('---')) ? null : text
                    expect(text).to.eq(body.full_name)
                })
                cy.getFieldText('Email').then((text)=>{
                    expect(text).to.eq(body.email)
                })
            })
    })
}

export function editCurrentUserProfile(name, email){
    goToEditUserProfile('leftnav');
    cy.allure().step('Update full name, email and click Save button')
    cy.getField('Full Name').clear().type(name)
    cy.getField('E-mail').clear().type(email)
    cy.intercept('PUT', '/api/v1/users/me').as('updateCurrentUser')
    cy.getButton('Save').click()
    cy.allure().step('Verify that api response is 200 after user profile is updated')
    cy.wait('@updateCurrentUser').then((req)=>{
        expect(req.response.statusCode).to.eq(200)
    })
}

export function changePassword(email, password){
    goToChangePassword();
    cy.allure().step('Verify full name before updating password (against API)')
    cy.wait('@token').then((token)=>{
            let accessToken = token.response.body.access_token
            api.getCurrentUserData(accessToken).then((body)=>{
                cy.getFieldText('User').then((text)=>{
                    body.full_name = (body.full_name===null) ? email : body.full_name
                    expect(text).to.eq(body.full_name)
                })
            })
    })
    cy.allure().step('Update password and click on save button')
    cy.getField('Password').clear().type(password)
    cy.getField('Confirm Password').clear().type(password)
    cy.intercept('PUT', '/api/v1/users/me').as('updateCurrentUser')
    cy.getButton('Save').click()
    cy.allure().step('Verify that api response is 200 after user profile is updated')
    cy.wait('@updateCurrentUser').then((req)=>{
        expect(req.response.statusCode).to.eq(200)
    })
}

export function getAllUserData(){
    goToManageUsers()
    let objRows = {};
    let intRow = 0;
    cy.allure().step('Get data for all rows on Manage Users page')
    cy.contains('No data available').should('not.exist')
    cy.get('table[class*="v-datatable v-table"] > tbody > tr').each((row)=>{
            let data = {};
            let i = 0;
            let map = {1: 'email', 2: 'full_name', 3: 'is_active', 4: 'is_superuser'}
            cy.wrap(row).find('td').each((td)=>{
                switch (map[i]) {
                    case map[1]:
                        data[map[1]] = td.text()
                        break;
                    case map[2]:
                        data[map[2]] = (td.text()==='')? null : td.text()
                        break;
                    case map[3]:
                        data[map[3]] = (td.text() === "checkmark") ? true : false
                        break;
                    case map[4]:
                        data[map[4]] = (td.text() === "checkmark") ? true : false
                        break;
                }
                i+=1
            })
            objRows[intRow] = data
            intRow += 1
        })
    return cy.wrap(null).then(()=>{
        return objRows
    })
}

export function verifyAllUsersData(actual={}){
    let expected = {};
    cy.allure().step('Verify user data for all users against API')
    cy.wait('@token').then((token)=>{
        let accessToken = token.response.body.access_token
        api.getAllUsersData(accessToken).then((responseBody)=>{
            for (let i in responseBody) {
                delete responseBody[i]['id']
                expected[i] = responseBody[i]
            }
            expect(actual).to.deep.eq(expected)
        })
    })
}

function editUserHelper(editUserPage, data){
    cy.get('[aria-label="E-mail"]').should('exist')
    cy.wait(500)
    if ('password' in data){
        editUserPage.updatePassword(data.password)
    }
    if ('fullName' in data){
        cy.getField('Full Name').clear().type(data['fullName'])
    }
    if ('email' in data){
        cy.getField('E-mail').clear().type(data['email'])
    }
    if ('super' in data){
        editUserPage.selectSuperUserCheckbox()
    }
    if ('inactive' in data){
        editUserPage.selectActiveCheckbox()
    }
}

export function editUserProfile(email, data={}){
    if (!Object.keys(data).length) { return } //log failure
    goToManageUsers()
    cy.allure().step('Click on Edit button for user on Manage Users Page using email id')
    let editUserPage = manageUsersPage.clickOnEditButton(email)
    cy.allure().step('Update user profile and Click on Save button')
    editUserHelper(editUserPage, data)
    cy.getButton('Save').click()
    cy.allure().step('Verify user update success message')
    cy.contains('User successfully updated').should('be.visible')
}

export function createUser(data={}){
    if (!Object.keys(data).length) { return }
    goToCreateUser();
    cy.allure().step('Enter new user information and click on Save button')
    if ('fullName' in data){
        cy.getField('Full Name').clear().type(data['fullName'])
    }
    if ('email' in data){
        cy.getField('E-mail').clear().type(data['email'])
    }
    if ('password' in data){
        cy.getField('Set Password').clear().type(data['password'])
        cy.getField('Confirm Password').clear().type(data['password'])
    }
    cy.getButton('Save').click()
}

export function recoverPassword(email){
    cy.allure().step('Click on Forgot your password')
    cy.contains('a', 'Forgot your password').click()
    cy.allure().step('Enter email and click on Recover Password button')
    cy.getField('Username').type(email)
    cy.intercept('POST', '/api/v1/password-recovery/'+email).as('recoverPassword')
    cy.getButton('Recover Password').click()
    cy.allure().step('Verify email was sent for password recovery')
    cy.wait('@recoverPassword').then((req)=>{
        expect(req.response.statusCode).to.eq(200)
    })
}