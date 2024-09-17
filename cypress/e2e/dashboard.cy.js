describe('m4n4ge-my-app: dashboard tests', () => {
  it('logs in successfully', () => {
    cy.visit('/')

    //click on the sign in button
    cy.get(':nth-child(1) > a > .MuiButtonBase-root').click()

    //fill the email and password fields and click on the sign in button
    cy.get('input[name="email"]').type('new_user@m4n4gemy.app')
    cy.get('input[name="password"]').type(Cypress.env('NEW_USER_PASSWORD'))
    cy.contains('button', 'Sign In').click()

    //check if the user is redirected to the dashboard
    cy.location('pathname').should('equal', '/dashboard')

    //check if the demo user banner is displayed
    cy.get('.css-14mo1hq').should('be.visible')
  })
})
