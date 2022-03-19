
import * as api from '../../support/lib/api.js'

describe('API Integration Tests', () => {

    it('Verify get all users /api/v1/users (GET method)', () => {
        let user = Cypress.env('adminUser')
        let password = Cypress.env('password')
        cy.allure().step('Get access token')
        api.getAccessToken(user, password).then((res)=>{
            cy.allure().step('Get all Users - Valid access token')
            api.getAllUsersData(res.body['access_token'])
            cy.allure().step('Get all Users - Invalid access token')
            api.getAllUsersData('1234', 403) //response code 403
        })
    });

    it('Verify /api/v1/login/test-token (POST method)', () => {
        let user = Cypress.env('adminUser')
        let password = Cypress.env('password')
        cy.allure().step('Get access token')
        cy.addContext('Get access token')
        api.getAccessToken(user, password).then((res)=>{
            let testOptions = {method:'POST', failOnStatusCode: false,
                                url:'api/v1/login/test-token', auth: {bearer: res.body['access_token']}}

            cy.allure().step('Test valid access token')
            cy.request(testOptions).then((res)=>{
                expect(res.status).to.eq(200) //200 response code
                expect(res.body).deep.eq({ email: "admin@tqqaproject.com", full_name: null, id: 1,
                                           is_active: true, is_superuser: true})
            })

            cy.allure().step('Test invalid access token')
            cy.wrap(null).then(()=>{ delete testOptions.auth })
            cy.request(testOptions).then((res)=>{
                expect(res.status).to.eq(401) //401 response code
                expect(res.body.detail).to.eq('Not authenticated')
            })
        })
    });

    it('Verify /api/v1/password-recovery/ (POST method)', () => {
        let user = Cypress.env('adminUser')
        let password = Cypress.env('password')
        cy.allure().step('Get access token')
        api.getAccessToken(user, password).then((res)=>{
            let testOptions = {method:'POST', failOnStatusCode: false,
                                url:'api/v1/password-recovery/dummy@gmail.com', auth: {bearer: res.body['access_token']}}
            cy.allure().step('Email Recovery request')
            cy.request(testOptions).then((res)=>{
                expect(res.status).to.eq(200) //response code 500 is returned
            })
        })
    });

    it('Verify /api/v1/reset-password/ (POST method)', () => {
        let user = Cypress.env('adminUser')
        let password = Cypress.env('password')
        cy.allure().step('Get access token')
        api.getAccessToken(user, password).then((res)=>{
            let testOptions = {method:'POST', failOnStatusCode: false,
                            body:{token:res.body['access_token'], new_password:'changed'},url:'api/v1/reset-password/'}

            cy.allure().step('Reset Password request')
            cy.request(testOptions).then((res)=>{
                expect(res.status).to.eq(200)
            })
        })
    });

    it('Verify get current user /api/v1/users/me', () => {
        let user = Cypress.env('adminUser')
        let password = Cypress.env('password')
        cy.allure().step('Get access token')
        api.getAccessToken(user, password).then((res)=>{
            cy.allure().step('Get Current User - Valid access token')
            api.getCurrentUserData(res.body['access_token'])
            cy.allure().step('Get Current User - Invalid access token')
            api.getCurrentUserData('1234', 403) //response code 403
        })
    });

    it('Verify Current User Updates /api/v1/users/me (PUT method)', () => {
        let user = Cypress.env('adminUser')
        let password = Cypress.env('password')
        cy.allure().step('Get access token')
        api.getAccessToken(user, password).then((res)=>{
            cy.allure().step('Update Current User - Valid access token')
            let body = {"full_name":"admin","email":"dummy2@gmail.com","password":"changethis"}
            api.updateCurrentUser(res.body['access_token'], body)
        })
    });

})