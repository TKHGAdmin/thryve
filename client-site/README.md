# KBE Fitness site

Single-file static site (`index.html`): HTML, CSS and JS in one file, using Roboto from Google Fonts.

## Brand
- Styled after the KBE Fitness logo: dark gym background, thin wide-spaced Roboto caps, orange K/E with a hot pink B.
- Colors: primary orange `#F2870F`, hot pink `#E85A98` (from the logo), soft pink `#F7AFBA`, peach `#F9C79A`. Edit the tokens at the top of the `<style>` block.
- The logo is rebuilt in HTML/CSS (`.logo` in the header/footer, `.hero-mark` in the hero). Swap in an image file if you have a transparent PNG/SVG of the logo.

## Before launch
- Photos: replace the dark gradient `.photo` boxes with `<img>` tags (see the HTML comments in the hero and coach sections).
- Coach bio: replace `[Coach Name]` and the credentials.
- Testimonials: replace the placeholder cards with real client quotes.
- Contact details in the footer.
- Apply form: connect the submit handler at the bottom of the file to a form service (Formspree, Netlify Forms, HubSpot, etc.).

## Preview
Open `index.html` in a browser. No build step.
