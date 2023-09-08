/// <reference types="cypress" />

import * as data from './env.json';
const {envURL} = data;

const Number = '+91829' + Math.floor((Math.random() * 1000000))

Cypress.on('uncaught:exception', (err, runnable) => {
    console.log(err);
    return false;
})

describe('3.2 Group Admin - Send message', () => {
    beforeEach(() => {
        cy.visit(envURL)
    })

    it('1.1.5 I want to be able to send a message to a student', () => {
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
        cy.get(':nth-child(1) > [style="cursor: pointer;"] > .tableRowColbtns > :nth-child(2) > span').click()
        cy.wait(1000)
        cy.get('.text-input > .rs-input').click().type('Gooooood Morning Willard')
        cy.get('.rs-btn-group > :nth-child(1)').click()
        cy.wait(3000)
    })

})