/// <reference types="cypress" />


Cypress.on('uncaught:exception', (err, runnable) => {
    console.log(err);
    return false;
})

describe('Website URL and Protocol', () => {
    before(() => {
        cy.visit('https://dev.scholarpresent.com/')
    })

    it('URL https://dev.scholarpresent.com/', () => {
        cy.url().should('eq', 'https://dev.scholarpresent.com/')
    })

    it('Should be HTTPS', () => {
        cy.location('protocol').should('contains', 'https')
    })

    it('The hostname should be dev.scholarpresent.com', () => {
        cy.location('hostname').should('eq', 'dev.scholarpresent.com')
    })
})