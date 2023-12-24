const {fontFamily} = require('tailwindcss/defaultTheme');
const plugin = require("tailwindcss/plugin");

const backfaceVisibility = plugin(function ({addUtilities}) {
    addUtilities({
        ".my-rotate-y-180": {
            transform: "rotateY(180deg)",
        },
        ".preserve-3d": {
            transformStyle: "preserve-3d",
        },
        ".perspective": {
            perspective: "1000px",
        },
        '.backface-visible': {
            'backface-visibility': 'visible',
            '-moz-backface-visibility': 'visible',
            '-webkit-backface-visibility': 'visible',
            '-ms-backface-visibility': 'visible'
        },
        '.backface-hidden': {
            'backface-visibility': 'hidden',
            '-moz-backface-visibility': 'hidden',
            '-webkit-backface-visibility': 'hidden',
            '-ms-backface-visibility': 'hidden'
        }
    });
});


/** @type {import('tailwindcss').Config} */
module.exports = {
    //  mode: 'jit',
    important: true,
    // mode: 'jit',
    content: ["./templates/**/*.html"],
    plugins: [
        require("@tailwindcss/typography"),
        require("daisyui"),
        //  backfaceVisibility
    ],
    theme: {
        extend: {
            backgroundImage: {
                'logo': "url('/logo.svg')",

            },
            fontFamily: {
                sans: ['Inter var', ...fontFamily.sans],
            },

            animation: {
                "fade": "fadeOut .9s ease-in-out",
            },

            // that is actual animation
            keyframes: (theme) => ({
                fadeOut: {
                    "0%": {backgroundColor: theme("colors.amber.300")},
                    "100%": {backgroundColor: theme("colors.transparent")},
                },
            }),
        },


    },

    daisyui: {
        themes: true,
        //  themes: false, // true: all themes | false: only light + dark | array: specific themes like this ["light", "dark", "cupcake"]
        darkTheme: "dark", // name of one of the included themes for dark mode
        base: true, // applies background color and foreground color for root element by default
        styled: true, // include daisyUI colors and design decisions for all components
        utils: true, // adds responsive and modifier utility classes
        //   rtl: false, // rotate style direction from left-to-right to right-to-left. You also need to add dir="rtl" to your html tag and install `tailwindcss-flip` plugin for Tailwind CSS.
        //    prefix: "", // prefix for daisyUI classnames (components, modifiers and responsive class names. Not colors)
        logs: false, // Shows info about daisyUI version and used config in the console when building your CSS
    },
}