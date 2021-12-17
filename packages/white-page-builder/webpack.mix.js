const mix = require("laravel-mix");

mix.js("src/index.js", "dist")
  .js("src/example.js", "dist")
  .sass("src/sass/pageBuilder.sass", "dist/css")
  .sass("src/sass/theme/voyager.sass", "dist/css/theme")
  .sass("src/sass/main.sass", "dist/css")

  .webpackConfig({
    plugins: [
    ]
  })
  .options({
    autoprefixer: false
  })
  .sourceMaps()
  .browserSync({
    proxy: 'http://localhost:8000'
  });
// .options({
//   processCssUrls: false,
//   postCss: [
//     autoprefixer
//   ]
// })

if (mix.inProduction()) {
  mix.copy("*.html", "./demo/pageBuilder")
    .copyDirectory("dist", "./demo/pageBuilder/dist");
}
