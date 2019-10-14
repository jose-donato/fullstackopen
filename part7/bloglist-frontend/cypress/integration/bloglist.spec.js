describe('Blog ', function () {
    beforeEach(function () {
        cy.request('POST', 'http://localhost:3003/api/testing/reset')
        const user = {
            name: 'test123',
            username: 'test123',
            password: 'test123'
        }
        cy.request('POST', 'http://localhost:3003/api/users', user)
        cy.visit('http://localhost:3000')
    })

    it('front page can be opened', function () {
        cy.contains('blogs')
    })

    it('login form can be opened', function () {
        cy.contains('login')
            .click()
    })
    

    describe('after logging in...', function () {
        beforeEach(function () {
            cy.get('#login-username')
                .type('test123')
            cy.get('#login-password')
                .type('test123')
            cy.contains('login')
                .click()
        })

        it('name is shown', function () {
            cy.contains('test123 logged in')
        })

        
        it('user can logout', function () {
            cy.contains('logout')
                .click()
            cy.contains('log in to application')
        })

        
        describe('user can add a new blog', function () {
            beforeEach(function () {
                cy.contains('new blog')
                    .click()
                cy.wait(500)
                cy.get('#add-blog-title')
                    .type('t')
                cy.wait(500)
                cy.get('#add-blog-author')
                    .type('t')
                cy.wait(500)
                cy.get('#add-blog-url')
                    .type('t')
                cy.wait(500)
                cy.contains('create blog')
                    .click()
                cy.wait(500)
            })

            it('the blog user created is in the bloglist', function () {
                cy.contains('t')
            })
        })
    })
})