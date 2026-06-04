// get the ninja-keys element
const ninja = document.querySelector('ninja-keys');

// add the home and posts menu items
ninja.data = [{
    id: "nav-about",
    title: "about",
    section: "Navigation",
    handler: () => {
      window.location.href = "/";
    },
  },{id: "nav-blog",
          title: "blog",
          description: "",
          section: "Navigation",
          handler: () => {
            window.location.href = "/blog/";
          },
        },{id: "nav-cv",
          title: "cv",
          description: "This is a brief summary of my Curriculum Vitae. For a PDF version, click on the PDF icon on the right.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/cv/";
          },
        },{id: "post-ricordo",
      
        title: "Ricordo",
      
      description: "Un pensiero per Carola Frediani e Marjane Satrapi",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2026/scomparse/";
        
      },
    },{id: "post-teaching-quot-an-introduction-to-c-quot",
      
        title: "Teaching &quot;An introduction to C++&quot;",
      
      description: "Another introductory course on C++ taught @ CINECA",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2026/introduction-to-cpp/";
        
      },
    },{id: "post-teaching-quot-an-introduction-to-python-quot",
      
        title: "Teaching &quot;An introduction to Python&quot;",
      
      description: "Some material from a Python introductory course I taught @ CINECA",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2026/introduction-to-python/";
        
      },
    },{
        id: 'social-github',
        title: 'GitHub',
        section: 'Socials',
        handler: () => {
          window.open("https://github.com/loscati", "_blank");
        },
      },{
        id: 'social-linkedin',
        title: 'LinkedIn',
        section: 'Socials',
        handler: () => {
          window.open("https://www.linkedin.com/in/leonardo-salicari", "_blank");
        },
      },{
        id: 'social-rss',
        title: 'RSS Feed',
        section: 'Socials',
        handler: () => {
          window.open("/feed.xml", "_blank");
        },
      },{
      id: 'light-theme',
      title: 'Change theme to light',
      description: 'Change the theme of the site to Light',
      section: 'Theme',
      handler: () => {
        setThemeSetting("light");
      },
    },
    {
      id: 'dark-theme',
      title: 'Change theme to dark',
      description: 'Change the theme of the site to Dark',
      section: 'Theme',
      handler: () => {
        setThemeSetting("dark");
      },
    },
    {
      id: 'system-theme',
      title: 'Use system default theme',
      description: 'Change the theme of the site to System Default',
      section: 'Theme',
      handler: () => {
        setThemeSetting("system");
      },
    },];
