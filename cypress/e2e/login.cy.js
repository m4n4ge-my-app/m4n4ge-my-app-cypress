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
            LoginPage.displayInputErrors('email', 'Invalid email address')

            // Check the behavior of the email input field when no email is entered
            LoginPage.getEmailInput().clear()
            LoginPage.displayInputErrors('email', 'Email is required')
        })
        
    })

    // Note: This test should be placed carefully, as it requires the user to be logged out before hand if it follows tests that perform successful logins.
    it("should prevent an anonymous user from accessing private routes without logging in", () => {
        const somePrivateRoutes = [
            '/dashboard',
            '/add',
            '/resumes',
            '/coverletters',
            '/calendar',
            '/descriptions',
            '/todos',
            '/interview',
            '/automated',
            '/archives',
            '/profile',
            '/settings'
        ]

        somePrivateRoutes.forEach(route => {
            cy.visit(route)
            cy.url().should('eq', Cypress.config().baseUrl)
        })
    })

    it("should redirect invalid urls to the base url", () => {
        const someInvalidUrls = [
            '/invalid-page',
            '/nonexistent',
            '/404',
            '/random-url',
            '/unknown-route'
          ];

          someInvalidUrls.forEach(route => {
            cy.visit(route)
            cy.url().should('eq', Cypress.config().baseUrl)
        })
    })

    it("should display error messages for empty email and password fields", () => {
        LoginPage.getSignInButton().click()
        LoginPage.displayInputErrors('email', 'Email is required')
        LoginPage.displayInputErrors('password', 'Password is required')
    })
})
