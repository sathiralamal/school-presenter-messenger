/// <reference types="cypress" />

import * as data from './env.json';
const {envURL} = data;

var learnerNumber = '27826' + Math.floor((Math.random() * 1000000))
var parent1Phone = '27829' + Math.floor((Math.random() * 1000000))
var parent2Phone = '27829' + Math.floor((Math.random() * 1000000))

Cypress.on('uncaught:exception', (err, runnable) => {
    console.log(err);
    return false;
})

describe('2.2 Group administrator - Educator/Learner', () => {
    beforeEach(() => {
        cy.visit(envURL)
    })

    it('2.2.1 I want to have access to group administrative rights', () => {
        cy.get('.rs-input').click().then
        cy.get('.rs-input').type('090200').then
        cy.get('#continueBtn').click().then
        cy.get(':nth-child(1) > .otp-input').click().type('1').then
        cy.get(':nth-child(2) > .otp-input').click().type('2').then
        cy.get(':nth-child(3) > .otp-input').click().type('3').then
        cy.get(':nth-child(4) > .otp-input').click().type('4').then
        cy.get('#submitPinCodeBtn').click().then
        cy.wait(5000)
        cy.get(':nth-child(2) > .rs-nav-item-content').should('exist')

    })

    it('2.2.3 I want to be able to edit members contact information', () => {
        cy.get('.rs-input').click().then
        cy.get('.rs-input').type('090200').then
        cy.get('#continueBtn').click().then
        cy.get(':nth-child(1) > .otp-input').click().type('1').then
        cy.get(':nth-child(2) > .otp-input').click().type('2').then
        cy.get(':nth-child(3) > .otp-input').click().type('3').then
        cy.get(':nth-child(4) > .otp-input').click().type('4').then
        cy.get('#submitPinCodeBtn').click().then
        cy.wait(5000)
        cy.get(':nth-child(2) > .rs-nav-item-content').click()
        cy.get(':nth-child(1) > .groupBody > .groupBodyDown').click()
        cy.get(':nth-child(1) > [style="font-weight: bold;"] > ion-icon.md').click()
        cy.wait(2000)
        cy.get('.popover-viewport > .md > :nth-child(1)').click()
        cy.get('.groupMainShadow > .groupsMoreAdmins > .NewStaff > ion-grid.md > form > :nth-child(6) > ion-col.md > .rs-flex-box-grid > .rs-flex-box-grid-item > .outlineBtn')
        .click({force: true})
        
    })

    it('2.2.5 I want to see how many members are in my group', () => {
        cy.get('.rs-input').click().then
        cy.get('.rs-input').type('090200').then
        cy.get('#continueBtn').click().then
        cy.get(':nth-child(1) > .otp-input').click().type('1').then
        cy.get(':nth-child(2) > .otp-input').click().type('2').then
        cy.get(':nth-child(3) > .otp-input').click().type('3').then
        cy.get(':nth-child(4) > .otp-input').click().type('4').then
        cy.get('#submitPinCodeBtn').click().then
        cy.wait(5000)
        cy.get(':nth-child(2) > .rs-nav-item-content').click()
        cy.get(':nth-child(1) > .groupBody > .groupBodyDown').click()
        
    })

})