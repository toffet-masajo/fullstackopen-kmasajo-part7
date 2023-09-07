describe('Blog app', () => {
  beforeEach(function() {
    const user1 = {
      name: 'T. E. Ster',
      username: 'tester',
      password: 'tester'
    };
    const user2 = {
      name: 'A. D. Min',
      username: 'admin',
      password: 'admin'
    };
    cy.request('POST', 'http://localhost:3000/api/testing/reset');
    cy.request('POST', 'http://localhost:3000/api/users', user1);
    cy.request('POST', 'http://localhost:3000/api/users', user2);
    cy.visit('http://localhost:3000');
  });

  it('login page is shown', function() {
    cy.contains('Log in to application');
  });

  describe('Login', function() {
    it('login successfully', function() {
      cy.get('#username').type('tester');
      cy.get('#password').type('tester');
      cy.get('#login-button').click();
      cy.contains('T. E. Ster logged in');
    });

    it('login unsuccessfully', function() {
      cy.get('#username').type('tester');
      cy.get('#password').type('test');
      cy.get('#login-button').click();
      cy.get('.error-message')
        .should('contain', 'wrong username or password')
        .and('have.css', 'color', 'rgb(255, 0, 0)');
    });
  });

  describe('Blog Creation', function() {
    const title = 'Bazinga! A Tale As Old As Time';
    const author = 'S. Cooper';
    const url = 'http://www.bazinga.com';

    beforeEach(function() {
      cy.login({ username: 'tester', password: 'tester' });
    });

    it('create new blog successfully', function() {
      cy.contains('new blog').click();
      cy.get('#blog-title').type(title);
      cy.get('#blog-author').type(author);
      cy.get('#blog-url').type(url);
      cy.get('#create-button').click();

      cy.get('.success-message')
        .should('contain', `a new blog ${title} by ${author} added`)
        .and('have.css', 'color', 'rgb(0, 128, 0)');
      cy.contains(`${title} ${author}`);
    });

    it('like a blog', function() {
      cy.createBlog({ title: title, author: author, url: url });

      cy.contains(`${title} ${author}`).contains('view').click();
      cy.contains('0').contains('like').click();

      cy.get('.blog')
        .should('contain', '1');
    });
  });

  describe('Blog Deletion', function() {
    const title = 'Bazinga! A Tale As Old As Time';
    const author = 'S. Cooper';
    const url = 'http://www.bazinga.com';

    beforeEach(function() {
      cy.login({ username: 'tester', password: 'tester' });
      cy.createBlog({ title: title, author: author, url: url });
    });

    it('delete own blog', function() {
      cy.contains(`${title} ${author}`)
        .contains('view')
        .click();
      cy.get('.blog')
        .should('contain', 'remove');
    });

    it('cannot delete other blog', function() {
      cy.get('#logout-button').click();
      cy.login({ username: 'admin', password: 'admin' });
      cy.contains(`${title} ${author}`)
        .contains('view')
        .click();
      cy.get('.blog')
        .should('not.contain', 'remove');
    });
  });

  describe('Blog Order', function() {
    beforeEach(function() {
      cy.login({ username: 'tester', password: 'tester' });

      cy.createBlog({
        title: 'Blog with 1 likes',
        author: 'Blogger1',
        url: 'http://www.blogger1.com'
      });
      cy.addLike({ title: 'Blog with 1 likes', author: 'Blogger1' });

      cy.createBlog({
        title: 'Blog with 2 likes',
        author: 'Blogger2',
        url: 'http://www.blogger2.com'
      });
      cy.addLike({ title: 'Blog with 2 likes', author: 'Blogger2' });
      cy.addLike({ title: 'Blog with 2 likes', author: 'Blogger2' });

      cy.createBlog({
        title: 'Blog with 3 likes',
        author: 'Blogger3',
        url: 'http://www.blogger3.com'
      });
      cy.addLike({ title: 'Blog with 3 likes', author: 'Blogger3' });
      cy.addLike({ title: 'Blog with 3 likes', author: 'Blogger3' });
      cy.addLike({ title: 'Blog with 3 likes', author: 'Blogger3' });
    });

    it('blog with highest likes on top, default', function() {
      cy.get('.blog').eq(0).should('contain', 'Blog with 3 likes');
      cy.get('.blog').eq(1).should('contain', 'Blog with 2 likes');
      cy.get('.blog').eq(2).should('contain', 'Blog with 1 likes');
    });

    it('blog with highest likes on top, new top', function() {
      cy.addLike({ title: 'Blog with 1 likes', author: 'Blogger1' });
      cy.addLike({ title: 'Blog with 1 likes', author: 'Blogger1' });
      cy.addLike({ title: 'Blog with 1 likes', author: 'Blogger1' });

      cy.get('.blog').eq(0).should('contain', 'Blog with 1 likes');
      cy.get('.blog').eq(1).should('contain', 'Blog with 3 likes');
      cy.get('.blog').eq(2).should('contain', 'Blog with 2 likes');
    });
  });
});