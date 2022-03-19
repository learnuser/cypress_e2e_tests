
import {verifyCommonMenuItems, verifyAdminMenuItems, 
    goToUserProfile, goToCreateUser}
    from '../../support/lib/main.js'
import {verifyUserProfile, editCurrentUserProfile}
    from '../../support/lib/user.js'

describe('Smoke Test', () => {

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
    });

    it('Verify navigation to Manage User and Create User Page for Admin', () => {
        let user = Cypress.env('adminUser')
        let password = Cypress.env('password')
        cy.logIn(user, password);
        goToCreateUser()
        goToCreateUser(true)
        cy.logout()
    });

    it('Verify Common Menu Items and Admin Menu Items for Admin', () => {
        let user = Cypress.env('adminUser')
        let password = Cypress.env('password')
        cy.logIn(user, password);
        verifyCommonMenuItems()
        verifyAdminMenuItems('admin')
    });

    it('Verify end user can update user profile and view saved changes', ()=>{
        cy.logIn(Cypress.env('endUser'), Cypress.env('password'));
        editCurrentUserProfile('EndUser', Cypress.env('adminUser'))
        verifyUserProfile();
    });

});

describe("File upload", () => {
    it("File upload", () => {
        cy.visit("https://www.file.io");
        const uploadPath = "/Users/snair/Downloads/example.json";
        cy.intercept("POST", "https://file.io/").as("uploadFileAPI");
        cy.get('[id="upload-button"]').selectFile(uploadPath, {force: true});
        cy.wait("@uploadFileAPI").then((uploadFileAPI)=>{
            expect(uploadFileAPI.response.statusCode).to.eq(200);
            expect(uploadFileAPI.response.body.name).to.eq("example.json");
        })
    });
});

describe("Search feature", ()=>{
    it("Search feature test", ()=>{
        cy.visit("http://automationpractice.multiformis.com");
        cy.get('[id="search_query_top"]').type("blouse");
        cy.get('[name="submit_search"]').click();
        cy.get('[class="page-heading  product-listing"]').should("include.text", "blouse");
    })
})
