/// <reference types="cypress" />

import * as data from './env.json';
const {envURL} = data;

const Number = '+91829' + Math.floor((Math.random() * 1000000))

Cypress.on('uncaught:exception', (err, runnable) => {
    console.log(err);
    return false;
})

describe('1.2 Clerk - Add a new Parent', () => {
    beforeEach(() => {
        cy.visit(envURL)
    })

    it('1.2.1 I want to make sure that the correct parent is linked to the correct Learner', () => {
        cy.get('.rs-input').click().then
        cy.get('.rs-input').type('090200').then
        cy.get('#continueBtn').click().then
        cy.get(':nth-child(1) > .otp-input').click().type('1').then
        cy.get(':nth-child(2) > .otp-input').click().type('2').then
        cy.get(':nth-child(3) > .otp-input').click().type('3').then
        cy.get(':nth-child(4) > .otp-input').click().type('4').then
        cy.get('#submitPinCodeBtn').click().then
        cy.wait(5000)
        cy.get('.native-input').click().type('NDIVHUWO')
        cy.wait(2000)
        cy.get('.tableRowColbtns > :nth-child(1)').click() //clicking on edit
        cy.wait(2000)
        cy.get('[style="display: block;"] > :nth-child(1) > ion-grid.md > .tab-header > .learner-tab-header > #tabParent1').click()
        cy.get('[style="display: block;"] > :nth-child(1) > ion-grid.md > .tab-header > .learner-tab-header > #tabParent2').click()
        cy.get('[style="display: block;"] > :nth-child(1) > .learner-button-container > .learner-submit-button').click()
        // cy.get('.react-draggable-dragged > :nth-child(1) > :nth-child(3) > :nth-child(2) > :nth-child(1) > .rs-input').contains('Ronald').should('be.visible')
        // cy.get('.search-input').type('NDIVHUWO')
        // cy.contains("[value='DONALDMATHEBULA@GMAIL.COM'").should('be.visible')
        cy.get('.rs-btn > .rs-icon').click()
        cy.get('.navbar-profile-button-container > .rs-dropdown > .rs-dropdown-menu > :nth-child(2) > .rs-dropdown-item-content').click()
    })

    it('1.2.5 I want to be able to link parents to existing groups - (Grade 10 learners group and Grade 10 parent group)', () => {
        cy.get('.rs-input').click().then
        cy.get('.rs-input').type('090200').then
        cy.get('#continueBtn').click().then
        cy.get(':nth-child(1) > .otp-input').click().type('1').then
        cy.get(':nth-child(2) > .otp-input').click().type('2').then
        cy.get(':nth-child(3) > .otp-input').click().type('3').then
        cy.get(':nth-child(4) > .otp-input').click().type('4').then
        cy.get('#submitPinCodeBtn').click().then
        cy.wait(5000)
        cy.get('#addContact').click().then
        cy.get('#dropDownAddNewLearner').click().then
        cy.get('#leranerFirstName').type(Number).then
        cy.get('#leranerLastName').type('Ratshalingwa').then
        cy.log('Number',Number)
        cy.get('#newLearnerNumber').type(Number).then
        cy.get('#leranerEmail').type('nethonondamulalo54@gmail.com').then
        cy.get('#step1').click()
        cy.get('#step2').click()
        cy.get('#step3').click()
        cy.wait(3000)
        cy.get('.rs-flex-box-grid-center > .rs-picker-check > .rs-btn').click()
        cy.get('[data-key="fbd56960-5c5e-45bc-a03e-a64bdef3db78"] > .rs-checkbox > .rs-checkbox-checker > label').click({force: true})
        cy.get('.AddLearnerToGroup > .rs-flex-box-grid-start > .rs-flex-box-grid-end > .rs-flex-box-grid-item > .btn-green-popup').click()
        // cy.get('.AddLearnerToGroup > .rs-flex-box-grid-start > .rs-flex-box-grid-end > .rs-flex-box-grid-item > .btn-green-popup').click()
        cy.wait(5000)
        cy.get('.rs-btn > .rs-icon').click()
        cy.get('.navbar-profile-button-container > .rs-dropdown > .rs-dropdown-menu > :nth-child(2) > .rs-dropdown-item-content').click()
    })


})