
import * as api from '../../support/lib/api.js'

describe('API Integration Tests', () => {

    it('Verify /api/v1/login/access-token', ()=>{
        let user = Cypress.env('adminUser')
        let password = Cypress.env('password')
        cy.allure().step('Success Scenario')
        api.getAccessToken(user, password)

        cy.allure().step('Incorrect Password')
        api.getAccessToken(user, 'incorrect', 400)

        cy.allure().step('Missing field - Password')
        api.getAccessToken(user,undefined, 422)
    })

    it('Verify /api/v1/login/test-token', () => {
        let user = Cypress.env('adminUser')
        let password = Cypress.env('password')
        cy.allure().step('Get access token')
        api.getAccessToken(user, password).then((res)=>{
            let testOptions = {method:'POST', failOnStatusCode: false,
                                url:'api/v1/login/test-token', auth: {bearer: res.body['access_token']}}

            cy.allure().step('Test valid access token')
            cy.request(testOptions).then((res)=>{
                expect(res.status).to.eq(200)
                expect(res.body).deep.eq({ email: "admin@tqqaproject.com", full_name: null, id: 1,
                                           is_active: true, is_superuser: true})
            })

            cy.allure().step('Test invalid access token')
            cy.wrap(null).then(()=>{ delete testOptions.auth })
            cy.request(testOptions).then((res)=>{
                expect(res.status).to.eq(401)
                expect(res.body.detail).to.eq('Not authenticated')
            })
        })
    })

    it('Verify /api/v1/password-recovery/', () => {
        let user = Cypress.env('adminUser')
        let password = Cypress.env('password')
        cy.allure().step('Get access token')
        api.getAccessToken(user, password).then((res)=>{
            let testOptions = {method:'POST', failOnStatusCode: false,
                                url:'api/v1/password-recovery/dummy@gmail.com', auth: {bearer: res.body['access_token']}}
            cy.allure().step('Email Recovery request')
            cy.request(testOptions).then((res)=>{
                expect(res.status).to.eq(200)
            })
        })
    })

    it('Verify /api/v1/reset-password/', () => {
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
    })

    it('Verify get all users /api/v1/users', () => {
        let user = Cypress.env('adminUser')
        let password = Cypress.env('password')
        cy.allure().step('Get access token')
        api.getAccessToken(user, password).then((res)=>{
            cy.allure().step('Get all Users - Valid access token')
            api.getAllUsersData(res.body['access_token'])
            cy.allure().step('Get all Users - Invalid access token')
            api.getAllUsersData('1234', 403)
        })
    })

    it('Verify get current user /api/v1/users/me', () => {
        let user = Cypress.env('adminUser')
        let password = Cypress.env('password')
        cy.allure().step('Get access token')
        api.getAccessToken(user, password).then((res)=>{
            cy.allure().step('Get Current User - Valid access token')
            api.getCurrentUserData(res.body['access_token'])
            cy.allure().step('Get Current User - Invalid access token')
            api.getCurrentUserData('1234', 403)
        })
    })

    it('Verify Current User Updates /api/v1/users/me', () => {
        let user = Cypress.env('adminUser')
        let password = Cypress.env('password')
        cy.allure().step('Get access token')
        api.getAccessToken(user, password).then((res)=>{
            cy.allure().step('Update Current User - Valid access token')
            let body = {"full_name":"admin","email":"dummy2@gmail.com","password":"changethis"}
            api.updateCurrentUser(res.body['access_token'], body)
        })
    })

    it('Verify User Updates by admin via /api/v1/users/{user_id}', () => {
        let user = Cypress.env('adminUser')
        let password = Cypress.env('password')
        cy.allure().step('Get access token')
        api.getAccessToken(user, password).then((res)=>{
            cy.allure().step('Update full name, email, superuser/active status and password - Valid access token')
            let body = {"full_name":"dummy2","email":"dummy2@gmail.com","is_active":true,
                "is_superuser":false,"password":"changethis"}
            let id = 4
            api.updateUserById(res.body['access_token'], id, body)
            cy.allure().step('Verify updated information using getUserDataById API')
            api.getUserDataById(res.body['access_token'], 4).then((responseBody)=>{
                delete responseBody.id
                expect(responseBody).deep.eq(body)
            })
            cy.allure().step('Update full name, email, superuser/active status and password - Invalid access token')
            api.updateUserById('', id, body, 403)
            cy.allure().step('Update full name, email, superuser/active status - Valid access token')
            body = {"full_name":"dummy2","email":"dummy2@gmail.com","is_active":true, "is_superuser":false}
            api.updateUserById(res.body['access_token'], id, body)
        })
    })

    it('Verify User Updates by non admin via /api/v1/users/{user_id}', () => {
        let user = Cypress.env('endUser')
        let password = Cypress.env('password')
        cy.allure().step('Get access token')
        api.getAccessToken(user, password).then((res)=>{
            cy.allure().step('Verify 400 status code is returned')
            let body = {"full_name":"dummy2","email":"dummy2@gmail.com","is_active":true,
                "is_superuser":false,"password":"changethis"}
            let id = 4
            api.updateUserById(res.body['access_token'], id, body, 400)

        })
    })

    it('Verify Create User via /api/v1/users', () => {
        let user = Cypress.env('endUser')
        let password = Cypress.env('password')
        cy.allure().step('Get access token')
        api.getAccessToken(user, password).then((res)=>{
            cy.allure().step('Create User by non admin and expect 400 status code')
            api.createUser(res.body['access_token'], 400)
        })
        cy.allure().step('Create user that already exists in the system')
        api.getAccessToken(Cypress.env('adminUser'), password).then((res)=>{
            api.createUser(res.body['access_token'], 400) //comment this for successful user creation
            // cy.allure().step('Create User by admin and expect 200 status code')
            // api.createUser(res.body['access_token'])
        })
    })

})