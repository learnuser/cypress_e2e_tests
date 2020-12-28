
//page elements
function getMenuItem(item){
    return cy.get('[class="layout column fill-height"]')
            .contains('div[role="listitem"]', item)
}

function getInactiveMenuItem(item){
    return cy.get('[class*="v-menu__content theme--light"]')
                .contains('div[role="listitem"]', item)
}

function getLeftNavButton(){
    return cy.get('button[class*="v-toolbar__side-icon"]')
}

function getMenuActivator(){
    return cy.get('[class="v-menu__activator"]')
}

function getPageTitle(){
    return cy.get('[class="headline primary--text"]').then((el)=>{
        return el.text()
    })
}

module.exports = {
    getMenuItem, getInactiveMenuItem, getLeftNavButton, getMenuActivator, getPageTitle
}