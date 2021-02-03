describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:5000/api/testing/reset')
    cy.request('POST', 'http://localhost:5000/api/users/', {
      name: 'Matti Luukkainen',
      username: 'mluukkai',
      password: 'salainen'
    })
    cy.visit('http://localhost:5000')
  })

  it('Login form is shown', function() {
    cy.contains('Log in to the application')
    cy.get('#loginForm')
  })

  describe('Login', function() {
    it('succeeds with correct credentials', function() {
      cy.get('#username').type('mluukkai')
      cy.get('#password').type('salainen')
      cy.get('#submitLogin').click()

      cy.contains('Matti Luukkainen logged in')
    })

    it('fails with wrong credentials', function() {
      cy.get('#username').type('mluukkai')
      cy.get('#password').type('hemlig')
      cy.get('#submitLogin').click()

      cy.get('.error')
        .should('contain', 'Error: Wrong username or password')
        .and('have.css', 'color', 'rgb(255, 0, 0)')
    })
  })

  describe('When logged in', function() {
    beforeEach(function() {
      cy.login({ username: 'mluukkai', password: 'salainen' })
    })

    it('a blog can be created', function() {
      cy.contains('add new').click()
      cy.get('#title').type('Using Cypress for E2E testing')
      cy.get('#author').type('John Doe')
      cy.get('#url').type('www.codecshool.com')
      cy.get('#submitBlog').click()
      cy.contains('Using Cypress for E2E testing by John Doe view')
    })

    describe('and a blog is created', function() {
      beforeEach(function() {
        cy.createBlog({
          title: 'Using Cypress for E2E testing',
          author: 'John Doe',
          url: 'www.codecshool.com',
          likes: 3,
          user: {
            username: 'mluukkai',
            name: 'Matti Luukkainen'
          },
        })
      })

      it('it can be endorsed', function() {
        cy.get('#getDetails').click()
        cy.get('#like').click()
        cy.contains('likes 4')
      })

      it('it can be deleted by the creator', function() {
        cy.get('#getDetails').click()
        cy.get('#remove').click()
        cy.get('.error')
          .should('contain', 'Removed Using Cypress for E2E testing by John Doe')
          .and('have.css', 'color', 'rgb(0, 128, 0)')
        cy.should('not.have.class', 'basicDiv')
      })

      it('other users cannot delete it', function() {
        cy.request('POST', 'http://localhost:5000/api/users/', {
          name: 'Andy Tester',
          username: 'testandy',
          password: 'sekret'
        })
        cy.login({ username: 'testandy', password: 'sekret' })

        cy.get('#getDetails').click()
        cy.get('.detailsDiv')
        cy.should('not.have.id', 'remove')
      })

      it('blogs are in descending order by likes', function() {
        cy.createBlog({
          title: 'Testing frontend with jest',
          author: 'Jack Nerd',
          url: 'www.codeacademy.com',
          likes: 5,
          user: {
            username: 'mluukkai',
            name: 'Matti Luukkainen'
          },
        })

        cy.get('#blogList').children().as('blogs')
        cy.get('@blogs').first().contains('Testing frontend with jest')
        cy.get('@blogs').last().contains('Using Cypress for E2E testing by John Doe')
      })
    })
  })
})