/// <reference types="cypress" />

import * as data from './env.json';
const {envURL} = data;

import "cypress-localstorage-commands"

const fileD = "./document.pdf"

const Number = '+91829' + Math.floor((Math.random() * 1000000))

Cypress.on('uncaught:exception', (err, runnable) => {
    console.log(err);
    return false;
})

describe('3.1 Admin - Send message', () => {
    beforeEach(() => {
        cy.visit(envURL)
        cy.restoreLocalStorage();
    })

    let table;
    before(() => {
        Cypress.Cookies.preserveOnce('ajs_user_id')
        Cypress.Cookies.preserveOnce('ajs_anonymous_id')
        cy.clearLocalStorageSnapshot();
    });

    it('3.1.1 I want to have access to everyone on the system (List contact list)', () => {
        cy.reload(true)
        cy.get('.rs-input').click().then
        cy.get('.rs-input').type('090200').then
        cy.get('#continueBtn').click().then
        cy.get(':nth-child(1) > .otp-input').click().type('1').then
        cy.get(':nth-child(2) > .otp-input').click().type('2').then
        cy.get(':nth-child(3) > .otp-input').click().type('3').then
        cy.get(':nth-child(4) > .otp-input').click().type('4').then
        cy.get('#submitPinCodeBtn').click().then
        cy.get('.total-column', {timeout:20000}).should('have.text','Total filtered: 40')
    })

    it.skip('3.1.2 I want to be able send a message to everyone at once (via filters)', () => {
        cy.reload(true)
        cy.get('.rs-input').click().then
        cy.get('.rs-input').type('090200').then
        cy.get('#continueBtn').click().then
        cy.get(':nth-child(1) > .otp-input').click().type('1').then
        cy.get(':nth-child(2) > .otp-input').click().type('2').then
        cy.get(':nth-child(3) > .otp-input').click().type('3').then
        cy.get(':nth-child(4) > .otp-input').click().type('4').then
        cy.get('#submitPinCodeBtn').click().then
        cy.wait(5000)
        cy.get(':nth-child(3) > .rs-nav-item-content > .navbar-icon').click()
        cy.wait(5000)
        cy.get('.rs-picker-cascader > .rs-btn').click()
        cy.wait(5000)
        cy.get(':nth-child(3) > .rs-checkbox > .rs-checkbox-checker > label > .rs-checkbox-wrapper').click()
        cy.wait(5000)
        cy.get('.rs-picker-menu > .rs-btn').click({ force: true })
        cy.wait(5000)
        cy.get('.text-input > .rs-input').type('Good Morning Smith')

    })

    it('3.1.2 I want to be able send a message to everyone at once (Message bulk create)', () => {
        cy.reload(true)
        cy.get('.rs-input').click().then
        cy.get('.rs-input').type('090200').then
        cy.get('#continueBtn').click().then
        cy.get(':nth-child(1) > .otp-input').click().type('1').then
        cy.get(':nth-child(2) > .otp-input').click().type('2').then
        cy.get(':nth-child(3) > .otp-input').click().type('3').then
        cy.get(':nth-child(4) > .otp-input').click().type('4').then
        cy.get('#submitPinCodeBtn').click().then
        cy.wait(5000)
        cy.get(':nth-child(3) > .rs-nav-item-content > .navbar-icon').click()
        cy.wait(5000)
        cy.get('.conversation-list > :nth-child(1) > :nth-child(2)').click()
        cy.wait(2000)
        cy.get('.text-input > .rs-input').type('Good Morning parents')
        cy.get('.rs-btn-group > :nth-child(1)').click()
    })

    it('3.1.3 I want to be able to send a message to an individuals', () => {
        cy.reload(true)
        cy.get('.rs-input').click().then
        cy.get('.rs-input').type('090200').then
        cy.get('#continueBtn').click().then
        cy.get(':nth-child(1) > .otp-input').click().type('1').then
        cy.get(':nth-child(2) > .otp-input').click().type('2').then
        cy.get(':nth-child(3) > .otp-input').click().type('3').then
        cy.get(':nth-child(4) > .otp-input').click().type('4').then
        cy.get('#submitPinCodeBtn').click().then
        cy.wait(5000)
        cy.get(':nth-child(3) > .rs-nav-item-content > .navbar-icon').click()
        cy.wait(2000)
        cy.get('.conversation-list > :nth-child(1) > :nth-child(3)').click()
        cy.wait(2000)
        cy.get('.text-input > .rs-input').type('Good Morning Leah jones')
        cy.get('.rs-btn-group > :nth-child(1)').click()
    })

    it('3.1.4 I want to have access to all channels of communication', () => {
        cy.reload(true)
        cy.get('.rs-input').click().then
        cy.get('.rs-input').type('090200').then
        cy.get('#continueBtn').click().then
        cy.get(':nth-child(1) > .otp-input').click().type('1').then
        cy.get(':nth-child(2) > .otp-input').click().type('2').then
        cy.get(':nth-child(3) > .otp-input').click().type('3').then
        cy.get(':nth-child(4) > .otp-input').click().type('4').then
        cy.get('#submitPinCodeBtn').click().then
        cy.wait(10000)
        cy.get(':nth-child(3) > .rs-nav-item-content > .navbar-icon').click()
        cy.get('.conversation-list > :nth-child(1) > :nth-child(3)').click()
        cy.wait(8000)
        cy.get('.text-input > .rs-input').type('Good Morning Smith')
        cy.get('.rs-dropdown-toggle > .rs-btn > .rs-icon').click()
        cy.get('.rs-btn-group > .rs-dropdown > .rs-dropdown-menu > .rs-dropdown-item > .rs-dropdown-item-content').should('contain', ' Via SMS ONLY')
        cy.get('.rs-btn-group > :nth-child(1)').click()
    })

    it('3.1.5 I want to be able to choose the channel of communication to use', () => {
        cy.reload(true)
        cy.get('.rs-input').click().then
        cy.get('.rs-input').type('090200').then
        cy.get('#continueBtn').click().then
        cy.get(':nth-child(1) > .otp-input').click().type('1').then
        cy.get(':nth-child(2) > .otp-input').click().type('2').then
        cy.get(':nth-child(3) > .otp-input').click().type('3').then
        cy.get(':nth-child(4) > .otp-input').click().type('4').then
        cy.get('#submitPinCodeBtn').click().then
        cy.wait(10000)
        cy.get(':nth-child(3) > .rs-nav-item-content > .navbar-icon').click()
        cy.get('.conversation-list > :nth-child(1) > :nth-child(2)').click()
        cy.wait(8000)
        cy.get('.text-input > .rs-input').type('Good Morning Smith')
        cy.get('.rs-dropdown-toggle > .rs-btn > .rs-icon').click()
        cy.get('.rs-btn-group > .rs-dropdown > .rs-dropdown-menu > .rs-dropdown-item > .rs-dropdown-item-content').should('contain', ' Via SMS ONLY').click()
    })

    it.skip('3.1.6 I want to be able to send messages to a specific group', () => {
        cy.reload(true)
        cy.get('.rs-input').click().then
        cy.get('.rs-input').type('090200').then
        cy.get('#continueBtn').click().then
        cy.get(':nth-child(1) > .otp-input').click().type('1').then
        cy.get(':nth-child(2) > .otp-input').click().type('2').then
        cy.get(':nth-child(3) > .otp-input').click().type('3').then
        cy.get(':nth-child(4) > .otp-input').click().type('4').then
        cy.get('#submitPinCodeBtn').click().then
        cy.wait(5000)
        cy.get(':nth-child(2) > .rs-nav-item-content > .navbar-icon').click()
        cy.get(':nth-child(1) > .groupBody > .btnGroupChat').click()
        cy.wait(5000)
        cy.get('.text-input > .rs-input').type('Good Morning Smith')
        cy.get('.rs-dropdown-toggle > .rs-btn > .rs-icon').click()
      
    })

    it('3.1.10 I Dont want to send an empty message - Validation', () => {
        cy.reload(true)
        cy.get('.rs-input').click().then
        cy.get('.rs-input').type('090200').then
        cy.get('#continueBtn').click().then
        cy.get(':nth-child(1) > .otp-input').click().type('1').then
        cy.get(':nth-child(2) > .otp-input').click().type('2').then
        cy.get(':nth-child(3) > .otp-input').click().type('3').then
        cy.get(':nth-child(4) > .otp-input').click().type('4').then
        cy.get('#submitPinCodeBtn').click().then
        cy.wait(5000)
        cy.get(':nth-child(3) > .rs-nav-item-content > .navbar-icon').click()
        cy.wait(10000)
        cy.get('.rs-btn-disabled').should('be.disabled')
    })

    it('3.1.11 I want to know when messages are sent successfully', () => {
        cy.get('.rs-input', {timeout:20000}).click()
        cy.get('.rs-input').type('090180')
        cy.get('#continueBtn').click()
        cy.get(':nth-child(1) > .otp-input').click().type('1')
        cy.get(':nth-child(2) > .otp-input').click().type('2')
        cy.get(':nth-child(3) > .otp-input').click().type('3')
        cy.get(':nth-child(4) > .otp-input').click().type('4')
        cy.get('#submitPinCodeBtn').click()
        cy.get(':nth-child(3) > .rs-nav-item-content > .navbar-icon', {timeout:20000}).click()
        cy.get('.text-input > .rs-input', {timeout:20000}).type('Good Morning Lenkwe!')
        cy.get('.rs-btn-group > :nth-child(1)').click()
        cy.get('.timebox > .md').should('have.length',1)
    })

    it('3.1.12 I want to be able to search previous messages', () => {
        cy.get('.rs-input').click().then
        cy.get('.rs-input').type('090200').then
        cy.get('#continueBtn').click().then
        cy.get(':nth-child(1) > .otp-input').click().type('1').then
        cy.get(':nth-child(2) > .otp-input').click().type('2').then
        cy.get(':nth-child(3) > .otp-input').click().type('3').then
        cy.get(':nth-child(4) > .otp-input').click().type('4').then
        cy.get('#submitPinCodeBtn').click().then
        cy.wait(5000)
        cy.get(':nth-child(3) > .rs-nav-item-content > .navbar-icon').click()
        cy.get('.conversation-list > :nth-child(1) > :nth-child(3)').click()
        cy.wait(5000)
        cy.get('.header-block > .rs-input-group > .rs-input').click().type('Mulalo')

    })

    it.skip('3.1.14 I want to be able to send documents', () => {
        cy.get('.rs-input').click().then
        cy.get('.rs-input').type('090200').then
        cy.get('#continueBtn').click().then
        cy.get(':nth-child(1) > .otp-input').click().type('1').then
        cy.get(':nth-child(2) > .otp-input').click().type('2').then
        cy.get(':nth-child(3) > .otp-input').click().type('3').then
        cy.get(':nth-child(4) > .otp-input').click().type('4').then
        cy.get('#submitPinCodeBtn').click().then
        cy.wait(5000)
        cy.get(':nth-child(3) > .rs-nav-item-content > .navbar-icon').click()
        cy.get('#conversationDiv > :nth-child(1) > :nth-child(3)', {timeout:20000}).click()
        cy.get('.insert-icons > .rs-icon').click()
        cy.wait(2000)
        cy.get('.message.sent').find('.message-list').then(listing => {
            const listingCount = Cypress.$(listing).length;
            cy.get('#root > ion-app > ion-router-outlet > div > ion-content > div > div > div > div.rs-col.rs-col-xs-24.rs-col-md-16.rs-col-lg-16 > div > div.message-body > div.chat-controls > input[type=file]').attachFile(fileD)
            // cy.get('[class="cursor-pointer rs-icon rs-icon-attachment"]').click({force:true})
            // cy.get('.text-input > .rs-input').type('Here is the pdf test')
            cy.get('').invoke('attr', 'id')
            cy.get('.rs-btn-group > :nth-child(1)').click() 
            // expect(listing).to.have.length(listingCount);
            });
    })

    it.skip('3.1.15 I want to be able to listen to the voice note before it is sent out', () => {
        cy.reload(true)
        cy.get('.rs-input').click().then
        cy.get('.rs-input').type('090120').then
        cy.get('#continueBtn').click().then
        cy.get(':nth-child(1) > .otp-input').click().type('1').then
        cy.get(':nth-child(2) > .otp-input').click().type('2').then
        cy.get(':nth-child(3) > .otp-input').click().type('3').then
        cy.get(':nth-child(4) > .otp-input').click().type('4').then
        cy.get('#submitPinCodeBtn').click().then
        cy.wait(5000)
        cy.get(':nth-child(3) > .rs-nav-item-content > .navbar-icon').click()
        cy.wait(5000)
        cy.get('.conversation-list > :nth-child(1) > :nth-child(3)').click()
        cy.get('.microphone').click()
        cy.wait(5000)
        cy.get('[style="color: rgb(255, 0, 0); cursor: pointer;"]').click()
    })


})
