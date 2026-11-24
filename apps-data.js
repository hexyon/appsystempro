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
                    description: 'A media viewer for images and videos, with fullscreen viewing, ' +
                        'keyboard navigation, file uploads, blurred backgrounds and smooth transitions.',
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
                    description: 'Create, customize and download gradient backgrounds. Generate random ' +
                        'gradients, pick colors by hand, extract them from photos and see each color\'s name.',
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
                    description: 'A personal journal for writing and saving entries with a simple ' +
                        'formatting editor. Export all entries to a file and load them back anytime.',
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
                    description: 'Search any word for definitions, usage examples and related images. ' +
                        'Click words inside definitions to explore further, and revisit past searches ' +
                        'from your history.',
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
                    subtitle: 'AI brain activity map',
                    description: 'Search any activity to see which brain regions light up, in an ' +
                        'interactive AI-powered visualization.',
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
        { title: 'BatchLink', url: 'https://batchlink.vercel.app/' },
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
