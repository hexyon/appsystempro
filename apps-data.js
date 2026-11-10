/* ===========================================
   AppSystem Pro — content source of truth
   -------------------------------------------
   Everything shown in the gallery lives here.
   Add, remove or reorder apps without touching
   index.html or script.js.

   Category fields:
     name  -> section header text (uppercased in CSS)
     apps  -> array of app objects

   App fields:
     title       -> app name
     subtitle    -> one-line summary under the title
     description -> long text shown when the row is expanded
     url         -> where "open" points
     icon        -> path to the favicon
     iconClass   -> optional extra class for icon sizing

   Other projects fields:
     title, url
   =========================================== */

window.APPSYSTEM_DATA = {
    categories: [
        {
            name: 'Media',
            apps: [
                {
                    title: 'Media Hub',
                    subtitle: 'Sleek media viewer',
                    description: 'A sleek media viewer web app for images and videos with a modern UI. ' +
                        'Features include fullscreen viewing, keyboard navigation, file upload support, ' +
                        'blur background effects, and an index system. It offers smooth transitions and ' +
                        'a responsive design.',
                    url: 'https://mediahub-siwb.onrender.com',
                    icon: 'icons/MediaHub/favicon.ico'
                }
            ]
        },
        {
            name: 'Design',
            apps: [
                {
                    title: 'Gradient Designer',
                    subtitle: 'Create custom gradients',
                    description: 'A dynamic Gradient Designer web app for creating, customizing, and ' +
                        'downloading gradient backgrounds. Generate random gradients, manually select ' +
                        'colors, extract colors from photos, and view color names. Enjoy responsive ' +
                        'design and an interactive UI for a seamless experience.',
                    url: 'https://gradientdesigner.vercel.app',
                    icon: 'icons/GradientDesigner/favicon.ico'
                }
            ]
        },
        {
            name: 'Journal',
            apps: [
                {
                    title: 'Memory Prism',
                    subtitle: 'Online memory journal',
                    description: 'An online memory journal that lets you easily write and save your ' +
                        'personal entries. Use the simple editor to capture your thoughts, format them ' +
                        'as you like, and revisit them anytime. Duplicate entries are prevented to keep ' +
                        'your journal unique. You can also save all your entries to a file or load them ' +
                        'back, ensuring your memories are secure and accessible.',
                    url: 'https://memoryprism.vercel.app',
                    icon: 'icons/MemoryPrism/favicon.ico'
                }
            ]
        },
        {
            name: 'Dictionary',
            apps: [
                {
                    title: 'Dictionary Lens',
                    subtitle: 'Interactive word exploration',
                    description: 'Dictionary Lens is an interactive web application that brings words ' +
                        'to life with definitions and visual imagery. Search for any word to see its ' +
                        'meanings, usage examples, and related images in a clean, modern interface. ' +
                        'Features history and a clickable mode that lets you explore word relationships ' +
                        'by clicking on terms within definitions.',
                    url: 'https://dictionarylensv3.lovable.app/',
                    icon: 'icons/DictionaryLens/favicon.ico'
                }
            ]
        },
        {
            name: 'AI',
            apps: [
                {
                    title: 'Brain Side',
                    subtitle: 'Brain visualization',
                    description: 'AI-powered interactive brain visualization. Search any activity to ' +
                        'see which brain regions light up.',
                    url: 'https://brainsidev2.lovable.app/',
                    icon: 'icons/BrainSide/favicon.ico',
                    iconClass: 'brain-side-icon'
                }
            ]
        },
        {
            name: 'Space',
            apps: [
                {
                    title: 'Solar System',
                    subtitle: 'Interactive 3D observatory',
                    description: 'Interactive 3D observatory: explore a procedural Milky Way, the ' +
                        'Solar System on Keplerian orbits, and a ray-traced Schwarzschild black hole. ' +
                        'Built with Three.js, created with the GPT-6 Astra model.',
                    url: 'https://solarsystempro.lovable.app/',
                    icon: 'icons/Solar System/favicon.ico'
                }
            ]
        }
    ],

    otherProjects: [
        { title: 'Code Editor', url: 'https://ceditor-tan.vercel.app/' },
        { title: 'Hexy Vision', url: 'https://hexyvision.vercel.app/' },
        { title: 'Inverse Lens', url: 'https://inverselens.lovable.app/' },
        { title: 'Blurred Image Generator', url: 'https://blurredimagenerator.vercel.app/' },
        { title: 'Folder Size Analyzer', url: 'https://foldersizeanalyzer.vercel.app/' },
        { title: 'Folder Size Separator', url: 'https://foldersizeseparator.vercel.app/' },
        { title: 'Link Launcher', url: 'https://softlinklauncher.vercel.app/' },
        { title: 'MediaHub Player', url: 'https://mediahubplayer.vercel.app/' },
        { title: 'Exercise Timer', url: 'https://modernexercisetimer.netlify.app/' },
        { title: 'Text to Image', url: 'https://texttoimagepremium.vercel.app/' },
        { title: 'Word Flow', url: 'https://wordflowsystem.vercel.app/' },
        { title: 'Content Plus', url: 'https://contentpluspremium.vercel.app/' },
        { title: 'Smart Image Compressor', url: 'https://smartimagecompressor.vercel.app/' },
        { title: 'Earth Climate Matrix', url: 'https://earthclimatematrix.vercel.app/' },
        { title: 'MemoryPrism Pro', url: 'https://memoryprismpro5.lovable.app/' }
    ]
};
