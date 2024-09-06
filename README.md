# Luxe

[Getting started](#getting-started) |
[Developer tools](#developer-tools) |
[Theme Marketplace submission](#theme-marketplace-submission) |


Luxe represents a HTML-first, JavaScript-only-as-needed approach to theme development. It's Fynd Platform's first source available theme with performance, flexibility, and [Fynd Platform features](https://platform.fynd.com/help/docs/introduction/what-is-fp) built-in and acts as a reference for building Fynd Platform themes.

* **Web-native in its purest form:** Themes run on the [evergreen web](https://www.w3.org/2001/tag/doc/evergreen-web/). We leverage the latest web browsers to their fullest, while maintaining support for the older ones through progressive enhancement—not polyfills.
* **Lean, fast, and reliable:** Functionality and design defaults to “no” until it meets this requirement. Code ships on quality. Themes must be built with purpose. They shouldn’t support each and every feature in Fynd Platform.
* **Server-rendered:** HTML must be rendered by Fynd Platform servers using React. Business logic and platform primitives such as translations and money formatting don’t belong on the client. Async and on-demand rendering of parts of the page is OK, but we do it sparingly as a progressive enhancement.
* **SPA (Single Page Application):** The architecture should follow SPA principles, ensuring smooth transitions between views without full page reloads. This enhances user experience by making the application feel faster and more responsive.
* **Functional, not pixel-perfect:** The Web doesn’t require each page to be rendered pixel-perfect by each browser engine. Using semantic markup, progressive enhancement, and clever design, we ensure that themes remain functional regardless of the browser.

## Getting started
We recommend using Fynd Platform as a starting point for theme development. [Learn more on partners.fynd.com](https://partners.fynd.com/help/docs/partners/themes/vuejs/getting-started).

> If you're building a theme for the Fynd Theme Marketplace, then you can use Luxe as a starting point. However, the theme that you submit needs to be [substantively different from Luxe]https://partners.fynd.com/help/docs/partners/themes/vuejs/theme-mp) so that it provides added value for merchants.

## Developer tools

### FDK CLI

[FDK CLI](https://github.com/gofynd/fdk-cli) helps you build Fynd Platform themes and is used to enhance your local development workflow. It comes bundled with a suite of commands for developing Fynd Platform themes - everything from working with themes on [Fynd Themes](https://themes.fynd.com) (e.g. creating new theme, initializing exisiting theme, publishing new theme, switching between themes) or launching a development server for local theme development.

You can follow this [quick start guide for theme developers](https://partners.fynd.com/help/docs/partners/themes/vuejs/fdk-cli) to get started.


## Theme Marketplace submission

The [Fynd Theme Marketplace](https://themes.fynd.com) is the place where Fynd Platform merchants find the themes that they'll use to showcase and support their business. As a theme partner, you can create themes for the Fynd Platform Theme Store and reach an international audience of an ever-growing number of entrepreneurs.
>>>>>>> development
