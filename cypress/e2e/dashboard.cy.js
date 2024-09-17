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

  it.only('should prevent demo user from adding a new application', () => {
    cy.visit('/')

    //click on the sign in button
    cy.get(':nth-child(1) > a > .MuiButtonBase-root').click()

    //fill the email and password fields and click on the sign in button
    cy.get('input[name="email"]').type('new_user@m4n4gemy.app')
    cy.get('input[name="password"]').type(Cypress.env('NEW_USER_PASSWORD'))
    cy.contains('button', 'Sign In').click()

    //close/acknowledge the demo user banner
    cy.get('.css-14mo1hq > .MuiButton-root').click().wait(1000)

    //click on the add new application button
    cy.get('.MuiFab-root').click().wait(1000)

    //check if the user is redirected to the new application page
    cy.location('pathname').should('equal', '/add')
    cy.contains('h6', 'Add Application Record').should('be.visible')

    //check if the required fields are working by directly submitting the form without filling the fields
    cy.contains('button', 'Add Application').click()

    //check if certains fields are required and "... is required" error message is displayed
    cy.get('label').filter('.Mui-error').its('length').should('be.gt', 1)
    //TODO: below is finding more elements than it appears in the UI, fix it later
    cy.get('body *').filter(':contains("is required")').each($el => {
      cy.wrap($el).should('be.visible')
    }).then($visibleElements => {
      expect($visibleElements.length).to.be.gt(1)
    })

    //fill just the required fields and submit the form
    cy.get('input[name="employerName"]').type('Test Employer')
    cy.get('input[name="positionName"]').type('Test Application')
    cy.get('div.MuiSelect-outlined').click().wait(500)
    cy.contains('li', 'Indeed').click()
    cy.contains('button', 'Add Application').click()

    //check if the user actions gets blocked and the error message is displayed
    cy.contains('div', 'Access Denied: Demonstration accounts do not have the privileges to add an application. Please create a personal account for full access.').should('be.visible')
    cy.location('pathname').should('equal', '/add')
  })

  it('should prevent demo user from deleting a new application while on dashboad page', () => {
    cy.visit('/')

    //click on the sign in button
    cy.get(':nth-child(1) > a > .MuiButtonBase-root').click()

    //fill the email and password fields and click on the sign in button
    cy.get('input[name="email"]').type('new_user@m4n4gemy.app')
    cy.get('input[name="password"]').type(Cypress.env('NEW_USER_PASSWORD'))
    cy.contains('button', 'Sign In').click()

    //switch to expert user account as new user have no applications to delete
    cy.contains('label', 'John Doe (Expert User)').click().wait(1000)

    //close/acknowledge the demo user banner
    cy.get('.css-14mo1hq > .MuiButton-root').click().wait(1000)

    //check if expert user data is loaded
    //1. check if the greating message uses the correct name
    cy.contains('h6', 'John').should('be.visible')
    //2. check if the avatar displays the correct first letter of the name
    cy.get('div.MuiAvatar-root').should('contain', 'J')

    //find the fist application and click on it to get the delete button  and click it
    cy.get('tbody>tr').first().click().contains('button', 'Delete').click()

    //cofirm that delete confirmation modal appears
    cy.contains('h2#modal-modal-title', 'Delete Application').should('be.visible')
    cy.contains('p#modal-modal-description', 'Are you sure you want to delete').should('be.visible')

    //click on the proceed button in the 
    cy.contains('button', 'Proceed').click()

    //check if the user actions gets blocked and the error message is displayed
    cy.contains('div', 'Access Denied: Demonstration accounts do not have the privileges to delete an application. Please create a personal account for full access.').should('be.visible')
  })

})
