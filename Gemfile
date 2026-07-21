source "https://rubygems.org"

# Pins Jekyll + all plugins to the exact versions GitHub Pages uses in
# production, so what builds locally is what deploys. No custom
# plugins are used in this project (notebook conversion happens via
# scripts/convert-notebooks.sh, run locally, outside of Jekyll), so
# the site can be deployed either via GitHub Pages' automatic build or
# the included GitHub Actions workflow.
gem "github-pages", group: :jekyll_plugins

group :jekyll_plugins do
  gem "jekyll-feed"
  gem "jekyll-sitemap"
  gem "jekyll-seo-tag"
end

# Windows/JRuby compatibility shims some environments still need
platforms :mingw, :x64_mingw, :mswin, :jruby do
  gem "tzinfo", ">= 1", "< 3"
  gem "tzinfo-data"
end

gem "wdm", "~> 0.1.1", :platforms => [:mingw, :x64_mingw]

gem "http_parser.rb", "~> 0.6.0", :platforms => [:jruby]
