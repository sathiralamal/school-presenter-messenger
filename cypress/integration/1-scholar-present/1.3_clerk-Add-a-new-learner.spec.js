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

describe('1.3 Clerk - Add a new learner', () => {
    beforeEach(() => {
        cy.visit(envURL)
    })

    it('1.3.2 I want to be able to add a learner individually', () => {
        cy.get('.rs-input').click().then
        cy.get('.rs-input').type('090200').then
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
        cy.get('#newLearnerNumber').type(learnerNumber).then
        cy.get('#leranerEmail').type('nethonondamulalo54@gmail.com').then
        cy.get('#step1').click()
        cy.get('#step2').click()
        cy.get('#step3').click()
        cy.wait(3000)
        cy.get('.AddLearnerToGroup > .rs-flex-box-grid-start > .rs-flex-box-grid-end > .rs-flex-box-grid-item > .btn-green-popup').click()
        cy.wait(5000)

    })

    it('1.3.3 I want to add their parents/guardian information, either with the spreadsheet or individually', () => {
        cy.get('.rs-input').click().then
        cy.get('.rs-input').type('090200').then
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
        cy.get('#newLearnerNumber').type(learnerNumber).then
        cy.get('#leranerEmail').type('nethonondamulalo54@gmail.com').then
        cy.get('#step1').click()
        cy.get('#parent1FirstName').type('Donald')
        cy.get('#parent1LastName').type('Mathebula')
        cy.get(':nth-child(2) > :nth-child(1) > .allow-dropdown > .rs-input').type(parent1Phone)
        cy.get('#parent1Email').type('donaldmathebula@gmail.com')
        cy.get('#step2').click()
        cy.get('#parent1FirstName').type('Jane')
        cy.get('#parent1LastName').type('Mathebula')
        cy.get(':nth-child(2) > :nth-child(1) > .allow-dropdown > .rs-input').type(parent2Phone)
        cy.get('#parent1Email').type('janemathebula@gmail.com')
        cy.get('#step3').click()
        cy.wait(3000)
        cy.get('.AddLearnerToGroup > .rs-flex-box-grid-start > .rs-flex-box-grid-end > .rs-flex-box-grid-item > .btn-green-popup').click({force: true})
        cy.wait(5000)
    })

    it('1.3.4 I want to be able to associate these learners with the class they belong to.', () => {
        cy.get('.rs-input').click().then
        cy.get('.rs-input').type('090200').then
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
        cy.get('#leranerGrade').select('Grade 2')    
        cy.log('Number', learnerNumber)
        cy.get('#newLearnerNumber').type(learnerNumber).then
        cy.get('#leranerEmail').type('nethonondamulalo54@gmail.com').then
        cy.get('#step1').click()
        cy.get('#parent1FirstName').type('Donald')
        cy.get('#parent1LastName').type('Mathebula')
        cy.get(':nth-child(2) > :nth-child(1) > .allow-dropdown > .rs-input').type(parent1Phone)
        cy.get('#parent1Email').type('donaldmathebula@gmail.com')
        cy.get('#step2').click()
        cy.get('#parent1FirstName').type('Jane')
        cy.get('#parent1LastName').type('Mathebula')
        cy.get(':nth-child(2) > :nth-child(1) > .allow-dropdown > .rs-input').type(parent2Phone)
        cy.get('#parent1Email').type('janemathebula@gmail.com')
        cy.get('#step3').click()
        cy.wait(3000)
        cy.get('.AddLearnerToGroup > .rs-flex-box-grid-start > .rs-flex-box-grid-end > .rs-flex-box-grid-item > .btn-green-popup').click()
        cy.wait(5000)
    })

    it('1.3.10 I want to see the newly added learners in a scrollable list - Pagination', () => {
        cy.get('.rs-input').click().then
        cy.get('.rs-input').type('090200').then
        cy.get('#continueBtn').click().then
        cy.get(':nth-child(1) > .otp-input').click().type('1').then
        cy.get(':nth-child(2) > .otp-input').click().type('2').then
        cy.get(':nth-child(3) > .otp-input').click().type('3').then
        cy.get(':nth-child(4) > .otp-input').click().type('4').then
        cy.get('#submitPinCodeBtn').click().then
        cy.wait(10000)
        cy.get('#addContact').click().then
        cy.get('#dropDownAddNewLearner').click().then
        cy.get('#leranerFirstName').type(learnerNumber).then
        cy.get('#leranerLastName').type('Mukusule').then
        cy.log('Number', learnerNumber)
        cy.get('#newLearnerNumber').type(learnerNumber).then
        cy.get('#leranerEmail').type('nethonondamulalo54@gmail.com').then
        cy.get('#step1').click()
        cy.get('#step2').click()
        cy.get('#step3').click()
        cy.wait(3000)
        cy.get('.AddLearnerToGroup > .rs-flex-box-grid-start > .rs-flex-box-grid-end > .rs-flex-box-grid-item > .btn-green-popup').click()
        cy.wait(5000)
        cy.get('.native-input').type(learnerNumber)
        cy.wait(2000)
        cy.get('.desktop-only > .rs-flex-box-grid > .name-column > ion-text.md').should('be.visible')
    })

    it('1.3.12 I want to be able to update the learner information', () => {
        cy.get('.rs-input').click().then
        cy.get('.rs-input').type('090200').then
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
        cy.get('#leranerLastName').clear()
        cy.get('#leranerLastName').type('NewNamehere').then
        cy.log('Number', learnerNumber)
        cy.get('#leranerFirstName').type(learnerNumber).then
        cy.get('#leranerEmail').type('nethonondamulalo54@gmail.com').then
        cy.get('#step1').click()
        cy.get('#step2').click()
        cy.get('#step3').click()
        cy.wait(3000)
        cy.get('.AddLearnerToGroup > .rs-flex-box-grid-start > .rs-flex-box-grid-end > .rs-flex-box-grid-item > .btn-green-popup').click()
        cy.wait(5000)
    })

    it('1.3.13 Validation of the number format required by the system - Should Fail', () => {
        cy.get('.rs-input').click().then
        cy.get('.rs-input').type('090200').then
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
        cy.get('#leranerLastName').clear()
        cy.get('#leranerLastName').type('NewNamehere').then
        cy.log('Number', learnerNumber)
        cy.get('#leranerFirstName').type(learnerNumber).then
        cy.get('#leranerEmail').type('nethonondamulalo54@gmail.com').then
        cy.get('#step1').click()
        cy.get('#step2').click()
        cy.get('#step3').click()
        cy.wait(3000)
        cy.get('.AddLearnerToGroup > .rs-flex-box-grid-start > .rs-flex-box-grid-end > .rs-flex-box-grid-item > .btn-green-popup').click()
        cy.wait(5000)
    })

    it('1.3.14 I want to be given an example of the upload template compatible with the system', () => {
        cy.get('.rs-input').click().then
        cy.get('.rs-input').type('090200').then
        cy.get('#continueBtn').click().then
        cy.get(':nth-child(1) > .otp-input').click().type('1').then
        cy.get(':nth-child(2) > .otp-input').click().type('2').then
        cy.get(':nth-child(3) > .otp-input').click().type('3').then
        cy.get(':nth-child(4) > .otp-input').click().type('4').then
        cy.get('#submitPinCodeBtn').click().then
        cy.wait(8000)
        cy.get(':nth-child(2) > .rs-dropdown-toggle > .outlineBtn').click()
        cy.contains('Learner and Parents').click()
        cy.get('[justify="end"] > .btn-green-popup').should('be.visible')
    })

    it('1.3.15 I want to be able to search or filter the name of a learner from the list', () => {
        cy.get('.rs-input').click().then
        cy.get('.rs-input').type('090200').then
        cy.get('#continueBtn').click().then
        cy.get(':nth-child(1) > .otp-input').click().type('1').then
        cy.get(':nth-child(2) > .otp-input').click().type('2').then
        cy.get(':nth-child(3) > .otp-input').click().type('3').then
        cy.get(':nth-child(4) > .otp-input').click().type('4').then
        cy.get('#submitPinCodeBtn').click().then
        cy.wait(10000)
        cy.get('#addContact').click().then
        cy.get('#dropDownAddNewLearner').click().then
        cy.get('#leranerFirstName').type(learnerNumber).then
        cy.get('#leranerLastName').type('Mukusule').then
        cy.log('Number', learnerNumber)
        cy.get('#leranerFirstName').type(learnerNumber).then
        cy.get('#leranerEmail').type('nethonondamulalo54@gmail.com').then
        cy.get('#step1').click()
        cy.get('#step2').click()
        cy.get('#step3').click()
        cy.wait(3000)
        cy.get('.AddLearnerToGroup > .rs-flex-box-grid-start > .rs-flex-box-grid-end > .rs-flex-box-grid-item > .btn-green-popup').click()
        cy.wait(5000)
        cy.get('.native-input').type(learnerNumber)
        cy.wait(2000)
        cy.get('.desktop-only > .rs-flex-box-grid > .name-column > ion-text.md').should('be.visible')
    })

})