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
})
