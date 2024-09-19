describe('m4n4ge-my-app: dashboard tests', () => {
  before(() => {
    // Runs once before all tests in the block
    cy.visit('/')
  })

  beforeEach(() => {
    // Runs before each test in the block
    cy.visit('/')
    cy.get(':nth-child(1) > a > .MuiButtonBase-root').click()
    cy.get('input[name="email"]').type('new_user@m4n4gemy.app')
    cy.get('input[name="password"]').type(Cypress.env('NEW_USER_PASSWORD'))
    cy.contains('button', 'Sign In').click()
  })

  it('logs in successfully', () => {
    // Check if the user is redirected to the dashboard
    cy.location('pathname').should('equal', '/dashboard')

    // Check if the demo user banner is displayed
    cy.get('.css-14mo1hq').should('be.visible')
  })

  it('should prevent demo user from adding a new application', () => {
    // Close/acknowledge the demo user banner
    cy.get('.css-14mo1hq > .MuiButton-root').click().wait(1000)

    // Click on the add new application button
    cy.get('.MuiFab-root').click().wait(1000)

    // Check if the user is redirected to the new application page
    cy.location('pathname').should('equal', '/add')
    cy.contains('h6', 'Add Application Record').should('be.visible')

    // Check if the required fields are working by directly submitting the form without filling the fields
    cy.contains('button', 'Add Application').click()

    // Check if certain fields are required and "... is required" error message is displayed
    cy.get('label').filter('.Mui-error').its('length').should('be.gt', 1)
    cy.get('body *').filter(':contains("is required")').each($el => {
      cy.wrap($el).should('be.visible')
    }).then($visibleElements => {
      expect($visibleElements.length).to.be.gt(1)
    })

    // Fill just the required fields and submit the form
    cy.get('input[name="employerName"]').type('Test Employer')
    cy.get('input[name="positionName"]').type('Test Application')
    cy.get('div.MuiSelect-outlined').click().wait(500)
    cy.contains('li', 'Indeed').click()
    cy.contains('button', 'Add Application').click()

    // Check if the user actions get blocked and the error message is displayed
    cy.contains('div', 'Access Denied: Demonstration accounts do not have the privileges to add an application. Please create a personal account for full access.').should('be.visible')
    cy.location('pathname').should('equal', '/add')
  })

  it('should prevent demo user from deleting a new application while on dashboard page', () => {
    // Switch to expert user account as new user has no applications to delete
    cy.contains('label', 'John Doe (Expert User)').click().wait(1000)

    // Close/acknowledge the demo user banner
    cy.get('.css-14mo1hq > .MuiButton-root').click().wait(1000)

    // Check if expert user data is loaded
    cy.contains('h6', 'John').should('be.visible')
    cy.get('div.MuiAvatar-root').should('contain', 'J')

    // Find the first application and click on it to get the delete button and click it
    cy.get('tbody>tr').first().click().contains('button', 'Delete').click()

    // Confirm that delete confirmation modal appears
    cy.contains('h2#modal-modal-title', 'Delete Application').should('be.visible')
    cy.contains('p#modal-modal-description', 'Are you sure you want to delete').should('be.visible')

    // Click on the proceed button in the modal
    cy.contains('button', 'Proceed').click()

    // Check if the user actions get blocked and the error message is displayed
    cy.contains('div', 'Access Denied: Demonstration accounts do not have the privileges to delete an application. Please create a personal account for full access.').should('be.visible')
  })

  it('should prevent demo user from deleting a new application while on edit application page', () => {
    // Switch to expert user account as new user has no applications to delete
    cy.contains('label', 'John Doe (Expert User)').click().wait(1000)

    // Close/acknowledge the demo user banner
    cy.get('.css-14mo1hq > .MuiButton-root').click().wait(1000)

    // Check if expert user data is loaded
    cy.contains('h6', 'John').should('be.visible')
    cy.get('div.MuiAvatar-root').should('contain', 'J')

    // Find the first application and click on it to get the edit button and click it
    cy.get('tbody>tr').first().click().contains('button', 'Edit').click()

    // Check if the user is redirected to the edit application page
    cy.location('pathname').should('include', '/edit')

    // Click on delete button
    cy.contains('button', 'Delete').click()

    // Confirm that delete confirmation modal appears
    cy.contains('h2#modal-modal-title', 'Delete Application').should('be.visible')
    cy.contains('p#modal-modal-description', 'Are you sure you want to delete').should('be.visible')

    // Click on the proceed button in the modal
    cy.contains('button', 'Proceed').click()

    // Check if the user actions get blocked and the error message is displayed
    cy.contains('div', 'Access Denied: Demonstration accounts do not have the privileges to delete an application. Please create a personal account for full access.').should('be.visible')
  })

  it('should prevent demo user from editing an existing application', () => {
    // Switch to expert user account as new user has no applications to edit
    cy.contains('label', 'John Doe (Expert User)').click().wait(1000)

    // Close/acknowledge the demo user banner
    cy.get('.css-14mo1hq > .MuiButton-root').click().wait(1000)

    // Find the first application and click on it to get the edit button and click it
    cy.get('tbody>tr').first().click().contains('button', 'Edit').click()

    // Check if the user is redirected to the edit application page
    cy.location('pathname').should('include', '/edit')

    // Check if the employer name field has a value
    cy.get('input[name="employerName"]').should('have.value', 'Zoom')

    // Change the employer name and submit the form
    cy.get('input[name="employerName"]').clear().type('Test Employer')
    cy.contains('button', 'Save Changes').click()

    // Check if the user actions get blocked and the error message is displayed
    cy.contains('div', 'Access Denied: Demonstration accounts do not have the privileges to update an application. Please create a personal account for full access.').should('be.visible')
    cy.location('pathname').should('include', '/edit')
  })

  it.only('matches the number of applications listed in each day card with the count displayed on the day card badge', () => {
    // Switch to expert user account as new user has no applications to delete
    cy.contains('label', 'John Doe (Expert User)').click().wait(1000)

    // Close/acknowledge the demo user banner
    cy.get('.css-14mo1hq > .MuiButton-root').click().wait(1000)

    // Check if expert user data is loaded
    cy.contains('h6', 'John').should('be.visible')
    cy.get('div.MuiAvatar-root').should('contain', 'J')

    // Get the count of applications listed in each day card and compare it with the count displayed on the day card badge
    cy.get('.applications-table').each(($table) => {
      cy.wrap($table).find('.applications-count').invoke('text').then((badgeCount) => {
        cy.log("badgeCount: " + badgeCount)
        cy.wrap($table).find('tbody tr.applications-table-row').its('length').should('eq', parseInt(badgeCount))
      })
    })
  })

})