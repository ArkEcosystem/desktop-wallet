/*

Tailwind - The Utility-First CSS Framework

A project by Adam Wathan (@adamwathan), Jonathan Reinink (@reinink),
David Hemphill (@davidhemphill) and Steve Schoger (@steveschoger).

Welcome to the Tailwind config file. This is where you can customize
Tailwind specifically for your project. Don't be intimidated by the
length of this file. It's really just a big JavaScript object and
we've done our very best to explain each section.

View the full documentation at https://tailwindcss.com.

|-------------------------------------------------------------------------------
| The default config
|-------------------------------------------------------------------------------
|
| This variable contains the default Tailwind config. You don't have
| to use it, but it can sometimes be helpful to have available. For
| example, you may choose to merge your custom configuration
| values with some of the Tailwind defaults.
|
*/

// let defaultConfig = require('tailwindcss/defaultConfig')

/*
|-------------------------------------------------------------------------------
| Colors                                    https://tailwindcss.com/docs/colors
|-------------------------------------------------------------------------------
|
| Here you can specify the colors used in your project. To get you started,
| we've provided a generous palette of great looking colors that are perfect
| for prototyping, but don't hesitate to change them for your project. You
| own these colors, nothing will break if you change everything about them.
|
| We've used literal color names ("red", "blue", etc.) for the default
| palette, but if you'd rather use functional names like "primary" and
| "secondary", or even a numeric scale like "100" and "200", go for it.
|
*/

