// scholar-present.spec.js created with Cypress
/// <reference types="cypress" />
import * as data from './env.json';
const {envURL} = data;

Cypress.on('uncaught:exception', (err, runnable) => {
    console.log(err);
    return false;
})

describe('Scholar Present', () => {
    before(() => {
        console.log("envURL ", envURL);
        cy.visit(envURL)
    })

    it('Test if the top menu has all tabs', () => {
        const menuLinksText = [
            "Home",
            "Download App",
            "About Us",
            "FAQs",
            "Contact Us",
            "Sign In",

        ]

        cy.get('#navbarNavDropdown [class*="navbar-nav ms-lg-auto"]').each((item, index, list) => {
            expect(list).to.have(6)
        })

    })

    it('Sign into Scholar Present Successfully', () => {
        cy.get('.rs-input').click().then
        cy.get('.rs-input').type('090135').then
        cy.get('#continueBtn').click().then
        cy.get(':nth-child(1) > .otp-input').click().type('1').then
        cy.get(':nth-child(2) > .otp-input').click().type('2').then
        cy.get(':nth-child(3) > .otp-input').click().type('3').then
        cy.get(':nth-child(4) > .otp-input').click().type('4').then
        cy.get('#submitPinCodeBtn').click().then
        cy.wait(5000)

    })

    it('Test if contacts Tab exist', () => {
        cy.wait(8000)
        cy.get('[src="assets/logo.png"]').should('be.visible')
    })

    it('Test if contacts Tab exist', () => {
        cy.get('[class="navbar-icon rs-icon rs-icon-id-badge rs-icon-size-2x"]').should('be.visible')
        cy.contains('Contacts').should('be.visible')
    })

    it('Test if Groups Tab exist', () => {
        cy.get('[class="navbar-icon rs-icon rs-icon-group rs-icon-size-2x"]').should('be.visible')
        cy.contains('Groups').should('be.visible')
    })

    it('Test if Messaging Tab exist', () => {
        cy.get('[class="navbar-icon rs-icon rs-icon-wechat rs-icon-size-2x"]').should('be.visible')
        cy.contains('Messaging').should('be.visible')
    })

    it('Did sub tab contacts load correctly', () => {
        cy.get('[value="Contacts"]').should('be.visible')
    })

    it('Did sub tab Invitation load correctly', () => {
        cy.get('[value="Invitations"]').should('be.visible')
    })

    it('Contact Search ', () => {
        cy.wait(6000)
        cy.log('Contact Search')
        cy.get('[class="native-input sc-ion-input-md"]').should('be.visible')
    })

    it('Add Contact button', () => {
        cy.contains('Add Contact').should('be.visible')
    })

    it('Import Contacts Button', () => {
        cy.contains('Import contact').should('be.visible')
    })

    it('Export list to PDF Button', () => {
        cy.contains('Export list to PDF').should('be.visible')
    })

    it.skip('Send a Message to Jose Hall', () => {
        cy.reload()
        cy.get('[class="rs-icon rs-icon-wechat rs-icon-size-2x"]').click()
        // cy.get('.conversation-list > div > .rs-btn').click()
        cy.contains('class="name"')
        cy.contains('Jose Hall', 'Student').click()
    })


    it('Add a Learner without parents', () => {
        cy.get('#addContact').click().then
        cy.get('#dropDownAddNewLearner').click().then
        cy.get('#leranerFirstName').type('William').then
        cy.get('#leranerLastName').type('Muthombeni').then
        cy.get('#leranerGrade').select('Grade 12').then
        cy.get('#leranerPhone').type('0722663198').then
        cy.get('#leranerEmail').type('nethonondamulalo54@gmail.com').then
        // cy.get('#leranerGrade').eq(2).click()        
        // cy.wait(2000)
        // cy.get('[id="leranerClass"]').should('be.visible').select('Gr 12A').then
        cy.get('#next').should('be.visible').click()
        cy.get('#next').should('be.visible').click()
        cy.get('#next').should('be.visible').click()
        cy.get('#cancel').should('be.visible').click()
        cy.wait(5000)
    })


    it.skip('Edit Learner Contact information', () => {
        cy.wait(10000)
        cy.get(':nth-child(7) > .rs-flex-box-grid > .tableRowColbtns > :nth-child(1)').eq(0).click()
        cy.get('[style="display: block; transform: translate(0px, 0px);"] > ion-grid.md > form > .LearnerPhoneEmail > :nth-child(1) > .rs-input').type('0')
        cy.get('[style="display: block; transform: translate(0px, 0px);"] > ion-grid.md > form > ion-row.devider > ion-col.md > .rs-flex-box-grid > .rs-flex-box-grid-item > .btn-green-popup').click()

    })

})



describe.skip('Create New School', () => {
    before(() => {
        cy.visit('https://dev.scholarpresent.com/')
    })

    it('Log in with a an invited Number as a Student (Use this Tenant 0722663198)', () => {
        cy.get('[class="rs-btn rs-btn-subtle rs-dropdown-toggle"]').click().then
        cy.contains('Join My School').click().then
        cy.get('.rs-input').type('+91839073458').then
        cy.get('#continueBtn').click()
        cy.wait(10000)
        cy.get(':nth-child(1) > .otp-input').click().type('1').then
        cy.get(':nth-child(2) > .otp-input').click().type('2').then
        cy.get(':nth-child(3) > .otp-input').click().type('3').then
        cy.get(':nth-child(4) > .otp-input').click().type('4').then
        cy.get('#submitRegPinCodeBtn').click().then
        cy.wait(20000)
        cy.contains('NEXT').click()
        cy.wait(1000)
        cy.contains('NEXT').click()
        cy.wait(1000)
        cy.contains('FINISH').click()
        cy.wait(1000)
    })
})

describe('Log in as a student', () => {
    before(() => {
        cy.visit('https://dev.scholarpresent.com/')
    })

    it('Log in as a Student (Use this Tenant 0722663198)', () => {
        cy.get('.rs-input').click().then
        cy.get('.rs-input').type('+91839073458').then
        cy.get('#continueBtn').click().then
        cy.get(':nth-child(1) > .otp-input').click().type('1').then
        cy.get(':nth-child(2) > .otp-input').click().type('2').then
        cy.get(':nth-child(3) > .otp-input').click().type('3').then
        cy.get(':nth-child(4) > .otp-input').click().type('4').then
        cy.get('#submitPinCodeBtn').click().then
        cy.wait(5000)
    })
})