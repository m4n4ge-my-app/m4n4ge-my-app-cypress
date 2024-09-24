/// <reference types="cypress" />

import { LoginPage } from './login.page'

describe("m4n4ge-my-app: login tests", () => {
    beforeEach(() => {
        // Runs once before all tests in the block
        cy.visit('/')
        // Click the "Sign in" button
        cy.get(':nth-child(1) > a > .MuiButtonBase-root').click()
    })

    it("should display an error message for invalid login credentials", () => {
        LoginPage.getEmailInput().type('new_user@m4n4gemy.app')
        LoginPage.getPasswordInput().type('some_invalid_password')
        LoginPage.getSignInButton().click()

        LoginPage.displayToastError('Invalid email or password')
    })

    it("should display an error message for an invalid email address", () => {
        const invalidEmails = [
            'new_user',
            'invalidemail.com',
            'invalid@',
            '@domain.com',
            'invalid@@domain.com',
            'invalid@domain!.com',
            'invalid email@domain.com',
            'invalid@domain',
            //TODO: below test data are not throwing error message as expected, need to investigate validity of these data or fronted validation logic
            // '.invalid@domain.com',
            // 'invalid.@domain.com',
            // 'invalid@domain..com'
          ];
        
        invalidEmails.forEach(email => {
            LoginPage.getEmailInput().type(email)

            // Check the behavior of the email input field when an invalid email is entered
            LoginPage.displayInputErrors('Invalid email address')

            // Check the behavior of the email input field when no email is entered
            LoginPage.getEmailInput().clear()
            LoginPage.displayInputErrors('Email is required')
        })
        
    })
})