module.exports = {

  /*
  |-----------------------------------------------------------------------------
  | Advanced Options         https://tailwindcss.com/docs/configuration#options
  |-----------------------------------------------------------------------------
  |
  | Here is where you can tweak advanced configuration options. We recommend
  | leaving these options alone unless you absolutely need to change them.
  |
  */

  prefix: '',
  important: false,
  separator: ':',

  /*
  |-----------------------------------------------------------------------------
  | Theme                      https://tailwindcss.com/docs/configuration/#theme
  |-----------------------------------------------------------------------------
  |
  | The theme section is where you define your
  | Color palette, font stacks, type scale, border sizes, breakpoints
  | anything related to the visual design of your site.
  |
  */

  theme: {
    /*
    |-----------------------------------------------------------------------------
    | Colors                      https://tailwindcss.com/docs/customizing-colors/
    |-----------------------------------------------------------------------------
    |
    | The color palette defined above is also assigned to the "colors" key of
    | your Tailwind config. This makes it easy to access them in your CSS
    | using Tailwind's config helper. For example:
    |
    | .error { color: config('colors.red') }
    |
    */

    colors: {
      // Custom color variables
      'theme-page': 'var(--theme-page)',
      'theme-page-text': 'var(--theme-page-text)',
      'theme-page-text-light': 'var(--theme-page-text-light)',
      'theme-page-instructions-text': 'var(--theme-page-instructions-text)',
      'theme-page-instructions-background': 'var(--theme-page-instructions-background)',
      'theme-modal': 'var(--theme-modal)',

      'theme-announcements-gradient-1': 'var(--theme-announcements-gradient-1)',
      'theme-announcements-gradient-2': 'var(--theme-announcements-gradient-2)',

      'theme-line-separator': 'var(--theme-line-separator)',
      'theme-wallet-overview-border': 'var(--theme-wallet-overview-border)',

      'theme-table-row-hover': 'var(--theme-table-row-hover)',
      'theme-transaction-sent': 'var(--theme-transaction-sent)',
      'theme-transaction-sent-arrow': 'var(--theme-transaction-sent-arrow)',
      'theme-transaction-received': 'var(--theme-transaction-received)',
      'theme-transaction-received-arrow': 'var(--theme-transaction-received-arrow)',
      'theme-send-circle-second-signature': 'var(--theme-send-circle-second-signature)',
      'theme-send-circle-second-signature-text': 'var(--theme-send-circle-second-signature-text)',
      'theme-send-circle-register-delegate': 'var(--theme-send-circle-register-delegate)',
      'theme-send-circle-register-delegate-text': 'var(--theme-send-circle-register-delegate-text)',
      'theme-send-circle-vote': 'var(--theme-send-circle-vote)',
      'theme-send-circle-vote-text': 'var(--theme-send-circle-vote-text)',
      'theme-transaction-detail-gradient1': 'var(--theme-transaction-detail-gradient1)',
      'theme-transaction-detail-gradient2': 'var(--theme-transaction-detail-gradient2)',
      'theme-transaction-detail-arrow': 'var(--theme-transaction-detail-arrow)',
      'theme-transaction-confirmations-received': 'var(--theme-transaction-confirmations-received)',
      'theme-transaction-confirmations-sent': 'var(--theme-transaction-confirmations-sent)',

      'theme-wallet-new-selected': 'var(--theme-wallet-new-selected)',
      'theme-wallet-new-unselected': 'var(--theme-wallet-new-unselected)',
      'theme-wallet-sign-verify-message-text': 'var(--theme-wallet-sign-verify-message-text)',

      'theme-feature': 'var(--theme-feature)',
      'theme-feature-item-text': 'var(--theme-feature-item-text)',
      'theme-feature-item-hover': 'var(--theme-feature-item-hover)',
      'theme-feature-item-alternative': 'var(--theme-feature-item-alternative)',
      'theme-feature-item-alternative-text': 'var(--theme-feature-item-alternative-text)',
      'theme-feature-item-hover-text': 'var(--theme-feature-item-hover-text)',
      'theme-feature-item-selected': 'var(--theme-feature-item-selected)',
      'theme-feature-item-selected-text': 'var(--theme-feature-item-selected-text)',
      'theme-feature-item-indicator': 'var(--theme-feature-item-indicator)',

      'theme-caption-text': 'var(--theme-caption-text)',
      'theme-heading-background': 'var(--theme-heading-background)',
      'theme-heading-text': 'var(--theme-heading-text)',

      'theme-button-special-choice': 'var(--theme-button-special-choice)',

      'theme-chart-background': 'var(--theme-chart-background)',
      'theme-chart-price': 'var(--theme-chart-price)',

      'theme-button': 'var(--theme-button)',
      'theme-button-text': 'var(--theme-button-text)',
      'theme-button-light': 'var(--theme-button-light)',
      'theme-button-light-text': 'var(--theme-button-light-text)',
      'theme-button-inner-box': 'var(--theme-button-inner-box)',
      'theme-action-button': 'var(--theme-action-button)',
      'theme-action-button-text': 'var(--theme-action-button-text)',
      'theme-action-button-text-hover': 'var(--theme-action-button-text-hover)',
      'theme-option-button': 'var(--theme-option-button)',
      'theme-option-button-hover': 'var(--theme-option-button-hover)',
      'theme-option-button-text': 'var(--theme-option-button-text)',
      'theme-switch-button': 'var(--theme-switch-button)',
      'theme-option-heading-button': 'var(--theme-option-heading-button)',
      'theme-option-heading-button-hover': 'var(--theme-option-heading-button-hover)',
      'theme-option-heading-button-text': 'var(--theme-option-heading-button-text)',
      'theme-input-field-border': 'var(--theme-input-field-border)',
      'theme-input-toggle-choice': 'var(--theme-input-toggle-choice)',
      'theme-input-toggle-choice-text': 'var(--theme-input-toggle-choice-text)',
      'theme-modal-footer-button': 'var(--theme-modal-footer-button)',
      'theme-modal-footer-button-text': 'var(--theme-modal-footer-button-text)',

      'theme-explanation-background': 'var(--theme-explanation-background)',
      'theme-explanation-text': 'var(--theme-explanation-text)',

      'theme-voting-banner-background': 'var(--theme-voting-banner-background)',
      'theme-voting-banner-text': 'var(--theme-voting-banner-text)',
      'theme-voting-banner-button': 'var(--theme-voting-banner-button)',
      'theme-voting-banner-button-hover': 'var(--theme-voting-banner-button-hover)',
      'theme-voting-banner-button-text': 'var(--theme-voting-banner-text)',
      'theme-voting-banner-button-text-hover': 'var(--theme-voting-banner-text-hover)',

      'theme-settings': 'var(--theme-settings)',
      'theme-settings-sub': 'var(--theme-settings-sub)',
      'theme-settings-button': 'var(--theme-settings-button)',
      'theme-settings-heading': 'var(--theme-settings-heading)',
      'theme-settings-border': 'var(--theme-settings-border)',
      'theme-settings-text': 'var(--theme-settings-text)',
      'theme-settings-control-title': 'var(--theme-settings-control-title)',

      'theme-error': 'var(--theme-error)',
      'theme-error-shadow': 'var(--theme-error-shadow)',
      'theme-success': 'var(--theme-success)',
      'theme-success-shadow': 'var(--theme-success-shadow)',
      'theme-info': 'var(--theme-info)',
      'theme-info-shadow': 'var(--theme-info-shadow)',
      'theme-warn': 'var(--theme-warn)',
      'theme-warn-shadow': 'var(--theme-warn-shadow)',
      'theme-warn-text': 'var(--theme-warn-text)',

      'theme-footer-text': '#a4acb8',

      'transparent': 'transparent',
      'inherit': 'inherit',

      'black': '#22292f',
      'grey-darkest': '#3d4852',
      'grey-darker': '#606f7b',
      'grey-dark': '#8795a1',
      'grey': '#b8c2cc',
      'grey-light': '#dae1e7',
      'grey-lighter': '#f1f5f8',
      'grey-lightest': '#f8fafc',
      'white': '#ffffff',

      'red-darkest': '#3b0d0c',
      'red-darker': '#621b18',
      'red-dark': '#cc1f1a',
      'red': '#e51317', // ARK logo
      'red-light': '#F03643', // Sidemenu hover and selected border
      'red-lighter': '#f9acaa',
      'red-lightest': '#fef4f5', // Sidemenu hover background

      'orange-darkest': '#462a16',
      'orange-darker': '#613b1f',
      'orange-dark': '#de751f',
      'orange': '#f6993f',
      'orange-light': '#faad63',
      'orange-lighter': '#fcd9b6',
      'orange-lightest': '#fff5eb',

      'yellow-darkest': '#453411',
      'yellow-darker': '#684f1d',
      'yellow-dark': '#f2d024',
      'yellow': '#ffed4a',
      'yellow-light': '#fff382',
      'yellow-lighter': '#ffeaa5', // UPDATED
      'yellow-lightest': '#fcfbeb',

      'green-darkest': '#0f2f21',
      'green-darker': '#1a4731',
      'green-dark': '#1f9d55',
      'green': '#2db761', // UPDATED
      'green-light': '#51d88a',
      'green-lighter': '#a2f5bf',
      'green-lightest': '#e3fcec',

      'teal-darkest': '#0d3331',
      'teal-darker': '#20504f',
      'teal-dark': '#38a89d',
      'teal': '#4dc0b5',
      'teal-light': '#64d5ca',
      'teal-lighter': '#a0f0ed',
      'teal-lightest': '#e8fffe',

      'blue-darkest': '#202126', // UPDATED
      'blue-darker': '#282a38', // UPDATED
      'blue-dark': '#2779bd',
      'blue': '#037CFF', // UPDATED
      'blue-light': '#6f77a4', // UPDATED
      'blue-lighter': '#C0CDDF', // Sidemenu icons
      'blue-lightest': '#edf4f5', // Background

      'indigo-darkest': '#191e38',
      'indigo-darker': '#2f365f',
      'indigo-dark': '#5661b3',
      'indigo': '#6574cd',
      'indigo-light': '#7886d7',
      'indigo-lighter': '#b2b7ff',
      'indigo-lightest': '#e6e8ff',

      'purple-darkest': '#21183c',
      'purple-darker': '#382b5f',
      'purple-dark': '#794acf',
      'purple': '#9561e2',
      'purple-light': '#a779e9',
      'purple-lighter': '#d6bbfc',
      'purple-lightest': '#f3ebff',

      'pink-darkest': '#451225',
      'pink-darker': '#6f213f',
      'pink-dark': '#eb5286',
      'pink': '#f66d9b',
      'pink-light': '#e28188', // Sidemenu active icon
      'pink-lighter': '#e5b0b4', // Sidemenu hover icon
      'pink-lightest': '#ffebef'
    },

    /*
      |-----------------------------------------------------------------------------
      | Screens                       https://tailwindcss.com/docs/responsive-design
      |-----------------------------------------------------------------------------
      |
      | Screens in Tailwind are translated to CSS media queries. They define the
      | responsive breakpoints for your project. By default Tailwind takes a
      | "mobile first" approach, where each screen size represents a minimum
      | viewport width. Feel free to have as few or as many screens as you
      | want, naming them in whatever way you'd prefer for your project.
      |
      | Tailwind also allows for more complex screen definitions, which can be
      | useful in certain situations. Be sure to see the full responsive
      | documentation for a complete list of options.
      |
      | Class name: .{screen}:{utility}
      |
    */

    screens: {
      'sm': '576px',
      'md': '768px',
      'max-md': { max: '991px' },
      'lg': '992px',
      'minmax-lg': { min: '992px', max: '1199px' },
      'xl': '1200px',
      'xxl': '1375px'
    },

    /*
    |-----------------------------------------------------------------------------
    | Font Family                        https://tailwindcss.com/docs/font-family/
    |-----------------------------------------------------------------------------
    |
    | Here is where you define your project's font stack, or font families.
    | Keep in mind that Tailwind doesn't actually load any fonts for you.
    | If you're using custom fonts you'll need to import them prior to
    | defining them here.
    |
    | By default we provide a native font stack that works remarkably well on
    | any device or OS you're using, since it just uses the default fonts
    | provided by the platform.
    |
    | Class name: .font-{name}
    |
    */

    fontFamily: {
      'sans': [
        'Proxima Nova',
        'system-ui',
        'BlinkMacSystemFont',
        '-apple-system',
        'Segoe UI',
        'Roboto',
        'Oxygen',
        'Ubuntu',
        'Cantarell',
        'Fira Sans',
        'Droid Sans',
        'Helvetica Neue',
        'sans-serif'
      ],
      'serif': [
        'Constantia',
        'Lucida Bright',
        'Lucidabright',
        'Lucida Serif',
        'Lucida',
        'DejaVu Serif',
        'Bitstream Vera Serif',
        'Liberation Serif',
        'Georgia',
        'serif'
      ],
      'mono': [
        'Menlo',
        'Monaco',
        'Consolas',
        'Liberation Mono',
        'Courier New',
        'monospace'
      ]
    },

    /*
    |-----------------------------------------------------------------------------
    | Font Size                            https://tailwindcss.com/docs/font-size/
    |-----------------------------------------------------------------------------
    |
    | Here is where you define your font sizes. Name these in whatever way
    | makes the most sense to you. We use size names by default, but
    | you're welcome to use a numeric scale or even something else
    | entirely.
    |
    | By default Tailwind uses the "rem" unit type for most measurements.
    | This allows you to set a root font size which all other sizes are
    | then based on. That said, you are free to use whatever units you
    | prefer, be it rems, ems, pixels or other.
    |
    | Class name: .text-{size}
    |
    */

    fontSize: {
      'xs': '.75rem', // 12px
      'sm': '.875rem', // 14px
      'base': '1rem', // 16px
      'lg': '1.125rem', // 18px
      'xl': '1.25rem', // 20px
      '2xl': '1.5rem', // 24px
      '3xl': '1.875rem', // 30px
      '4xl': '2.25rem', // 36px
      '5xl': '3rem' // 48px
    },

    /*
    |-----------------------------------------------------------------------------
    | Font weight                        https://tailwindcss.com/docs/font-weight/
    |-----------------------------------------------------------------------------
    |
    | Here is where you define your font weight. We've provided a list of
    | common font weight names with their respective numeric scale values
    | to get you started. It's unlikely that your project will require
    | all of these, so we recommend removing those you don't need.
    |
    | Class name: .font-{weight}
    |
    */

    fontWeight: {
      'hairline': 100,
      'thin': 200,
      'light': 300,
      'normal': 400,
      'medium': 500,
      'semibold': 600,
      'bold': 700,
      'extrabold': 800,
      'black': 900
    },

    /*
    |-----------------------------------------------------------------------------
    | Line Height                         https://tailwindcss.com/docs/line-height
    |-----------------------------------------------------------------------------
    |
    | Here is where you define your line height values, or as we call
    | them in Tailwind, Line Height.
    |
    | Class name: .leading-{size}
    |
    */

    lineHeight: {
      'none': 1,
      'tight': 1.25,
      'normal': 1.5,
      'loose': 2
    },

    /*
    |-----------------------------------------------------------------------------
    | Letter Spacing                   https://tailwindcss.com/docs/letter-spacing
    |-----------------------------------------------------------------------------
    |
    | Here is where you define your letter spacing values
    |
    | Class name: .tracking-{size}
    |
    */

    letterSpacing: {
      'tight': '-0.05em',
      'normal': '0',
      'semiwide': '0.025em',
      'wide': '0.05em',
      'extrawide': '0.075em'
    },

    /*
    |-----------------------------------------------------------------------------
    | Text color                           https://tailwindcss.com/docs/text-color
    |-----------------------------------------------------------------------------
    |
    | Here is where you define your text colors. By default these use the
    | color palette we defined above, however you're welcome to set these
    | independently if that makes sense for your project.
    |
    | Class name: .text-{color}
    |
    */

    textColor: theme => theme('colors'),

    /*
    |-----------------------------------------------------------------------------
    | Background color               https://tailwindcss.com/docs/background-color
    |-----------------------------------------------------------------------------
    |
    | Here is where you define your background colors. By default these use
    | the color palette we defined above, however you're welcome to set
    | these independently if that makes sense for your project.
    |
    | Class name: .bg-{color}
    |
    */

    backgroundColor: theme => theme('colors'),

    /*
    |-----------------------------------------------------------------------------
    | Background sizes               https://tailwindcss.com/docs/background-size
    |-----------------------------------------------------------------------------
    |
    | Here is where you define your background sizes. We provide some common
    | values that are useful in most projects, but feel free to add other sizes
    | that are specific to your project here as well.
    |
    | Class name: .bg-{size}
    |
    */

    backgroundSize: {
      'auto': 'auto',
      'cover': 'cover',
      'contain': 'contain'
    },

    /*
    |-----------------------------------------------------------------------------
    | Border width                       https://tailwindcss.com/docs/border-width
    |-----------------------------------------------------------------------------
    |
    | Here is where you define your border width. Take note that border
    | widths require a special "default" value set as well. This is the
    | width that will be used when you do not specify a border width.
    |
    | Class name: .border{-side?}{-width?}
    |
    */

    borderWidth: {
      default: '1px',
      '0': '0',
      '2': '2px',
      '4': '4px',
      '8': '8px'
    },

    /*
    |-----------------------------------------------------------------------------
    | Border color                       https://tailwindcss.com/docs/border-color
    |-----------------------------------------------------------------------------
    |
    | Here is where you define your border color. By default these use the
    | color palette we defined above, however you're welcome to set these
    | independently if that makes sense for your project.
    |
    | Take note that border colors require a special "default" value set
    | as well. This is the color that will be used when you do not
    | specify a border color.
    |
    | Class name: .border-{color}
    |
    */

    borderColor: theme => ({
      default: theme('colors.grey-light'),
      ...theme('colors')
    }),

    /*
    |-----------------------------------------------------------------------------
    | Border radius                    https://tailwindcss.com/docs/border-radius
    |-----------------------------------------------------------------------------
    |
    | Here is where you define your border radius values. If a `default` radius
    | is provided, it will be made available as the non-suffixed `.rounded`
    | utility.
    |
    | If your scale includes a `0` value to reset already rounded corners, it's
    | a good idea to put it first so other values are able to override it.
    |
    | Class name: .rounded{-side?}{-size?}
    |
    */

    borderRadius: {
      'none': '0',
      'sm': '.125rem',
      default: '.25rem',
      'lg': '.5rem',
      'xl': '1rem',
      'full': '9999px',
      '1/2': '100%' // Added
    },

    /*
    |-----------------------------------------------------------------------------
    | Width                                    https://tailwindcss.com/docs/width
    |-----------------------------------------------------------------------------
    |
    | Here is where you define your width utility sizes. These can be
    | percentage based, pixels, rems, or any other units. By default
    | we provide a sensible rem based numeric scale, a percentage
    | based fraction scale, plus some other common use-cases. You
    | can, of course, modify these values as needed.
    |
    |
    | It's also worth mentioning that Tailwind automatically escapes
    | invalid CSS class name characters, which allows you to have
    | awesome classes like .w-2/3.
    |
    | Class name: .w-{size}
    |
    */

    width: {
      'auto': 'auto',
      'px': '1px',
      '1': '0.25rem',
      '2': '0.5rem',
      '3': '0.75rem',
      '4': '1rem',
      '5': '1.25rem',
      '6': '1.5rem',
      '8': '2rem',
      '10': '2.5rem',
      '12': '3rem',
      '16': '4rem',
      '18': '4.5rem', // Added
      '20': '5.0rem', // Added
      '22': '5.5rem', // Added
      '24': '6rem',
      '30': '7rem', // Added
      '32': '8rem',
      '36': '9rem', // Added
      '48': '12rem',
      '64': '16rem',
      '80': '20rem', // Added
      '88': '22rem', // Added
      '1/2': '50%',
      '1/3': '33.33333%',
      '2/3': '66.66667%',
      '1/4': '25%',
      '3/4': '75%',
      '1/5': '20%',
      '2/5': '40%',
      '3/5': '60%',
      '4/5': '80%',
      '1/6': '16.66667%',
      '1/7': '12.50%', // Added
      '5/6': '83.33333%',
      'full': '100%',
      'screen': '100vw'
    },

    /*
    |-----------------------------------------------------------------------------
    | Height                                  https://tailwindcss.com/docs/height
    |-----------------------------------------------------------------------------
    |
    | Here is where you define your height utility sizes. These can be
    | percentage based, pixels, rems, or any other units. By default
    | we provide a sensible rem based numeric scale plus some other
    | common use-cases. You can, of course, modify these values as
    | needed.
    |
    | Class name: .h-{size}
    |
    */

    height: {
      'auto': 'auto',
      'px': '1px',
      '1': '0.25rem',
      '2': '0.5rem',
      '3': '0.75rem',
      '4': '1rem',
      '5': '1.25rem',
      '6': '1.5rem',
      '8': '2rem',
      '10': '2.5rem',
      '12': '3rem',
      '16': '4rem',
      '18': '4.5rem', // Added
      '20': '5.0rem', // Added
      '24': '6rem',
      '30': '7rem', // Added
      '32': '8rem',
      '40': '10rem', // Added
      '48': '12rem',
      '64': '16rem',
      '100': '25rem', // Added
      '120': '30rem', // Added
      'full': '100%',
      'screen': '100vh'
    },

    /*
    |-----------------------------------------------------------------------------
    | Minimum width                        https://tailwindcss.com/docs/min-width
    |-----------------------------------------------------------------------------
    |
    | Here is where you define your minimum width utility sizes. These can
    | be percentage based, pixels, rems, or any other units. We provide a
    | couple common use-cases by default. You can, of course, modify
    | these values as needed.
    |
    | Class name: .min-w-{size}
    |
    */

    minWidth: {
      '0': '0',
      '1/4': '25%', // Added
      'full': '100%'
    },

    /*
    |-----------------------------------------------------------------------------
    | Minimum height                      https://tailwindcss.com/docs/min-height
    |-----------------------------------------------------------------------------
    |
    | Here is where you define your minimum height utility sizes. These can
    | be percentage based, pixels, rems, or any other units. We provide a
    | few common use-cases by default. You can, of course, modify these
    | values as needed.
    |
    | Class name: .min-h-{size}
    |
    */

    minHeight: {
      '0': '0',
      'full': '100%',
      'screen': '100vh'
    },

    /*
    |-----------------------------------------------------------------------------
    | Maximum width                        https://tailwindcss.com/docs/max-width
    |-----------------------------------------------------------------------------
    |
    | Here is where you define your maximum width utility sizes. These can
    | be percentage based, pixels, rems, or any other units. By default
    | we provide a sensible rem based scale and a "full width" size,
    | which is basically a reset utility. You can, of course,
    | modify these values as needed.
    |
    | Class name: .max-w-{size}
    |
    */

    maxWidth: {
      'xxs': '10rem',
      'xs': '20rem',
      'sm': '30rem',
      'md': '40rem',
      'lg': '50rem',
      'xl': '60rem',
      '2xl': '70rem',
      '3xl': '80rem',
      '4xl': '90rem',
      '5xl': '100rem',
      '1/2': '50%', // Added
      'full': '100%'
    },

    /*
    |-----------------------------------------------------------------------------
    | Maximum height                      https://tailwindcss.com/docs/max-height
    |-----------------------------------------------------------------------------
    |
    | Here is where you define your maximum height utility sizes. These can
    | be percentage based, pixels, rems, or any other units. We provide a
    | couple common use-cases by default. You can, of course, modify
    | these values as needed.
    |
    | Class name: .max-h-{size}
    |
    */

    maxHeight: {
      'full': '100%',
      'screen': '100vh',
      '2xs': '12rem',
      'xs': '20rem'
    },

    /*
    |-----------------------------------------------------------------------------
    | Padding                                https://tailwindcss.com/docs/padding
    |-----------------------------------------------------------------------------
    |
    | Here is where you define your padding utility sizes. These can be
    | percentage based, pixels, rems, or any other units. By default we
    | provide a sensible rem based numeric scale plus a couple other
    | common use-cases like "1px". You can, of course, modify these
    | values as needed.
    |
    | Class name: .p{side?}-{size}
    |
    */

    padding: {
      'px': '1px',
      '0': '0',
      '1': '0.25rem',
      '2': '0.5rem',
      '3': '0.75rem',
      '4': '1rem',
      '5': '1.25rem',
      '6': '1.5rem',
      '8': '2rem',
      '10': '2.5rem',
      '12': '3rem',
      '16': '4rem',
      '20': '5rem',
      '24': '6rem',
      '32': '8rem'
    },

    /*
    |-----------------------------------------------------------------------------
    | Margin                                  https://tailwindcss.com/docs/margin
    |-----------------------------------------------------------------------------
    |
    | Here is where you define your margin utility sizes. These can be
    | percentage based, pixels, rems, or any other units. By default we
    | provide a sensible rem based numeric scale plus a couple other
    | common use-cases like "1px". You can, of course, modify these
    | values as needed.
    |
    | Class name: .m{side?}-{size}
    |
    */

    margin: {
      'auto': 'auto',
      'px': '1px',
      '0': '0',
      '1': '0.25rem',
      '2': '0.5rem',
      '3': '0.75rem',
      '4': '1rem',
      '5': '1.25rem',
      '6': '1.5rem',
      '8': '2rem',
      '10': '2.5rem',
      '12': '3rem',
      '16': '4rem',
      '20': '5rem',
      '24': '6rem',
      '32': '8rem',
      '-px': '1px',
      '-0': '0',
      '-1': '0.25rem',
      '-2': '0.5rem',
      '-3': '0.75rem',
      '-4': '1rem',
      '-5': '1.25rem',
      '-6': '1.5rem',
      '-8': '2rem',
      '-10': '2.5rem',
      '-12': '3rem',
      '-16': '4rem',
      '-20': '5rem',
      '-24': '6rem',
      '-32': '8rem'
    },

    /*
    |-----------------------------------------------------------------------------
    | Box Shadow                          https://tailwindcss.com/docs/box-shadow/
    |-----------------------------------------------------------------------------
    |
    | Here is where you define your box shadow utilities. As you can see from
    | the defaults we provide, it's possible to apply multiple box shadows
    | per utility using comma separation.
    |
    | If a `default` box shadow is provided, it will be made available as the non-
    | suffixed `.shadow` utility.
    |
    | Class name: .shadow-{size?}
    |
    */

    boxShadow: {
      default: '0 2px 4px 0 rgba(0,0,0,0.10)',
      'md': '0 4px 8px 0 rgba(0,0,0,0.12), 0 2px 4px 0 rgba(0,0,0,0.08)',
      'lg': '0 15px 30px 0 rgba(0,0,0,0.11), 0 5px 15px 0 rgba(0,0,0,0.08)',
      'inner': 'inset 0 2px 4px 0 rgba(0,0,0,0.06)',
      'outline': '0 0 0 3px rgba(52,144,220,0.5)',
      'none': 'none'
    },

    /*
    |-----------------------------------------------------------------------------
    | Z-index                                https://tailwindcss.com/docs/z-index
    |-----------------------------------------------------------------------------
    |
    | Here is where you define your z-index utility values. By default we
    | provide a sensible numeric scale. You can, of course, modify these
    | values as needed.
    |
    | Class name: .z-{index}
    |
    */

    zIndex: {
      'auto': 'auto',
      '0': 0,
      '10': 10,
      '20': 20,
      '30': 30,
      '40': 40,
      '50': 50
    },

    /*
    |-----------------------------------------------------------------------------
    | Opacity                                https://tailwindcss.com/docs/opacity
    |-----------------------------------------------------------------------------
    |
    | Here is where you define your opacity utility values. By default we
    | provide a sensible numeric scale. You can, of course, modify these
    | values as needed.
    |
    | Class name: .opacity-{name}
    |
    */

    opacity: {
      '0': '0',
      '25': '.25',
      '37.5': '.375',
      '50': '.5',
      '75': '.75',
      '85': '.85', // added
      '100': '1'
    },

    /*
    |-----------------------------------------------------------------------------
    | Fill                                      https://tailwindcss.com/docs/fill/
    |-----------------------------------------------------------------------------
    |
    | Here is where you define your SVG fill colors. By default we just provide
    | `fill-current` which sets the fill to the current text color. This lets you
    | specify a fill color using existing text color utilities and helps keep the
    | generated CSS file size down.
    |
    | Class name: .fill-{name}
    |
    */

    fill: {
      'current': 'currentColor'
    },

    /*
    |-----------------------------------------------------------------------------
    | Stroke                              https://tailwindcss.com/docs/stroke/#app
    |-----------------------------------------------------------------------------
    |
    | Here is where you define your SVG stroke colors. By default we just provide
    | `stroke-current` which sets the stroke to the current text color. This lets
    | you specify a stroke color using existing text color utilities and helps
    | keep the generated CSS file size down.
    |
    | Class name: .stroke-{name}
    |
    */

    stroke: {
      'current': 'currentColor'
    }
  },

  /*
  |-----------------------------------------------------------------------------
  | Variants                https://tailwindcss.com/docs/configuration/#variants
  |                         https://tailwindcss.com/docs/configuring-variants/
  |-----------------------------------------------------------------------------
  |
  | The variants section lets you control which variants are generated for each core utility plugin.
  |
  | Currently supported variants:
  |   - responsive
  |   - hover
  |   - focus-within
  |   - focus
  |   - active
  |   - group-hover
  |
  | To disable a variant completely, use `false` instead of an array.
  |
  */

  variants: {
    appearance: ['responsive'],
    backgroundAttachment: ['responsive'],
    backgroundColor: ['responsive', 'hover', 'focus'],
    backgroundPosition: ['responsive'],
    backgroundRepeat: ['responsive'],
    backgroundSize: ['responsive'],
    borderCollapse: [],
    borderColor: ['responsive', 'hover', 'focus', 'group-hover'],
    borderRadius: ['responsive'],
    borderStyle: ['responsive'],
    borderWidth: ['responsive'],
    cursor: ['responsive'],
    display: ['responsive', 'group-hover'],
    flexDirection: ['responsive'],
    flexWrap: ['responsive'],
    alignItems: ['responsive'],
    alignSelf: ['responsive'],
    alignContent: ['responsive'],
    flex: ['responsive'],
    flexGrow: ['responsive'],
    flexShrink: ['responsive'],
    float: ['responsive'],
    fontFamily: ['responsive'],
    fontWeight: ['responsive', 'hover', 'focus'],
    height: ['responsive'],
    lineHeight: ['responsive'],
    listStylePosition: ['responsive'],
    listStyleType: ['responsive'],
    margin: ['responsive'],
    maxHeight: ['responsive'],
    maxWidth: ['responsive'],
    minHeight: ['responsive'],
    minWidth: ['responsive'],
    negativeMargin: ['responsive'],
    opacity: ['responsive', 'hover'],
    outline: ['focus'],
    overflow: ['responsive'],
    padding: ['responsive'],
    pointerEvents: ['responsive'],
    position: ['responsive'],
    resize: ['responsive'],
    boxShadow: ['responsive', 'hover', 'focus'],
    fill: [],
    stroke: [],
    tableLayout: ['responsive'],
    textAlign: ['responsive'],
    textColor: ['responsive', 'hover', 'focus'],
    fontSize: ['responsive'],
    fontStyle: ['responsive'],
    fontSmoothing: ['responsive'],
    textDecoration: ['responsive', 'hover', 'focus'],
    textTransform: ['responsive'],
    letterSpacing: ['responsive'],
    userSelect: ['responsive'],
    verticalAlign: ['responsive'],
    visibility: ['responsive'],
    whitespace: ['responsive'],
    width: ['responsive'],
    zIndex: ['responsive']
  },

  /*
  |-----------------------------------------------------------------------------
  | Plugins                                https://tailwindcss.com/docs/plugins
  |-----------------------------------------------------------------------------
  |
  | Here is where you can register any plugins you'd like to use in your
  | project. Tailwind's built-in `container` plugin is enabled by default to
  | give you a Bootstrap-style responsive container component out of the box.
  |
  | Be sure to view the complete plugin documentation to learn more about how
  | the plugin system works.
  |
  */

  plugins: []
}
