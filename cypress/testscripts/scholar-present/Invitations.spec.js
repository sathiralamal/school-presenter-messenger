/// <reference types="cypress" />

var learnerNumber = '27829' + Math.floor((Math.random() * 1000000))
var parent1Phone = '27829' + Math.floor((Math.random() * 1000000))
var parent2Phone = '27829' + Math.floor((Math.random() * 1000000))

Cypress.on('uncaught:exception', (err, runnable) => {
    console.log(err);
    return false;
})

describe('Test Invitation of learner', () => {
    before(() => {
        cy.visit('https://dev.scholarpresent.com/')
    })

    it('log in to Tenant 090175', () => {
        // var learnerNumber = '+27829' + Math.floor((Math.random() * 1000000))
        // var parent1Phone = '+27829' + Math.floor((Math.random() * 1000000))
        // var parent2Phone = '+27829' + Math.floor((Math.random() * 1000000))
        cy.get('.rs-input').click().then
        cy.get('.rs-input').type('090175').then
        cy.get('#continueBtn').click().then
        cy.get(':nth-child(1) > .otp-input').click().type('1').then
        cy.get(':nth-child(2) > .otp-input').click().type('2').then
        cy.get(':nth-child(3) > .otp-input').click().type('3').then
        cy.get(':nth-child(4) > .otp-input').click().type('4').then
        cy.get('#submitPinCodeBtn').click().then
        cy.wait(10000)
        cy.get('#addContact').click().then
        cy.get('#dropDownAddNewLearner').click().then
        cy.get('#leranerFirstName').type('William').then
        cy.get('#leranerLastName').type('Ratshalingwa').then
        cy.log('Number', learnerNumber)
        cy.get('#leranerPhone').type(learnerNumber).then
        cy.get('#leranerEmail').type('nethonondamulalo54@gmail.com').then
        cy.get('[style="display: block; transform: translate(0px, 0px);"] > :nth-child(1) > .learner-button-container > .learner-submit-button').click()
        cy.get('#parent1FirstName').type('Donald')
        cy.get('#parent1LastName').type('Mathebula')
        cy.get('#parent1Phone').type(parent1Phone)
        cy.get('#parent1Email').type('donaldmathebula@gmail.com')
        cy.get('[style="display: block; transform: translate(0px, 0px);"] > :nth-child(1) > .learner-button-container > .learner-submit-button').click()
        cy.get('#parent1FirstName').type('Jane')
        cy.get('#parent1LastName').type('Mathebula')
        cy.get('#parent1Phone').type(parent2Phone)
        cy.get('#parent1Email').type('janemathebula@gmail.com')
        cy.get('[style="display: block; transform: translate(0px, 0px);"] > :nth-child(1) > .learner-button-container > .learner-submit-button').click()
        cy.wait(3000)
        cy.get('.AddLearnerToGroup > .rs-flex-box-grid-start > .rs-flex-box-grid-end > .rs-flex-box-grid-item > .btn-green-popup').click()
        // cy.get('[class="rs-flex-box-grid table-body rs-flex-box-grid-top rs-flex-box-grid-start"]')
        // .children().should('contain', learnerNumber, 'Send invite').click({ multiple: true })
        cy.wait(5000)
        cy.get('[class="rs-flex-box-grid table-body rs-flex-box-grid-top rs-flex-box-grid-start"] [class="tableRowCol phone-column rs-flex-box-grid-item rs-flex-box-grid-item-0"]')
            .should('contain', learnerNumber)
            .should('be.visible')

    })

})