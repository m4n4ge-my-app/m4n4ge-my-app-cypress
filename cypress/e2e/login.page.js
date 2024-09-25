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
    },
    login(username, password) {
        cy.log(`Session for user: ${username}`)
        cy.session('user session', () => {
            cy.visit('/')
            cy.get(':nth-child(1) > a > .MuiButtonBase-root').click()
            cy.get('input[name="email"]').type(username)
            cy.get('input[name="password"]').type(password, { log: false })
            cy.contains('button', 'Sign In').click().wait(3000)
            cy.window().then(win => win.localStorage.getItem('user'));
        })
        cy.visit('/dashboard')
    }
}
