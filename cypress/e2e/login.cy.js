/// <reference types="cypress" />

describe("m4n4ge-my-app: login tests", () => {
    beforeEach(() => {
        // Runs once before all tests in the block
        cy.visit('/')
        // Click the "Sign in" button
        cy.get(':nth-child(1) > a > .MuiButtonBase-root').click()
    })

    it("should display an error message for invalid login credentials", () => {
        cy.get('input[name="email"]').type('new_user@m4n4gemy.app')
        cy.get('input[name="password"]').type('some_invalid_password')
        cy.contains('button', 'Sign In').click()

        cy.contains('div.MuiAlert-message', 'Invalid email or password').should('exist').and('be.visible')
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
            cy.get('input[name="email"]').type(email)

            // Check the behavior of the email input field when an invalid email is entered
            cy.get('input[name="email"]').parent().should('have.class', 'Mui-error')
            cy.contains('p', 'Invalid email address').should('exist').and('be.visible')

            // Check the behavior of the email input field when no email is entered
            cy.get('input[name="email"]').clear()
            cy.get('input[name="email"]').parent().should('have.class', 'Mui-error')
            cy.contains('p', 'Email is required').should('exist').and('be.visible')
        })
        
    })
})
