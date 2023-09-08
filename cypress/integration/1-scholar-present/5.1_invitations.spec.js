/// <reference types="cypress" />

const Number = '+91829' + Math.floor((Math.random() * 1000000))

import * as data from './env.json';
const {envURL} = data;

Cypress.on('uncaught:exception', (err, runnable) => {
    console.log(err);
    return false;
})

describe('5.1 Invitations', () => {
    beforeEach(() => {
        cy.visit(envURL)
    })

    it('5.1.2. I want to be able to send an Invitation to individual contacts from the contact page (Staff, Learners or Parents)', () => {
        cy.reload()
        cy.get('.rs-input').click().then
        cy.get('.rs-input').type('090200').then
        cy.get('#continueBtn').click().then
        cy.get(':nth-child(1) > .otp-input').click().type('1').then
        cy.get(':nth-child(2) > .otp-input').click().type('2').then
        cy.get(':nth-child(3) > .otp-input').click().type('3').then
        cy.get(':nth-child(4) > .otp-input').click().type('4').then
        cy.get('#submitPinCodeBtn').click().then
        cy.wait(10000)
        cy.get(':nth-child(1) > .rs-flex-box-grid > .tableRowColbtns > :nth-child(3)').click()
        cy.get('.alert-button-inner').should('be.visible')
        cy.get('.alert-button-inner').click()
    })

    it('5.1.3. I want to see the delivery status of the entire invited list (Either Distributed and Accepted)', () => {
        cy.reload()
        cy.get('.rs-input').click().then
        cy.get('.rs-input').type('090200').then
        cy.get('#continueBtn').click().then
        cy.get(':nth-child(1) > .otp-input').click().type('1').then
        cy.get(':nth-child(2) > .otp-input').click().type('2').then
        cy.get(':nth-child(3) > .otp-input').click().type('3').then
        cy.get(':nth-child(4) > .otp-input').click().type('4').then
        cy.get('#submitPinCodeBtn').click().then
        cy.wait(10000)
        cy.get('.contactSegment > .segment-button-after-checked').click({force: true})
        cy.wait(3000)
        cy.get(':nth-child(3) > .table-body > .tableRowColbtns > .rs-flex-box-grid > div > [style="width: 100%;"]').should('exist')
    })

    it('5.1.6. I want to know the date the last invitation was sent through', () => {
        cy.reload()
        cy.get('.rs-input').click().then
        cy.get('.rs-input').type('090200').then
        cy.get('#continueBtn').click().then
        cy.get(':nth-child(1) > .otp-input').click().type('1').then
        cy.get(':nth-child(2) > .otp-input').click().type('2').then
        cy.get(':nth-child(3) > .otp-input').click().type('3').then
        cy.get(':nth-child(4) > .otp-input').click().type('4').then
        cy.get('#submitPinCodeBtn').click().then
        cy.wait(10000)
        cy.get('.contactSegment > .segment-button-after-checked').click({force: true})
        cy.wait(3000)
        cy.get(':nth-child(1) > .table-body > .tableRowColbtns > .rs-flex-box-grid > div > :nth-child(3)').should('exist')
    })

})