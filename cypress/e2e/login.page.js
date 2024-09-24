/// <reference types="cypress" />

export const LoginPage = {
    getEmailInput() {
        return cy.get('input[name="email"]')
    },
    getPasswordInput() {
        return cy.get('input[name="password"]')
    },
    getInputField(type) {
        return cy.get(`input[name="${type}"]`)
    },
    getSignInButton() {
        return cy.contains('button', 'Sign In')
    },
    displayInputErrors(type, errorString) {
        this.getInputField(type).parent().should('have.class', 'Mui-error')
        cy.contains('p', errorString).should('exist').and('be.visible')
    },
    displayToastError(errorString) {
        cy.contains('div.MuiAlert-message', errorString).should('exist').and('be.visible')
    }
}
