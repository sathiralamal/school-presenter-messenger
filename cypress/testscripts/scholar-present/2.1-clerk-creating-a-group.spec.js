/// <reference types="cypress" />

var learnerNumber = '27826' + Math.floor((Math.random() * 1000000))
var parent1Phone = '27829' + Math.floor((Math.random() * 1000000))
var parent2Phone = '27829' + Math.floor((Math.random() * 1000000))

Cypress.on('uncaught:exception', (err, runnable) => {
    console.log(err);
    return false;
})

describe('Create New School', () => {
    beforeEach(() => {
        cy.visit('https://dev.scholarpresent.com/')
    })

    it('2.1.1 I want to be able to create groups and give rights to class heads as group administrators', () => {
        cy.get('.rs-input').click().then
        cy.get('.rs-input').type('090135').then
        cy.get('#continueBtn').click().then
        cy.get(':nth-child(1) > .otp-input').click().type('1').then
        cy.get(':nth-child(2) > .otp-input').click().type('2').then
        cy.get(':nth-child(3) > .otp-input').click().type('3').then
        cy.get(':nth-child(4) > .otp-input').click().type('4').then
        cy.get('#submitPinCodeBtn').click().then
        cy.wait(5000)
        cy.get(':nth-child(2) > .rs-nav-item-content').click()
        cy.get(':nth-child(2) > .btn-right').click()
        cy.get('.groupModalInputInner > .rs-input').click().type('Scholar Present').then
        cy.get(':nth-child(3) > .groupModalInputInner > .drag-cancel > .rs-btn').click()
        cy.get(':nth-child(4) > .groupModalInputInner > .drag-cancel > .rs-btn').click()
    })


})