/// <reference types="cypress" />


Cypress.on('uncaught:exception', (err, runnable) => {
    console.log(err);
    return false;
})

describe('Create New School', () => {
    before(() => {
        cy.visit('https://dev.scholarpresent.com/')
    })

    it('Check if unknown number behave corretly and rerouted to join  school', () => {
        var Number = '+91829' + Math.floor((Math.random() * 1000000))
        cy.get('.rs-input').type(Number).then
        cy.get('#continueBtn').click()
        cy.wait(2000)
        cy.get('#alert-1-msg').should('be.visible')
        cy.get(':nth-child(1) > .alert-button-inner').click()
        cy.contains('Join as My School').should('be.visible')
        cy.go('back')
        cy.reload()
    })

    it('Check if unknown number behave corretly and rerouted to Retry', () => {
        var Number = '+91829' + Math.floor((Math.random() * 1000000))
        cy.get('.rs-input').type(Number).then
        cy.get('#continueBtn').click()
        cy.wait(2000)
        cy.get('#alert-1-msg').should('be.visible')
        cy.get(':nth-child(2) > .alert-button-inner').click()
        cy.contains('Login').should('be.visible')
        cy.get('#continueBtn').click()
        cy.wait(2000)
        cy.get('#alert-2-msg').should('be.visible')
        cy.go('back')
        cy.reload()
    })

    it('Confirm if the join my school link works', () => {
        cy.get('p > .rs-btn').click()
        cy.contains('Join as My School').should('be.visible')
        cy.go('back')
        cy.reload()
    })

    it('Join a school with a number already existing on the system', () => {
        cy.get('.rs-dropdown > .rs-btn').click().then
        cy.contains('New School').click().then
        cy.get('.rs-input').type('090140').then
        cy.get('#continueBtn').click()
        cy.get('#alert-1-msg').should('be.visible')
        cy.wait(2000)
        cy.get(':nth-child(2) > .alert-button-inner').click()
        cy.contains('Login').should('be.visible')
    })

    it('Join a school with a number already existing on the system', () => {
        cy.get('.rs-dropdown > .rs-btn').click().then
        cy.contains('New School').click().then
        cy.get('.rs-input').type('090140').then
        cy.get('#continueBtn').click()
        cy.get('#alert-1-msg').should('be.visible')
        cy.wait(2000)
        cy.get(':nth-child(1) > .alert-button-inner').click()
        cy.contains('Login').should('be.visible')
    })


})
