/// <reference types="cypress" />

const Number = '+91829' + Math.floor((Math.random() * 1000000))

Cypress.on('uncaught:exception', (err, runnable) => {
    console.log(err);
    return false;
})

describe('Create New School', () => {
    beforeEach(() => {
        cy.visit('https://qa.scholarpresent.com/')
    })

    it('3.1.1 I want to have access to everyone on the system (List contact list)', () => {
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
        cy.get('.total-column').should('contain',40)
    })

    it('3.1.2 I want to be able send a message to everyone at once (Message bulk create)', () => {
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
        cy.get('.rs-picker-cascader > .rs-btn').click()
        cy.wait(5000)
        cy.get(':nth-child(3) > .rs-checkbox > .rs-checkbox-checker > label > .rs-checkbox-wrapper').click()
        cy.wait(5000)
        cy.get('.rs-picker-menu > .rs-btn').click({ force: true })
        cy.wait(5000)
        cy.get('.text-input > .rs-input').type('Good Morning Smith')

    })

    it('3.1.3 I want to be able to send a message to an individuals', () => {
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
        cy.get('.text-input > .rs-input').type('Good Morning Smith')
        cy.get('.rs-btn-group > :nth-child(1)').click()
    })

    it('3.1.4 I want to have access to all channels of communication', () => {
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
        cy.get(':nth-child(4) > .content > .header-title > .name').click()
        cy.wait(5000)
        cy.get('.text-input > .rs-input').type('Good Morning Smith')
        cy.get('.rs-dropdown-toggle > .rs-btn > .rs-icon').click()
        cy.get('.rs-btn-group > .rs-dropdown > .rs-dropdown-menu > .rs-dropdown-item > .rs-dropdown-item-content').should('contain', ' Via SMS ONLY')
        cy.get('.rs-btn-group > :nth-child(1)').click()
    })

    it('3.1.5 I want to be able to choose the channel of communication to use', () => {
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
        cy.get(':nth-child(4) > .content > .header-title > .name').click()
        cy.wait(5000)
        cy.get('.text-input > .rs-input').type('Good Morning Smith')
        cy.get('.rs-dropdown-toggle > .rs-btn > .rs-icon').click()
        cy.get('.rs-btn-group > .rs-dropdown > .rs-dropdown-menu > .rs-dropdown-item > .rs-dropdown-item-content').should('contain', ' Via SMS ONLY').click()
    })

    it('3.1.6 I want to be able to send messages to a specific group', () => {
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
        cy.get(':nth-child(2) > .rs-nav-item-content > .navbar-icon').click()
        cy.get(':nth-child(1) > .groupBody > .btnGroupChat').click()
        cy.get('.text-input > .rs-input').type('Good Morning Smith3')
        cy.get('.rs-dropdown-toggle > .rs-btn > .rs-icon').click()
      
    })

    it('3.1.10 I Dont want to send an empty message - Validation', () => {
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
        cy.get('.rs-btn-disabled').eq(8).should('be.disabled')
    })

    it('3.1.12 I want to be able to search previous messages', () => {
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
        cy.get(':nth-child(5) > .content > .header-title > .name').click()
        cy.wait(5000)
        cy.get('.header-block > .rs-input-group > .rs-input').click().type('zxcc')

    })

    it.only('3.1.15 I want to be able to listen to the voice note before it is sent out', () => {
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
        cy.get(':nth-child(2) > .content > .header-title > .name').click()
        cy.get('.microphone').click()
        cy.wait(5000)
        cy.get('[style="color: rgb(255, 0, 0); cursor: pointer;"]').click()
    })
})