
//page elements

function getSuperUserCheckbox(){
    return cy.get('[aria-label="Is Superuser"][role="checkbox"]')
}

function getActiveCheckbox(){
    return cy.get('[aria-label="Is Active"][role="checkbox"]')
}

function getPasswordCheckbox(){
    return cy.contains('[class="flex"]','Set Password').prev()
}

//page actions
export function updatePassword(password){
    getPasswordCheckbox().should('exist').click()
    cy.getField('Set Password').should('exist').clear().type(password)
    cy.getField('Confirm Password').should('exist').clear().type(password)
}

export function selectSuperUserCheckbox(){
    getSuperUserCheckbox().should('exist').click({force:true})
    //el.attr("aria-checked")==='false'
}

export function selectActiveCheckbox(){
    getActiveCheckbox().should('exist').click({force:true})
}