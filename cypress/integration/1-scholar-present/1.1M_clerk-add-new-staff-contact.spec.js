/// <reference types="cypress" />

Cypress.on('uncaught:exception', (err, runnable) => {
    console.log(err);
    return false;
})

import * as data from './env.json';
const {envURL} = data;

import "cypress-localstorage-commands"

const fileP = "./Import Example.csv"

describe('1.1 Clerk - Add New Staff contact', () => {
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
    
    // beforeEach(() => {
    //     cy.restoreLocalStorage();
    // });
    
    afterEach(() => {
        cy.saveLocalStorage();
    });
    
    // it("Visit Website", function(){
    //     cy.visit(Cypress.env('url')+"/login")
    // })

    it('1.1.1. I want to add new staff individually (Personal Information and Contact information)', () => {
        cy.viewport('iphone-6')
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
        cy.get('#dropDownAddNewStaff').click()
        cy.get('[style="display: block; transform: translate(0px, 0px);"] > ion-grid.md > form > :nth-child(2) > :nth-child(1) > .rs-input').click().type('Phakhathi').then
        cy.get('[style="display: block; transform: translate(0px, 0px);"] > ion-grid.md > form > :nth-child(2) > :nth-child(2) > .rs-input').click().type('Desmond').then
        cy.get('[style="display: block; transform: translate(0px, 0px);"] > ion-grid.md > form > .StaffRole > .md > .PopupInputPicker > .rs-btn > .rs-picker-toggle-placeholder').click()
        cy.contains('Teacher').click()
        cy.get('.react-draggable-dragged > ion-grid.md > form > .StaffPhoneEmail > :nth-child(1) > .allow-dropdown > .rs-input').click().type('0722663198').then
        cy.get('.react-draggable-dragged > ion-grid.md > form > .StaffPhoneEmail > :nth-child(2) > .rs-input').click().type('desmond@scholarpresent.com').then
        // cy.get('.react-draggable-dragged > ion-grid.md > form > :nth-child(5) > :nth-child(1)').click()
        cy.get('.react-draggable-dragged > ion-grid.md > form > :nth-child(6) > ion-col.md > .rs-flex-box-grid > .rs-flex-box-grid-item > .btn-green-popup').click().then
        cy.get('.StaffsToGroup > ion-grid.md > .devider > ion-col.md > .rs-flex-box-grid > .rs-flex-box-grid-item > .btn-green-popup').click()
        cy.get('.alert-button-inner').click()
    })


    it.only('1.1.4 I want to be able to upload all the staff members at once', () => {
        cy.viewport('iphone-6')
        cy.get('.rs-input', {timeout:20000}).click()
        cy.get('.rs-input').type('090180')
        cy.get('#continueBtn').click()
        cy.get(':nth-child(1) > .otp-input').click().type('1')
        cy.get(':nth-child(2) > .otp-input').click().type('2')
        cy.get(':nth-child(3) > .otp-input').click().type('3')
        cy.get(':nth-child(4) > .otp-input').click().type('4')
        cy.get('#submitPinCodeBtn').click()
        //cy.wait(5000)
        cy.get(':nth-child(3) > .rs-nav-item-content > .navbar-icon', {timeout:20000}).click()
        //cy.wait(2000)
        //cy.get('.conversation-list > :nth-child(1) > :nth-child(3)', {timeout:20000}).click()
        //cy.wait(2000)
        cy.get('.text-input > .rs-input', {timeout:20000}).type('Good Morning Leah jones')
        cy.get('.rs-btn-group > :nth-child(1)').click()
        cy.get('.timebox > .md').should('have.length',1)

      
        cy.get(':nth-child(1) > .rs-nav-item-content').click()
        cy.get(':nth-child(2) > .rs-dropdown-toggle > .outlineBtn',{timeout:20000}).click({force:true})

        cy.wait(1000)
        cy.get('.rs-dropdown-open > .rs-dropdown-menu > :nth-child(1) > .rs-dropdown-item-content').click({force:true})
        cy.get('#csv_import_btn').attachFile(fileP)
        cy.get('.UploadModal > ion-grid.md > .devider > ion-col.md > .rs-flex-box-grid > .rs-flex-box-grid-item > .btn-green-popup').click()
        cy.get(':nth-child(3) > .coll-2 > .PopupInputPicker > .rs-btn').click()
        cy.get('[data-key="1"] > .rs-picker-select-menu-item').should('have.text','Learner First Name (s)').click({force: true})
        cy.get(':nth-child(4) > .coll-2 > .PopupInputPicker > .rs-btn').click()
        cy.get('[data-key="2"] > .rs-picker-select-menu-item').should('have.text','Learner Last Name').click({force: true})
        cy.get(':nth-child(5) > .coll-2 > .PopupInputPicker > .rs-btn').click()
        cy.get('[data-key="3"] > .rs-picker-select-menu-item').should('have.text','Learner Grade').click({force: true})
        cy.get(':nth-child(6) > .coll-2 > .PopupInputPicker > .rs-btn').click()
        cy.get('[data-key="4"] > .rs-picker-select-menu-item').should('have.text','Learner Class').click({force: true})
        cy.get(':nth-child(7) > .coll-2 > .PopupInputPicker > .rs-btn').click()
        cy.get('[data-key="5"] > .rs-picker-select-menu-item').should('have.text','Learner Mobile Number').click({force: true})
        cy.get(':nth-child(8) > .coll-2 > .PopupInputPicker > .rs-btn').click()
        cy.get('[data-key="6"] > .rs-picker-select-menu-item').should('have.text','Learner Email address (Optional)').click({force: true})
        cy.get('.columnMapping > .rs-flex-box-grid-start > .rs-flex-box-grid-end > .rs-flex-box-grid-item > .btn-green-popup').click()

        cy.get(':nth-child(3) > .coll-2 > .PopupInputPicker > .rs-btn').click()
        cy.get('[data-key="7"] > .rs-picker-select-menu-item').should('have.text','Parent 1 First Name (s)').click({force: true})
        cy.get(':nth-child(4) > .coll-2 > .PopupInputPicker > .rs-btn').click()
        cy.get('[data-key="8"] > .rs-picker-select-menu-item').should('have.text','Parent 1 Last Name').click({force: true})
        cy.get(':nth-child(5) > .coll-2 > .PopupInputPicker > .rs-btn').click()
        cy.get('[data-key="9"] > .rs-picker-select-menu-item').should('have.text','Parent 1 Mobile Number').click({force: true})
        cy.get(':nth-child(6) > .coll-2 > .PopupInputPicker > .rs-btn').click()
        cy.get('[data-key="10"] > .rs-picker-select-menu-item').should('have.text','Parent 1 Email address (Optional)').click({force: true})

        cy.get('.columnMapping > .rs-flex-box-grid-start > .rs-flex-box-grid-end > .rs-flex-box-grid-item > .btn-green-popup').click()

        cy.get(':nth-child(3) > .coll-2 > .PopupInputPicker > .rs-btn').click()
        cy.get('[data-key="11"] > .rs-picker-select-menu-item').should('have.text','Parent 2 First Name (s)').click({force: true})
        cy.get(':nth-child(4) > .coll-2 > .PopupInputPicker > .rs-btn').click()
        cy.get('[data-key="12"] > .rs-picker-select-menu-item').should('have.text','Parent 2 Last Name').click({force: true})
        cy.get(':nth-child(5) > .coll-2 > .PopupInputPicker > .rs-btn').click()
        cy.get('[data-key="13"] > .rs-picker-select-menu-item').should('have.text','Parent 2 Mobile Number').click({force: true})
        cy.get(':nth-child(6) > .coll-2 > .PopupInputPicker > .rs-btn').click()
        cy.get('[data-key="14"] > .rs-picker-select-menu-item').should('have.text','Parent 2 Email address (Optional)').click({force: true})

        cy.get('.columnMapping > .rs-flex-box-grid-start > .rs-flex-box-grid-end > .rs-flex-box-grid-item > .btn-green-popup').click()

        cy.wait(3000)

        cy.get('.CGSIBodyHead', {timeout:200000}).should('have.text',"Contacts imported successfully")

        cy.get('.createGroupsSendInvitations > [style="flex-direction: column; width: 100%;"] > .rs-flex-box-grid-end > .rs-flex-box-grid-item > .btn-green-popup',{timeout:100000}).click()
        cy.get('.sendInvitations > [style="flex-direction: column; width: 100%;"] > .rs-flex-box-grid-end > .rs-flex-box-grid-item > .outlineBtn',{timeout:10000}).click()
    })

    it('1.1.5 I want to be able to update the information and class assignment easily', () => {
        cy.viewport('iphone-6')
        cy.get('.rs-input').click().then
        cy.get('.rs-input').type('090200').then
        cy.get('#continueBtn').click().then
        cy.get(':nth-child(1) > .otp-input').click().type('1').then
        cy.get(':nth-child(2) > .otp-input').click().type('2').then
        cy.get(':nth-child(3) > .otp-input').click().type('3').then
        cy.get(':nth-child(4) > .otp-input').click().type('4').then
        cy.get('#submitPinCodeBtn').click().then
        cy.wait(10000)
        cy.get(':nth-child(1) > .rs-flex-box-grid > .tableRowColbtns > :nth-child(1)').click()
        cy.get('[style="display: block; transform: translate(0px, 0px);"] > :nth-child(1) > .learner-tab1 > :nth-child(2) > :nth-child(1) > .rs-input').clear()
        cy.get('[style="display: block; transform: translate(0px, 0px);"] > :nth-child(1) > .learner-tab1 > :nth-child(2) > :nth-child(1) > .rs-input').click().type('willard').then
        cy.get('[style="display: block; transform: translate(0px, 0px);"] > :nth-child(1) > .learner-button-container > .learner-submit-button').click({force: true})
        // cy.get('[style="display: block; transform: translate(0px, 0px);"] > :nth-child(1) > .learner-button-container > .learner-submit-button').click()
        // cy.get('[style="display: block; transform: translate(0px, 0px);"] > :nth-child(1) > .learner-button-container > .learner-submit-button').click()
        // cy.get('.alert-button-inner').click()

    })

    it('1.1.6 I want them to be notified that they have been added to a new official communication App via SMS', () => {
        cy.viewport('iphone-6')
        cy.get('.rs-input').click().then
        cy.get('.rs-input').type('090200').then
        cy.get('#continueBtn').click().then
        cy.get(':nth-child(1) > .otp-input').click().type('1').then
        cy.get(':nth-child(2) > .otp-input').click().type('2').then
        cy.get(':nth-child(3) > .otp-input').click().type('3').then
        cy.get(':nth-child(4) > .otp-input').click().type('4').then
        cy.get('#submitPinCodeBtn').click().then
        cy.wait(10000)
        cy.get(':nth-child(1) > .rs-flex-box-grid > .tableRowColbtns > :nth-child(3) > span').click()
        cy.get('#alert-1-hdr').should('be.visible')
        cy.get('.alert-button-inner').click()
    })

})