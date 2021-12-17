const mix = require("laravel-mix");

mix.js("src/js/pageBuilder.js", "dist")
  .js("src/js/main.js", "dist/js")
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
