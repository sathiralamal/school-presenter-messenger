/// <reference types="cypress" />

import * as data from './env.json';
const {envURL} = data;

const Number = '+91829' + Math.floor((Math.random() * 1000000))

Cypress.on('uncaught:exception', (err, runnable) => {
    console.log(err);
    return false;
})

describe('4.1 New Organisation Sign-up', () => {
    beforeEach(() => {
        cy.visit(envURL)
    })

    it('Create a new school on Dev', () => {
        // cy.viewport('iphone-x')
        console.log("number", Number)
        cy.get('.rs-dropdown > .rs-btn').click().then
        cy.contains('New School').click().then
        cy.get('.rs-input').type(Number).then
        // cy.log('Open new tab with Terms and conditions')
        // cy.get('.terms-link').click().then
        cy.get('#continueBtn').click()
        cy.wait(2000)
        cy.get(':nth-child(1) > .otp-input').click().type('1').then
        cy.get(':nth-child(2) > .otp-input').click().type('2').then
        cy.get(':nth-child(3) > .otp-input').click().type('3').then
        cy.get(':nth-child(4) > .otp-input').click().type('4').then
        cy.get('#submitRegPinCodeBtn').click().then
        cy.wait(10000)
        cy.get('[placeholder="School Name"]').type(Number).then
        cy.get('[placeholder="School Email"]').type('0901004@email.com').then
        cy.get('.PopupInputPicker > .rs-btn').click()
        cy.contains('[class="rs-picker-select-menu-item"]', 'Principal').click()
        cy.get(':nth-child(5) > :nth-child(1) > .rs-input').type('Mulalo').then
        cy.get('[placeholder="Last Name"]').type('Nethononda').then
        cy.get('[placeholder="Email (Optional)"]').type('nethonondamulalo54@gmail.com').then
        cy.wait(10000)
        cy.get('#submitRegPinCodeBtn').click()
        cy.wait(5000)
        cy.contains('NEXT').click()
        cy.wait(1000)
        cy.contains('NEXT').click()
        cy.wait(1000)
        cy.contains('NEXT').click()
        cy.wait(1000)
        cy.contains('FINISH').click()
        cy.wait(10000)
        cy.reload()
    })
})