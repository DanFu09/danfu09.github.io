var $nav;
var $navbarToggle;
var $window;
var $body;
var navOffsetTop;

function init_shared(callback) {
  fetch('/layouts/navbar.html')
    .then(response => response.text())
    .then(navHTML => {
      $('#navbar-container').html(navHTML);

      fetch('/layouts/footer.html')
        .then(response => response.text())
        .then(footerHTML => $('#footer').html(footerHTML));

      $nav = $('.navbar');
      $navbarToggle = $('.navbar-toggle');
      $window = $(window);
      $body = $('body');
      navOffsetTop = $nav.offset().top;

      $window.on('scroll', onScroll);
      $window.on('resize', resize);
      $navbarToggle.on('click', onNavbarToggle);
      $('a[href^="#"]').on('click', smoothScroll);

      callback();
    });
}

function init_index() {
  init_shared(() => {
    loadNews();
    loadProjects('research-section', '/data/research.yml', false);
    loadProjects('software-section', '/data/software.yml');
    loadClasses('teaching-section', '/data/teaching.yml', false);
    loadPubs();
  });
}

function init_blog() {
  init_shared(() => {
    loadBlog();
  });
}

function smoothScroll(e) {
  e.preventDefault();
  $(document).off("scroll");
  var target = this.hash,
    $target = $(target);
  $('html, body').stop().animate({
    'scrollTop': $target.offset().top - 40
  }, 0, 'swing', function () {
    window.location.hash = target;
    $(document).on("scroll", onScroll);
  });
}

function resize() {
  $body.removeClass('has-docked-nav');
  navOffsetTop = $nav.offset().top;
  onScroll();
}

function onScroll() {
  if (navOffsetTop < $window.scrollTop() && !$body.hasClass('has-docked-nav')) {
    $body.addClass('has-docked-nav');
  }
  if (navOffsetTop > $window.scrollTop() && $body.hasClass('has-docked-nav')) {
    $body.removeClass('has-docked-nav');
  }
}

function onNavbarToggle() {
  if ($body.hasClass('always-display-navbar')) {
    $body.removeClass('always-display-navbar');
  } else {
    $body.addClass('always-display-navbar');
  }
}

function loadNews() {
  fetch('/data/news.yml')
    .then(response => response.text())
    .then(response_text => {
      var news = jsyaml.load(response_text);
      var newsTableHTML = '<table>';
      news.forEach((update, idx) => {
        newsTableHTML += `<tr>
          <td>${update['date']}</td>
          <td>${update['update']}</td>
        </tr>`;
        if (idx == 4) {
          newsTableHTML += `<tr>
              <td><a href="javascript:toggleVis('morenews')">show more</a></td>
            </tr>
          </table>
          <table id="morenews" style="display: none;">`;
        }
      });
      newsTableHTML += '</table>';
      $('#news-table').html(newsTableHTML);
    });
}

function loadLinks(linksList) {
  var linksHTML = '';
  linksList.forEach((link, idx) => {
    linksHTML += `<a href="${link['link']}"${
      'target' in link ? `target="${link['target']}"` : ''
    }>${link['text']}</a>`;
    if (idx < linksList.length - 1) {
      linksHTML += ' / ';
    }
  });
  return linksHTML;
}

function loadProjects(divID, yamlPath, proj = true) {
  fetch(yamlPath)
    .then(response => response.text())
    .then(response_text => {
      var projects = jsyaml.load(response_text);
      var projectsHTML = '';
      projects.forEach(project => {
        var linksHTML = `${'links' in project ?
          `<br>${loadLinks(project['links'])}` : ''}`;
        projectsHTML += `
        <div class="row">
          ${ proj ?
          `<div class="paper-title">
            <a href="${project['link']}">${project['title']}</a>
          </div>` : `<h6 class="docs-header">${project['title']}</h6>`
          }` +
          `${'conf' in project ?
            `<h6 class="conferences">${project['conf']}</h6>` :
            ''}
          <p>${project['desc']}${linksHTML}<\p>
        </div>` ;
      });
      $(`#${divID}`).html(projectsHTML);
    });
}

function loadClasses(divID, yamlPath, proj = true) {
  fetch(yamlPath)
    .then(response => response.text())
    .then(response_text => {
      var projects = jsyaml.load(response_text);
      var projectsHTML = '';
      projects.forEach(project => {
        var linksHTML = `${'links' in project ?
          `<br>${loadLinks(project['links'])}` : ''}`;
        projectsHTML += `
        <div class="row">
          <div class="teaching-class-name">${project['title']}</div>` +
          `${'conf' in project ?
            `<h6 class="conferences">${project['conf']}</h6>` :
            ''}
          <p>${project['desc']}${linksHTML}<\p>
        </div>` ;
      });
      $(`#${divID}`).html(projectsHTML);
    });
}

function loadPubs() {
  fetch('/data/pubs.yml')
    .then(response => response.text())
    .then(response_text => {
      var pubHTML = '';
      jsyaml.load(response_text).forEach(pubYear => {
        pubsInYear = '';
        pubYear.pubs.forEach(pub => {
          authorList = '';
          pub['authors'].forEach((author, idx) => {
            authorList += `${('me' in author) && author['me'] ?
            `<span class="my-name">${author['name']}</span>` :
            `${author['name']}`}${idx < pub['authors'].length - 1 ? ', ' : ''}`;
          });
          pubsInYear += `<div class="row publication">
            <div class="paper-title">
              <a href="${pub['link']}">${pub['title']}</a>
            </div>
            <div class="paper-authors">${authorList}</div>
            ${'conf' in pub ?
            `<div class="paper-conference">${pub['conf']}</div>` : ''}
            ${'links' in pub ?
            `<div class="paper-links">${loadLinks(pub['links'])}</div>` : ''}
          </div>`;
        });
        pubHTML += `<h5 class="top-margin bottom-margin">${pubYear.year}</h5>${pubsInYear}`;
      });
      $('#pub-list').html(pubHTML);
    })
}

function loadBlog() {
  fetch('/data/blogs.yml')
    .then(response => response.text())
    .then(response_text => {
      var blogsHTML = '';
      jsyaml.load(response_text).forEach(blog => {
        blogsHTML += `<div class="row blog">
          <h5 class="top-margin"><a href="${blog['link']}">${blog['title']}</a></h5>
          <div class="blog-authors">${blog['date']}<i class="bi bi-dot"></i>${blog['authors']}</div>
          <div class="row">
            ${blog['blurb']}
          </div>
          <a href="${blog['link']}">Read more...</a>
        </div>`;
      });
      $('#blog-section').html(blogsHTML);
    });
}
