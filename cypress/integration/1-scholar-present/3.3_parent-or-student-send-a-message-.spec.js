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

    it('3.3.1 I want to send a message to my class teacher ', () => {
        cy.reload()
        cy.get('.rs-input').click().then
        cy.get('.rs-input').type('846519690').then
        cy.get('#continueBtn').click().then
        cy.get(':nth-child(1) > .otp-input').click().type('1').then
        cy.get(':nth-child(2) > .otp-input').click().type('2').then
        cy.get(':nth-child(3) > .otp-input').click().type('3').then
        cy.get(':nth-child(4) > .otp-input').click().type('4').then
        cy.get('#submitPinCodeBtn').click().then
        cy.wait(10000)
        cy.get('.sc-ion-input-md-h').click({force: true})
        cy.get('.sc-ion-input-md-h').type('Mulalo')
        cy.wait(2000)
        cy.get('.tableRowColbtns > .outlineBtn').click()
        cy.get('.text-input > .rs-input').type('Good Day Principal')
        cy.get('.rs-btn-group > .rs-btn').click()
    })

})