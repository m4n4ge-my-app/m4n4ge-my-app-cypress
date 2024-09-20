// @ts-check
/// <reference types="cypress" />

import 'cypress-map'

chai.use(require('chai-sorted'))

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

  function selectExpertUser() {
    // Switch to expert user account as new user has no applications to delete
    cy.contains('label', 'John Doe (Expert User)').click().wait(1000)

    // Close/acknowledge the demo user banner
    cy.get('.css-14mo1hq > .MuiButton-root').click().wait(1000)

    // Check if expert user data is loaded
    cy.contains('h6', 'John').should('be.visible')
    cy.get('div.MuiAvatar-root').should('contain', 'J')
  }   

  function verifyApplicationsTableCounts() {
    cy.get('.applications-table').each(($table) => {
      cy.wrap($table).find('.applications-count').invoke('text').then((badgeCount) => {
        cy.log("badgeCount: " + badgeCount)
        cy.wrap($table).find('tbody tr.applications-table-row').its('length').should('eq', parseInt(badgeCount))
      })
    })
  }

  function getTableColumnValues(parentTable, columnSelector) {
    return cy.wrap(parentTable)
    .find(columnSelector)
    .map('innerText')
    .print('dates %o')
  }

  function verifySinglePageSortOrder(columnName, order) {
    expect(order, 'order').to.be.oneOf(['asc', 'desc', 'az', 'za'])
    cy.get('.applications-table').within(($table) => {
      const _order = (order === 'asc' || order === 'az') ? 'ascending' : (order === 'desc' || order === 'za') ? 'descending' : 'unknown'

      switch (columnName) {
        case 'applicationDate':
          getTableColumnValues($table, '.applicationDate').should(`be.${_order}`);
          break;
        case 'employerName':
          getTableColumnValues($table, '.employerName').should(`be.${_order}`);
          break;
        case 'roleName':
          getTableColumnValues($table, '.roleName').should(`be.${_order}`);
          break;
        case 'location':
          getTableColumnValues($table, '.location').should(`be.${_order}`);
          break;
      
        default:
          throw new Error(`Unknown column name: ${columnName}`);
      }
    })
  }

  /**
   * @param { 'asc' | 'desc' | 'az' | 'za'} order
   */
  function verifyApplicationsTableSortOrder (columnName, order) {
    function verifyAllPages() {
      verifySinglePageSortOrder(columnName, order)
      cy.get('button[aria-label="Go to next page"]').then($nextButton => {
        if (!$nextButton.is(':disabled')) { // Ensure to stop the recursion when the next button is disabled
          cy.wrap($nextButton).click().wait(1000)
          verifyAllPages() // Recursively call the function for the next page
        }
      })
    }
    verifyAllPages()
  }

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
    selectExpertUser()

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
    selectExpertUser()

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
    selectExpertUser()

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

  it('matches the number of applications listed in each table with the count displayed on the table badge', () => {
    selectExpertUser()

    // Get the count of applications listed in each day card and compare it with the count displayed on the day card badge
    verifyApplicationsTableCounts()

    // Check the above test for weeks view
    cy.contains('button', 'Weeks').click().wait(1000)
    verifyApplicationsTableCounts()

    // Check the above test for months view
    cy.contains('button', 'Months').click().wait(1000)
    verifyApplicationsTableCounts()
  })

  it('should sort the application dates in ascending order', () => {
    selectExpertUser()
    cy.get("#expandCollapseButton").click().wait(1000)
  
    verifyApplicationsTableSortOrder('applicationDate', 'asc')
  })

  it('should sort the application dates in descending order', () => {
    selectExpertUser()
    cy.get("#expandCollapseButton").click().wait(1000)

    // Sort the applications by date in descending order by clicking on the date column header
    cy.contains('span', 'Job Application Date').click().wait(1000)
  
    verifyApplicationsTableSortOrder('applicationDate', 'desc')
  })

  it('should sort the employer names in ascending order', () => {
    selectExpertUser()
    cy.get("#expandCollapseButton").click().wait(1000)

    // Sort the applications by employer name in ascending order by clicking on the date column header
    cy.contains('span', 'Employer Name').click().wait(1000)
  
    verifyApplicationsTableSortOrder('employerName', 'az')
  })

  it('should sort the employer names in descending order', () => {
    selectExpertUser()
    cy.get("#expandCollapseButton").click().wait(1000)

    // Sort the applications by employer name in ascending order by clicking on the date column header
    cy.contains('span', 'Employer Name').click().wait(500).click().wait(500) // dblClick is not working so click twice
  
    verifyApplicationsTableSortOrder('employerName', 'za')
  })

  it('should sort the role names in ascending order', () => {
    selectExpertUser()
    cy.get("#expandCollapseButton").click().wait(1000)

    // Sort the applications by employer name in ascending order by clicking on the date column header
    cy.contains('span', 'Role Name').click().wait(1000)
  
    verifyApplicationsTableSortOrder('roleName', 'az')
  })

  it('should sort the role names in descending order', () => {
    selectExpertUser()
    cy.get("#expandCollapseButton").click().wait(1000)

    // Sort the applications by employer name in ascending order by clicking on the date column header
    cy.contains('span', 'Role Name').click().wait(500).click().wait(500) // dblClick is not working so click twice
  
    verifyApplicationsTableSortOrder('roleName', 'za')
  })

  it('should sort the locations in ascending order', () => {
    selectExpertUser()
    cy.get("#expandCollapseButton").click().wait(1000)

    // Sort the applications by employer name in ascending order by clicking on the date column header
    cy.contains('span', 'Location').click().wait(1000)
  
    verifyApplicationsTableSortOrder('location', 'az')
  })

  it('should sort the locations in descending order', () => {
    selectExpertUser()
    cy.get("#expandCollapseButton").click().wait(1000)

    // Sort the applications by employer name in ascending order by clicking on the date column header
    cy.contains('span', 'Location').click().wait(500).click().wait(500) // dblClick is not working so click twice
  
    verifyApplicationsTableSortOrder('location', 'za')
  })

})