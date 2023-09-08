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

describe('2.1 Clerk - Creating a group', () => {
    beforeEach(() => {
        cy.visit(envURL)
    })

    it('2.1.1 I want to be able to create groups and give rights to class heads as group administrators', () => {
        cy.viewport('macbook-16')
        cy.get('.rs-input').click({ multiple: true }).then
        cy.get('.rs-input').type('090200').then
        cy.get('#continueBtn').click().then
        cy.get(':nth-child(1) > .otp-input').click().type('1').then
        cy.get(':nth-child(2) > .otp-input').click().type('2').then
        cy.get(':nth-child(3) > .otp-input').click().type('3').then
        cy.get(':nth-child(4) > .otp-input').click().type('4').then
        cy.get('#submitPinCodeBtn').click().then
        cy.wait(8000)
        cy.get(':nth-child(2) > .rs-nav-item-content').click()
        cy.get('.searchBar > :nth-child(2) > .btn-right').click() //new group btn
        cy.get('.groupModalInputInner > .rs-input').click().type(parent1Phone).then
        cy.get(':nth-child(3) > .groupModalInputInner > .drag-cancel > .rs-btn').click()
        cy.wait(3000)
        cy.get(':nth-child(5) > .rs-checkbox > .rs-checkbox-checker > label').click()
        cy.wait(3000)
        cy.get(':nth-child(2) > ul > :nth-child(1) > .rs-checkbox > .rs-checkbox-checker > label').click({force:true})
        cy.wait(5000)
        cy.get(':nth-child(3) > ul > :nth-child(3) > .rs-checkbox > .rs-checkbox-checker > label').click({force:true})
        cy.wait(3000)
        cy.get(':nth-child(4) > ul > :nth-child(2) > .rs-checkbox > .rs-checkbox-checker > label > .rs-checkbox-wrapper').click({force:true})
        cy.get(':nth-child(4) > ul > :nth-child(3) > .rs-checkbox > .rs-checkbox-checker > label > .rs-checkbox-wrapper').click({force:true})
        cy.get('.rs-picker-menu > .rs-btn').click({force:true})
        cy.wait(3000)
        cy.get(':nth-child(4) > .groupModalInputInner > .drag-cancel > .rs-btn').click() // select administrator
        cy.wait(3000)
        cy.get(':nth-child(2) > .rs-checkbox > .rs-checkbox-checker > label').click() // open principal folder
        cy.wait(3000)
        cy.get(':nth-child(2) > .rs-checkbox > .rs-checkbox-checker > label').click({ multiple: true })
        cy.wait(3000)
        cy.get(':nth-child(2) > ul > .rs-picker-cascader-menu-has-children > .rs-checkbox > .rs-checkbox-checker > label > .rs-checkbox-wrapper').click({ multiple: true })
        cy.get('.rs-picker-menu > .rs-btn').click({force:true}) // done after selecting the group administrator
        cy.wait(3000)
        cy.get('form > [style="flex-direction: column; width: 100%;"] > .rs-flex-box-grid-end > .rs-flex-box-grid-item > .btn-green-popup').click({force:true}) // save the pop up
        cy.wait(3000)
        cy.get('.groupSuccess > .rs-flex-box-grid-top.rs-flex-box-grid-start > .rs-flex-box-grid-end > .rs-flex-box-grid-item > .btn-green-popup').click({force:true})
        cy.wait(2000)
        cy.get('.rs-btn > .rs-icon').click()
        cy.get('.navbar-profile-button-container > .rs-dropdown > .rs-dropdown-menu > :nth-child(2) > .rs-dropdown-item-content').click()
        cy.wait(2000)
        
    })

 
    it('2.1.9 I want to be able to present groups as a list', () => {
        cy.viewport('macbook-16')
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
        cy.get('.rs-flex-box-grid-item > .groupBodyText',{timeout:20000}).should('have.not.text','Group Name   (Count: 0)')
    })

})